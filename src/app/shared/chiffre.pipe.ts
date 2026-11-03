import { Pipe, PipeTransform } from '@angular/core';

/**
 * Typographie des chiffres saisis dans l'admin : « 5ans » devient « 5 ans » (espace insécable,
 * pour que le chiffre et son unité ne soient jamais séparés par un retour à la ligne).
 */
@Pipe({ name: 'chiffre' })
export class ChiffrePipe implements PipeTransform {
  transform(valeur: string | null | undefined): string {
    return (valeur ?? '').replace(/(\d)([A-Za-zÀ-ÿ])/g, '$1 $2');
  }
}
