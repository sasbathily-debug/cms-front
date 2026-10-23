import { PageDef } from '../fields';

/** Textes d'exemple : les passages entre crochets sont à compléter avec la doctoresse. */
const defaults = {
  hero: {
    titre: 'Une question ? Appelez ou écrivez-nous.',
    intro:
      "Nous répondons pendant les horaires d'ouverture. Pour un rendez-vous, la réservation en ligne est le moyen le plus rapide.",
    bouton: 'Prendre rendez-vous en ligne',
  },
  carteAppel: {
    label: 'APPELER LE CABINET',
    note: "Hors des horaires d'ouverture, laissez un message : nous vous rappelons.",
    boutonWhatsapp: 'Écrire sur WhatsApp',
    photo: '/img/dr-fall-sourire-640.webp',
  },
  formulaire: {
    titre: 'Envoyer un message',
    delai: 'Réponse sous [délai à préciser par la doctoresse].',
    confirmationTitre: 'Message envoyé',
    confirmationTexte:
      'Le cabinet a bien reçu votre message et vous répondra par téléphone ou par e-mail. Pour une urgence, appelez directement.',
  },
  avant: {
    titre: 'Avant de nous écrire',
    cartes: [
      {
        titre: 'Prendre rendez-vous',
        texte:
          'Créez votre compte en une minute et choisissez votre créneau. La confirmation est immédiate.',
        lien: 'Réserver en ligne',
      },
      {
        titre: 'Tarifs et paiement',
        texte:
          "Le prix d'une consultation, les moyens de paiement et les assurances acceptées. [À confirmer par la doctoresse]",
        lien: 'Voir les infos pratiques',
      },
      {
        titre: 'Première consultation',
        texte: "Ce qu'il faut apporter et comment elle se déroule, pour venir l'esprit tranquille.",
        lien: 'Préparer ma visite',
      },
    ],
  },
};

export type ContactContent = typeof defaults;

export const CONTACT: PageDef<ContactContent> = {
  slug: 'contact',
  title: 'Contact',
  route: '/contact',
  defaults,
  fields: [
    {
      key: 'hero',
      label: 'En-tête de la page',
      type: 'group',
      fields: [
        { key: 'titre', label: 'Titre', type: 'text' },
        { key: 'intro', label: 'Présentation', type: 'textarea' },
        { key: 'bouton', label: 'Texte du bouton', type: 'text' },
      ],
    },
    {
      key: 'carteAppel',
      label: 'Carte « Appeler le cabinet »',
      type: 'group',
      fields: [
        {
          key: 'label',
          label: 'Petit titre',
          type: 'text',
          hint: 'Le numéro de téléphone se saisit dans les Réglages du site.',
        },
        { key: 'note', label: 'Phrase sous le numéro', type: 'textarea' },
        { key: 'boutonWhatsapp', label: 'Texte du bouton WhatsApp', type: 'text' },
        { key: 'photo', label: 'Petite photo ronde', type: 'image' },
      ],
    },
    {
      key: 'formulaire',
      label: 'Formulaire de message',
      type: 'group',
      fields: [
        { key: 'titre', label: 'Titre du formulaire', type: 'text' },
        {
          key: 'delai',
          label: 'Délai de réponse affiché à côté du bouton',
          type: 'text',
          hint: 'Laissez vide pour ne rien afficher.',
        },
        { key: 'confirmationTitre', label: 'Titre après l’envoi', type: 'text' },
        { key: 'confirmationTexte', label: 'Texte après l’envoi', type: 'textarea' },
      ],
    },
    {
      key: 'avant',
      label: 'Avant de nous écrire',
      type: 'group',
      fields: [
        { key: 'titre', label: 'Titre', type: 'text' },
        {
          key: 'cartes',
          label: 'Trois cartes (leurs liens restent les mêmes)',
          type: 'list',
          itemLabel: 'une carte',
          titleKey: 'titre',
          fields: [
            { key: 'titre', label: 'Titre', type: 'text' },
            { key: 'texte', label: 'Texte', type: 'textarea' },
            { key: 'lien', label: 'Texte du lien', type: 'text' },
          ],
        },
      ],
    },
  ],
};
