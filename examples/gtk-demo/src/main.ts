import { html } from 'lit';
import { GtkApplication } from '@lit-gtk/library';
import './gtk-demo';
import './index.css';

class LitGtkDemoApp extends GtkApplication {
  constructor() {
    super('com.google.litgtk.demo', {
      name: 'Lit-GTK Demo',
      shortName: 'LitGTK',
      description: 'A high-fidelity GTK4 toolkit for the web.',
      startUrl: '/',
      display: 'standalone',
      backgroundColor: '#f6f5f4',
      themeColor: '#3584e4',
      icons: [
        {
          src: 'https://cdn-icons-png.flaticon.com/512/5968/5968322.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ],
      offlineAssets: [
        '/',
        '/index.html',
        '/src/main.ts',
        '/src/gtk-demo.ts'
      ]
    });
  }

  protected onActivate() {
    this.setMainWindow(html`
      <gtk-pwa-banner></gtk-pwa-banner>
      <gtk-demo></gtk-demo>
    `);
  }
}

const app = new LitGtkDemoApp();
app.run();
