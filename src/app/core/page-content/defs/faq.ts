import { PageDef } from '../fields';

/** Les questions elles-mêmes se gèrent dans « FAQ » ; ici, les textes autour. */
const defaults = {
  hero: {
    titre: 'Vos questions, nos réponses.',
    intro:
      "Rendez-vous, consultation, paiement, confidentialité : les réponses courtes aux questions que l'on nous pose le plus souvent.",
  },
  bulles: [
    {
      q: 'Dois-je créer un compte pour réserver ?',
      a: 'Oui, en une minute avec votre numéro de téléphone.',
    },
    { q: 'Que dois-je apporter ?', a: 'Vos analyses récentes et la liste de vos médicaments.' },
    {
      q: "Et si j'ai une urgence ?",
      a: 'Appelez le {urgence}. Ne passez pas par le site.',
    },
  ],
  recherche: {
    placeholder: 'Rechercher une question (par exemple : « annuler », « tarif », « apporter »)',
  },
  contact: {
    titre: 'Vous ne trouvez pas votre réponse ?',
    texte: "Écrivez-nous ou appelez pendant les horaires d'ouverture.",
    bouton: 'Nous contacter',
  },
  urgence: {
    titre: 'Urgence',
    texte:
      'En cas de malaise, de douleur dans la poitrine ou de difficulté à respirer, appelez le {urgence}. Ne passez pas par le site.',
  },
  appel: { titre: 'Une consultation, des réponses claires.' },
};

export type FaqPageContent = typeof defaults;

const urgenceHint =
  'Écrivez {urgence} là où le numéro doit apparaître : il est remplacé par le numéro saisi dans les Réglages du site.';

export const FAQ_PAGE: PageDef<FaqPageContent> = {
  slug: 'faq',
  editable: false,
  title: 'Questions fréquentes',
  route: '/faq',
  defaults,
  fields: [
    {
      key: 'hero',
      label: 'En-tête de la page',
      type: 'group',
      fields: [
        { key: 'titre', label: 'Titre', type: 'text' },
        { key: 'intro', label: 'Présentation', type: 'textarea' },
      ],
    },
    {
      key: 'bulles',
      label: 'Les trois bulles animées',
      type: 'list',
      itemLabel: 'une bulle',
      titleKey: 'q',
      fields: [
        { key: 'q', label: 'Question', type: 'text' },
        { key: 'a', label: 'Réponse', type: 'text', hint: urgenceHint },
      ],
    },
    {
      key: 'recherche',
      label: 'Barre de recherche',
      type: 'group',
      fields: [{ key: 'placeholder', label: 'Texte d’aide dans la barre', type: 'text' }],
    },
    {
      key: 'contact',
      label: 'Encadré « Vous ne trouvez pas votre réponse ? »',
      type: 'group',
      fields: [
        { key: 'titre', label: 'Titre', type: 'text' },
        { key: 'texte', label: 'Texte', type: 'textarea' },
        { key: 'bouton', label: 'Texte du bouton', type: 'text' },
      ],
    },
    {
      key: 'urgence',
      label: 'Encadré « Urgence »',
      type: 'group',
      fields: [
        { key: 'titre', label: 'Titre', type: 'text' },
        { key: 'texte', label: 'Texte', type: 'textarea', hint: urgenceHint },
      ],
    },
    {
      key: 'appel',
      label: 'Bandeau du bas de page',
      type: 'group',
      fields: [{ key: 'titre', label: 'Phrase', type: 'text' }],
    },
  ],
};
