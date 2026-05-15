import { html } from 'lit';
import { GtkApplication } from '@lit-gtk/library';

class KitchenSinkApp extends GtkApplication {
  constructor() {
    super('com.example.kitchensink', {
      name: 'Kitchen Sink',
      shortName: 'Sink',
      description: 'Showing all components in one place.',
      startUrl: '/',
      display: 'standalone',
      backgroundColor: '#f6f5f4',
      themeColor: '#3584e4',
      icons: []
    });
  }

  protected onActivate() {
    this.setMainWindow(html`
      <gtk-window>
        <gtk-header-bar slot="header" title="Kitchen Sink" subtitle="Every component test">
          <gtk-button slot="start" icon="â˜°" variant="flat"></gtk-button>
          <gtk-button slot="end" label="Action" variant="suggested"></gtk-button>
        </gtk-header-bar>

        <gtk-leaflet visible-child="main">
          <gtk-sidebar slot="sidebar" selected="buttons"></gtk-sidebar>
          <gtk-box orientation="vertical" spacing="10" style="padding: 24px; overflow-y: auto;">
             <gtk-clamp>
                <gtk-box orientation="vertical" spacing="20">
                  <section>
                    <gtk-label isTitle text="Buttons"></gtk-label>
                    <gtk-box spacing="10">
                      <gtk-button label="Normal"></gtk-button>
                      <gtk-button label="Suggested" suggested></gtk-button>
                      <gtk-button label="Destructive" destructive></gtk-button>
                      <gtk-button icon="ðŸ”™" label="Back"></gtk-button>
                    </gtk-box>
                  </section>

                  <section>
                    <gtk-label isTitle text="Input Widgets"></gtk-label>
                    <gtk-box orientation="vertical" spacing="10">
                       <gtk-entry placeholder="Type something..."></gtk-entry>
                       <gtk-box spacing="20">
                          <gtk-switch active></gtk-switch>
                          <gtk-check-button label="Check Me"></gtk-check-button>
                       </gtk-box>
                       <gtk-spin-button value="42" min="0" max="100"></gtk-spin-button>
                    </gtk-box>
                  </section>

                  <section>
                    <gtk-label isTitle text="Progress"></gtk-label>
                    <gtk-progress-bar fraction="0.65"></gtk-progress-bar>
                  </section>

                  <section>
                    <gtk-label isTitle text="Images & Icons"></gtk-label>
                    <gtk-box spacing="20">
                      <gtk-image icon="ðŸš€" width="32" height="32"></gtk-image>
                      <gtk-image icon="âœ¨" width="32" height="32"></gtk-image>
                      <gtk-image icon="ðŸ“¦" width="32" height="32"></gtk-image>
                    </gtk-box>
                  </section>

                  <section>
                    <gtk-label isTitle text="Layout Containers"></gtk-label>
                    <gtk-separator></gtk-separator>
                    <gtk-grid columns="repeat(2, 1fr)" spacing="10">
                      <div style="background: rgba(0,0,0,0.05); padding: 20px; border-radius: 8px;">Cell 1</div>
                      <div style="background: rgba(0,0,0,0.05); padding: 20px; border-radius: 8px;">Cell 2</div>
                    </gtk-grid>
                  </section>
                </gtk-box>
             </gtk-clamp>
          </gtk-box>
        </gtk-leaflet>
      </gtk-window>
    `);
  }
}

const app = new KitchenSinkApp();
app.run();
