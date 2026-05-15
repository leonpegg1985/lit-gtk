import { html, css, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@lit-gtk/library';

/**
 * GtkDemo is the main application component showing off the toolkit's capabilities.
 * It includes a gallery of components and adaptive layout examples.
 * 
 * @element gtk-demo
 */
@customElement('gtk-demo')
export class GtkDemo extends LitElement {
  @state() private inputText = 'User Input';
  @state() private switchActive = false;
  @state() private progress = 0.4;
  @state() private activeId = 'home';
  @state() private selectedWidget = 'gtk-box';
  @state() private isDarkMode = false;
  @state() private isMenuOpen = false;
  @state() private spinValue = 10;
  @state() private leafletFolded = false;
  @state() private leafletVisibleChild = 'sidebar';

  static styles = css`
    :host {
      display: block;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
      background: var(--gtk-window-bg);
      color: var(--gtk-button-fg);
      font-family: var(--gtk-font-family);
    }
    .gallery-container {
      display: flex;
      height: 100%;
    }
    .gallery-content {
      flex: 1;
      overflow-y: auto;
      padding: 32px;
      background: var(--gtk-window-bg);
    }
    .widget-detail {
       max-width: 800px;
       margin: 0 auto;
       display: flex;
       flex-direction: column;
       gap: 32px;
    }
    .card {
      background: var(--gtk-headerbar-bg);
      border: 1px solid var(--gtk-border-color);
      border-radius: var(--gtk-radius);
      padding: 24px;
      box-shadow: var(--gtk-shadow);
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .card-title {
      font-size: 16px;
      font-weight: 700;
      color: var(--gtk-button-fg);
      margin-bottom: 8px;
    }
    .card-description {
      font-size: 13px;
      line-height: 1.5;
      color: #5e5c64;
    }
    .card-meta {
      font-family: var(--font-mono);
      font-size: 11px;
      color: #9ea0a2;
      background: var(--gtk-window-bg);
      padding: 2px 6px;
      border-radius: 4px;
    }
    .code-block {
      background: #2e3436;
      border-radius: var(--gtk-radius);
      padding: 16px;
      color: #dcdcdc;
      font-family: var(--font-mono);
      font-size: 12px;
      line-height: 1.6;
      margin: 0;
      overflow-x: auto;
    }
    .spacer { flex: 1; }
    
    .icon-box {
      width: 16px;
      height: 16px;
      border-radius: 3px;
      background: var(--gtk-accent-bg);
      margin: 0 12px;
    }

    .demo-pill {
      background: var(--gtk-switch-bg);
      border-radius: 6px;
      padding: 2px;
      display: flex;
    }
    
    .menu-container {
      position: relative;
      display: inline-block;
    }

    .doc-page {
      padding: 48px;
      max-width: 900px;
      margin: 0 auto;
      line-height: 1.6;
    }
    .doc-page h1 { font-size: 32px; margin-bottom: 16px; }
    .doc-page h2 { font-size: 24px; margin-top: 32px; margin-bottom: 16px; border-bottom: 1px solid var(--gtk-border-color); padding-bottom: 8px; }
    .doc-page p { margin-bottom: 16px; font-size: 15px; }

    .prop-table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
      font-size: 13px;
    }
    .prop-table th, .prop-table td {
      text-align: left;
      padding: 12px;
      border-bottom: 1px solid var(--gtk-border-color);
    }
    .prop-table th { background: var(--gtk-window-bg); font-weight: 700; }
  `;

  private _toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      this.classList.add('dark');
      this.dataset.theme = 'dark';
    } else {
      this.classList.remove('dark');
      this.dataset.theme = 'light';
    }
  }

  render() {
    return html`
      <gtk-window>
        <gtk-header-bar slot="header" title="LIT-GTK TOOLKIT" subtitle="Component Gallery & Docs">
          <gtk-box slot="start" valign="center">
            ${this.leafletFolded && this.activeId === 'home' && this.leafletVisibleChild === 'content' ? html`
              <gtk-button icon="⬅️" variant="flat" @click="${() => this.leafletVisibleChild = 'sidebar'}"></gtk-button>
            ` : ''}
            <div class="icon-box"></div>
            <div class="demo-pill">
              <gtk-button 
                label="Gallery" 
                variant="flat" 
                .active="${this.activeId === 'home'}"
                @click="${() => this.activeId = 'home'}"
              ></gtk-button>
              <gtk-button 
                label="Documentation" 
                variant="flat" 
                .active="${this.activeId === 'docs'}"
                @click="${() => this.activeId = 'docs'}"
              ></gtk-button>
              <gtk-button 
                label="Settings" 
                variant="flat" 
                .active="${this.activeId === 'settings'}"
                @click="${() => this.activeId = 'settings'}"
              ></gtk-button>
            </div>
          </gtk-box>
          <gtk-box slot="end" valign="center" spacing="8">
            <gtk-button 
              variant="flat" 
              icon="${this.isDarkMode ? '🌞' : '🌙'}" 
              @click="${this._toggleTheme}"
              tooltip="Toggle Dark Mode"
            ></gtk-button>
            <div class="menu-container">
               <gtk-button 
                icon="⋮" 
                variant="flat"
                @click="${() => this.isMenuOpen = !this.isMenuOpen}"
                .active="${this.isMenuOpen}"
              ></gtk-button>
              <gtk-menu .open="${this.isMenuOpen}">
                <gtk-menu-item label="New Widget" icon="➕"></gtk-menu-item>
                <gtk-menu-item label="Import..." icon="📥"></gtk-menu-item>
                <div class="separator"></div>
                <gtk-menu-item label="Themes" icon="🎨"></gtk-menu-item>
                <gtk-menu-item label="Accessibility" icon="♿"></gtk-menu-item>
                <div class="separator"></div>
                <gtk-menu-item label="Quit" icon="🚪"></gtk-menu-item>
              </gtk-menu>
            </div>
          </gtk-box>
        </gtk-header-bar>

        <gtk-stack active-id="${this.activeId}" transition="crossfade" style="height: 100%">
          <!-- Gallery View -->
          <div id="home" style="height: 100%">
            <gtk-leaflet 
              .visibleChild="${this.leafletVisibleChild}"
              @folded-changed="${(e: any) => this.leafletFolded = e.detail.folded}"
            >
              <gtk-sidebar 
                id="sidebar"
                .selected="${this.selectedWidget}" 
                @select="${(e: any) => {
                  this.selectedWidget = e.detail.id;
                  if (this.leafletFolded) this.leafletVisibleChild = 'content';
                }}"
              ></gtk-sidebar>
              
              <div id="content" class="gallery-content">
                <gtk-stack active-id="${this.selectedWidget}" transition="crossfade">
                  ${this._renderWidgetDetails()}
                </gtk-stack>
              </div>
            </gtk-leaflet>
          </div>

          <!-- Documentation View -->
          <div id="docs">
            <gtk-clamp maximum-size="800">
              <div class="doc-page">
                <h1>LIT-GTK TOOLKIT</h1>
                <p>A Web Component library built with Lit-Element that replicates the GTK4 / Adwaita design system with high fidelity. This toolkit uses a worker-based rendering engine to ensure smooth visuals even with complex layouts.</p>
                
                <h2>Getting Started</h2>
                <p>Install the library via npm or include it via CDN. All components are self-registering.</p>
                <div class="code-block">
                  npm install lib-gtk-toolkit<br>
                  import 'lit-gtk-toolkit';
                </div>

                <h2>Global Configuration</h2>
                <p>The library uses CSS variables for theming. You can override these variables at the root level to customize the look and feel.</p>
                <div class="code-block">
                  :root {<br>
                  &nbsp;&nbsp;--gtk-accent-bg: #3584e4;<br>
                  &nbsp;&nbsp;--gtk-radius: 8px;<br>
                  }
                </div>

                <h2>Component API Structure</h2>
                <p>Most components follow the GTK object model where they inherit from GtkElement. Input components emit events like 'changed' or 'state-set'.</p>
                
                <table class="prop-table">
                  <thead>
                    <tr><th>Property</th><th>Type</th><th>Description</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>theme</td><td>Object</td><td>Overrides the global theme for this specific element.</td></tr>
                    <tr><td>disabled</td><td>Boolean</td><td>Disables user interaction.</td></tr>
                    <tr><td>tooltip</td><td>String</td><td>Shows a floating tooltip on hover.</td></tr>
                  </tbody>
                </table>

                <h2>Adaptive Design</h2>
                <p>Use <code>gtk-leaflet</code> and <code>gtk-clamp</code> to build interfaces that scale from phone to desktop effortlessly.</p>

                <h2>PWA Framework</h2>
                <p>The <code>GtkApplication</code> class simplifies Progressive Web App creation. It automatically manages manifests, service workers, and installation prompts.</p>
                <div class="code-block">
                  class MyApp extends GtkApplication {<br>
                  &nbsp;&nbsp;protected onActivate() {<br>
                  &nbsp;&nbsp;&nbsp;&nbsp;this.setMainWindow(html'&#60;my-root&#62;&#60;/my-root&#62;');<br>
                  &nbsp;&nbsp;}<br>
                  }
                </div>

                <h2>Dark Mode</h2>
                <p>To enable dark mode, add the .dark class to the host element or any parent element. The library automatically adjusts its internal color palettes.</p>
              </div>
            </gtk-clamp>
          </div>

          <!-- Settings View -->
          <div id="settings">
            <div style="padding: 40px; max-width: 600px; margin: 0 auto">
              <div class="card">
                <div class="card-header">
                  <h2 style="margin: 0; font-size: 18px">Adwaita Preferences</h2>
                </div>
                <gtk-box orientation="vertical" spacing="20">
                   <gtk-box valign="center">
                    <gtk-label text="Developer Name"></gtk-label>
                    <div class="spacer"></div>
                    <div style="width: 200px">
                      <gtk-entry .value="${this.inputText}"></gtk-entry>
                    </div>
                  </gtk-box>
                  <gtk-box valign="center">
                    <gtk-label text="Telemetry"></gtk-label>
                    <div class="spacer"></div>
                    <gtk-switch .active="${this.switchActive}" @state-set="${(e: any) => this.switchActive = e.detail.active}"></gtk-switch>
                  </gtk-box>
                  <gtk-separator></gtk-separator>
                  <gtk-box valign="center">
                    <gtk-label text="Interface Density"></gtk-label>
                    <div class="spacer"></div>
                    <gtk-spin-button .value="${this.spinValue}" .min="${1}" .max="${20}"></gtk-spin-button>
                  </gtk-box>
                  <gtk-button label="Factory Reset" variant="destructive" style="align-self: flex-end"></gtk-button>
                </gtk-box>
              </div>
            </div>
          </div>
        </gtk-stack>

        <footer slot="footer" style="height: 40px; background: var(--gtk-headerbar-bg); border-top: 1px solid var(--gtk-border-color); display: flex; align-items: center; justify-content: space-between; padding: 0 24px">
          <div style="font-size: 10px; font-weight: 700; color: var(--gtk-accent-bg)">GTK-CORE / <span style="color: #5e5c64">GALLERY.UI</span></div>
          <div style="display: flex; gap: 20px; font-size: 10px; color: #5e5c64; font-weight: 500">
             <div>Widget: <span style="color: var(--gtk-accent-bg)">${this.selectedWidget}</span></div>
             <div style="background: var(--gtk-button-hover-bg); padding: 1px 4px; border-radius: 3px">Optimal Performance</div>
          </div>
        </footer>
      </gtk-window>
    `;
  }

  private _renderWidgetDetails() {
    const widgets = [
      {
        id: 'gtk-leaflet',
        title: 'GtkLeaflet',
        description: 'An adaptive layout component that folds its children on small screens. It is the key to building responsive Adwaita applications.',
        code: `<gtk-leaflet .threshold="\${600}">\n  <div id="sidebar">Sidebar</div>\n  <div id="main">Main Content</div>\n</gtk-leaflet>`,
        preview: html`
          <gtk-box orientation="vertical" spacing="10">
            <gtk-label text="Resize the browser window to see the leaflet fold."></gtk-label>
            <gtk-box spacing="8">
              <gtk-button label="Unfold" @click="${() => (this.renderRoot.querySelector('#leaflet-demo') as any).folded = false}"></gtk-button>
              <gtk-button label="Fold" @click="${() => (this.renderRoot.querySelector('#leaflet-demo') as any).folded = true}"></gtk-button>
            </gtk-box>
            <gtk-leaflet id="leaflet-demo" style="height: 120px; border: 1px dashed var(--gtk-border-color); border-radius: 6px">
              <div id="child-0" style="background: var(--gtk-sidebar-bg); padding: 20px">View A</div>
              <div id="child-1" style="background: var(--gtk-window-bg); padding: 20px">View B</div>
            </gtk-leaflet>
          </gtk-box>
        `
      },
      {
        id: 'gtk-clamp',
        title: 'GtkClamp',
        description: 'Restricts its child to a maximum width, while remaining centered. Perfect for large screen readability.',
        code: `<gtk-clamp maximum-size="600">\n  <div>Centered Content</div>\n</gtk-clamp>`,
        preview: html`
          <gtk-clamp maximum-size="400">
            <div style="background: var(--gtk-window-bg); padding: 20px; border: 1px solid var(--gtk-border-color); border-radius: 8px; text-align: center">
               This content will never be wider than 400px regardless of screen size.
            </div>
          </gtk-clamp>
        `
      },
      {
        id: 'gtk-box',
        title: 'GtkBox',
        description: 'A container that organizes child widgets into a single row or column. It is the fundamental layout block of the Adwaita design system.',
        code: `<gtk-box orientation="vertical" spacing="12">\n  <gtk-button label="One"></gtk-button>\n  <gtk-button label="Two"></gtk-button>\n</gtk-box>`,
        preview: html`
          <gtk-box orientation="vertical" spacing="20">
            <gtk-box spacing="8">
              <gtk-button label="Horizontal"></gtk-button>
              <gtk-button label="Layout"></gtk-button>
              <gtk-button label="Example"></gtk-button>
            </gtk-box>
            <gtk-separator></gtk-separator>
            <gtk-box orientation="vertical" spacing="8">
              <gtk-button label="Vertical"></gtk-button>
              <gtk-button label="Layout"></gtk-button>
              <gtk-button label="Example"></gtk-button>
            </gtk-box>
          </gtk-box>
        `
      },
      {
        id: 'gtk-grid',
        title: 'GtkGrid',
        description: 'A powerful 2D grid layout. Supports reorderable children via drag and drop and arbitrary grid configurations.',
        code: `<gtk-grid columns="1fr 1fr" column-spacing="24" .reorderable="\${true}">\n  <div class="card">Item 1</div>\n  <div class="card">Item 2</div>\n</gtk-grid>`,
        preview: html`
          <gtk-grid columns="1fr 1fr" column-spacing="16" row-spacing="16" .reorderable="${true}">
            <div class="card" style="padding: 16px"><gtk-label text="Grid Item A"></gtk-label></div>
            <div class="card" style="padding: 16px"><gtk-label text="Grid Item B"></gtk-label></div>
            <div class="card" style="padding: 16px"><gtk-label text="Grid Item C"></gtk-label></div>
            <div class="card" style="padding: 16px"><gtk-label text="Grid Item D"></gtk-label></div>
          </gtk-grid>
        `
      },
      {
        id: 'gtk-button',
        title: 'GtkButton',
        description: 'Standard button component supporting various semantic styles (suggested, destructive, flat, outline) and icons.',
        code: `<gtk-button label="Submit" variant="suggested" icon="⭐"></gtk-button>`,
        preview: html`
          <gtk-box orientation="vertical" spacing="16">
            <gtk-box spacing="12">
              <gtk-button label="Standard"></gtk-button>
              <gtk-button label="Suggested" variant="suggested"></gtk-button>
              <gtk-button label="Destructive" variant="destructive"></gtk-button>
            </gtk-box>
            <gtk-box spacing="12">
              <gtk-button label="Outline" variant="outline"></gtk-button>
              <gtk-button label="Flat" variant="flat"></gtk-button>
              <gtk-button icon="🔍" variant="flat" tooltip="Search"></gtk-button>
            </gtk-box>
            <gtk-box spacing="12">
              <gtk-button label="With Icon" icon="📁"></gtk-button>
              <gtk-button label="Disabled" .disabled="${true}"></gtk-button>
            </gtk-box>
          </gtk-box>
        `
      },
      {
        id: 'gtk-switch',
        title: 'GtkSwitch',
        description: 'A toggle switch for binary preferences. Transitions smoothly between states.',
        code: `<gtk-switch .active="\${active}" @state-set="\${onToggle}"></gtk-switch>`,
        preview: html`
          <gtk-box orientation="vertical" spacing="12">
            <gtk-box valign="center">
              <gtk-label text="Enable Wifi"></gtk-label>
              <div class="spacer"></div>
              <gtk-switch .active="${true}"></gtk-switch>
            </gtk-box>
            <gtk-box valign="center">
              <gtk-label text="Bluetooth"></gtk-label>
              <div class="spacer"></div>
              <gtk-switch></gtk-switch>
            </gtk-box>
          </gtk-box>
        `
      },
      {
        id: 'gtk-progress-bar',
        title: 'GtkProgressBar',
        description: 'Visual indicator of task completion or value magnitude.',
        code: `<gtk-progress-bar .fraction="\${0.7}"></gtk-progress-bar>`,
        preview: html`
          <gtk-box orientation="vertical" spacing="20">
            <gtk-progress-bar .fraction="${0.3}"></gtk-progress-bar>
            <gtk-progress-bar .fraction="${0.6}"></gtk-progress-bar>
            <gtk-progress-bar .fraction="${1.0}"></gtk-progress-bar>
          </gtk-box>
        `
      },
      {
         id: 'gtk-spin-button',
         title: 'GtkSpinButton',
         description: 'Numeric input with increment/decrement controls. Supports min, max, and custom step values.',
         code: `<gtk-spin-button .value="\${10}" .min="\${0}" .max="\${100}"></gtk-spin-button>`,
         preview: html`
            <gtk-box spacing="20" valign="center">
               <gtk-spin-button .value="42"></gtk-spin-button>
               <gtk-spin-button .value="5" .step="5"></gtk-spin-button>
               <gtk-spin-button .value="10" .min="0" .max="20"></gtk-spin-button>
            </gtk-box>
         `
      },
      {
        id: 'gtk-flow-box',
        title: 'GtkFlowBox',
        description: 'A container that wraps its children into multiple rows based on available horizontal space.',
        code: `<gtk-flow-box spacing="8">\n  <gtk-button label="One"></gtk-button>\n  ...\n</gtk-flow-box>`,
        preview: html`
          <gtk-flow-box spacing="10">
            ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => html`
              <gtk-button label="Token ${n}" variant="outline"></gtk-button>
            `)}
          </gtk-flow-box>
        `
      },
      {
        id: 'gtk-menu',
        title: 'GtkMenu / Popovers',
        description: 'Floating menus for context actions or dropdown selections. Mimics standard desktop application menus.',
        code: `<gtk-menu .open="\${true}">\n  <gtk-menu-item label="Action" icon="⚡"></gtk-menu-item>\n</gtk-menu>`,
        preview: html`
          <gtk-box spacing="32">
            <div style="position: relative">
              <gtk-button label="Open Menu" @click="${() => this.isMenuOpen = !this.isMenuOpen}"></gtk-button>
              <gtk-menu .open="${this.isMenuOpen}">
                <gtk-menu-item label="Copy" icon="📋"></gtk-menu-item>
                <gtk-menu-item label="Paste" icon="📥"></gtk-menu-item>
                <div class="separator"></div>
                <gtk-menu-item label="Rename" icon="✏️"></gtk-menu-item>
                <gtk-menu-item label="Delete" icon="🗑️"></gtk-menu-item>
              </gtk-menu>
            </div>
            <gtk-label text="Click the button to toggle the popover menu."></gtk-label>
          </gtk-box>
        `
      },
      {
        id: 'gtk-check-button',
        title: 'GtkCheckButton',
        description: 'A checkbox component for selecting multiple options from a set.',
        code: `<gtk-check-button label="Subscribe" .active="\${true}"></gtk-check-button>`,
        preview: html`
          <gtk-box orientation="vertical" spacing="12">
            <gtk-check-button label="Enable dark theme by default" .active="${true}"></gtk-check-button>
            <gtk-check-button label="Show line numbers in editor"></gtk-check-button>
            <gtk-check-button label="Autosave work every 5 minutes" .active="${true}"></gtk-check-button>
          </gtk-box>
        `
      },
      {
        id: 'gtk-stack',
        title: 'GtkStack',
        description: 'A container which shows only one of its children at a time. Supports transitions like crossfade.',
        code: `<gtk-stack active-id="page1" transition="crossfade">\n  <div id="page1">Page One</div>\n  <div id="page2">Page Two</div>\n</gtk-stack>`,
        preview: html`
          <gtk-box orientation="vertical" spacing="16">
            <gtk-box spacing="8">
              <gtk-button label="Show View A" @click="${() => (this.renderRoot.querySelector('#demo-stack') as any).activeId = 'a'}"></gtk-button>
              <gtk-button label="Show View B" @click="${() => (this.renderRoot.querySelector('#demo-stack') as any).activeId = 'b'}"></gtk-button>
            </gtk-box>
            <gtk-stack id="demo-stack" active-id="a" transition="crossfade" style="height: 60px; background: var(--gtk-window-bg); border-radius: 6px; display: flex; align-items: center; justify-content: center; border: 1px dashed var(--gtk-border-color)">
              <div id="a">View A - Content</div>
              <div id="b">View B - Different Content</div>
            </gtk-stack>
          </gtk-box>
        `
      },
      {
        id: 'gtk-header-bar',
        title: 'GtkHeaderBar',
        description: 'A bar used at the top of windows, containing a title, optional subtitle, and various interactive controls.',
        code: `<gtk-header-bar title="App" subtitle="v1.0">\n  <gtk-button slot="start" icon="🔙"></gtk-button>\n</gtk-header-bar>`,
        preview: html`
          <div style="border: 1px solid var(--gtk-border-color); border-radius: 8px; overflow: hidden">
            <gtk-header-bar title="Documents" subtitle="Last edited 2m ago">
              <gtk-button slot="start" icon="📂" variant="flat"></gtk-button>
              <gtk-button slot="end" label="Share" variant="suggested"></gtk-button>
            </gtk-header-bar>
            <div style="height: 100px; background: white; padding: 20px">Window Content...</div>
          </div>
        `
      },
      {
        id: 'gtk-label',
        title: 'GtkLabel',
        description: 'A component for displaying text. It respects the system font and provides consistent styling.',
        code: `<gtk-label text="Hello Adwaita"></gtk-label>`,
        preview: html`
          <gtk-box orientation="vertical" spacing="10">
            <gtk-label text="Standard Label Text" style="font-size: 16px; font-weight: 700"></gtk-label>
            <gtk-label text="Informative text for the user about various settings and configurations."></gtk-label>
          </gtk-box>
        `
      },
      {
        id: 'gtk-image',
        title: 'GtkImage',
        description: 'Display images or symbolic icons with consistent scaling and Adwaita alignment.',
        code: `<gtk-image icon="📁" width="24"></gtk-image>`,
        preview: html`
          <gtk-box spacing="24">
            <gtk-image icon="📄" width="32"></gtk-image>
            <gtk-image icon="⚙️" width="32"></gtk-image>
            <gtk-image icon="🌐" width="32"></gtk-image>
            <gtk-image icon="🖼️" width="32"></gtk-image>
          </gtk-box>
        `
      },
      {
        id: 'gtk-entry',
        title: 'GtkEntry',
        description: 'Single-line text entry field. Supports placeholders and provides clear focus feedback.',
        code: `<gtk-entry placeholder="Search..." .value="\${val}"></gtk-entry>`,
        preview: html`
          <gtk-box orientation="vertical" spacing="12">
            <gtk-entry placeholder="Type something..." .value="${this.inputText}" @changed="${(e: any) => this.inputText = e.detail.value}"></gtk-entry>
            <gtk-entry .value="Readonly value" .disabled="${true}"></gtk-entry>
          </gtk-box>
        `
      },
      {
        id: 'gtk-separator',
        title: 'GtkSeparator',
        description: 'A visual divider between widgets, helping to group related elements or separate sections.',
        code: `<gtk-separator></gtk-separator>`,
        preview: html`
          <gtk-box orientation="vertical" spacing="16">
            <gtk-label text="Section A"></gtk-label>
            <gtk-separator></gtk-separator>
            <gtk-label text="Section B"></gtk-label>
          </gtk-box>
        `
      }
    ];

    return widgets.map(w => html`
      <div id="${w.id}">
        <div class="widget-detail">
          <div class="card">
            <div class="card-title">${w.title} <span class="card-meta">Core Component</span></div>
            <div class="card-description">${w.description}</div>
            
            <div style="margin-top: 10px; border: 1px solid var(--gtk-border-color); border-radius: 8px; padding: 32px; background: var(--gtk-window-bg); overflow: hidden">
              ${w.preview}
            </div>
          </div>

          <div class="card">
            <div class="card-title">Usage Example</div>
            <div class="code-block"><code>${w.code}</code></div>
          </div>
        </div>
      </div>
    `);
  }
}
