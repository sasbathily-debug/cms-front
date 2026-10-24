import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { Subject } from 'rxjs';
import { FORCE_UPDATE_LEVEL, PwaUpdate } from './pwa-update';

describe('PwaUpdate', () => {
  const versionUpdates = new Subject<{ type: string }>();
  const unrecoverable = new Subject<unknown>();
  const sw = {
    isEnabled: true,
    versionUpdates,
    unrecoverable,
    checkForUpdate: vi.fn(() => Promise.resolve(false)),
    activateUpdate: vi.fn(() => Promise.resolve(true)),
  };
  let applyThen: { mock: unknown };
  let hardReload: { mock: unknown };

  function setup(forceLevel: number | null = null) {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        forceLevel === null
          ? Promise.resolve({ ok: false })
          : Promise.resolve({ ok: true, json: () => Promise.resolve({ level: forceLevel }) }),
      ),
    );
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: '**', children: [] }]),
        { provide: SwUpdate, useValue: sw },
      ],
    });
    const service = TestBed.inject(PwaUpdate);
    const internals = service as unknown as {
      applyThen: (next: () => void) => Promise<void>;
      hardReload: () => Promise<void>;
    };
    applyThen = vi.spyOn(internals, 'applyThen').mockResolvedValue(undefined);
    hardReload = vi.spyOn(internals, 'hardReload').mockResolvedValue(undefined);
    service.start();
    return service;
  }

  afterEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = '';
    sw.checkForUpdate.mockClear();
    sw.activateUpdate.mockClear();
  });

  it('cherche une nouvelle version dès le démarrage', async () => {
    setup();
    await Promise.resolve();
    expect(sw.checkForUpdate).toHaveBeenCalled();
  });

  it('applique une version prête au changement de page suivant, sans rien demander', async () => {
    const service = setup();
    versionUpdates.next({ type: 'VERSION_READY' });
    expect(service.ready()).toBe(true);
    expect(service.prompt()).toBe(false);

    await TestBed.inject(Router).navigateByUrl('/contact');
    expect(applyThen).toHaveBeenCalledTimes(1);
  });

  it('ne recharge pas sous les doigts du visiteur qui remplit un formulaire : il propose « Actualiser »', async () => {
    const form = document.createElement('form');
    form.className = 'ng-dirty';
    document.body.appendChild(form);

    const service = setup();
    versionUpdates.next({ type: 'VERSION_READY' });
    expect(service.prompt()).toBe(true);

    await TestBed.inject(Router).navigateByUrl('/contact');
    expect(applyThen).not.toHaveBeenCalled();
  });

  it("n'applique rien tant qu'aucune version n'est prête", async () => {
    setup();
    await TestBed.inject(Router).navigateByUrl('/contact');
    expect(applyThen).not.toHaveBeenCalled();
  });

  it("déclenche l'arrêt d'urgence quand le fichier demande un niveau plus récent", async () => {
    setup(FORCE_UPDATE_LEVEL + 1);
    await vi.waitFor(() => expect(hardReload).toHaveBeenCalled());
  });

  it("ne fait rien d'urgent quand le niveau est le même ou que le fichier est absent", async () => {
    setup(FORCE_UPDATE_LEVEL);
    await new Promise((r) => setTimeout(r, 20));
    expect(hardReload).not.toHaveBeenCalled();

    setup(null);
    await new Promise((r) => setTimeout(r, 20));
    expect(hardReload).not.toHaveBeenCalled();
  });

  it('se recharge proprement quand le service worker est dans un état irrécupérable', async () => {
    setup();
    unrecoverable.next({ reason: 'cache corrompu' });
    expect(hardReload).toHaveBeenCalled();
  });

  it("n'agit pas du tout quand le service worker est désactivé (développement)", () => {
    sw.isEnabled = false;
    try {
      const service = setup();
      versionUpdates.next({ type: 'VERSION_READY' });
      expect(service.ready()).toBe(false);
      expect(sw.checkForUpdate).not.toHaveBeenCalled();
    } finally {
      sw.isEnabled = true;
    }
  });
});
