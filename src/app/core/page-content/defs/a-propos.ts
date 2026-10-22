import { PageDef } from '../fields';

/** Textes d'exemple : les passages entre crochets sont à remplir avec la doctoresse. */
const defaults = {
  hero: {
    kicker: 'À PROPOS',
    tagline: 'Endocrinologie · Diabétologie · Nutrition',
    nom: 'Dr Aissatou Mamadou Fall',
    intro:
      "Médecin endocrinologue et nutritionniste à Dakar. J'accompagne les personnes qui vivent avec le diabète, une maladie de la thyroïde ou un trouble hormonal.",
    citation: "« Mieux comprendre sa maladie, c'est déjà commencer à la maîtriser. »",
    citationNote: '[Citation à confirmer par la doctoresse]',
    boutonPrincipal: 'Prendre rendez-vous',
    boutonSecondaire: 'Mes spécialités',
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
        lieu: 'Sacré-Cœur, Dakar',
      },
    ],
  },
  valeurs: {
    kicker: 'MA FAÇON DE TRAVAILLER',
    titre: 'Trois engagements envers mes patients',
    items: [
      {
        sym: 'Éc',
        titre: 'Écoute',
        texte:
          'Chaque patient arrive avec son histoire, ses habitudes et ses craintes. La consultation commence toujours par vous écouter.',
      },
      {
        sym: 'Pé',
        titre: 'Pédagogie',
        texte:
          "Comprendre sa maladie rend le traitement plus facile à suivre. J'explique avec des mots simples, autant de fois que nécessaire.",
      },
      {
        sym: 'Su',
        titre: 'Suivi dans la durée',
        texte:
          "Un plan de soins n'est jamais figé : nous l'ajustons ensemble, consultation après consultation.",
      },
    ],
  },
  affiliations: {
    titre: 'Sociétés savantes et affiliations',
    texte:
      "[Ordre des médecins du Sénégal, n° d'inscription] · [Société d'endocrinologie ou de diabétologie] · [Autres associations]",
  },
  interventions: {
    titre: 'Enseignement et publications',
    texte:
      "Lors d'une intervention [événement et date à préciser]. [Autres interventions, congrès, articles : à renseigner si la doctoresse en a.]",
  },
  appel: {
    titre: "Envie d'en parler ? Prenons rendez-vous.",
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
        { key: 'boutonPrincipal', label: 'Texte du bouton orange', type: 'text' },
        { key: 'boutonSecondaire', label: 'Texte du bouton contour', type: 'text' },
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
            { key: 'sym', label: 'Deux lettres affichées en grand', type: 'text' },
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
