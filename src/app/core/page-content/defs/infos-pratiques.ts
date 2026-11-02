import { PageDef } from '../fields';

/** Textes d'exemple : les passages entre crochets sont à confirmer par la doctoresse. */
const defaults = {
  hero: {
    kicker: 'INFOS PRATIQUES',
    titre: 'Venir au cabinet, nous joindre, régler sa consultation',
  },
  cartes: {
    adresseLabel: 'ADRESSE',
    telephoneLabel: 'TÉLÉPHONE ET WHATSAPP',
    telephoneNote: "Réponse pendant les horaires d'ouverture.",
    emailLabel: 'E-MAIL',
    emailNote: 'Pour une question hors urgence.',
  },
  horaires: {
    titre: "Horaires d'ouverture",
    bouton: 'Prendre rendez-vous',
  },
  tarifs: {
    titre: 'Tarifs et paiement',
    lignes: [
      { acte: 'Première consultation', prix: '20\u00a0000\u00a0FCFA' },
      { acte: 'Consultation nutritionnelle (30 min)', prix: '35\u00a0000\u00a0FCFA' },
      { acte: 'Accompagnement nutritionnel (1 mois)', prix: '90\u00a0000\u00a0FCFA' },
      { acte: 'Paiement', prix: 'Espèces, Wave, Orange Money' },
    ],
    note: '',
  },
  blocs: [
    {
      titre: 'Accès',
      texte:
        '[Repères pour trouver le cabinet : lieu connu, étage, entrée. Taxis ou bus à proximité.]',
    },
    {
      titre: 'Stationnement et accessibilité',
      texte: '[Parking ? Accès pour personnes à mobilité réduite ? Ascenseur ?]',
    },
    {
      titre: 'Assurances et mutuelles',
      texte: '[Liste des assurances et mutuelles acceptées, démarches de remboursement.]',
    },
  ],
  appel: {
    titre: 'Une question avant de venir ?',
    boutonSecondaire: 'Écrire sur WhatsApp',
  },
};

export type InfosPratiquesContent = typeof defaults;

export const INFOS_PRATIQUES: PageDef<InfosPratiquesContent> = {
  slug: 'infos-pratiques',
  title: 'Infos pratiques',
  route: '/infos-pratiques',
  defaults,
  fields: [
    {
      key: 'hero',
      label: 'En-tête de la page',
      type: 'group',
      fields: [
        { key: 'kicker', label: 'Petit titre', type: 'text' },
        { key: 'titre', label: 'Titre', type: 'text' },
      ],
    },
    {
      key: 'cartes',
      label: 'Les trois cartes sombres',
      type: 'group',
      fields: [
        {
          key: 'adresseLabel',
          label: 'Petit titre de la carte adresse',
          type: 'text',
          hint: 'L’adresse et le repère se saisissent dans les Réglages du site.',
        },
        { key: 'telephoneLabel', label: 'Petit titre de la carte téléphone', type: 'text' },
        { key: 'telephoneNote', label: 'Phrase sous le numéro', type: 'text' },
        { key: 'emailLabel', label: 'Petit titre de la carte e-mail', type: 'text' },
        { key: 'emailNote', label: 'Phrase sous l’adresse e-mail', type: 'text' },
      ],
    },
    {
      key: 'horaires',
      label: 'Encadré des horaires',
      type: 'group',
      fields: [
        {
          key: 'titre',
          label: 'Titre',
          type: 'text',
          hint: 'Les horaires eux-mêmes se saisissent dans les Réglages du site.',
        },
        { key: 'bouton', label: 'Texte du bouton', type: 'text' },
      ],
    },
    {
      key: 'tarifs',
      label: 'Tarifs et paiement',
      type: 'group',
      fields: [
        { key: 'titre', label: 'Titre', type: 'text' },
        {
          key: 'lignes',
          label: 'Lignes',
          type: 'list',
          itemLabel: 'une ligne',
          titleKey: 'acte',
          fields: [
            { key: 'acte', label: 'Intitulé', type: 'text' },
            { key: 'prix', label: 'Tarif', type: 'text' },
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
      key: 'blocs',
      label: 'Accès, stationnement, assurances',
      type: 'list',
      itemLabel: 'un bloc',
      titleKey: 'titre',
      fields: [
        { key: 'titre', label: 'Titre', type: 'text' },
        { key: 'texte', label: 'Texte', type: 'textarea' },
      ],
    },
    {
      key: 'appel',
      label: 'Bandeau du bas de page',
      type: 'group',
      fields: [
        { key: 'titre', label: 'Phrase', type: 'text' },
        { key: 'boutonSecondaire', label: 'Texte du bouton WhatsApp', type: 'text' },
      ],
    },
  ],
};
