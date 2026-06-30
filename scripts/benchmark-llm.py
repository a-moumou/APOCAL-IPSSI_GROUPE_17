#!/usr/bin/env python3
"""
Benchmark LLM — APOCAL'IPSSI 2026 · Perturbation J2
Mesure la latence (p50 / p95) et la qualité de 3 fournisseurs LLM.

Usage :
    python scripts/benchmark-llm.py                     # Ollama uniquement
    python scripts/benchmark-llm.py --gemini AIza...    # + Gemini
    python scripts/benchmark-llm.py --groq gsk_...      # + Groq

Prérequis :
    pip install requests statistics
    Docker doit tourner : docker compose up -d ollama
    Modèles Ollama installés :
        docker exec apocalipssi-2026-ollama ollama pull llama3.1:8b
        docker exec apocalipssi-2026-ollama ollama pull phi3:mini
"""

import argparse
import json
import re
import statistics
import sys
import time

import requests

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
OLLAMA_HOST = "http://localhost:11434"
RUNS = 5  # nombre de runs par modèle (p50/p95 fiables à partir de 5)

# Cours de test (identique pour tous les modèles — condition reproductible)
SAMPLE_TITLE = "La photosynthèse — SVT Terminale"
SAMPLE_TEXT = """
La photosynthèse est le processus par lequel les plantes, les algues et certaines
bactéries convertissent l'énergie lumineuse en énergie chimique stockée sous forme
de glucose. Elle se déroule principalement dans les chloroplastes, organites contenant
la chlorophylle, le pigment vert qui absorbe la lumière.

La photosynthèse comprend deux phases :
1. La phase lumineuse (ou phase claire) : elle se déroule dans les thylakoïdes.
   L'énergie lumineuse est captée par la chlorophylle et utilisée pour scinder
   les molécules d'eau (photolyse), libérant de l'oxygène (O2) et produisant
   de l'ATP et du NADPH.
2. Le cycle de Calvin (ou phase sombre) : il se déroule dans le stroma.
   L'ATP et le NADPH produits en phase lumineuse sont utilisés pour fixer le CO2
   atmosphérique et synthétiser du glucose (C6H12O6).

Équation bilan : 6 CO2 + 6 H2O + lumière → C6H12O6 + 6 O2

Les facteurs limitants de la photosynthèse sont : l'intensité lumineuse,
la concentration en CO2, la température et la disponibilité en eau.
"""

SYSTEM_PROMPT = """Tu es un assistant pédagogique francophone spécialisé en
génération de QCM. À partir du cours fourni, tu génères exactement 10 questions
à choix multiples pour aider un étudiant à réviser.

Règles ABSOLUES :
- Exactement 10 questions.
- Chaque question a EXACTEMENT 4 options.
- Une seule bonne réponse par question, indiquée par "correct_index" (0 à 3).
- Pas de markdown, pas de balises HTML, pas d'explications hors JSON.
- Sortie = JSON STRICT et UNIQUEMENT JSON.

Format de sortie :
{
  "questions": [
    {"prompt": "...", "options": ["...","...","...","..."], "correct_index": 0}
  ]
}"""

FULL_PROMPT = f"{SYSTEM_PROMPT}\n\nTITRE DU COURS : {SAMPLE_TITLE}\n\nCOURS :\n{SAMPLE_TEXT}\n\nGÉNÈRE LE JSON MAINTENANT :"


# ---------------------------------------------------------------------------
# Validation qualité (structure JSON + 10 questions valides)
# ---------------------------------------------------------------------------
def validate_quality(raw: str) -> tuple[bool, int, str]:
    """Retourne (valide, nb_questions_ok, commentaire)."""
    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        match = re.search(r"\{[\s\S]*\}", raw)
        if not match:
            return False, 0, "Pas de JSON trouvé"
        try:
            data = json.loads(match.group(0))
        except json.JSONDecodeError:
            return False, 0, "JSON invalide"

    questions = data.get("questions", [])
    if not isinstance(questions, list):
        return False, 0, "Clé 'questions' absente ou invalide"

    valid_q = 0
    for q in questions:
        if (isinstance(q.get("prompt"), str)
                and isinstance(q.get("options"), list)
                and len(q["options"]) == 4
                and q.get("correct_index") in (0, 1, 2, 3)):
            valid_q += 1

    ok = valid_q == 10
    comment = f"{valid_q}/10 questions valides"
    return ok, valid_q, comment


# ---------------------------------------------------------------------------
# Clients LLM
# ---------------------------------------------------------------------------
def call_ollama(model: str) -> tuple[float, str]:
    t0 = time.perf_counter()
    resp = requests.post(
        f"{OLLAMA_HOST}/api/generate",
        json={"model": model, "prompt": FULL_PROMPT, "stream": False,
              "options": {"temperature": 0.4}, "format": "json"},
        timeout=600,
    )
    resp.raise_for_status()
    elapsed = time.perf_counter() - t0
    return elapsed, resp.json().get("response", "")


def call_gemini(api_key: str) -> tuple[float, str]:
    url = (f"https://generativelanguage.googleapis.com/v1beta/models/"
           f"gemini-1.5-flash:generateContent?key={api_key}")
    body = {"contents": [{"parts": [{"text": FULL_PROMPT}]}],
            "generationConfig": {"temperature": 0.4}}
    t0 = time.perf_counter()
    resp = requests.post(url, json=body, timeout=60)
    resp.raise_for_status()
    elapsed = time.perf_counter() - t0
    raw = (resp.json()["candidates"][0]["content"]["parts"][0]["text"])
    return elapsed, raw


def call_groq(api_key: str) -> tuple[float, str]:
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    body = {"model": "llama-3.1-8b-instant",
            "messages": [{"role": "user", "content": FULL_PROMPT}],
            "temperature": 0.4}
    t0 = time.perf_counter()
    resp = requests.post(url, headers=headers, json=body, timeout=60)
    resp.raise_for_status()
    elapsed = time.perf_counter() - t0
    raw = resp.json()["choices"][0]["message"]["content"]
    return elapsed, raw


# ---------------------------------------------------------------------------
# Benchmark d'un modèle
# ---------------------------------------------------------------------------
def benchmark(name: str, call_fn, runs: int = RUNS) -> dict:
    print(f"\n  Modèle : {name}")
    latencies = []
    quality_scores = []
    errors = 0

    for i in range(1, runs + 1):
        print(f"    Run {i}/{runs} ...", end=" ", flush=True)
        try:
            elapsed, raw = call_fn()
            ok, nb_valid, comment = validate_quality(raw)
            latencies.append(elapsed)
            # Score qualité : nb de questions valides / 10 * 5
            quality_scores.append(round(nb_valid / 10 * 5, 1))
            status = "✅" if ok else "⚠️ "
            print(f"{status} {elapsed:.1f}s — {comment}")
        except Exception as exc:
            errors += 1
            print(f"❌ Erreur : {exc}")

    if not latencies:
        return {"name": name, "error": "Toutes les runs ont échoué"}

    latencies_sorted = sorted(latencies)
    p50 = statistics.median(latencies)
    p95_idx = max(0, int(len(latencies_sorted) * 0.95) - 1)
    p95 = latencies_sorted[p95_idx]
    avg_quality = round(statistics.mean(quality_scores), 1) if quality_scores else 0

    return {
        "name": name,
        "runs": runs,
        "errors": errors,
        "p50_s": round(p50, 1),
        "p95_s": round(p95, 1),
        "quality_5": avg_quality,
        "latencies": [round(l, 1) for l in latencies],
    }


# ---------------------------------------------------------------------------
# Affichage du tableau récapitulatif
# ---------------------------------------------------------------------------
def print_results(results: list[dict]) -> None:
    print("\n" + "=" * 70)
    print("RÉSULTATS BENCHMARK — EduTutor IA · Perturbation J2")
    print("=" * 70)
    print(f"{'Modèle':<28} {'p50 (s)':>8} {'p95 (s)':>8} {'Qualité /5':>11} {'Erreurs':>8}")
    print("-" * 70)
    for r in results:
        if "error" in r:
            print(f"{r['name']:<28} {'—':>8} {'—':>8} {'—':>11} {r['error']:>8}")
        else:
            print(f"{r['name']:<28} {r['p50_s']:>8} {r['p95_s']:>8} {r['quality_5']:>11} {r['errors']:>8}")
    print("=" * 70)
    print(f"\nProtocole : {RUNS} runs · même cours ({len(SAMPLE_TEXT)} chars) · temperature=0.4")
    print(f"Machine   : notez votre config (CPU/RAM) dans l'ADR")
    print()

    # Sauvegarde JSON pour l'ADR
    with open("scripts/benchmark-results.json", "w", encoding="utf-8") as f:
        json.dump({"results": results, "runs": RUNS,
                   "sample_chars": len(SAMPLE_TEXT)}, f, indent=2, ensure_ascii=False)
    print("📄 Résultats sauvegardés dans scripts/benchmark-results.json")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main() -> None:
    parser = argparse.ArgumentParser(description="Benchmark LLM EduTutor J2")
    parser.add_argument("--gemini", metavar="API_KEY", help="Clé Gemini (optionnel)")
    parser.add_argument("--groq",   metavar="API_KEY", help="Clé Groq   (optionnel)")
    parser.add_argument("--runs", type=int, default=RUNS, help=f"Nb de runs (défaut {RUNS})")
    args = parser.parse_args()

    print("🚀 Benchmark LLM — EduTutor IA (Perturbation J2)")
    print(f"   Cours de test : {SAMPLE_TITLE} ({len(SAMPLE_TEXT)} caractères)")
    print(f"   Runs par modèle : {args.runs}")

    results = []

    # Modèle 1 — Ollama llama3.1:8b (actuel, ~45s sur CPU)
    print("\n[ Modèle A — Ollama llama3.1:8b (actuel) ]")
    try:
        results.append(benchmark(
            "A · Ollama llama3.1:8b (actuel)",
            lambda: call_ollama("llama3.1:8b"),
            args.runs,
        ))
    except Exception as e:
        print(f"  ❌ Ollama inaccessible : {e}")
        print("  → Vérifiez que Docker tourne : docker compose up -d ollama")

    # Modèle 2 — Ollama phi3:mini (plus léger, ~15s)
    print("\n[ Modèle B — Ollama phi3:mini (alternatif local) ]")
    try:
        results.append(benchmark(
            "B · Ollama phi3:mini",
            lambda: call_ollama("phi3:mini"),
            args.runs,
        ))
    except Exception as e:
        print(f"  ❌ Erreur phi3:mini : {e}")
        print("  → Installez le modèle : docker exec apocalipssi-2026-ollama ollama pull phi3:mini")

    # Modèle 3 — Gemini (cloud, gratuit)
    if args.gemini:
        print("\n[ Modèle C — Gemini 1.5 Flash (cloud gratuit) ]")
        results.append(benchmark(
            "C · Gemini 1.5 Flash (cloud)",
            lambda: call_gemini(args.gemini),
            args.runs,
        ))
    else:
        print("\n[ Modèle C — Gemini ] ignoré (passez --gemini VOTRE_CLE pour l'inclure)")
        results.append({"name": "C · Gemini 1.5 Flash (cloud)", "error": "clé non fournie"})

    # Modèle 4 — Groq (cloud, ultra-rapide)
    if args.groq:
        print("\n[ Modèle D — Groq llama-3.1-8b-instant (cloud gratuit) ]")
        results.append(benchmark(
            "D · Groq llama-3.1-8b-instant",
            lambda: call_groq(args.groq),
            args.runs,
        ))

    print_results(results)


if __name__ == "__main__":
    main()
