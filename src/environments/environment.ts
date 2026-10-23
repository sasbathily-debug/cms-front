export const environment = {
  production: true,
  apiUrl: '/api',
  /** Adresse de l'assistant du cabinet (service Render « chatbot »). */
  chatbotUrl: 'https://chatbot-tc7h.onrender.com',
  /**
   * Identifiant de mesure Google Analytics 4 (« G-XXXXXXXXXX »). Vide : aucune mesure, aucun bandeau de cookies.
   * Rien n'est chargé chez Google avant que le visiteur accepte, et jamais sur l'admin ni l'espace patient.
   */
  analyticsId: '',
  /** Tant que le contenu n'est pas validé : montre les textes d'exemple si l'admin n'a rien publié. À passer à false au lancement. */
  sampleContent: true,
};
