import { html, render } from 'lit';
import { RendererManager } from './renderer-manager';

/**
 * Configuration options for the PWA aspect of the GtkApplication.
 */
interface PwaOptions {
  name: string;
  shortName: string;
  description: string;
  startUrl: string;
  display: 'standalone' | 'fullscreen' | 'minimal-ui' | 'browser';
  backgroundColor: string;
  themeColor: string;
  icons: Array<{ src: string; sizes: string; type: string }>;
  offlineAssets?: string[];
}

/**
 * GtkApplication mimics the GTK4 GtkApplication class.
 * It handles the application lifecycle, PWA integration, and main window management.
 */
export class GtkApplication {
  private _applicationId: string;
  private _pwaOptions?: PwaOptions;
  private _installPrompt: any = null;

  constructor(applicationId: string, pwaOptions?: PwaOptions) {
    this._applicationId = applicationId;
    this._pwaOptions = pwaOptions;
  }

  /**
   * Initializes the application and registers PWA features if configured.
   */
  public async run() {
    if (this._pwaOptions) {
      this._setupPwa();
    }

    // Trigger the 'activate' signal logic
    this.onActivate();
  }

  /**
   * Virtual method to be overridden by subclasses to define the UI.
   * Similar to the 'activate' signal in GTK.
   */
  protected onActivate() {
    console.warn('GtkApplication: onActivate() not implemented. Override this method to build your UI.');
  }

  /**
   * Sets the main component of the application.
   * @param component The Lit component or template to render as the root.
   */
  protected setMainWindow(template: any) {
    render(template, document.body);
  }

  /**
   * Setup PWA features: manifest injection and service worker registration.
   */
  private async _setupPwa() {
    if (!this._pwaOptions) return;

    // Inject Web Manifest
    const manifest = {
      name: this._pwaOptions.name,
      short_name: this._pwaOptions.shortName,
      description: this._pwaOptions.description,
      start_url: this._pwaOptions.startUrl || '/',
      display: this._pwaOptions.display || 'standalone',
      background_color: this._pwaOptions.backgroundColor || '#ffffff',
      theme_color: this._pwaOptions.themeColor || '#3584e4',
      icons: this._pwaOptions.icons || [],
    };

    const stringManifest = JSON.stringify(manifest);
    const blob = new Blob([stringManifest], { type: 'application/json' });
    const manifestURL = URL.createObjectURL(blob);
    
    let link = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'manifest';
      document.head.appendChild(link);
    }
    link.href = manifestURL;

    // Inject Theme Color meta tag
    let themeMeta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
    if (!themeMeta) {
      themeMeta = document.createElement('meta');
      themeMeta.name = 'theme-color';
      document.head.appendChild(themeMeta);
    }
    themeMeta.content = this._pwaOptions.themeColor;

    // Register Service Worker and handle offline assets
    await this._registerServiceWorker();

    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this._installPrompt = e;
      (window as any).gtk_pwa_prompt = e;
      window.dispatchEvent(new CustomEvent('gtk-pwa-installable', { detail: { prompt: e } }));
    });
  }

  private async _registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });
        
        console.log('GtkApplication: ServiceWorker registration successful with scope: ', registration.scope);

        // If offline assets are provided, we can pre-cache them from the main thread
        // to simplify the service worker implementation
        if (this._pwaOptions?.offlineAssets && this._pwaOptions.offlineAssets.length > 0) {
          try {
            const cache = await caches.open('gtk-pwa-cache-v1');
            await cache.addAll(this._pwaOptions.offlineAssets);
            console.log('GtkApplication: Pre-cached offline assets:', this._pwaOptions.offlineAssets);
          } catch (cacheErr) {
            console.error('GtkApplication: Failed to pre-cache assets:', cacheErr);
          }
        }
      } catch (err) {
        console.error('GtkApplication: ServiceWorker registration failed: ', err);
      }
    }
  }

  /**
   * Triggers the PWA installation dialog if available.
   */
  public async install() {
    if (this._installPrompt) {
      this._installPrompt.prompt();
      const { outcome } = await this._installPrompt.userChoice;
      console.log(`GtkApplication: User accepted the install prompt: ${outcome}`);
      this._installPrompt = null;
    }
  }

  /**
   * Returns true if the app is currently running as a standalone PWA.
   */
  public isStandalone(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
  }
}
