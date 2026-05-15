import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { GtkElement } from './base-element';

/**
 * GtkLabel is a widget for displaying text. It mimics GtkLabel.
 * 
 * @element gtk-label
 */
@customElement('gtk-label')
export class GtkLabel extends GtkElement {
  /**
   * The text to display.
   */
  @property({ type: String }) text = '';

  /**
   * Whether the text should be rendered with a bold font weight.
   */
  @property({ type: Boolean }) bold = false;

  /**
   * Apply title styling (larger font, heavier weight) consistent with Adwaita titles.
   */
  @property({ type: Boolean }) isTitle = false;

  static styles = [
    ...GtkElement.styles,
    css`
      :host {
        display: inline-block;
        min-height: 20px;
        vertical-align: middle;
      }
    `
  ];

  protected requestRender() {
    const rect = this.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.renderer.render({
      id: this.elementId,
      type: 'label',
      props: { text: this.text, bold: this.bold, isTitle: this.isTitle },
      theme: this.getThemeProps(),
      width: rect.width * dpr || 100,
      height: rect.height * dpr || 20
    });
  }

  render() {
    return html`
      <canvas style="width: 100%; height: 100%"></canvas>
      <span class="semantic-layer" aria-label=${this.text}>
        ${this.text}
      </span>
    `;
  }
}
