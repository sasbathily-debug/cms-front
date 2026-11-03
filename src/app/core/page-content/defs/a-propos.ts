import { PageDef } from '../fields';

/** Textes d'exemple : les passages entre crochets sont à remplir avec la doctoresse. */
const defaults = {
  hero: {
    kicker: 'À PROPOS',
    tagline: 'Endocrinologie · Diabétologie · Nutrition',
    nom: 'Dr Aïssatou Mamadou Fall',
    intro:
      "Médecin endocrinologue et nutritionniste à Dakar. J'accompagne les personnes qui vivent avec le diabète, une maladie de la thyroïde ou un trouble hormonal.",
    citation: "« Mieux comprendre sa maladie, c'est déjà commencer à la maîtriser. »",
    citationNote: '[Citation à confirmer par la doctoresse]',
    preuve: "Autrice du Guide pratique de l'alimentation du diabétique",
    boutonPrincipal: 'Prendre rendez-vous',
    boutonSecondaire: 'Mes spécialités',
    banniere: '/img/photo-1.jpg',
    portrait: '/img/dr-fall-sourire-640.webp',
    portraitAlt: 'Portrait souriant du Dr Aïssatou Mamadou Fall',
  },
  histoire: {
    kicker: 'MON HISTOIRE',
    titre: "Pourquoi l'endocrinologie",
    accroche:
      'Les maladies chroniques demandent du temps, de la pédagogie et une relation de confiance durable.',
    texte:
      "[Texte à écrire avec la doctoresse : ce qui l'a menée à cette spécialité, une rencontre ou un patient qui l'a marquée.] Au cabinet, je prends le temps d'expliquer chaque diagnostic avec des mots simples, de construire avec vous un plan réaliste et de l'ajuster au fil des consultations, en tenant compte de votre quotidien, de votre alimentation et de votre famille.",
  },
  parcours: {
    kicker: 'PARCOURS',
    titre: 'Formation et expérience',
    items: [
      { periode: '[Années]', titre: 'Doctorat en médecine', lieu: '[Université, ville, pays]' },
      {
        periode: '[Années]',
        titre: 'Spécialisation en endocrinologie, diabétologie et maladies métaboliques',
        lieu: '[Établissement, ville, pays]',
      },
      {
        periode: '[Années]',
        titre: 'Formation en nutrition clinique',
        lieu: '[Diplôme universitaire, établissement]',
      },
      {
        periode: '[Années]',
        titre: 'Exercice hospitalier',
        lieu: '[Service, structure, responsabilités]',
      },
      {
        periode: 'Depuis [année]',
        titre: "Cabinet d'endocrinologie et de nutrition",
        lieu: 'Cité Keur Gorgui, Dakar',
      },
    ],
  },
  valeurs: {
    kicker: 'CE QUE VOUS TROUVEREZ AU CABINET',
    titre: 'Ce que je vous promets, concrètement',
    items: [
      {
        sym: '',
        titre: 'Un plan écrit',
        texte:
          'Vous repartez de chaque consultation avec une ordonnance, la liste des examens à faire et la date du prochain rendez-vous.',
      },
      {
        sym: '',
        titre: 'Des mots simples',
        texte:
          "J'explique le diagnostic avec des mots simples, autant de fois que nécessaire, jusqu'à ce que ce soit clair.",
      },
      {
        sym: '',
        titre: 'Votre cuisine, pas un régime importé',
        texte:
          'Les conseils alimentaires partent de vos vrais repas et de votre quotidien, pour que vous puissiez les tenir.',
      },
    ],
  },
  affiliations: {
    titre: 'Sociétés savantes et affiliations',
    texte:
      "[Ordre des médecins du Sénégal, n° d'inscription] · [Société d'endocrinologie ou de diabétologie] · [Autres associations]",
  },
  interventions: {
    titre: "Lors d'une intervention publique",
    texte:
      '[Événement, ville et date : à préciser. Autres interventions, congrès, articles : à renseigner si la doctoresse en a.]',
    photo: '/img/dr-fall-conference-640.webp',
    photoAlt: "Le Dr Aïssatou Mamadou Fall, micro à la main, lors d'une intervention publique",
  },
  appel: {
    titre: 'Faisons connaissance.',
  },
};

export type AProposContent = typeof defaults;

export const A_PROPOS: PageDef<AProposContent> = {
  slug: 'a-propos',
  title: 'À propos',
  route: '/a-propos',
  defaults,
  fields: [
    {
      key: 'hero',
      label: 'En-tête de la page',
      type: 'group',
      fields: [
        { key: 'kicker', label: 'Petit titre de l’encadré', type: 'text' },
        { key: 'tagline', label: 'Spécialités (à droite du petit titre)', type: 'text' },
        { key: 'nom', label: 'Nom', type: 'text' },
        { key: 'intro', label: 'Présentation', type: 'textarea' },
        { key: 'citation', label: 'Citation', type: 'textarea' },
        {
          key: 'citationNote',
          label: 'Note sous la citation',
          type: 'text',
          hint: 'Laissez vide pour ne rien afficher.',
        },
        {
          key: 'preuve',
          label: 'Ligne de reconnaissance sous la présentation',
          type: 'text',
          hint: 'Par exemple une société savante ou une publication. Laissez vide pour ne rien afficher.',
        },
        { key: 'boutonPrincipal', label: 'Texte du bouton orange', type: 'text' },
        { key: 'boutonSecondaire', label: 'Texte du bouton contour', type: 'text' },
        {
          key: 'banniere',
          label: 'Photo de fond en haut de page',
          type: 'image',
          hint: 'Format conseillé : large (paysage).',
        },
        { key: 'portrait', label: 'Portrait', type: 'image' },
        {
          key: 'portraitAlt',
          label: 'Description du portrait (pour les malvoyants)',
          type: 'text',
        },
      ],
    },
    {
      key: 'histoire',
      label: 'Mon histoire',
      type: 'group',
      fields: [
        { key: 'kicker', label: 'Petit titre', type: 'text' },
        { key: 'titre', label: 'Titre', type: 'text' },
        { key: 'accroche', label: 'Phrase d’accroche', type: 'textarea' },
        { key: 'texte', label: 'Texte', type: 'textarea' },
      ],
    },
    {
      key: 'parcours',
      label: 'Parcours',
      type: 'group',
      fields: [
        { key: 'kicker', label: 'Petit titre', type: 'text' },
        { key: 'titre', label: 'Titre', type: 'text' },
        {
          key: 'items',
          label: 'Étapes du parcours',
          type: 'list',
          itemLabel: 'une étape',
          titleKey: 'titre',
          fields: [
            { key: 'periode', label: 'Période (années)', type: 'text' },
            { key: 'titre', label: 'Diplôme ou poste', type: 'text' },
            { key: 'lieu', label: 'Lieu', type: 'text' },
          ],
        },
      ],
    },
    {
      key: 'valeurs',
      label: 'Ma façon de travailler',
      type: 'group',
      fields: [
        { key: 'kicker', label: 'Petit titre', type: 'text' },
        { key: 'titre', label: 'Titre', type: 'text' },
        {
          key: 'items',
          label: 'Engagements',
          type: 'list',
          itemLabel: 'un engagement',
          titleKey: 'titre',
          fields: [
            { key: 'titre', label: 'Titre', type: 'text' },
            { key: 'texte', label: 'Texte', type: 'textarea' },
          ],
        },
      ],
    },
    {
      key: 'affiliations',
      label: 'Sociétés savantes et affiliations',
      type: 'group',
      fields: [
        { key: 'titre', label: 'Titre', type: 'text' },
        { key: 'texte', label: 'Texte', type: 'textarea' },
      ],
    },
    {
      key: 'interventions',
      label: 'Enseignement et publications',
      type: 'group',
      fields: [
        { key: 'titre', label: 'Titre', type: 'text' },
        { key: 'texte', label: 'Texte', type: 'textarea' },
        { key: 'photo', label: 'Photo', type: 'image' },
        {
          key: 'photoAlt',
          label: 'Description de la photo (pour les malvoyants)',
          type: 'text',
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
