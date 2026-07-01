/** Mentions légales — EduTutor IA (complétées J3-bis). */
import LegalScaffold, { type LegalSection } from './LegalScaffold';

const SECTIONS: LegalSection[] = [
  {
    title: 'Éditeur du site',
    hint: "nom de l'organisation/équipe, statut, adresse, email de contact.",
    body: "EduTutor IA est édité par l'Équipe 17 dans le cadre de la semaine pédagogique APOCAL'IPSSI 2026 organisée par l'IPSSI. Membres : Abdelhadi MOUMOU (chef de projet), Jason DAHMOUN, Julie SAINT MARTIN, Kephren BIBANG, Mathis PENAGOS, Stive GAMY, Karam DHIFI.",
  },
  {
    title: 'Directeur de la publication',
    hint: 'nom de la personne responsable du contenu publié.',
    body: "Abdelhadi MOUMOU, chef de projet Équipe 17 APOCAL'IPSSI 2026.",
  },
  {
    title: 'Hébergeur',
    hint: "nom, adresse et téléphone de l'hébergeur du site.",
    body: "Environnement de développement : hébergement local via Docker Compose. Production future prévue sur OVHcloud SAS (2 Rue Kellermann, 59100 Roubaix, France — www.ovhcloud.com), hébergeur européen conforme RGPD.",
  },
  {
    title: 'Propriété intellectuelle',
    hint: 'à qui appartiennent les textes, logos, code, contenus.',
    body: "Le code source est publié sous licence pédagogique APOCAL'IPSSI 2026. Les cours uploadés restent la propriété de leurs auteurs. Les QCM générés par le LLM sont produits à partir du contenu fourni — aucune revendication de propriété sur les quiz générés.",
  },
  {
    title: 'Contact',
    hint: 'comment vous joindre pour toute question juridique.',
    body: "Pour toute question juridique, contactez l'Équipe 17 via l'encadrement pédagogique de l'IPSSI.",
  },
];

export default function MentionsLegalesPage() {
  return (
    <LegalScaffold
      title="Mentions légales"
      intro="Informations légales obligatoires identifiant l'éditeur et l'hébergeur du service EduTutor IA."
      sections={SECTIONS}
      lastUpdated="01/07/2026"
    />
  );
}
