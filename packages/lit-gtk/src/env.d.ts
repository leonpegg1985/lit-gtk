declare module "*?worker&inline" {
  class InlineWorker extends Worker {
    constructor();
  }
  export default InlineWorker;
}
