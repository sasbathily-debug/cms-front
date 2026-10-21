export interface FaqEntry {
  question: string;
  answer: string;
}

export interface FaqGroup {
  id: string;
  title: string;
  items: FaqEntry[];
}

/** Texte d'exemple : les réponses entre crochets sont à compléter ou à valider par la doctoresse. */
export const FAQ_GROUPS: FaqGroup[] = [
  {
    id: 'rdv',
    title: 'Rendez-vous et compte',
    items: [
      {
        question: 'Comment prendre rendez-vous ?',
        answer:
          "En ligne : créez votre compte, confirmez le code de vérification que vous recevez, puis choisissez votre créneau. Vous pouvez aussi appeler le cabinet pendant les horaires d'ouverture.",
      },
      {
        question: 'Dois-je créer un compte pour réserver ?',
        answer:
          'Oui, la réservation en ligne passe par un compte. Il se crée en une minute et vous permet de retrouver vos rendez-vous et vos documents.',
      },
      {
        question: 'Comment annuler ou déplacer un rendez-vous ?',
        answer:
          '[À confirmer par la doctoresse : délai de prévenance et façon de procéder, depuis votre espace ou par téléphone.]',
      },
      {
        question: "J'ai oublié mon mot de passe, que faire ?",
        answer:
          "[Fonction « mot de passe oublié » à créer sur le site.] En attendant, appelez le cabinet : nous vous aidons à retrouver l'accès à votre compte.",
      },
    ],
  },
  {
    id: 'consult',
    title: 'La consultation',
    items: [
      {
        question: 'Que dois-je apporter à la première consultation ?',
        answer:
          'Vos analyses récentes, vos ordonnances, la liste de vos médicaments et vos anciens résultats. Une page détaille tout cela pour préparer votre visite.',
      },
      {
        question: 'Combien de temps dure une consultation ?',
        answer: '[À préciser par la doctoresse : durée de la première consultation et des suivis.]',
      },
      { question: 'Puis-je venir accompagné ?', answer: '[À confirmer par la doctoresse.]' },
      {
        question: 'Faut-il être à jeun ?',
        answer:
          '[À confirmer : cela dépend des analyses demandées. Le cabinet vous le précisera à la prise de rendez-vous.]',
      },
    ],
  },
  {
    id: 'tarifs',
    title: 'Tarifs et paiement',
    items: [
      {
        question: "Quel est le prix d'une consultation ?",
        answer: '[Tarif de la première consultation et du suivi, à indiquer par la doctoresse.]',
      },
      {
        question: 'Quels moyens de paiement acceptez-vous ?',
        answer: '[Espèces, Wave, Orange Money… à préciser.]',
      },
      {
        question: 'Travaillez-vous avec des assurances ou des mutuelles ?',
        answer:
          '[Liste des assurances et mutuelles acceptées, démarches de remboursement : à compléter.]',
      },
    ],
  },
  {
    id: 'maladies',
    title: 'Vos questions de santé',
    items: [
      {
        question: 'Le diabète de type 2 peut-il se contrôler ?',
        answer:
          "Oui, avec un traitement adapté, une alimentation équilibrée et de l'activité physique, la glycémie peut être bien stabilisée. Chaque situation est différente : un suivi régulier permet d'ajuster. [Réponse à valider]",
      },
      {
        question: 'Un nodule à la thyroïde est-il un cancer ?',
        answer:
          'Non, dans la grande majorité des cas, les nodules sont bénins. Un bilan avec échographie permet de savoir lesquels doivent être surveillés. [Réponse à valider]',
      },
      {
        question: 'Faut-il suivre un régime strict pour perdre du poids ?',
        answer:
          "Non. Nous construisons un plan réaliste, adapté à votre vie, plutôt qu'un régime strict qu'on abandonne. [Réponse à valider]",
      },
    ],
  },
  {
    id: 'donnees',
    title: 'Vos données et votre confidentialité',
    items: [
      {
        question: 'Mes informations de santé sont-elles protégées ?',
        answer:
          "Vos données sont confidentielles et ne servent qu'à votre suivi. [Texte exact à valider par la doctoresse]",
      },
      {
        question: "Que devient le message que j'envoie par le formulaire de contact ?",
        answer: 'Il sert uniquement à répondre à votre demande. [Durée de conservation à préciser]',
      },
    ],
  },
];
