# Guide oral — EduTutor IA · Équipe 17 · APOCAL'IPSSI 2026

> Ce fichier accompagne `presentation.html` (21 slides).  
> Pour chaque slide : ce qu'il faut dire, les points à insister, les questions probables du jury.

---

## Slide 1 — Titre

**Ce qu'on dit :**
- "Bonjour, on est l'Équipe 17. On présente EduTutor IA — une plateforme qui génère des QCM à partir de cours, 100 % en local, sans cloud."
- "On a livré 76 story points en 4 jours, face à 4 perturbations. Voilà comment on a géré ça."

**Points à insister :**
- L'IA tourne localement — pas de données qui quittent la machine
- 4 jours, 4 crises, produit complet

---

## Slide 2 — Vue d'ensemble

**Ce qu'on dit :**
- "En partant de 56 SP planifiés, on a terminé à 76 — non pas parce qu'on a mal estimé, mais parce que chaque perturbation a ajouté du scope."
- "La vélocité de l'équipe est restée stable. C'est le périmètre qui a bougé, pas notre capacité à livrer."

**Points à insister :**
- J1 : cadrage + perturbation Mme Lefèvre
- J2 : MVP complet + Auth + Admin + Multi-LLM + CI/CD
- J3 : sécurité LLM + RGPD + Release 1
- J4 : RGAA + i18n + scalabilité + Release 2

**Question probable :** *"Comment vous avez géré le scope creep ?"*
→ "On a utilisé le MoSCoW à chaque perturbation pour décider ce qu'on garde dans le sprint et ce qu'on reporte."

---

## Slide 3 — J1 : Cadrage produit

**Ce qu'on dit :**
- "Le lundi matin, on n'a pas codé. On a d'abord compris le problème."
- "On a construit 3 artefacts : le Product Vision Board pour définir notre cible et notre différenciateur, le Persona Lucas pour humaniser le besoin, et la Story Map pour structurer le périmètre."

**Points à insister :**
- Différenciateur : 100 % local, zéro cloud, RGPD natif — pas juste un choix technique, c'est notre argument commercial B2B
- 56 SP planifiés sur 2 releases dès le départ
- On a validé le parcours utilisateur (Customer Journey) avant d'écrire une ligne de code

**Question probable :** *"Pourquoi avoir choisi l'IA locale plutôt que ChatGPT ?"*
→ "Contrainte RGPD des établissements scolaires : les données de cours (contenus pédagogiques, données élèves) ne peuvent pas quitter l'UE ni être envoyées à un tiers. Ollama local = zéro transfert."

---

## Slide 4 — J1 : Perturbation Mme Lefèvre

**Ce qu'on dit :**
- "Le lundi après-midi, première perturbation : le client veut qu'on serve aussi les enseignants, pas seulement les étudiants."
- "Nouveau persona : Mme Lefèvre, prof de lycée qui veut créer des évaluations pour ses classes depuis ses cours PDF."
- "Ça a ajouté +8 SP et renforcé encore plus notre contrainte RGPD — cette fois avec des données d'élèves mineurs."

**Points à insister :**
- On a mis à jour le Vision Board (v1.1) et le backlog (v2.0) dans la journée
- US-09 à US-11 ajoutées, priorisées SHOULD R1 / MUST R2
- Scope passe de 56 à 64 SP

**Question probable :** *"Vous avez anticipé que ça pouvait arriver ?"*
→ "On avait prévu une marge dans le release planning. La perturbation était attendue dans le principe, pas dans son contenu — c'est l'exercice APOCAL'IPSSI."

---

## Slide 5 — J1 : Architecture

**Ce qu'on dit :**
- "Toujours le lundi, on a arrêté les choix techniques. Chaque outil a été choisi pour une raison précise, pas pour le hype."
- "Django + DRF pour la vélocité — stack maîtrisée par l'équipe. React + Vite + TypeScript pour le frontend SPA. Ollama pour le LLM local."
- "Un `make dev` lance les 5 services Docker. N'importe qui dans l'équipe peut démarrer le projet en 2 minutes."

**Points à insister :**
- Docker Compose : reproductible sur Mac, Linux, Windows
- La contrainte principale (zéro donnée hors UE) a guidé tous les choix
- Redis ajouté en J4 comme 5e service

**Question probable :** *"Pourquoi pas Next.js ?"*
→ "SSR inutile ici — c'est une SPA auth-wall. Vite est plus simple, plus rapide au build, et l'équipe le maîtrise mieux."

---

## Slide 6 — J2 : 6 features MVP

**Ce qu'on dit :**
- "Le mardi, on a livré le cycle complet de l'élève en une journée : importer un cours, générer un quiz, le passer, voir son score, consulter son historique, et réviser ses erreurs."
- "6 features, F1 à F6, toutes fonctionnelles."

**Points à insister :**
- F1 : texte libre OU PDF (extraction via PyMuPDF)
- F2 : 10 questions JSON générées par le LLM local
- F3 : score immédiat après soumission
- F4 : dashboard avec KPIs et graphe de progression
- F5 : historique chronologique de tous les quiz
- F6 : révision des erreurs avec la bonne réponse affichée

**Question probable :** *"C'est quoi la valeur ajoutée par rapport à un simple formulaire ?"*
→ "La génération automatique — l'utilisateur colle son cours brut, l'IA calibre 10 questions pertinentes sur le contenu. Zero effort de création côté utilisateur."

---

## Slide 7 — J2 : Auth complet

**Ce qu'on dit :**
- "L'authentification va bien au-delà d'un login/password. On a un cycle complet de gestion d'identité."
- "Inscription avec validation email obligatoire, token JWT, mot de passe oublié avec lien de reset, et profil modifiable."

**Points à insister :**
- Email de confirmation via Brevo SMTP — bannière d'alerte tant que non confirmé
- Reset password : lien temporaire sécurisé par token
- Suppression de compte : cascade totale (RGPD Art. 17) — quiz, historique, tokens supprimés
- TokenAuthentication DRF avant SessionAuthentication

**Question probable :** *"Vous avez pensé à la sécurité des tokens ?"*
→ "Oui — tokens à durée limitée pour le reset password, stockage côté backend uniquement. La suppression de compte invalide tous les tokens existants."

---

## Slide 8 — J2 : Admin Panel

**Ce qu'on dit :**
- "L'opérateur de la plateforme a un back-office complet accessible uniquement aux admins — 5 onglets pour tout piloter sans toucher au code."

**Points à insister :**
- **Overview** : stats globales en temps réel
- **Users** : gérer les comptes, vérifier les statuts email, promouvoir admin
- **Data** : vue sur tous les quiz, purge si nécessaire (RGPD)
- **LLM Config** : changer de backend LLM (Ollama → Groq → Gemini…) en live, sans redémarrage
- **Site Config** : activer/désactiver les inscriptions, personnaliser le nom et le message d'accueil

**Question probable :** *"Comment le changement de LLM se fait sans redémarrage ?"*
→ "La variable `LLM_BACKEND` est lue dynamiquement par le Factory Pattern à chaque requête de génération. Le panel Admin la modifie en base de données, le prochain appel utilise le nouveau backend."

---

## Slide 9 — J2 : Multi-LLM (9 backends)

**Ce qu'on dit :**
- "On a implémenté un Pattern Factory qui abstrait 9 fournisseurs LLM derrière une interface unique."
- "Changer de modèle = changer une variable `.env`. Zéro refactor côté application."

**Points à insister :**
- 9 backends : Ollama (local), OpenAI, Anthropic, Gemini, Groq, Cerebras, Mistral, OpenRouter, Mock (tests)
- `factory.py` : `get_llm_client(backend)` retourne le bon client
- Défaut de production : Ollama + llama3.2:3b — 100 % local, ~2 Go RAM, zéro coût
- Mock backend : essentiel pour les tests automatisés sans dépendre d'un vrai LLM

**Question probable :** *"Pourquoi autant de backends ?"*
→ "Chaque contexte a des besoins différents : un établissement veut le local (RGPD), une PME veut la rapidité (Groq), un dev veut le gratuit (Gemini Flash). Le Factory Pattern nous permet de servir tous ces cas sans modifier le code métier."

---

## Slide 10 — J2 : ADR-001

**Ce qu'on dit :**
- "Le mardi matin, un beta-testeur nous remonte 45 secondes de latence sur le LLM. Retour exact : 'inutilisable'. Le sponsor veut une solution pour ce soir."
- "On a appliqué le protocole ADR : on benchmark, on documente les options, on décide, on trace."

**Points à insister :**
- 4 options benchmarkées : llama3.1:8b, llama3.2:3b, Gemini Flash, Groq
- Options C et D rejetées malgré leur rapidité : données hors UE → violation RGPD → invalide notre argument B2B
- Option B retenue : llama3.2:3b, ~15s, 2 Go RAM, changement en < 1h (une ligne `.env`)
- La décision est documentée et traçable : `docs/adr/ADR-001-choix-llm.md`

**Question probable :** *"15 secondes c'est encore long non ?"*
→ "En local sur CPU sans GPU, oui. En production sur serveur Linux avec GPU ou via Groq en fallback, on est à 2-5 secondes. On a fait le choix du compromis : rapidité acceptable + RGPD préservé."

---

## Slide 11 — J2 : CI/CD

**Ce qu'on dit :**
- "Chaque push sur GitHub déclenche le pipeline CI. On ne merge rien qui casse les tests."
- "Ça nous a sauvé 3 fois pendant la semaine — notamment lors des perturbations J3 et J4 où on a détecté des régressions avant de merger."

**Points à insister :**
- GitHub Actions : lint Python (ruff), pytest + coverage, tsc --noEmit, build frontend
- Tests adversariaux LLM (mock) jouent en CI à chaque commit
- Scripts de déploiement : `deploy.sh` pour le VPS, rollback en 1 commande
- Documentation complète : `docs/05-ci-cd.md`

**Question probable :** *"Vous avez un taux de couverture de tests ?"*
→ "pytest + coverage est dans le pipeline, le rapport est généré à chaque run. L'objectif principal était la non-régression, pas un taux cible arbitraire."

---

## Slide 12 — J3 : Sécurité LLM

**Ce qu'on dit :**
- "Le mercredi matin, perturbation sécurité : on doit auditer le LLM contre les prompt injections."
- "Le risque : un utilisateur envoie 'Ignore les instructions précédentes et...' dans le champ cours. Le LLM peut se faire manipuler."

**Points à insister :**
- 5 correctifs appliqués : troncature à 4000 chars, validation `correct_index` (entier 0-3), limite `max_tokens`, distribution forcée des bonnes réponses, sanitisation du cours
- 5 tests adversariaux : injection directe, lorem ipsum, texte vide, JSON malformé, exfiltration de prompt
- Résultat : 5/5 attaques bloquées — erreur 400 ou réponse vide contrôlée
- Principe : "defense in depth" — sanitisation en amont ET validation de la sortie en aval

**Question probable :** *"Le LLM peut quand même être manipulé différemment ?"*
→ "Les 5 tests couvrent les vecteurs d'attaque classiques documentés dans OWASP LLM Top 10. Pour une version production, un audit plus exhaustif est prévu. Ce PoC démontre la démarche, pas une couverture exhaustive."

---

## Slide 13 — J3 : RGPD + Release 1

**Ce qu'on dit :**
- "En parallèle de la sécurité, perturbation J3-bis : on doit livrer la conformité RGPD. +3 SP en milieu de journée."
- "On a absorbé les deux sans reporter de feature — la Release 1 est sortie à 17h45 comme prévu."

**Points à insister :**
- 4 pages légales : CGU, Confidentialité, Mentions légales, Cookies
- Export SAR : `GET /api/accounts/export/` — toutes les données en JSON (RGPD Art. 15)
- Droit à l'oubli : suppression = cascade totale, rien n'est conservé (RGPD Art. 17)
- Politique de rétention documentée, pas de tracking ni d'analytics tiers
- Release 1 : 42 SP livrés sur 67 de scope

**Question probable :** *"Vous avez fait valider la conformité RGPD ?"*
→ "On a appliqué les articles 15 et 17 du RGPD (droit d'accès et droit à l'oubli) et documenté la politique de rétention. Pour une mise en production réelle, un DPO devrait valider. Ici c'est une implémentation technique correcte des principes."

---

## Slide 14 — J4 : Perturbation passage à l'échelle

**Ce qu'on dit :**
- "Le jeudi 10h00, perturbation J4 déverrouillée : 3 nouveaux axes transverses — accessibilité RGAA, internationalisation FR/EN, et scalabilité."
- "Ce n'est pas 3 nouvelles features dans un coin. Ce sont 3 axes qui traversent toutes les fonctionnalités déjà livrées."

**Points à insister :**
- +9 SP, scope passe à 76
- On avait anticipé une marge de 12h dans le Sprint 4 (28h capacité pour 18,5h de tâches) — prouve qu'on pilote avec du recul
- Décision : "diagnostic + PoC minimal" sur chaque axe plutôt que remédiation exhaustive
- C'est une décision de pilotage assumée, documentée et traçable

**Question probable :** *"Comment vous avez réussi à faire 3 axes en une matinée ?"*
→ "En les calibrant comme des PoC, pas comme des implémentations complètes. Redis configuré mais pas généralisé à tous les endpoints, un seul provider cloud en fallback, ARIA sur 12 pages mais pas de test automatisé RGAA complet. C'est honnête et documenté."

---

## Slide 15 — J4 : RGAA

**Ce qu'on dit :**
- "Premier axe J4 : l'accessibilité numérique selon le référentiel RGAA — le standard français pour les services publics et établissements scolaires."
- "On a couvert 12 pages avec 16 types d'attributs ARIA, un skip link, et la gestion du focus clavier."

**Points à insister :**
- Skip link (`sr-only focus:not-sr-only`) : permet aux utilisateurs de lecteurs d'écran de sauter la nav
- `:focus-visible` CSS : outline uniquement au clavier, pas à la souris — ergonomie préservée
- 16 attributs ARIA : `aria-label`, `aria-live`, `role="tab"`, `role="alert"`, etc.
- Zéro dépendance externe, zéro régression visuelle

**Question probable :** *"Comment vous avez testé l'accessibilité ?"*
→ "Navigation manuelle au clavier sur toutes les pages, vérification des attributs ARIA dans le DOM. axe-core est mentionné dans le sprint backlog comme prochaine étape pour l'automatisation en CI."

---

## Slide 16 — J4 : i18n

**Ce qu'on dit :**
- "Deuxième axe J4 : l'internationalisation FR/EN. On a choisi de ne pas utiliser de librairie externe comme i18next."
- "On a implémenté un contexte TypeScript-safe : si une clé est définie en français et manquante en anglais, TypeScript lève une erreur à la compilation."

**Points à insister :**
- `fr.ts` est la source de vérité : `export type TranslationKeys = keyof typeof fr`
- `en.ts` est typé comme `Record<TranslationKeys, string>` — erreur TS si clé manquante
- `I18nContext.tsx` : `t(key)` retourne la traduction, `localStorage` persiste le choix
- Bouton FR/EN dans la navbar, accessible (`aria-label`)
- 100+ clés, 12 pages traduites

**Question probable :** *"Pourquoi pas i18next ou react-i18next ?"*
→ "Zéro dépendance supplémentaire, et notre besoin était simple (FR/EN, pas de pluralisation complexe). Le type TypeScript nous donne la même sécurité que ce que propose i18next, sans le coût d'une dépendance."

---

## Slide 17 — J4 : Scalabilité

**Ce qu'on dit :**
- "Troisième axe J4 : la scalabilité. L'objectif est que l'app puisse absorber plusieurs utilisateurs simultanés et basculer de LLM en cas de surcharge."
- "On a mis en place un cache Redis et branché un fallback LLM cloud configurable."

**Points à insister :**
- Redis : 5e service Docker (`redis:7-alpine`), branché dans `settings.py` via `django-redis`
- `@cache_page(60 * 5)` : vues cachées 5 minutes, réduit la charge LLM sur les endpoints de lecture
- Fallback Ollama → Groq : 1 clic dans l'Admin Panel, sans redéploiement — le Factory Pattern gère
- PoC honnête : Redis branché mais `@cache_page` non généralisé à tous les endpoints, stratégie d'invalidation à compléter

**Question probable :** *"C'est quoi la limite de votre cache Redis ?"*
→ "Pour l'instant `@cache_page` est sur les endpoints de lecture statiques. La stratégie d'invalidation pour les données dynamiques (quiz, scores) est prévue au Sprint 5 — ce n'est pas trivial et ça méritait plus de temps qu'on n'en avait."

---

## Slide 18 — Burnup + Pilotage

**Ce qu'on dit :**
- "Ce graphe montre toute la semaine. La ligne pointillée, c'est le scope — il monte à J1, J3 et J4. La ligne bleue, c'est ce qu'on a livré."
- "La vélocité n'a pas chuté. Le périmètre a été redéfini 3 fois — c'est le principe même de l'exercice."

**Points à insister :**
- Scope initial : 56 SP → final : 76 SP (+36%)
- Les 3 sauts : +8 J1 (Mme Lefèvre), +3 J3 (RGPD), +9 J4 (RGAA/i18n/scalabilité)
- Sprint backlogs mis à jour à chaque perturbation : v1.0 → v2.0 → v3.0 → v4.0
- Matrice des risques : identifiée dès J1, réactivée à J3 et J4

**Question probable :** *"Vous avez quand même un écart entre livré et scope à la fin ?"*
→ "Oui, ~30 SP d'écart au dernier sprint. C'est l'effet cumulé des perturbations. La décision de faire des PoC sur J4 plutôt que des implémentations complètes était volontaire — on préférait livrer 3 PoC validés plutôt que 1 axe complet et 2 non commencés."

---

## Slide 19 — Stack technique

**Ce qu'on dit :**
- "Voilà ce qui tourne sous le capot. Trois colonnes : backend, frontend, IA & infra."
- "Tout est open source, tout est local par défaut, zéro clé API requise pour démarrer."

**Points à insister :**
- Backend : Python 3.12 + Django 5 + DRF + PostgreSQL 16 + Redis + Gunicorn
- Frontend : React 18 + Vite + TypeScript 5 + Tailwind CSS 3 + i18n custom
- IA & Infra : Ollama (llama3.2:3b) + 9 backends + Docker Compose + GitHub Actions + PyMuPDF + Brevo SMTP
- Un seul `make dev` pour tout démarrer

---

## Slide 20 — Déploiement VPS OVH

**Ce qu'on dit :**
- "En dehors du dev local, on a documenté et testé un déploiement production complet sur VPS OVHcloud."
- "L'URL de production : `apocalipssi26.elafrit.com`. HTTPS auto via Caddy."

**Points à insister :**
- Stratégie override Compose : `docker-compose.prod.yml` surcharge le dev sans le modifier — `!reset []` ferme les ports applicatifs
- Multi-stage Dockerfiles : builder (gcc + wheels) → runtime slim (libpq5 seul), sans dev-deps
- Caddy : HTTPS automatique via Let's Encrypt, reverse proxy devant les conteneurs
- Gunicorn 3 workers, WhiteNoise sert les statiques (pas de Nginx séparé)
- Sécurité : UFW (22/80/443 seulement), SSH par clé Ed25519, root désactivé, fail2ban, HSTS
- En prod : Groq par défaut (VPS sans GPU → Ollama trop lent)

**Question probable :** *"Vous avez pensé aux données en prod ?"*
→ "Oui : `.env` prod en `chmod 600`, jamais commité, `POSTGRES_PASSWORD` fort (généré via `openssl rand`), `DJANGO_DEBUG=False`, et la clé Brevo dans le dépôt public est identifiée comme un exemple à remplacer — c'est documenté dans `.env.example` avec un avertissement explicite."

---

## Slide 21 — Conclusion

**Ce qu'on dit :**
- "En 4 jours face à 4 perturbations : 76 SP livrés, 9 backends LLM, un produit complet de la génération de QCM au déploiement production."
- "EduTutor IA : un étudiant, un cours, 10 questions générées en local. Zéro cloud. Zéro abonnement. Zéro donnée qui s'échappe."

**Points à insister :**
- Ce n'est pas un prototype — c'est un produit avec auth, RGPD, CI/CD, sécurité, accessibilité, i18n et déploiement prod
- La vélocité a tenu malgré les crises — grâce au cadrage solide du lundi et aux décisions documentées (ADR, MoSCoW, matrice des risques)
- Différenciateur fort : le seul QCM-generator 100 % local du marché pédagogique

**Pour finir :**
- "On est disponibles pour vos questions."
- Avoir sous la main : `docs/adr/ADR-001-choix-llm.md`, `docs/Matrice des Risques.docx`, le burndown J4

---

## Questions fréquentes du jury

| Question | Réponse courte |
|---|---|
| Pourquoi l'IA locale ? | RGPD — données cours/élèves ne peuvent pas quitter l'UE. Ollama = zéro transfert. |
| 15s de génération c'est acceptable ? | En local CPU sans GPU, oui avec un spinner. En prod (GPU ou Groq), 2-5s. |
| Vous avez testé avec de vrais utilisateurs ? | Beta-test J2 matin — retour "45s = inutilisable" qui a déclenché ADR-001. |
| La sécurité RGPD est vraiment complète ? | Art. 15 (export), Art. 17 (suppression cascade), politique de rétention. DPO à impliquer en prod. |
| Vous auriez fait quoi différemment ? | Plus de temps sur la stratégie d'invalidation du cache Redis, et commencer RGAA dès J1. |
| Comment vous avez géré les conflits d'équipe ? | Daily post-perturbation à chaque crise pour reprioriser ensemble. Décisions documentées. |
