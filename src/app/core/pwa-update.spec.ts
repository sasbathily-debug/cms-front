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

  beforeEach(() => vi.useFakeTimers({ toFake: ['Date'] }));

  afterEach(() => {
    vi.useRealTimers();
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
    vi.setSystemTime(Date.now() + 5 * 60_000); // le visiteur lit depuis un moment : pas de rechargement immédiat
    versionUpdates.next({ type: 'VERSION_READY' });
    expect(service.ready()).toBe(true);
    expect(service.prompt()).toBe(false);
    expect(applyThen).not.toHaveBeenCalled();

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

  it("applique tout de suite une version qui arrive juste après l'ouverture", () => {
    setup();
    versionUpdates.next({ type: 'VERSION_READY' });
    expect(applyThen).toHaveBeenCalledTimes(1);
  });

  it("applique aussi tout de suite une version qui arrive juste après le retour sur l'application", () => {
    const service = setup();
    vi.setSystemTime(Date.now() + 10 * 60_000);
    document.dispatchEvent(new Event('visibilitychange'));
    versionUpdates.next({ type: 'VERSION_READY' });
    expect(service.ready()).toBe(true);
    expect(applyThen).toHaveBeenCalledTimes(1);
  });

  it("cherche une nouvelle version à chaque changement de page, puis l'applique tout de suite si elle arrive", async () => {
    setup();
    vi.setSystemTime(Date.now() + 5 * 60_000); // l'application est ouverte depuis un moment
    sw.checkForUpdate.mockClear();

    await TestBed.inject(Router).navigateByUrl('/contact');
    expect(sw.checkForUpdate).toHaveBeenCalledTimes(1);

    versionUpdates.next({ type: 'VERSION_READY' });
    expect(applyThen).toHaveBeenCalledTimes(1);
  });

  it("ne cherche pas plus d'une fois par minute, même en changeant vite de page", async () => {
    setup();
    vi.setSystemTime(Date.now() + 5 * 60_000);
    sw.checkForUpdate.mockClear();

    const router = TestBed.inject(Router);
    await router.navigateByUrl('/contact');
    await router.navigateByUrl('/faq');
    await router.navigateByUrl('/a-propos');
    expect(sw.checkForUpdate).toHaveBeenCalledTimes(1);
  });

  it("n'applique pas une version qui arrive longtemps après le dernier changement de page", async () => {
    setup();
    vi.setSystemTime(Date.now() + 5 * 60_000);
    await TestBed.inject(Router).navigateByUrl('/contact');
    vi.setSystemTime(Date.now() + 60_000); // le visiteur lit depuis une minute
    versionUpdates.next({ type: 'VERSION_READY' });
    expect(applyThen).not.toHaveBeenCalled();
  });

  it('ne recharge pas si le visiteur a saisi du texte : il propose « Actualiser »', () => {
    const service = setup();
    document.dispatchEvent(new Event('input'));
    versionUpdates.next({ type: 'VERSION_READY' });
    expect(applyThen).not.toHaveBeenCalled();
    expect(service.prompt()).toBe(true);
  });

  it('ne recharge pas pendant que le chat est ouvert', () => {
    const panel = document.createElement('aside');
    panel.className = 'chat-panel';
    document.body.appendChild(panel);
    const service = setup();
    versionUpdates.next({ type: 'VERSION_READY' });
    expect(applyThen).not.toHaveBeenCalled();
    expect(service.prompt()).toBe(true);
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
