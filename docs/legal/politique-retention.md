# Politique de rétention des données — EduTutor IA

**Statut** : ✅ Validée  
**Date** : 2026-07-01  
**Auteur** : Abdelhadi MOUMOU — Chef de projet Équipe 17  
**Contexte** : Perturbation J3-bis — RGPD (droit à l'effacement, portabilité, rétention)

---

## 1. Données collectées et durées de rétention

### Données de compte utilisateur
- Email, nom d'utilisateur, mot de passe haché : conservés pendant toute la durée d'activité du compte, puis supprimés définitivement sous **30 jours** après suppression du compte.
- Date d'inscription, dernière connexion : même durée que le compte.

### Textes de cours (PDF ou saisie directe)
- Les textes uploadés sont utilisés **uniquement au moment de la génération du quiz**.
- Ils sont persistés en base dans le champ `source_text` du modèle `Quiz` pour permettre à l'utilisateur de consulter l'historique.
- Supprimés avec le quiz (cascade) ou lors de la suppression du compte.
- **Aucun transfert hors UE** : le traitement LLM est 100 % local (Ollama llama3.2:3b).

### Quiz et questions générés
- Conservés indéfiniment tant que le compte est actif (nécessaires pour l'historique F6).
- Supprimés en cascade à la suppression du compte (30 jours max).

### Tokens d'authentification
- Invalidés immédiatement à la déconnexion ou à la suppression du compte.
- Pas de rétention après invalidation.

### Logs applicatifs (Django)
- Logs techniques conservés **7 jours** en rotation automatique (aucun log nominatif).

---

## 2. Droits des utilisateurs et endpoints associés

| Droit RGPD | Endpoint | Description |
|---|---|---|
| Accès | `GET /api/accounts/me/` | Données du compte courant |
| Rectification | `PATCH /api/accounts/profile/` | Modifier email, nom d'utilisateur |
| Portabilité | `GET /api/accounts/export/` | Export JSON complet (compte + quiz + questions) |
| Effacement | `DELETE /api/accounts/profile/` | Suppression compte + toutes données sous 30 j |
| Opposition | Non applicable (pas de marketing ni de profilage) | — |

---

## 3. Garanties techniques mises en place

**Isolation par utilisateur** : toutes les requêtes base de données sont filtrées par `user=request.user`. Un utilisateur ne peut jamais accéder aux données d'un autre (vérifié dans les vues et serializers Django).

**Local-first** : le modèle LLM (Ollama llama3.2:3b) s'exécute sur le serveur local. Aucun texte de cours n'est envoyé à une API cloud (Gemini, Groq, OpenAI désactivés en production — cf. ADR-001).

**Suppression en cascade** : la suppression du compte Django déclenche la suppression en cascade de tous les `Quiz` et `Question` associés via `on_delete=models.CASCADE`.

**Export contrôlé** : l'endpoint `/api/accounts/export/` nécessite une authentification et ne retourne que les données de l'utilisateur connecté.

---

## 4. Responsable et contact CNIL

Responsable du traitement : Équipe 17 APOCAL'IPSSI 2026 — contact via l'établissement IPSSI.  
Autorité de contrôle : Commission Nationale de l'Informatique et des Libertés (CNIL) — www.cnil.fr
