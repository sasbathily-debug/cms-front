import { PageDef } from '../fields';

const defaults = {
  hero: {
    kicker: 'PRENDRE RENDEZ-VOUS',
    titre: 'Réservez en trois minutes.',
    intro:
      'Choisissez un créneau libre, vérifiez vos coordonnées et confirmez. Pour modifier ou annuler un rendez-vous, contactez le cabinet.',
  },
  etapes: [
    {
      n: '1',
      titre: 'Choisissez',
      texte: 'un motif, un jour et une heure parmi les créneaux libres.',
    },
    { n: '2', titre: 'Laissez', texte: 'votre nom et votre téléphone. Pas besoin de compte.' },
    {
      n: '3',
      titre: 'Confirmez',
      texte: 'et recevez votre confirmation. Avec une adresse e-mail, un rappel vous est envoyé la veille.',
    },
  ],
  aide: { titre: 'Vous préférez nous écrire ou appeler ?' },
  sansCompte: {
    titre: 'Pas besoin de compte',
    texte:
      "Laissez votre nom et votre téléphone. Avec une adresse e-mail, vous recevez la confirmation et le rappel de la veille, et un code vérifie que l'adresse est bien la vôtre. Un compte reste possible après le rendez-vous, pour retrouver votre historique.",
  },
  formulaire: {
    titre: 'Votre rendez-vous',
    bouton: 'Confirmer le rendez-vous',
    note: 'Vos données servent uniquement à gérer votre rendez-vous.',
  },
  confirmation: {
    titre: 'Rendez-vous confirmé',
    texte:
      "Votre créneau est réservé. Vous recevrez un rappel avant le rendez-vous et vous retrouverez l'historique dans votre espace patient.",
  },
};

export type RendezVousContent = typeof defaults;

export const RENDEZ_VOUS: PageDef<RendezVousContent> = {
  slug: 'rendez-vous',
  editable: false,
  title: 'Prise de rendez-vous',
  route: '/rendez-vous',
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
      ],
    },
    {
      key: 'etapes',
      label: 'Les étapes',
      type: 'list',
      itemLabel: 'une étape',
      titleKey: 'titre',
      fields: [
        { key: 'n', label: 'Numéro', type: 'text' },
        { key: 'titre', label: 'Mot en gras', type: 'text' },
        { key: 'texte', label: 'Suite de la phrase', type: 'text' },
      ],
    },
    {
      key: 'aide',
      label: 'Encadré « écrire ou appeler »',
      type: 'group',
      fields: [
        {
          key: 'titre',
          label: 'Titre',
          type: 'text',
          hint: 'Le numéro et les horaires s’affichent dessous, depuis les Réglages du site.',
        },
      ],
    },
    {
      key: 'sansCompte',
      label: 'Encadré « pas besoin de compte »',
      type: 'group',
      fields: [
        { key: 'titre', label: 'Titre', type: 'text' },
        { key: 'texte', label: 'Texte', type: 'textarea' },
      ],
    },
    {
      key: 'formulaire',
      label: 'Formulaire',
      type: 'group',
      fields: [
        { key: 'titre', label: 'Titre', type: 'text' },
        { key: 'bouton', label: 'Texte du bouton', type: 'text' },
        { key: 'note', label: 'Note sous le bouton', type: 'text' },
      ],
    },
    {
      key: 'confirmation',
      label: 'Après la réservation',
      type: 'group',
      fields: [
        { key: 'titre', label: 'Titre', type: 'text' },
        { key: 'texte', label: 'Texte', type: 'textarea' },
      ],
    },
  ],
};
