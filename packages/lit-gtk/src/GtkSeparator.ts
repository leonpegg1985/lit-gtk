import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { GtkElement } from './base-element';

/**
 * GtkSeparator mimics GtkSeparator, a visual divider between widgets.
 * 
 * @element gtk-separator
 */
@customElement('gtk-separator')
export class GtkSeparator extends GtkElement {
  /**
   * Layout orientation of the separator line.
   */
  @property({ type: String }) orientation: 'horizontal' | 'vertical' = 'horizontal';

  static styles = [
    ...GtkElement.styles,
    css`
      :host {
        display: block;
        background: var(--gtk-border-color);
      }
      :host([orientation="horizontal"]) {
        height: 1px;
        width: 100%;
        margin: 8px 0;
      }
      :host([orientation="vertical"]) {
        width: 1px;
        height: 100%;
        margin: 0 8px;
      }
    `
  ];

  protected requestRender() {
    const rect = this.getBoundingClientRect();
    this.renderer.render({
      id: this.elementId,
      type: 'separator',
      props: { orientation: this.orientation },
      theme: this.getThemeProps(),
      width: rect.width || (this.orientation === 'vertical' ? 1 : 100),
      height: rect.height || (this.orientation === 'horizontal' ? 1 : 100)
    });
  }

  render() {
    const isVertical = this.orientation === 'vertical';
    return html`<canvas 
      width="${isVertical ? 10 : 200}" 
      height="${isVertical ? 200 : 10}" 
      style="width: 100%; height: 100%"
    ></canvas>`;
  }
}
