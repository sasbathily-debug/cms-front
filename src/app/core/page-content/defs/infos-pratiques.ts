import { PageDef } from '../fields';

/** Textes d'exemple : les passages entre crochets sont à confirmer par la doctoresse. */
const defaults = {
  hero: {
    kicker: 'INFOS PRATIQUES',
    titre: "Tout ce qu'il faut savoir avant de pousser la porte.",
    intro: 'On vous attend. Voici comment venir, quand venir, et ce que coûte une consultation.',
  },
  acces: {
    titre: 'Où nous trouver',
    bouton: 'Itinéraire',
  },
  horaires: {
    titre: 'Quand venir',
    bouton: 'Prendre rendez-vous',
  },
  tarifs: {
    titre: 'Ce que coûte une consultation',
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
    titre: 'Vous hésitez encore\u00a0? Écrivez-nous.',
    texte: "Nous répondons pendant les horaires d'ouverture.",
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
        { key: 'intro', label: 'Phrase sous le titre', type: 'textarea' },
      ],
    },
    {
      key: 'acces',
      label: 'Plan et adresse',
      type: 'group',
      fields: [
        {
          key: 'titre',
          label: 'Titre',
          type: 'text',
          hint: 'L’adresse et le repère se saisissent dans les Réglages du site.',
        },
        { key: 'bouton', label: 'Texte du bouton d’itinéraire', type: 'text' },
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
        { key: 'texte', label: 'Phrase sous le titre', type: 'text' },
        { key: 'boutonSecondaire', label: 'Texte du bouton WhatsApp', type: 'text' },
      ],
    },
  ],
};
