/** Politique de gestion des cookies — EduTutor IA (complétée J3-bis). */
import LegalScaffold, { type LegalSection } from './LegalScaffold';

const SECTIONS: LegalSection[] = [
  {
    title: "Qu'est-ce qu'un cookie ?",
    hint: 'définition simple à destination des utilisateurs.',
    body: "Un cookie est un petit fichier texte déposé sur votre navigateur par un site web. Il permet de mémoriser des informations entre deux visites. EduTutor IA utilise du stockage local (localStorage) plutôt que des cookies au sens strict, avec le même objectif : maintenir votre session ouverte.",
  },
  {
    title: 'Cookies et stockage utilisés',
    hint: "lister ce que le site dépose (ex. token d'authentification en localStorage).",
    body: "EduTutor IA utilise uniquement le localStorage du navigateur pour stocker votre token d'authentification (clé : 'token'). Aucun cookie de traçage, de publicité ou d'analyse d'audience n'est déposé. Aucun service tiers (Google Analytics, Facebook Pixel, etc.) n'est intégré.",
  },
  {
    title: 'Finalité de chaque cookie',
    hint: "à quoi sert chaque cookie/stockage (technique, mesure d'audience…).",
    body: "Le token d'authentification (localStorage) a une finalité strictement technique : maintenir votre session active sans vous redemander votre mot de passe à chaque page. Il ne permet aucun traçage de navigation ni aucune analyse comportementale.",
  },
  {
    title: 'Consentement',
    hint: 'cookies nécessitant un consentement préalable et comment il est recueilli.',
    body: "Le token d'authentification est un stockage strictement nécessaire au fonctionnement du service (catégorie exemptée de consentement selon les lignes directrices CNIL). Aucun autre stockage non essentiel n'est utilisé, donc aucune bannière de consentement n'est requise.",
  },
  {
    title: 'Durée de conservation',
    hint: 'combien de temps chaque cookie est conservé.',
    body: "Le token d'authentification est conservé en localStorage jusqu'à la déconnexion explicite (clic sur 'Se déconnecter') ou la suppression du compte. Il n'a pas de date d'expiration automatique côté navigateur, mais est invalidé côté serveur lors de la déconnexion.",
  },
  {
    title: 'Gérer ou refuser les cookies',
    hint: 'comment paramétrer ou supprimer les cookies (navigateur, bannière).',
    body: "Pour supprimer le token d'authentification : utilisez le bouton 'Se déconnecter' dans l'application, ou effacez manuellement les données du site dans les paramètres de votre navigateur (Paramètres > Confidentialité > Données de navigation > localStorage). Notez que la suppression du token vous déconnecte immédiatement.",
  },
];

export default function CookiesPage() {
  return (
    <LegalScaffold
      title="Politique de gestion des cookies"
      intro="Les cookies et technologies de stockage utilisés par EduTutor IA, et comment les gérer."
      sections={SECTIONS}
      lastUpdated="01/07/2026"
    />
  );
}
