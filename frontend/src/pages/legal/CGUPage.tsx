/** Conditions Générales d'Utilisation — EduTutor IA (complétées J3-bis). */
import LegalScaffold, { type LegalSection } from './LegalScaffold';

const SECTIONS: LegalSection[] = [
  {
    title: 'Objet',
    hint: 'ce que régissent ces CGU et le service concerné (EduTutor IA).',
    body: "Les présentes Conditions Générales d'Utilisation régissent l'accès et l'utilisation du service EduTutor IA, plateforme de génération automatique de QCM pédagogiques à partir de cours uploadés par l'utilisateur, développée par l'Équipe 17 dans le cadre d'APOCAL'IPSSI 2026.",
  },
  {
    title: 'Acceptation des conditions',
    hint: "comment l'utilisateur accepte les CGU (inscription, usage…).",
    body: "L'utilisation du service vaut acceptation des présentes CGU. En créant un compte, l'utilisateur déclare avoir lu et accepté ces conditions dans leur intégralité. En cas de désaccord, l'utilisateur est invité à ne pas utiliser le service.",
  },
  {
    title: 'Accès au service',
    hint: "conditions d'accès, disponibilité, prérequis techniques.",
    body: "Le service est accessible via navigateur web après création d'un compte. Il est fourni dans un cadre pédagogique sans garantie de disponibilité continue. L'équipe se réserve le droit de suspendre temporairement l'accès pour maintenance.",
  },
  {
    title: 'Compte utilisateur',
    hint: 'création, responsabilité du mot de passe, exactitude des informations.',
    body: "L'utilisateur est responsable de la confidentialité de ses identifiants et de toute activité réalisée depuis son compte. Il s'engage à fournir des informations exactes lors de l'inscription et à maintenir ses données à jour.",
  },
  {
    title: 'Comportements interdits',
    hint: 'usages abusifs, contenus illicites, atteinte à la sécurité.',
    body: "Il est interdit de : (1) tenter de manipuler le modèle LLM via des instructions cachées dans les cours (prompt injection), (2) uploader des contenus illicites, violents ou protégés sans droit, (3) tenter d'accéder aux données d'autres utilisateurs, (4) utiliser le service à des fins autres que pédagogiques.",
  },
  {
    title: 'Contenu généré par IA',
    hint: "limites des quiz générés (peuvent contenir des erreurs), responsabilité de l'utilisateur.",
    body: "Les QCM générés par EduTutor IA sont produits automatiquement par un modèle de langage (LLM) et peuvent contenir des erreurs factuelles. L'utilisateur est seul responsable de la vérification et de l'utilisation des quiz générés. EduTutor IA ne peut être tenu responsable des inexactitudes dans le contenu généré.",
  },
  {
    title: 'Responsabilité',
    hint: "limites de responsabilité de l'éditeur.",
    body: "Le service est fourni dans un cadre pédagogique expérimental « tel quel », sans garantie de résultats. L'éditeur ne saurait être tenu responsable de tout dommage direct ou indirect résultant de l'utilisation du service ou de la confiance accordée aux quiz générés.",
  },
  {
    title: 'Propriété intellectuelle',
    hint: "droits sur le service et sur les contenus déposés par l'utilisateur.",
    body: "L'utilisateur conserve la propriété des cours qu'il uploade. En les déposant, il accorde à EduTutor IA une licence d'utilisation limitée au traitement LLM local pour la génération du quiz. Le code source du service appartient à l'Équipe 17 APOCAL'IPSSI 2026.",
  },
  {
    title: 'Modification des CGU',
    hint: 'comment et quand les CGU peuvent évoluer.',
    body: "Les présentes CGU peuvent être modifiées à tout moment. Les utilisateurs seront informés par email de toute modification substantielle. La poursuite de l'utilisation du service après notification vaut acceptation des nouvelles CGU.",
  },
  {
    title: 'Droit applicable et litiges',
    hint: 'droit applicable et juridiction compétente.',
    body: "Les présentes CGU sont soumises au droit français. En cas de litige, les parties s'engagent à rechercher une solution amiable. À défaut, les tribunaux compétents seront ceux du ressort du siège de l'éditeur.",
  },
];

export default function CGUPage() {
  return (
    <LegalScaffold
      title="Conditions Générales d'Utilisation"
      intro="Les règles d'utilisation du service EduTutor IA, acceptées par chaque utilisateur lors de son inscription."
      sections={SECTIONS}
      lastUpdated="01/07/2026"
    />
  );
}
