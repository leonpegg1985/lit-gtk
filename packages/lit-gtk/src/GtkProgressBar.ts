import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { GtkElement } from './base-element';

/**
 * GtkProgressBar is a widget for displaying the progress of a task.
 * 
 * @element gtk-progress-bar
 */
@customElement('gtk-progress-bar')
export class GtkProgressBar extends GtkElement {
  /**
   * The current progress value as a fraction between 0.0 and 1.0.
   */
  @property({ type: Number }) fraction = 0; // 0 to 1

  static styles = [
    ...GtkElement.styles,
    css`
      :host {
        height: 6px;
        width: 100%;
        display: block;
      }
    `
  ];

  protected requestRender() {
    const rect = this.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.renderer.render({
      id: this.elementId,
      type: 'progress-bar',
      props: { fraction: this.fraction },
      theme: this.getThemeProps(),
      width: rect.width * dpr || 200,
      height: rect.height * dpr || 6
    });
  }

  render() {
    return html`
      <canvas style="width: 100%; height: 100%"></canvas>
      <div 
        class="semantic-layer"
        role="progressbar"
        aria-valuenow=${this.fraction * 100}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        ${Math.round(this.fraction * 100)}%
      </div>
    `;
  }
}
