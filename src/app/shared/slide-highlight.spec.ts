import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SlideHighlight } from './slide-highlight';

@Component({
  imports: [SlideHighlight],
  template: `
    <div appSlideHighlight id="liste">
      <span data-hl></span>
      <a href="#a" id="a">A</a>
      <a href="#b" id="b">B</a>
    </div>
  `,
})
class Hote {}

describe('SlideHighlight', () => {
  it('montre le fond sous la ligne survolée puis le cache à la sortie', () => {
    const fixture = TestBed.createComponent(Hote);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const fond = root.querySelector<HTMLElement>('[data-hl]')!;

    root.querySelector('#b')!.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    expect(fond.style.opacity).toBe('1');
    expect(fond.style.transform).toContain('translate(');

    root.querySelector('#liste')!.dispatchEvent(new MouseEvent('mouseleave'));
    expect(fond.style.opacity).toBe('0');
  });
});
