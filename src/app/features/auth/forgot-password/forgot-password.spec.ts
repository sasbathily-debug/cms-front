import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router, provideRouter } from '@angular/router';
import { ForgotPassword } from './forgot-password';

describe('ForgotPassword', () => {
  let component: ForgotPassword;
  let fixture: ComponentFixture<ForgotPassword>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPassword],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPassword);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    await fixture.whenStable();
  });

  it("commence par demander l'adresse e-mail", () => {
    expect(component.step()).toBe('email');
  });

  it('refuse une adresse invalide sans appeler le serveur', () => {
    component.emailForm.controls.email.setValue('pas-un-email');
    component.sendCode();
    http.expectNone((req) => req.url.endsWith('/auth/forgot-password'));
    expect(component.errorMessage()).toBeTruthy();
    expect(component.step()).toBe('email');
  });

  it('passe à la saisie du code une fois la demande acceptée, sans dire si le compte existe', () => {
    component.emailForm.controls.email.setValue(' awa@example.com ');
    component.sendCode();
    const req = http.expectOne((r) => r.url.endsWith('/auth/forgot-password'));
    expect(req.request.body).toEqual({ email: 'awa@example.com' });
    req.flush(null, { status: 204, statusText: 'No Content' });

    expect(component.step()).toBe('code');
    expect(component.infoMessage()).toContain('Si un compte existe');
  });

  it("affiche le délai d'attente renvoyé par le serveur", () => {
    component.emailForm.controls.email.setValue('awa@example.com');
    component.sendCode();
    http
      .expectOne((r) => r.url.endsWith('/auth/forgot-password'))
      .flush(
        { message: 'Veuillez patienter avant de redemander un code.' },
        { status: 429, statusText: 'Too Many' },
      );
    expect(component.step()).toBe('email');
    expect(component.errorMessage()).toContain('patienter');
  });

  it('envoie code et nouveau mot de passe puis renvoie vers la connexion', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    component.emailForm.controls.email.setValue('awa@example.com');
    component.step.set('code');
    component.onCode('123456');
    component.resetForm.patchValue({
      password: 'NouveauMotDePasse1',
      confirmPassword: 'NouveauMotDePasse1',
    });
    component.submitReset();

    const req = http.expectOne((r) => r.url.endsWith('/auth/reset-password'));
    expect(req.request.body).toEqual({
      email: 'awa@example.com',
      otp: '123456',
      password: 'NouveauMotDePasse1',
    });
    req.flush(null, { status: 204, statusText: 'No Content' });
    expect(navigate).toHaveBeenCalledWith(['/login'], { queryParams: { reset: 1 } });
  });

  it('refuse deux mots de passe différents sans appeler le serveur', () => {
    component.step.set('code');
    component.onCode('123456');
    component.resetForm.patchValue({
      password: 'NouveauMotDePasse1',
      confirmPassword: 'Autre1234567',
    });
    component.submitReset();
    http.expectNone((r) => r.url.endsWith('/auth/reset-password'));
    expect(component.errorMessage()).toContain('pas identiques');
  });

  it('affiche le message du serveur quand le code est refusé', () => {
    component.emailForm.controls.email.setValue('awa@example.com');
    component.step.set('code');
    component.onCode('123456');
    component.resetForm.patchValue({
      password: 'NouveauMotDePasse1',
      confirmPassword: 'NouveauMotDePasse1',
    });
    component.submitReset();
    http
      .expectOne((r) => r.url.endsWith('/auth/reset-password'))
      .flush({ message: 'Code invalide ou expiré' }, { status: 400, statusText: 'Bad Request' });
    expect(component.errorMessage()).toBe('Code invalide ou expiré');
    expect(component.loading()).toBe(false);
  });
});
