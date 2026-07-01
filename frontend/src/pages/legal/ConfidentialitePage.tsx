/** Politique de confidentialité — EduTutor IA (complétée J3-bis). */
import LegalScaffold, { type LegalSection } from './LegalScaffold';

const SECTIONS: LegalSection[] = [
  {
    title: 'Responsable du traitement',
    hint: 'qui décide pourquoi et comment les données sont traitées.',
    body: "Équipe 17 APOCAL'IPSSI 2026 : Abdelhadi MOUMOU, Jason DAHMOUN, Julie SAINT MARTIN, Kephren BIBANG, Mathis PENAGOS, Stive GAMY, Karam DHIFI. Contact : via l'établissement IPSSI.",
  },
  {
    title: 'Données personnelles collectées',
    hint: 'email, nom, prénom, documents envoyés, historique de quiz…',
    body: "Adresse email (identifiant), nom d'utilisateur, date d'inscription, texte des cours uploadés (PDF ou saisie), historique des quiz générés, scores obtenus, réponses aux questions. Aucune donnée de paiement collectée.",
  },
  {
    title: 'Finalités du traitement',
    hint: 'pourquoi vous collectez ces données (créer un compte, générer des quiz…).',
    body: "(1) Créer et gérer votre compte. (2) Générer des QCM via un modèle LLM 100 % local. (3) Conserver votre historique et scores. (4) Envoyer des emails transactionnels (validation de compte, réinitialisation de mot de passe).",
  },
  {
    title: 'Base légale',
    hint: 'consentement, contrat, intérêt légitime… (RGPD art. 6).',
    body: "Exécution du contrat (CGU acceptées à l'inscription, RGPD art. 6.1.b) pour les fonctionnalités du service. Intérêt légitime (art. 6.1.f) pour les emails transactionnels strictement nécessaires.",
  },
  {
    title: 'Durée de conservation',
    hint: 'combien de temps les données sont gardées, puis supprimées/anonymisées.',
    body: "Données conservées pendant toute la durée d'activité du compte. Suppression du compte : toutes les données personnelles sont effacées définitivement sous 30 jours. Les textes de cours ne sont pas archivés au-delà de la génération du quiz.",
  },
  {
    title: 'Destinataires des données',
    hint: 'qui y a accès (équipe, sous-traitants, fournisseurs LLM…).',
    body: "Membres de l'Équipe 17 uniquement (usage pédagogique). Le traitement LLM est 100 % local (Ollama phi3:mini) : aucun texte de cours ne quitte le serveur. Aucune donnée vendue ni transmise à des tiers.",
  },
  {
    title: 'Transferts hors UE',
    hint: 'si un fournisseur cloud héberge les données hors Union européenne.',
    body: "Aucun transfert hors UE. Architecture local-first (ADR-001) : le modèle LLM fonctionne exclusivement sur le serveur local. Les fournisseurs cloud (Gemini, Groq, OpenAI) sont désactivés en production.",
  },
  {
    title: 'Vos droits',
    hint: 'accès, rectification, suppression, portabilité, opposition, et comment les exercer.',
    body: "Droit d'accès (GET /api/accounts/me/), rectification (PATCH /api/accounts/profile/), suppression (DELETE /api/accounts/profile/), portabilité (GET /api/accounts/export/ — export JSON de toutes vos données). Pour exercer vos droits : agissez depuis votre profil ou contactez l'équipe via l'établissement IPSSI.",
  },
  {
    title: 'Cookies',
    hint: 'renvoi vers la politique de cookies du site.',
    body: "EduTutor IA n'utilise pas de cookies de traçage ou publicitaires. Consultez notre Politique de gestion des cookies pour le détail du stockage utilisé (token d'authentification en localStorage).",
  },
  {
    title: 'Contact & réclamation',
    hint: 'email du référent données + droit de réclamation auprès de la CNIL.',
    body: "Contact : Équipe 17 via l'établissement IPSSI. Réclamation possible auprès de la CNIL — Commission Nationale de l'Informatique et des Libertés, 3 Place de Fontenoy, 75007 Paris (www.cnil.fr).",
  },
];

export default function ConfidentialitePage() {
  return (
    <LegalScaffold
      title="Politique de confidentialité"
      intro="Comment les données personnelles des utilisateurs d'EduTutor IA sont collectées, utilisées et protégées (RGPD)."
      sections={SECTIONS}
      lastUpdated="01/07/2026"
    />
  );
}
