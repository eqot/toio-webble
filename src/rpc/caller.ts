export default class RpcCaller {
  targetWindow: Window

  constructor(targetWindow: Window) {
    this.targetWindow = targetWindow

    window.addEventListener('message', (message: any) => {
      console.log(message)
    })
  }

  public async sendMessage(message: string) {
    this.targetWindow.postMessage(message, '*')
  }

  public async ping() {
    return this.sendMessage('ping')
  }
}
