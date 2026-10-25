/**
 * Texte provisoire de la politique de confidentialité, établi d'après ce que le site fait réellement
 * (comptes, rendez-vous, documents, formulaire de contact, assistant, cookies, prestataires).
 * Les passages entre crochets sont à confirmer par la doctoresse ; le texte entier est à faire relire,
 * idéalement par un juriste qui connaît la loi sénégalaise sur les données personnelles.
 */
export interface PolitiqueSection {
  id: string;
  titre: string;
  intro?: string[];
  /** Lignes « nom : explication », présentées en tableau. */
  lignes?: { nom: string; texte: string }[];
  points?: string[];
  fin?: string[];
}

export const POLITIQUE_MISE_A_JOUR = '25 octobre 2026';

export const POLITIQUE_TITRE = 'Politique de confidentialité';

export const POLITIQUE_LEAD =
  'Ce que nous faisons de vos informations, en clair : ce que nous recueillons, pourquoi, qui les reçoit, combien de temps nous les gardons et comment faire valoir vos droits.';

export const POLITIQUE_EN_BREF: string[] = [
  'Nous recueillons le minimum nécessaire pour vous recevoir : vos coordonnées, vos rendez-vous et, si vous le choisissez, vos documents.',
  "Vos informations de santé ne servent qu'à votre suivi. Elles ne sont ni vendues, ni utilisées pour de la publicité.",
  "La mesure d'audience Google Analytics n'est activée qu'avec votre accord, et sans aucune donnée de santé.",
  'Vous pouvez demander à voir, corriger ou supprimer vos données en écrivant au cabinet.',
];

export const POLITIQUE: PolitiqueSection[] = [
  {
    id: 'responsable',
    titre: 'Qui est responsable de vos données',
    intro: [
      'Le responsable du traitement est le cabinet du Dr Aïssatou Mamadou Fall, médecin endocrinologue, diabétologue et nutritionniste, à Sacré-Cœur 3, Dakar (Sénégal). [Forme juridique, adresse complète et numéro d’inscription à l’Ordre : à confirmer par la doctoresse.]',
      'Vos informations de santé restent couvertes par le secret médical.',
    ],
  },
  {
    id: 'donnees',
    titre: 'Les données que nous recueillons, et pourquoi',
    intro: ["Nous ne demandons que ce qui sert à l'usage décrit."],
    lignes: [
      {
        nom: 'Prendre un rendez-vous',
        texte:
          'Votre nom, votre téléphone, votre e-mail (facultatif), le motif, la date souhaitée et un message éventuel. Ils servent à fixer et confirmer le rendez-vous, puis à vous le rappeler.',
      },
      {
        nom: 'Créer un compte (Mon espace)',
        texte:
          'Votre nom, votre prénom, votre e-mail, et selon ce que vous renseignez votre téléphone, votre date de naissance et vos préférences de rappel. Ils servent à retrouver vos rendez-vous et vos documents. Votre mot de passe est enregistré sous une forme chiffrée que personne ne peut relire.',
      },
      {
        nom: 'Déposer des documents',
        texte:
          "Les fichiers que vous choisissez d'ajouter (par exemple des résultats d'analyses ou une ordonnance) et leur catégorie. Ce sont des données de santé : elles permettent à la doctoresse de les consulter avant et pendant la consultation. Vous pouvez les supprimer vous-même depuis Mon espace.",
      },
      {
        nom: 'Recevoir des rappels',
        texte:
          'Votre e-mail sert à vous rappeler un rendez-vous et à vous envoyer les codes de vérification. Vous pouvez désactiver les rappels dans votre profil.',
      },
      {
        nom: 'Écrire au cabinet (formulaire de contact)',
        texte:
          "Votre nom, votre téléphone, votre e-mail, le motif et votre message. Ils sont transmis par e-mail à la doctoresse pour vous répondre ; le site ne les enregistre pas dans sa base de données. Pour une urgence médicale, n'écrivez pas : appelez.",
      },
      {
        nom: "Poser une question à l'assistant",
        texte:
          "Votre question (500 caractères au plus) est analysée pour trouver une réponse ; le site ne l'enregistre pas. Une adresse IP est gardée quelques instants en mémoire pour limiter les abus. L'assistant donne des informations pratiques, pas des conseils médicaux : n'y écrivez pas d'informations de santé.",
      },
      {
        nom: 'Sécurité et fonctionnement',
        texte:
          "L'adresse IP et des informations techniques de connexion (navigateur, date et heure) sont conservées dans les journaux de nos hébergeurs pour assurer la sécurité du service.",
      },
    ],
  },
  {
    id: 'sante',
    titre: 'Vos informations de santé',
    intro: [
      "Ce sont des données sensibles. Elles ne sont accessibles qu'à vous et au cabinet. Elles ne sont ni vendues, ni utilisées pour de la publicité, ni envoyées à Google Analytics.",
      'Nous les traitons parce que vous nous les confiez pour être soigné et, pour vos documents et vos rappels, avec votre accord.',
      '[Formalités auprès de la Commission de Protection des Données Personnelles (CDP) du Sénégal, loi n° 2008-12 du 25 janvier 2008 : déclaration ou autorisation et numéro à confirmer.]',
    ],
  },
  {
    id: 'cookies',
    titre: 'Cookies et stockage dans votre navigateur',
    intro: [
      'Un cookie est un petit fichier enregistré sur votre appareil. Certains sont indispensables au site, d’autres demandent votre accord.',
    ],
    lignes: [
      {
        nom: 'Connexion (access_token, refresh_token)',
        texte:
          'Ils vous gardent connecté à Mon espace : 15 minutes pour l’un, 7 jours au plus pour l’autre. Indispensables, ils ne sont posés que si vous vous connectez.',
      },
      {
        nom: 'Sécurité (XSRF-TOKEN)',
        texte: 'Protège vos formulaires contre les envois frauduleux. Indispensable.',
      },
      {
        nom: 'Vos choix (analytics-consent, theme)',
        texte:
          'Ils retiennent votre réponse sur les cookies, votre préférence clair ou sombre et l’avancement de votre liste de préparation à la consultation. Ces informations restent dans votre navigateur.',
      },
      {
        nom: 'Rapidité (copie des textes, application installée)',
        texte:
          'Le site garde une copie de ses pages pour s’afficher plus vite et, si vous l’installez comme une application, pour s’ouvrir plus légèrement. Aucune donnée personnelle ni de santé n’y est conservée.',
      },
      {
        nom: 'Mesure d’audience Google Analytics (_ga, _ga_*) — avec votre accord',
        texte:
          'Ils ne sont posés que si vous cliquez sur « Oui, j’accepte ». Ils servent à compter les visites et les pages vues pour améliorer le site. Nous n’envoyons à Google ni vos coordonnées ni aucune information de santé : seulement l’adresse des pages publiques vues et deux actions (un rendez-vous réservé, un message envoyé), sans détail. Rien n’est mesuré dans votre espace ni dans l’espace professionnel. Google reçoit toutefois l’adresse IP de votre appareil pour répondre. Durée des cookies : [à confirmer, jusqu’à 2 ans] ; durée de conservation des statistiques : [2 mois, réglage du compte à confirmer].',
      },
    ],
    fin: [
      'Si vous refusez, rien n’est chargé chez Google. Vous pouvez changer d’avis à tout moment avec « Gérer les cookies », en bas de chaque page.',
    ],
  },
  {
    id: 'destinataires',
    titre: 'Qui reçoit vos données',
    intro: [
      'Nous faisons appel à des prestataires techniques qui n’agissent que pour notre compte :',
    ],
    lignes: [
      { nom: 'Vercel', texte: 'Affiche le site (hébergement des pages). [Lieu à préciser]' },
      {
        nom: 'Render',
        texte: 'Fait tourner le serveur du site et celui de l’assistant. [Région à confirmer]',
      },
      {
        nom: 'Neon',
        texte: 'Héberge la base de données (comptes, rendez-vous). [Région à confirmer]',
      },
      { nom: 'Cloudinary', texte: 'Stocke les documents et les images déposés.' },
      {
        nom: 'Brevo',
        texte:
          'Envoie les e-mails : codes de vérification, confirmations, rappels, messages de contact.',
      },
      { nom: 'Google', texte: 'Mesure d’audience, seulement si vous l’acceptez.' },
    ],
    fin: [
      'Certains de ces prestataires sont situés hors du Sénégal, notamment en Europe et aux États-Unis : vos données peuvent donc être traitées à l’étranger. [Régions retenues et garanties : à confirmer avec la doctoresse.]',
      'Nous ne vendons ni ne louons vos données. [Prestataire qui assure la maintenance du site : accès aux données et engagement de confidentialité à préciser.]',
    ],
  },
  {
    id: 'duree',
    titre: 'Combien de temps nous les gardons',
    lignes: [
      {
        nom: 'Compte et profil',
        texte:
          'Tant que votre compte existe, puis jusqu’à [durée à fixer] après sa suppression à votre demande.',
      },
      {
        nom: 'Rendez-vous et historique',
        texte:
          '[Durée à fixer avec la doctoresse, en tenant compte de la durée de conservation des dossiers médicaux.]',
      },
      {
        nom: 'Documents',
        texte:
          'Jusqu’à ce que vous les supprimiez ou que vous demandiez la suppression de votre compte.',
      },
      {
        nom: 'Messages de contact',
        texte: 'Dans la boîte e-mail du cabinet, le temps de vous répondre, puis [durée à fixer].',
      },
      {
        nom: 'Codes de vérification',
        texte: 'Quelques minutes, puis ils sont effacés automatiquement.',
      },
      {
        nom: 'Mesure d’audience',
        texte: '[2 mois, réglage du compte Google Analytics à confirmer.]',
      },
    ],
  },
  {
    id: 'droits',
    titre: 'Vos droits',
    intro: ['Vous avez le droit :'],
    points: [
      'de savoir quelles données nous avons sur vous et d’en obtenir une copie ;',
      'de corriger une information inexacte (la plupart se modifient vous-même dans votre profil) ;',
      'de demander la suppression de vos données ou de votre compte (vous pouvez déjà supprimer vous-même vos documents) ;',
      'de vous opposer à un usage, par exemple aux rappels, que vous pouvez désactiver dans votre profil ;',
      'de retirer à tout moment votre accord à la mesure d’audience, avec « Gérer les cookies ».',
    ],
    fin: [
      'Pour exercer un droit, écrivez-nous (coordonnées en bas de cette page). Nous répondons dans [délai à fixer, par exemple un mois]. Nous pouvons vous demander une preuve d’identité pour protéger vos informations.',
      'Si vous estimez que vos droits ne sont pas respectés, vous pouvez saisir la Commission de Protection des Données Personnelles (CDP) du Sénégal.',
    ],
  },
  {
    id: 'securite',
    titre: 'Comment nous protégeons vos données',
    points: [
      'La connexion au site est chiffrée (HTTPS).',
      'Les mots de passe sont enregistrés sous une forme chiffrée irréversible.',
      'Les cookies de connexion sont inaccessibles aux scripts et ne circulent qu’en connexion chiffrée.',
      'L’espace professionnel est réservé à la doctoresse et protégé par un identifiant personnel.',
      'Les essais de codes de vérification et les envois de messages sont limités pour éviter les abus.',
    ],
    fin: [
      'Aucun système n’est infaillible : si vos données étaient atteintes, nous vous en informerions. [Procédure à confirmer.]',
    ],
  },
  {
    id: 'modifications',
    titre: 'Mises à jour de ce texte',
    intro: [
      'Nous pouvons modifier cette politique, par exemple si le site évolue. La date de dernière mise à jour figure en haut de la page.',
    ],
  },
];
