import { LegalSection } from '../../../shared/legal-page/legal-page';

/**
 * Texte provisoire des mentions légales. Les passages entre crochets sont à confirmer par la doctoresse ;
 * le texte entier est à faire relire, idéalement par un juriste qui connaît le droit sénégalais.
 */
export const MENTIONS_MISE_A_JOUR = '25 octobre 2026';

export const MENTIONS_TITRE = 'Mentions légales';

export const MENTIONS_LEAD =
  'Qui édite ce site, qui l’héberge, ce que vous pouvez en faire et ce que ses informations ne remplacent pas.';

export const MENTIONS_RESUME: string[] = [
  'Ce site est celui du cabinet du Dr Aïssatou Mamadou Fall, médecin endocrinologue, diabétologue et nutritionniste à Dakar.',
  'Les informations qu’il contient sont générales : elles ne remplacent ni une consultation, ni un avis médical personnalisé.',
  'Les textes, images et le logo du site sont protégés : leur reprise demande l’accord du cabinet.',
  'Vos données personnelles sont traitées comme l’explique la politique de confidentialité.',
];

export const MENTIONS: LegalSection[] = [
  {
    id: 'editeur',
    titre: 'Qui édite ce site',
    lignes: [
      {
        nom: 'Éditeur',
        texte: 'Cabinet du Dr Aïssatou Mamadou Fall, Cité Keur Gorgui, Dakar (Sénégal).',
      },
      {
        nom: 'Profession',
        texte:
          'Médecin endocrinologue, diabétologue et nutritionniste. [Titres et diplômes à préciser]',
      },
      {
        nom: 'Ordre des médecins',
        texte: 'Inscrite à l’Ordre des médecins du Sénégal, n° [numéro d’inscription à compléter].',
      },
      {
        nom: 'Autorisation d’exercer',
        texte: '[Référence de l’autorisation d’exercer : à confirmer par la doctoresse.]',
      },
      {
        nom: 'Immatriculation',
        texte: '[NINEA ou autre identifiant, si le cabinet en a un : à confirmer.]',
      },
      {
        nom: 'Directrice de la publication',
        texte: 'Dr Aïssatou Mamadou Fall. [À confirmer]',
      },
    ],
    fin: ['Les coordonnées du cabinet figurent en bas de cette page.'],
  },
  {
    id: 'conception',
    titre: 'Qui a conçu et réalisé le site',
    intro: [
      'Site conçu et réalisé par Azertica (www.azertica.com). [Raison sociale, adresse et contact de l’agence à compléter.]',
    ],
  },
  {
    id: 'hebergement',
    titre: 'Où le site est hébergé',
    lignes: [
      {
        nom: 'Pages du site',
        texte: 'Vercel Inc. (société américaine). [Adresse et région à confirmer]',
      },
      {
        nom: 'Serveur du site et assistant',
        texte: 'Render (société américaine). [Société, adresse et région à confirmer]',
      },
      {
        nom: 'Base de données',
        texte: 'Neon (société américaine). [Société, adresse et région à confirmer]',
      },
      {
        nom: 'Images et documents',
        texte: 'Cloudinary. [Société, adresse et région à confirmer]',
      },
    ],
    fin: [
      'Le détail de ce que chacun reçoit de vos données figure dans la politique de confidentialité.',
    ],
  },
  {
    id: 'information-medicale',
    titre: 'Informations médicales',
    intro: [
      'Les informations de ce site sont données à titre général pour vous aider à comprendre votre santé. Elles ne constituent ni un diagnostic, ni une prescription, et ne remplacent pas une consultation.',
      'Ne retardez pas un avis médical à cause de ce que vous avez lu ici. En cas d’urgence, contactez les urgences ou le numéro indiqué sur les pages de santé du site. L’assistant et le formulaire de contact ne sont pas faits pour les urgences.',
      'Les textes de santé sont provisoires tant qu’ils n’ont pas été relus et validés par la doctoresse.',
    ],
  },
  {
    id: 'propriete',
    titre: 'Propriété intellectuelle',
    intro: [
      'Les textes, photographies, illustrations, le logo et l’organisation du site appartiennent au cabinet ou à leurs auteurs, et sont protégés. Vous pouvez les consulter et les citer en indiquant la source. Toute autre reprise, copie ou diffusion demande l’accord écrit du cabinet. [Droits des photographies à confirmer.]',
    ],
  },
  {
    id: 'responsabilite',
    titre: 'Responsabilité',
    points: [
      'Nous veillons à l’exactitude des informations, mais elles peuvent contenir des erreurs ou ne pas être à jour.',
      'Le site peut être interrompu pour une maintenance ou en cas de panne ; nous ne pouvons pas garantir qu’il soit toujours disponible.',
      'Le site renvoie vers d’autres sites (Instagram, WhatsApp, Google Maps) : le cabinet n’est pas responsable de leur contenu.',
    ],
  },
  {
    id: 'donnees',
    titre: 'Données personnelles et cookies',
    intro: [
      'Ce que le site recueille, pourquoi, avec qui il le partage et comment exercer vos droits est expliqué dans la politique de confidentialité. Vous pouvez à tout moment modifier votre choix sur les cookies avec « Gérer les cookies », en bas de chaque page.',
    ],
  },
  {
    id: 'droit',
    titre: 'Droit applicable',
    intro: [
      'Ces mentions sont soumises au droit sénégalais. En cas de litige, et à défaut d’accord amiable, les tribunaux de Dakar sont compétents. [À confirmer avec un juriste.]',
    ],
  },
];
