import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { GtkElement } from './base-element';

/**
 * GtkEntry is a single-line text entry widget mimicking GtkEntry.
 * 
 * @element gtk-entry
 * @fires changed - Dispatched on every input event with current value.
 */
@customElement('gtk-entry')
export class GtkEntry extends GtkElement {
  /**
   * The current text value of the entry.
   */
  @property({ type: String }) value = '';

  /**
   * Grayed-out placeholder text shown when the entry is empty.
   */
  @property({ type: String }) placeholder = '';

  static styles = [
    ...GtkElement.styles,
    css`
      input {
        font-family: var(--gtk-font-family);
        font-size: 14px;
        padding: 6px 12px;
        border-radius: var(--gtk-radius);
        border: 1px solid var(--gtk-input-border);
        background: var(--gtk-input-bg);
        color: var(--gtk-input-fg);
        width: 100%;
        box-sizing: border-box;
        transition: border-color 0.15s ease, box-shadow 0.15s ease;
        min-height: 34px;
      }

      input:focus {
        outline: none;
        border-color: var(--gtk-input-focus-border);
        box-shadow: 0 0 0 3px rgba(53, 132, 228, 0.2);
      }
    `
  ];

  @property({ type: Boolean, state: true }) focused = false;

  protected requestRender() {
    const rect = this.getBoundingClientRect();
    this.renderer.render({
      id: this.elementId,
      type: 'entry',
      props: { focused: this.focused },
      theme: this.getThemeProps(),
      width: rect.width || 200,
      height: rect.height || 34
    });
  }

  _onFocus() {
    this.focused = true;
    this.requestRender();
  }

  _onBlur() {
    this.focused = false;
    this.requestRender();
  }

  _onInput(e: InputEvent) {
    this.value = (e.target as HTMLInputElement).value;
    this.dispatchEvent(new CustomEvent('changed', { 
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <canvas width="200" height="34" style="position: absolute; top: 0; left: 0; pointer-events: none; width: 100%; height: 100%"></canvas>
      <input 
        style="background: transparent; border-color: transparent;"
        type="text" 
        .value=${this.value} 
        placeholder=${this.placeholder}
        @input=${this._onInput}
        @focus=${this._onFocus}
        @blur=${this._onBlur}
      />
    `;
  }
}
