import { PageDef } from '../fields';

/** Textes d'exemple : les passages entre crochets sont à compléter avec la doctoresse. */
const defaults = {
  hero: {
    kicker: 'PREMIÈRE CONSULTATION',
    titre: 'Ce qui vous attend au cabinet',
    intro:
      'Venir voir un spécialiste peut impressionner. Voici, étape par étape, comment se passe une première consultation, pour que vous arriviez sereinement.',
    bouton: 'Prendre rendez-vous',
  },
  deroule: {
    kicker: 'DÉROULEMENT',
    titre: 'Quatre temps, du rendez-vous à la sortie',
    items: [
      {
        n: '01',
        moment: 'AVANT',
        titre: 'Vous réservez en ligne',
        texte:
          'Choisissez un jour et une heure, laissez vos coordonnées. Confirmation par e-mail et rappel la veille.',
      },
      {
        n: '02',
        moment: "À L'ARRIVÉE",
        titre: 'Un accueil sans attente inutile',
        texte:
          "Présentez-vous quelques minutes avant l'heure. Nous ouvrons votre dossier et vous demandons vos antécédents.",
      },
      {
        n: '03',
        moment: 'PENDANT',
        titre: 'Une vraie conversation',
        texte:
          "La doctoresse vous écoute, vous examine, mesure poids, tension et glycémie si besoin, puis vous explique ce qu'elle constate.",
      },
      {
        n: '04',
        moment: 'APRÈS',
        titre: 'Un plan clair, par écrit',
        texte:
          'Vous repartez avec une ordonnance, la liste des examens à faire et la date du prochain rendez-vous.',
      },
    ],
  },
  apporter: {
    titre: 'À apporter',
    items: [
      "Une pièce d'identité",
      'Vos analyses et comptes rendus récents',
      'Vos ordonnances en cours ou la liste de vos médicaments',
      'Votre carnet de glycémie, si vous en avez un',
      'Vos radiographies ou échographies, si vous en avez',
      "Vos questions, notées à l'avance",
    ],
  },
  tarifs: {
    titre: 'Durée et tarif',
    lignes: [
      { label: 'Première consultation', valeur: '[durée] min · [tarif] FCFA' },
      { label: 'Consultation de suivi', valeur: '[durée] min · [tarif] FCFA' },
      { label: 'Paiement', valeur: '[espèces, Wave, Orange Money…]' },
    ],
    note: 'Tarifs à confirmer par la doctoresse.',
  },
  report: {
    titre: 'Besoin de reporter ?',
    texte:
      "Prévenez-nous au moins [24 heures] à l'avance, par téléphone ou depuis votre espace patient. [Règle d'annulation à confirmer.]",
  },
  urgence: {
    titre: "En cas d'urgence",
    texte:
      'Le cabinet ne prend pas en charge les urgences. En cas de malaise ou de glycémie très anormale, rendez-vous aux urgences les plus proches.',
  },
  appel: { titre: 'Prêt à réserver votre première consultation ?' },
};

export type PremiereConsultationContent = typeof defaults;

export const PREMIERE_CONSULTATION: PageDef<PremiereConsultationContent> = {
  slug: 'premiere-consultation',
  title: 'Première consultation',
  route: '/premiere-consultation',
  defaults,
  fields: [
    {
      key: 'hero',
      label: 'En-tête de la page',
      type: 'group',
      fields: [
        { key: 'kicker', label: 'Petit titre', type: 'text' },
        { key: 'titre', label: 'Titre', type: 'text' },
        { key: 'intro', label: 'Présentation', type: 'textarea' },
        { key: 'bouton', label: 'Texte du bouton', type: 'text' },
      ],
    },
    {
      key: 'deroule',
      label: 'Déroulement',
      type: 'group',
      fields: [
        { key: 'kicker', label: 'Petit titre', type: 'text' },
        { key: 'titre', label: 'Titre', type: 'text' },
        {
          key: 'items',
          label: 'Étapes',
          type: 'list',
          itemLabel: 'une étape',
          titleKey: 'titre',
          fields: [
            { key: 'n', label: 'Numéro', type: 'text' },
            { key: 'moment', label: 'Moment (en majuscules)', type: 'text' },
            { key: 'titre', label: 'Titre', type: 'text' },
            { key: 'texte', label: 'Texte', type: 'textarea' },
          ],
        },
      ],
    },
    {
      key: 'apporter',
      label: 'À apporter',
      type: 'group',
      fields: [
        { key: 'titre', label: 'Titre', type: 'text' },
        { key: 'items', label: 'La liste', type: 'strings', itemLabel: 'un élément' },
      ],
    },
    {
      key: 'tarifs',
      label: 'Durée et tarif',
      type: 'group',
      fields: [
        { key: 'titre', label: 'Titre', type: 'text' },
        {
          key: 'lignes',
          label: 'Lignes',
          type: 'list',
          itemLabel: 'une ligne',
          titleKey: 'label',
          fields: [
            { key: 'label', label: 'Intitulé', type: 'text' },
            { key: 'valeur', label: 'Durée et tarif', type: 'text' },
          ],
        },
        {
          key: 'note',
          label: 'Note sous le tableau',
          type: 'text',
          hint: 'Laissez vide pour ne rien afficher.',
        },
      ],
    },
    {
      key: 'report',
      label: 'Besoin de reporter ?',
      type: 'group',
      fields: [
        { key: 'titre', label: 'Titre', type: 'text' },
        { key: 'texte', label: 'Texte', type: 'textarea' },
      ],
    },
    {
      key: 'urgence',
      label: "En cas d'urgence",
      type: 'group',
      fields: [
        { key: 'titre', label: 'Titre', type: 'text' },
        {
          key: 'texte',
          label: 'Texte',
          type: 'textarea',
          hint: 'Le numéro d’urgence saisi dans les Réglages du site s’affiche à la suite.',
        },
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
