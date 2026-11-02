import { PageDef } from '../fields';

/** Textes d'exemple : les passages entre crochets sont à compléter avec la doctoresse. */
const defaults = {
  hero: {
    titre: 'Un cabinet calme, pensé pour prendre le temps.',
    intro:
      "Endocrinologie et nutrition à la Cité Keur Gorgui, Dakar. Ici, chaque consultation commence par l'écoute, dans un lieu simple et accueillant.",
    photoCabinet: '',
    photoAccueil: '',
    photoSalle: '',
  },
  enBref: {
    kicker: 'LE CABINET EN BREF',
    note: '',
    items: [
      {
        label: 'LA SPÉCIALITÉ',
        texte:
          'Endocrinologie, diabétologie et nutrition : diabète, thyroïde, poids, troubles hormonaux, cholestérol.',
      },
      { label: 'LE LIEU', texte: 'Cité Keur Gorgui, Dakar. [Étage, repère et accès à préciser]' },
      {
        label: "L'ACCUEIL",
        texte: "Sur rendez-vous, pour prendre le temps d'écouter. [À valider par la doctoresse]",
      },
    ],
    pied: "Adresse, plan d'accès et horaires dans les infos pratiques.",
    bouton: 'Voir les infos pratiques',
  },
  parcours: {
    titre: 'Votre parcours au cabinet',
    items: [
      {
        n: '1',
        titre: 'Accueil',
        texte: 'Vous êtes accueilli, vos informations sont vérifiées et votre dossier est prêt.',
      },
      {
        n: '2',
        titre: 'Consultation',
        texte: 'La doctoresse écoute votre histoire, examine et explique, sans se presser.',
      },
      {
        n: '3',
        titre: 'Examens',
        texte: 'Prise de sang, échographie ou mesures selon votre situation. [À préciser]',
      },
      {
        n: '4',
        titre: 'Plan de suivi',
        texte: 'Un plan clair, des rendez-vous planifiés et vos documents dans Mon espace.',
      },
    ],
  },
  lieux: {
    titre: 'Ce que vous trouverez sur place',
    items: [
      {
        sym: 'Sa',
        titre: "Salle d'attente",
        texte: '[Description : confort, climatisation, lecture… à compléter]',
      },
      {
        sym: 'Me',
        titre: 'Mesures sur place',
        texte: 'Poids, taille, tension. [Matériel exact à préciser]',
      },
      { sym: 'Éc', titre: 'Échographie', texte: '[À confirmer : réalisée au cabinet ou non]' },
      {
        sym: 'Es',
        titre: 'Mon espace',
        texte:
          'Vos rendez-vous et vos documents, accessibles en ligne après création de votre compte.',
      },
      {
        sym: 'Ac',
        titre: 'Accessibilité',
        texte: '[Parking, accès pour personnes à mobilité réduite, ascenseur : à préciser]',
      },
      { sym: 'Hy', titre: 'Hygiène', texte: "[Engagements d'hygiène du cabinet : à compléter]" },
    ],
  },
  equipe: {
    titre: "L'équipe qui vous accueille",
    items: [
      {
        photo: '/img/dr-fall.webp',
        nom: 'Dr Aïssatou Mamadou Fall',
        role: 'Médecin endocrinologue et nutritionniste',
        texte:
          'Voir sa présentation et son parcours dans la page À propos. [Orthographe du prénom à confirmer]',
      },
      {
        photo: '',
        nom: '[Nom]',
        role: '[Secrétaire médicale]',
        texte: "[Rôle et mots d'accueil à compléter]",
      },
      {
        photo: '',
        nom: '[Nom]',
        role: '[Diététicienne, infirmière… si applicable]',
        texte: '[À compléter, ou supprimer cette carte]',
      },
    ],
  },
  appel: { titre: 'Venez découvrir le cabinet.' },
};

export type LeCabinetContent = typeof defaults;

export const LE_CABINET: PageDef<LeCabinetContent> = {
  slug: 'le-cabinet',
  title: 'Le cabinet',
  route: '/le-cabinet',
  defaults,
  fields: [
    {
      key: 'hero',
      label: 'En-tête de la page',
      type: 'group',
      fields: [
        { key: 'titre', label: 'Titre', type: 'text' },
        { key: 'intro', label: 'Présentation', type: 'textarea' },
        {
          key: 'photoCabinet',
          label: 'Photo du cabinet de consultation',
          type: 'image',
          hint: 'Sans photo, un cadre « photo à fournir » s’affiche.',
        },
        { key: 'photoAccueil', label: 'Photo de l’accueil', type: 'image' },
        { key: 'photoSalle', label: 'Photo de la salle d’attente', type: 'image' },
      ],
    },
    {
      key: 'enBref',
      label: 'Le cabinet en bref',
      type: 'group',
      fields: [
        { key: 'kicker', label: 'Titre de l’encadré', type: 'text' },
        {
          key: 'note',
          label: 'Note à droite du titre',
          type: 'text',
          hint: 'Laissez vide pour ne rien afficher.',
        },
        {
          key: 'items',
          label: 'Les trois points',
          type: 'list',
          itemLabel: 'un point',
          titleKey: 'label',
          fields: [
            { key: 'label', label: 'Petit titre (en majuscules)', type: 'text' },
            { key: 'texte', label: 'Texte', type: 'textarea' },
          ],
        },
        { key: 'pied', label: 'Phrase du bas', type: 'text' },
        { key: 'bouton', label: 'Texte du bouton', type: 'text' },
      ],
    },
    {
      key: 'parcours',
      label: 'Votre parcours au cabinet',
      type: 'group',
      fields: [
        { key: 'titre', label: 'Titre', type: 'text' },
        {
          key: 'items',
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
      key: 'lieux',
      label: 'Ce que vous trouverez sur place',
      type: 'group',
      fields: [
        { key: 'titre', label: 'Titre', type: 'text' },
        {
          key: 'items',
          label: 'Cartes',
          type: 'list',
          itemLabel: 'une carte',
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
      key: 'equipe',
      label: "L'équipe",
      type: 'group',
      fields: [
        { key: 'titre', label: 'Titre', type: 'text' },
        {
          key: 'items',
          label: 'Membres de l’équipe',
          type: 'list',
          itemLabel: 'un membre',
          titleKey: 'nom',
          fields: [
            {
              key: 'photo',
              label: 'Photo',
              type: 'image',
              hint: 'Sans photo, un cadre « photo à fournir » s’affiche.',
            },
            { key: 'nom', label: 'Nom', type: 'text' },
            { key: 'role', label: 'Fonction', type: 'text' },
            { key: 'texte', label: 'Texte', type: 'textarea' },
          ],
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
