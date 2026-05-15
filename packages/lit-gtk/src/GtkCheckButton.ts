import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { GtkElement } from './base-element';

/**
 * GtkCheckButton mimics GtkCheckButton, a widget used to select
 * multiple options from a set of choices.
 * 
 * @element gtk-check-button
 * @fires toggled - Dispatched when the checkbox state is changed.
 */
@customElement('gtk-check-button')
export class GtkCheckButton extends GtkElement {
  /**
   * Whether the checkbox is checked.
   */
  @property({ type: Boolean }) active = false;

  /**
   * Text label to display alongside the checkbox.
   */
  @property({ type: String }) label = '';

  static styles = [
    ...GtkElement.styles,
    css`
      :host {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        user-select: none;
        font-family: var(--gtk-font-family);
        font-size: 14px;
        color: var(--gtk-button-fg);
        transition: color 0.15s ease;
        outline: none;
      }

      :host(:focus-visible) .check {
        box-shadow: 0 0 0 2px white, 0 0 0 4px var(--gtk-accent-bg);
      }

      :host(:hover) span {
        color: #2e3436;
        opacity: 0.8;
      }

      .check {
        width: 18px;
        height: 18px;
        border: 1px solid var(--gtk-border-color);
        border-radius: 4px;
        background: var(--gtk-button-bg);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
      }

      :host(:hover) .check {
        background: var(--gtk-button-hover-bg);
      }

      .check.active {
        background: var(--gtk-accent-bg);
        border-color: var(--gtk-accent-bg);
      }

      .checkmark {
        width: 10px;
        height: 5px;
        border-left: 2px solid white;
        border-bottom: 2px solid white;
        transform: rotate(-45deg) translateY(-1px);
        display: none;
      }

      .check.active .checkmark {
        display: block;
      }
    `
  ];

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('tabindex', '0');
    this.setAttribute('role', 'checkbox');
    this.addEventListener('keydown', this.handleKeydown.bind(this));
  }

  handleKeydown(e: KeyboardEvent) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      this.toggle();
    }
  }

  protected requestRender() {
    this.renderer.render({
      id: this.elementId,
      type: 'checkbox',
      props: { active: this.active },
      theme: this.getThemeProps(),
      width: 18,
      height: 18
    });
  }

  toggle() {
    this.active = !this.active;
    this.setAttribute('aria-checked', String(this.active));
    this.dispatchEvent(new CustomEvent('toggled', { 
      detail: { active: this.active },
      bubbles: true,
      composed: true
    }));
    this.requestRender();
  }

  render() {
    return html`
      <canvas width="18" height="18"></canvas>
      <div class="semantic-layer" @click=${this.toggle}></div>
      <span @click=${this.toggle}>${this.label}</span>
    `;
  }
}
