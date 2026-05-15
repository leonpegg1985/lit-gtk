import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { GtkElement } from './base-element';

/**
 * GtkSwitch is a binary toggle button that mimics GtkSwitch.
 * 
 * @element gtk-switch
 * @fires state-set - Dispatched when the switch state is toggled.
 */
@customElement('gtk-switch')
export class GtkSwitch extends GtkElement {
  /**
   * Whether the switch is in the 'off' (false) or 'on' (true) state.
   */
  @property({ type: Boolean }) active = false;

  static styles = [
    ...GtkElement.styles,
    css`
      :host {
        width: 48px;
        height: 26px;
        cursor: pointer;
      }
    `
  ];

  protected requestRender() {
    const dpr = window.devicePixelRatio || 1;
    this.renderer.render({
      id: this.elementId,
      type: 'switch',
      props: { active: this.active },
      theme: this.getThemeProps(),
      width: 48 * dpr,
      height: 26 * dpr
    });
  }

  toggle() {
    this.active = !this.active;
    this.dispatchEvent(new CustomEvent('state-set', { 
      detail: { active: this.active },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <canvas width="48" height="26"></canvas>
      <div 
        class="semantic-layer" 
        @click=${this.toggle}
        role="switch"
        aria-checked="${this.active}"
        tabindex="0"
        @keydown=${(e: KeyboardEvent) => e.key === ' ' || e.key === 'Enter' ? this.toggle() : null}
      ></div>
    `;
  }
}
