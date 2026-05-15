import { html } from 'lit';
import { GtkApplication } from '@lit-gtk/library';

class HelloWorldApp extends GtkApplication {
  constructor() {
    super('com.example.helloworld', {
      name: 'Hello World',
      shortName: 'Hello',
      description: 'A simple adaptive hello world app.',
      startUrl: '/',
      display: 'standalone',
      backgroundColor: '#ffffff',
      themeColor: '#3584e4',
      icons: []
    });
  }

  protected onActivate() {
    this.setMainWindow(html`
      <gtk-window>
        <gtk-header-bar slot="header" title="Hello World"></gtk-header-bar>
        <gtk-clamp>
          <gtk-box orientation="vertical" spacing="20" style="padding: 40px;">
            <gtk-label isTitle text="Welcome to Lit-GTK"></gtk-label>
            <gtk-label text="This is a simple adaptive layout. Resize the window to see me stay centered or fold on mobile."></gtk-label>
            <gtk-button label="Click Me" variant="suggested" @click="${() => alert('Hello!')}"></gtk-button>
          </gtk-box>
        </gtk-clamp>
      </gtk-window>
    `);
  }
}

const app = new HelloWorldApp();
app.run();
