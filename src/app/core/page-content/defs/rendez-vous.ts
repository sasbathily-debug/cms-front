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
    { n: '2', titre: 'Vérifiez', texte: 'vos coordonnées, déjà remplies depuis votre compte.' },
    {
      n: '3',
      titre: 'Confirmez',
      texte: 'et recevez votre confirmation. Un rappel vous est envoyé avant le rendez-vous.',
    },
  ],
  aide: { titre: 'Vous préférez nous écrire ou appeler ?' },
  connexion: {
    titre: 'Connectez-vous pour réserver',
    texte:
      "Un compte nous permet de suivre votre demande, de vous prévenir par e-mail à chaque étape et de retrouver l'historique de vos rendez-vous. Il se crée en une minute.",
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
      key: 'connexion',
      label: 'Visiteur non connecté',
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
