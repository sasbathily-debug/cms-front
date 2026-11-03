import { PageDef } from '../fields';

/** Textes d'exemple : les passages entre crochets sont à compléter avec la doctoresse. */
const defaults = {
  hero: {
    kicker: "CABINET D'ENDOCRINOLOGIE · CITÉ KEUR GORGUI, DAKAR",
    titre: 'Endocrinologue à Dakar : diabète, thyroïde, poids.',
    sousTitre:
      "Une consultation qui prend le temps d'expliquer, un suivi clair, et un rendez-vous que vous réservez en ligne en trois minutes, sans compte.",
    introTelephone:
      "Endocrinologue à la Cité Keur Gorgui, Dakar. Diabète, thyroïde, poids, nutrition : une consultation qui prend le temps d'expliquer.",
    boutonPrincipal: 'Prendre rendez-vous',
    boutonSecondaire: 'Ma première consultation',
    lienTelephone: 'Ma première visite →',
    photo: '/img/dr-fall.webp',
    photoTelephone: '/img/dr-fall-640.webp',
    photoAlt:
      'Le Dr Aïssatou Mamadou Fall, endocrinologue et nutritionniste, en blouse blanche, les bras croisés',
  },
  carte: {
    sansCreneau: 'Réservez votre créneau en ligne',
    note: 'Réservation en ligne, confirmation immédiate',
    bouton: 'Prendre rendez-vous',
  },
  declaration: {
    kicker: 'NOTRE FAÇON DE SOIGNER',
    texte:
      "Un cabinet où l'on prend le temps de comprendre, pour que chaque patient devienne acteur de sa santé.",
    boutonPrincipal: 'Faire connaissance avec la doctoresse',
    boutonSecondaire: 'La première consultation',
  },
  specialites: {
    kicker: 'SPÉCIALITÉS',
    titre: 'Ce que je prends en charge',
    intro:
      "Passez la souris sur un motif, ou laissez le schéma tourner : pour le diabète, la thyroïde et les troubles hormonaux, la glande concernée s'allume.",
    introTelephone: "Touchez un motif : pour le diabète, la thyroïde et les troubles hormonaux, la glande concernée s'allume.",
  },
  doctoresse: {
    kicker: 'LA DOCTORESSE',
    titre: "Une consultation qui prend le temps d'expliquer",
    texte:
      "Le Dr Aïssatou Mamadou Fall est médecin endocrinologue et nutritionniste à Dakar. Elle accompagne les personnes qui vivent avec le diabète, une maladie de la thyroïde ou un trouble hormonal. [Parcours et années d'expérience à confirmer.]",
    points: [
      'Des explications avec des mots simples, autant de fois que nécessaire',
      'Un plan écrit, adapté à votre alimentation et à votre quotidien',
      'Un suivi régulier, avec rappel de rendez-vous la veille',
    ],
    stats: [
      { big: '[XX] ans', small: "d'expérience" },
      { big: '[XXXX]', small: 'patients suivis' },
      { big: '[Diplôme]', small: '[Université, pays]' },
      { big: '[Société]', small: '[Affiliation professionnelle]' },
    ],
    noteStats: '',
    lien: 'Découvrir son parcours',
    photo: '/img/dr-fall-sourire-640.webp',
    photoAlt: 'Portrait souriant du Dr Aïssatou Mamadou Fall',
    titreTelephone: 'Dr Aïssatou Mamadou Fall',
    texteTelephone:
      "Médecin endocrinologue et nutritionniste. [Une phrase sur son parcours : formation, années d'exercice.]",
  },
  parcours: {
    kicker: 'VOTRE PARCOURS',
    titre: 'De la réservation au plan de soins, en trois temps',
    etapes: [
      {
        n: '01',
        titre: 'Vous réservez en ligne',
        texte:
          'Choisissez un créneau libre et laissez votre nom et votre téléphone. Pas besoin de compte. Rappel la veille par e-mail.',
      },
      {
        n: '02',
        titre: 'Vous êtes écouté',
        texte:
          'Une vraie conversation, un examen complet, et des explications avec des mots simples.',
      },
      {
        n: '03',
        titre: 'Vous repartez avec un plan',
        texte: 'Ordonnance, examens à faire et prochain rendez-vous, noirs sur blanc.',
      },
    ],
  },
  premiere: {
    kicker: 'VOTRE PREMIÈRE VISITE',
    titre: 'Une première consultation, sans surprise.',
    texte:
      "Ce qu'il faut apporter, comment elle se déroule, ce que vous repartez avec : tout est expliqué avant que vous veniez.",
    points: [
      'Apportez vos analyses récentes et la liste de vos médicaments',
      'Une vraie conversation et un examen complet',
      'Vous repartez avec un plan écrit',
    ],
    bouton: 'Préparer ma première visite',
  },
  conseils: {
    titre: 'Des conseils pour mieux comprendre',
    titreTelephone: 'Comprendre pour mieux se soigner',
    lien: 'Tous les articles',
  },
  avis: {
    titre: 'Ce que disent les patients',
    items: [
      {
        texte:
          "« [Un avis de patient, avec son accord : ce qui l'a marqué dans la consultation.] »",
        auteur: '[Prénom], [ville ou quartier]',
      },
      {
        texte: '« [Un autre avis : la clarté des explications, le suivi.] »',
        auteur: '[Prénom], [ville ou quartier]',
      },
      {
        texte: '« [Un troisième avis, idéalement sur la première consultation.] »',
        auteur: '[Prénom], [ville ou quartier]',
      },
    ],
    note: '',
  },
  trouver: {
    titre: 'Nous trouver à la Cité Keur Gorgui',
  },
  faq: {
    kicker: 'QUESTIONS FRÉQUENTES',
    titre: 'Avant de venir, vous vous demandez peut-être…',
    intro: 'Une autre question ? Appelez le cabinet ou écrivez-nous sur WhatsApp.',
  },
  appel: {
    titre: 'Prenez soin de votre santé dès cette semaine.',
    texte: 'Réservez en ligne en trois minutes. Vous recevez la confirmation immédiatement.',
    bouton: 'Prendre rendez-vous',
    titreTelephone: 'Prenez rendez-vous cette semaine.',
  },
};

export type AccueilContent = typeof defaults;

export const ACCUEIL: PageDef<AccueilContent> = {
  slug: 'accueil',
  title: 'Accueil',
  route: '/',
  defaults,
  fields: [
    {
      key: 'hero',
      label: 'Haut de page',
      type: 'group',
      fields: [
        { key: 'kicker', label: 'Petit titre', type: 'text' },
        {
          key: 'titre',
          label: 'Titre',
          type: 'text',
          hint: 'Les mots arrivent un par un ; les trois derniers sont soulignés.',
        },
        { key: 'sousTitre', label: 'Sous-titre (ordinateur)', type: 'textarea' },
        { key: 'introTelephone', label: 'Sous-titre (téléphone)', type: 'textarea' },
        { key: 'boutonPrincipal', label: 'Texte du bouton orange', type: 'text' },
        { key: 'boutonSecondaire', label: 'Texte du bouton contour (ordinateur)', type: 'text' },
        { key: 'lienTelephone', label: 'Texte du lien (téléphone)', type: 'text' },
        {
          key: 'photo',
          label: 'Photo du haut de page (ordinateur)',
          type: 'image',
          hint: 'Format conseillé : carré, la doctoresse centrée.',
        },
        {
          key: 'photoTelephone',
          label: 'Photo du haut de page (téléphone)',
          type: 'image',
        },
        {
          key: 'photoAlt',
          label: 'Description des photos du haut de page (pour les malvoyants)',
          type: 'text',
        },
      ],
    },
    {
      key: 'carte',
      label: 'Carte « créneau, horaires, contact » (ordinateur)',
      type: 'group',
      fields: [
        {
          key: 'sansCreneau',
          label: 'Phrase quand aucun créneau n’est disponible',
          type: 'text',
          hint: 'Le prochain créneau libre s’affiche tout seul quand il y en a un.',
        },
        { key: 'note', label: 'Note à droite', type: 'text' },
        { key: 'bouton', label: 'Texte du bouton', type: 'text' },
      ],
    },
    {
      key: 'declaration',
      label: 'Notre façon de soigner (téléphone)',
      type: 'group',
      fields: [
        { key: 'kicker', label: 'Petit titre', type: 'text' },
        { key: 'texte', label: 'Phrase', type: 'textarea' },
        { key: 'boutonPrincipal', label: 'Texte du bouton orange', type: 'text' },
        { key: 'boutonSecondaire', label: 'Texte du bouton contour', type: 'text' },
      ],
    },
    {
      key: 'specialites',
      label: 'Spécialités',
      type: 'group',
      fields: [
        { key: 'kicker', label: 'Petit titre', type: 'text' },
        { key: 'titre', label: 'Titre', type: 'text' },
        { key: 'intro', label: 'Présentation (ordinateur)', type: 'textarea' },
        { key: 'introTelephone', label: 'Présentation (téléphone)', type: 'textarea' },
      ],
    },
    {
      key: 'doctoresse',
      label: 'La doctoresse',
      type: 'group',
      fields: [
        { key: 'kicker', label: 'Petit titre', type: 'text' },
        { key: 'titre', label: 'Titre (ordinateur)', type: 'text' },
        { key: 'texte', label: 'Présentation (ordinateur)', type: 'textarea' },
        { key: 'points', label: 'Points forts', type: 'strings', itemLabel: 'un point' },
        {
          key: 'stats',
          label: 'Chiffres',
          type: 'list',
          itemLabel: 'un chiffre',
          titleKey: 'big',
          fields: [
            { key: 'big', label: 'Chiffre ou mot en grand', type: 'text' },
            { key: 'small', label: 'Explication', type: 'text' },
          ],
        },
        {
          key: 'noteStats',
          label: 'Note sous les chiffres (ordinateur)',
          type: 'text',
          hint: 'Laissez vide pour ne rien afficher. Ne saisissez que des chiffres exacts.',
        },
        { key: 'lien', label: 'Texte du lien (ordinateur)', type: 'text' },
        { key: 'photo', label: 'Portrait (ordinateur et téléphone)', type: 'image' },
        {
          key: 'photoAlt',
          label: 'Description du portrait (pour les malvoyants)',
          type: 'text',
        },
        { key: 'titreTelephone', label: 'Titre (téléphone)', type: 'text' },
        { key: 'texteTelephone', label: 'Présentation (téléphone)', type: 'textarea' },
      ],
    },
    {
      key: 'parcours',
      label: 'Votre parcours',
      type: 'group',
      fields: [
        { key: 'kicker', label: 'Petit titre', type: 'text' },
        { key: 'titre', label: 'Titre', type: 'text' },
        {
          key: 'etapes',
          label: 'Étapes',
          type: 'list',
          itemLabel: 'une étape',
          titleKey: 'titre',
          fields: [
            { key: 'n', label: 'Numéro', type: 'text' },
            { key: 'titre', label: 'Titre', type: 'text' },
            { key: 'texte', label: 'Texte', type: 'textarea' },
          ],
        },
      ],
    },
    {
      key: 'premiere',
      label: 'Première consultation',
      type: 'group',
      fields: [
        { key: 'kicker', label: 'Petit titre', type: 'text' },
        { key: 'titre', label: 'Titre', type: 'text' },
        { key: 'texte', label: 'Présentation', type: 'textarea' },
        { key: 'points', label: 'Points', type: 'strings', itemLabel: 'un point' },
        { key: 'bouton', label: 'Texte du bouton', type: 'text' },
      ],
    },
    {
      key: 'conseils',
      label: 'Conseils',
      type: 'group',
      fields: [
        {
          key: 'titre',
          label: 'Titre (ordinateur)',
          type: 'text',
          hint: 'Les articles se gèrent dans « Conseils santé ».',
        },
        { key: 'titreTelephone', label: 'Titre (téléphone)', type: 'text' },
        { key: 'lien', label: 'Texte du lien', type: 'text' },
      ],
    },
    {
      key: 'avis',
      label: 'Avis des patients',
      type: 'group',
      fields: [
        { key: 'titre', label: 'Titre', type: 'text' },
        {
          key: 'items',
          label: 'Avis',
          type: 'list',
          itemLabel: 'un avis',
          titleKey: 'auteur',
          fields: [
            { key: 'texte', label: 'Avis', type: 'textarea' },
            { key: 'auteur', label: 'Prénom et quartier', type: 'text' },
          ],
        },
        {
          key: 'note',
          label: 'Note sous les avis (ordinateur)',
          type: 'textarea',
          hint: 'Laissez vide pour ne rien afficher. Ne publiez que de vrais avis, avec l’accord écrit des patients.',
        },
      ],
    },
    {
      key: 'trouver',
      label: 'Nous trouver',
      type: 'group',
      fields: [
        {
          key: 'titre',
          label: 'Titre',
          type: 'text',
          hint: 'L’adresse, le repère et les horaires viennent des Réglages du site.',
        },
      ],
    },
    {
      key: 'faq',
      label: 'Questions fréquentes',
      type: 'group',
      fields: [
        { key: 'kicker', label: 'Petit titre', type: 'text' },
        {
          key: 'titre',
          label: 'Titre',
          type: 'text',
          hint: 'Les questions se gèrent dans « FAQ ».',
        },
        { key: 'intro', label: 'Phrase sous le titre', type: 'textarea' },
      ],
    },
    {
      key: 'appel',
      label: 'Bandeau du bas de page',
      type: 'group',
      fields: [
        { key: 'titre', label: 'Titre (ordinateur)', type: 'text' },
        { key: 'texte', label: 'Texte (ordinateur)', type: 'textarea' },
        { key: 'bouton', label: 'Texte du bouton (ordinateur)', type: 'text' },
        { key: 'titreTelephone', label: 'Titre (téléphone)', type: 'text' },
      ],
    },
  ],
};
