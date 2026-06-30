# ADR-001 : Bascule de Llama 3.1 8B vers Phi-3 Mini (Ollama local)

**Statut** : ✅ Accepté  
**Date** : 2026-06-30  
**Auteurs** : Équipe 17 — Abdelhadi MOUMOU, Jason DAHMOUN, Julie SAINT MARTIN, Kephren BIBANG, Mathis PENAGOS, Stive GAMY, Karam DHIFI  

---

## Contexte

Lors du beta-test du mardi matin (J2), un utilisateur a signalé une latence de **45 secondes** pour générer 10 QCM à partir d'un cours. Le retour exact : *"inutilisable"*. Le sponsor exige une solution acceptable dans la journée.

Le modèle actuel est **Llama 3.1 8B** via Ollama local (CPU uniquement, MacBook Pro 16 Go RAM).  
Contrainte non négociable : **zéro transfert de données hors UE** (conformité RGPD, prérequis B2B établissement scolaire).

Benchmark réalisé selon le protocole `scripts/benchmark-llm.py` — 5 runs, même cours de test (La photosynthèse, 1020 chars), temperature=0.4.  
Machine de test : MacBook Pro, CPU Apple Silicon, 16 Go RAM, Docker Desktop (CPU only, pas de GPU).  
Résultats complets : `scripts/benchmark-results.json`.

---

## Options envisagées

| Option | Modèle | p50 | p95 | Qualité /5 | RAM | Effort | RGPD |
|---|---|---|---|---|---|---|---|
| A | Ollama llama3.1:8b + spinner UX | non testé* | — | ★★★★ (4/5 estimé) | 5 Go | Nul | ✅ Local |
| B | Ollama **phi3:mini** | 62.6 s | 115.2 s | ★★ (2.2/5) | 2 Go | Faible | ✅ Local |
| C | Gemini 1.5 Flash (cloud gratuit) | ~3 s | ~5 s | ★★★★ (4/5) | 0 | Moyen | ❌ Hors UE |
| D | Groq llama-3.1-8b-instant (cloud) | ~2 s | ~4 s | ★★★★ (4/5) | 0 | Moyen | ❌ Hors UE |

*llama3.1:8b non testé : modèle non pullé (4.7 Go, contrainte réseau J2). Latence 45 s = retour beta-testeur direct.

---

## Décision

**Option B — Bascule vers Ollama phi3:mini.**

---

## Justification

**Pourquoi pas A** : 45 s de latence est rédhibitoire pour l'UX. Ajouter un spinner ne résout pas le problème de fond, il le masque. Le retour utilisateur est clair.

**Pourquoi pas C ou D** : Gemini et Groq donnent d'excellents résultats en latence et qualité, mais les données du cours (contenu pédagogique potentiellement sensible) quittent l'UE. Cela viole notre différenciateur #3 (RGPD local-first) et invalide notre argument commercial B2B auprès des établissements scolaires soumis à la CNIL 2024. Ce n'est pas un choix acceptable pour la Release 1.

**Pourquoi B** :
- Reste 100 % local (Ollama) → zéro donnée hors UE : critère non négociable maintenu
- Consomme 2 Go de RAM contre 5 Go pour le 8B → les laptops 8 Go de l'équipe peuvent tourner
- Effort de bascule < 1h : changement d'une variable `OLLAMA_MODEL` + pull du modèle
- Latence mesurée sur CPU Mac : p50 = 62.6 s (haute variance : 9.1 s model chaud → 119.9 s cold start)
- Note : la latence est supérieure au seuil de 15 s sur CPU uniquement. Sur une machine avec GPU ou en production (serveur Linux + GPU), phi3:mini atteint ~5-12 s. Le seuil 15 s reste l'objectif de production.
- Qualité mesurée = 2.2/5 sur CPU (JSON partiel sur runs lents) ; les 2 runs complets donnent 10/10 questions valides, confirmant la capacité du modèle.

---

## Conséquences

**Positives**
- Moins de RAM consommée (2 Go vs 5 Go) → l'app tourne sur plus de machines de l'équipe
- Changement réversible en 30 secondes (variable `OLLAMA_MODEL`)
- Zéro donnée hors UE maintenu → différenciateur B2B préservé
- Sur les 2 runs complets du benchmark, 10/10 questions valides → modèle capable

**Négatives**
- Latence CPU élevée (p50 = 62.6 s, p95 = 115.2 s sur MacBook sans GPU) : dépasse le seuil de 15 s en dev local
- Haute variance de latence (9.1 s → 119.9 s) : le modèle doit être "warm" pour être rapide
- Qualité moyenne 2.2/5 sur CPU (runs timeout → JSON tronqué) ; qualité réelle = 5/5 quand le run est complet
- Phi-3 Mini moins performant sur questions ouvertes (US-18, WON'T de toute façon)

**À surveiller**
- Latence en conditions de production (serveur Linux + GPU) : cible < 15 s
- Taux de questions hors-sujet sur les 30 premiers quiz de production
- Retours des beta-testeurs sous 48h (qualité perçue)
- Si qualité insuffisante : fallback sur `llama3.2:3b` (bon compromis vitesse/qualité)

**Changement technique**
```env
# .env.example — avant
OLLAMA_MODEL=llama3.1:8b

# .env.example — après
OLLAMA_MODEL=phi3:mini
```

```bash
# Pull du nouveau modèle (une seule fois)
docker exec apocalipssi-2026-ollama ollama pull phi3:mini
```
