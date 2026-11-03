import { Field, PageDef } from '../fields';
import { MALADIES, MaladieContent } from '../../../features/pages/maladie/maladies.data';

/** Les champs sont les mêmes pour les trois pages maladies ; seules leurs illustrations (fixes, facultatives) diffèrent. */
const FIELDS: Field[] = [
  {
    label: 'En-tête de la page',
    type: 'section',
    fields: [
      { key: 'crumb', label: 'Nom dans le fil d’Ariane', type: 'text' },
      { key: 'title', label: 'Titre', type: 'text' },
      { key: 'lead', label: 'Présentation', type: 'textarea' },
      { key: 'heroLabel', label: 'Légende de l’illustration', type: 'text' },
    ],
  },
  {
    key: 'essentiel',
    label: 'L’essentiel en 30 secondes',
    type: 'group',
    fields: [
      { key: 'quoi', label: 'De quoi s’agit-il ?', type: 'textarea' },
      { key: 'quand', label: 'Quand consulter ?', type: 'textarea' },
      { key: 'suivi', label: 'Comment se passe le suivi ?', type: 'textarea' },
      { key: 'urgence', label: 'En cas d’urgence', type: 'textarea' },
    ],
  },
  {
    key: 'definition',
    label: 'Comprendre la maladie',
    type: 'group',
    fields: [
      { key: 'title', label: 'Titre', type: 'text' },
      { key: 'text', label: 'Explication', type: 'textarea' },
      { key: 'imageTitle', label: 'Titre de la partie illustrée', type: 'text' },
      { key: 'imageIntro', label: 'Phrase d’introduction de l’illustration', type: 'textarea' },
      {
        key: 'cards',
        label: 'Cartes illustrées (les illustrations ne changent pas)',
        type: 'list',
        itemLabel: 'une carte',
        titleKey: 'title',
        fixed: true,
        fields: [
          { key: 'title', label: 'Titre', type: 'text' },
          { key: 'text', label: 'Texte', type: 'textarea' },
        ],
      },
    ],
  },
  {
    key: 'signes',
    label: 'Les signes qui doivent alerter',
    type: 'group',
    fields: [
      { key: 'items', label: 'Les signes', type: 'strings', itemLabel: 'un signe' },
      { key: 'outro', label: 'Phrase de conclusion', type: 'textarea' },
    ],
  },
  {
    key: 'priseEnCharge',
    label: 'La prise en charge',
    type: 'group',
    fields: [
      { key: 'intro', label: 'Introduction', type: 'textarea' },
      {
        key: 'examens',
        label: 'Examens',
        type: 'list',
        itemLabel: 'un examen',
        titleKey: 'nom',
        fields: [
          { key: 'nom', label: 'Nom de l’examen', type: 'text' },
          { key: 'texte', label: 'Explication', type: 'textarea' },
          {
            key: 'rythme',
            label: 'Fréquence (facultatif)',
            type: 'text',
            hint: 'Par exemple « En général tous les 3 mois ». Laissez vide pour ne rien afficher.',
          },
        ],
      },
    ],
  },
  {
    label: 'Le suivi au quotidien',
    type: 'section',
    fields: [
      {
        key: 'quotidien',
        label: 'Conseils',
        type: 'list',
        itemLabel: 'un conseil',
        titleKey: 'titre',
        fields: [
          { key: 'titre', label: 'Titre', type: 'text' },
          { key: 'texte', label: 'Texte', type: 'textarea' },
        ],
      },
    ],
  },
  {
    label: 'Quand consulter sans attendre',
    type: 'section',
    fields: [
      {
        key: 'urgence',
        label: 'Texte',
        type: 'textarea',
        hint: 'Le numéro d’urgence saisi dans les Réglages du site s’affiche à la suite.',
      },
    ],
  },
  {
    label: 'Questions fréquentes de la page',
    type: 'section',
    fields: [
      { key: 'faqTitle', label: 'Titre', type: 'text' },
      {
        key: 'faq',
        label: 'Questions',
        type: 'list',
        itemLabel: 'une question',
        titleKey: 'question',
        fields: [
          { key: 'question', label: 'Question', type: 'text' },
          { key: 'reponse', label: 'Réponse', type: 'textarea' },
        ],
      },
    ],
  },
  {
    key: 'aside',
    label: 'Encadré latéral',
    type: 'group',
    fields: [
      { key: 'title', label: 'Titre', type: 'text' },
      { key: 'apporter', label: 'Texte', type: 'textarea' },
    ],
  },
  {
    label: 'Bandeau du bas de page',
    type: 'section',
    fields: [{ key: 'cta', label: 'Phrase', type: 'text' }],
  },
];

function maladie(slug: string, title: string): PageDef<MaladieContent> {
  return {
    slug: `maladie-${slug}`,
    editable: false,
    title,
    route: `/specialites/${slug}`,
    fields: FIELDS,
    defaults: MALADIES[slug],
  };
}

export const MALADIE_DIABETE = maladie('diabete', 'Page Diabète');
export const MALADIE_THYROIDE = maladie('thyroide', 'Page Thyroïde');
export const MALADIE_OBESITE = maladie('obesite', 'Page Obésité et surpoids');
export const MALADIE_NUTRITION = maladie('nutrition-clinique', 'Page Nutrition clinique');
export const MALADIE_HORMONES = maladie('troubles-hormonaux', 'Page Troubles hormonaux');
export const MALADIE_CHOLESTEROL = maladie('cholesterol', 'Page Cholestérol et métabolisme');

/** Les pages maladies par identifiant d'adresse (/specialites/:slug). */
export const MALADIE_DEFS: Record<string, PageDef<MaladieContent>> = {
  diabete: MALADIE_DIABETE,
  thyroide: MALADIE_THYROIDE,
  obesite: MALADIE_OBESITE,
  'nutrition-clinique': MALADIE_NUTRITION,
  'troubles-hormonaux': MALADIE_HORMONES,
  cholesterol: MALADIE_CHOLESTEROL,
};
