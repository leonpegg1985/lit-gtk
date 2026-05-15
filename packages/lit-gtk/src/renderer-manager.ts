/**
 * RendererManager handles the communication between GtkElements and the rendering worker.
 * it manages the lifecycle of OffscreenCanvas registrations and draw call scheduling.
 * Follows the Singleton pattern.
 */
export class RendererManager {
  private static instance: RendererManager;
  private worker: Worker;

  private constructor() {
    this.worker = new Worker(new URL('./render.worker.ts', import.meta.url), {
      type: 'module'
    });
  }

  /**
   * Returns the global instance of the RendererManager.
   */
  static getInstance() {
    if (!RendererManager.instance) {
      RendererManager.instance = new RendererManager();
    }
    return RendererManager.instance;
  }

  /**
   * Registers a canvas for a specific element ID.
   * @param id Unique element identifier.
   * @param canvas The OffscreenCanvas to transfer to the worker.
   */
  registerCanvas(id: string, canvas: OffscreenCanvas) {
    this.worker.postMessage({
      type: 'REGISTER_CANVAS',
      payload: { id, canvas }
    }, [canvas]);
  }

  /**
   * Sends a render request to the worker.
   * @param payload Object containing draw instructions and properties.
   */
  render(payload: any) {
    this.worker.postMessage({
      type: 'RENDER',
      payload
    });
  }

  /**
   * Notifies the worker that an element has been resized.
   * @param id Unique element identifier.
   * @param width New width in pixels.
   * @param height New height in pixels.
   */
  resize(id: string, width: number, height: number) {
    this.worker.postMessage({
      type: 'RESIZE',
      payload: { id, width, height }
    });
  }
}
