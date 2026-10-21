import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublicPage } from '../../../shared/public-page/public-page';
import { CtaBand } from '../../../shared/cta-band/cta-band';

@Component({
  selector: 'app-premiere-consultation',
  imports: [RouterLink, PublicPage, CtaBand],
  styleUrl: './premiere-consultation.css',
  templateUrl: './premiere-consultation.html',
})
export class PremiereConsultation {
  readonly etapes = [
    {
      n: '01',
      moment: 'AVANT',
      titre: 'Vous réservez en ligne',
      texte:
        'Choisissez un jour et une heure, laissez vos coordonnées. Confirmation par e-mail et rappel la veille.',
    },
    {
      n: '02',
      moment: "À L'ARRIVÉE",
      titre: 'Un accueil sans attente inutile',
      texte:
        "Présentez-vous quelques minutes avant l'heure. Nous ouvrons votre dossier et vous demandons vos antécédents.",
    },
    {
      n: '03',
      moment: 'PENDANT',
      titre: 'Une vraie conversation',
      texte:
        "La doctoresse vous écoute, vous examine, mesure poids, tension et glycémie si besoin, puis vous explique ce qu'elle constate.",
    },
    {
      n: '04',
      moment: 'APRÈS',
      titre: 'Un plan clair, par écrit',
      texte:
        'Vous repartez avec une ordonnance, la liste des examens à faire et la date du prochain rendez-vous.',
    },
  ];

  readonly apporter = [
    "Une pièce d'identité",
    'Vos analyses et comptes rendus récents',
    'Vos ordonnances en cours ou la liste de vos médicaments',
    'Votre carnet de glycémie, si vous en avez un',
    'Vos radiographies ou échographies, si vous en avez',
    "Vos questions, notées à l'avance",
  ];
}
