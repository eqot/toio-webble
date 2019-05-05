export default class RpcCallee {
  targetWindow: Window

  constructor() {
    window.addEventListener('message', this.handleMessage.bind(this))
  }

  public async sendMessage(message: string) {
    this.targetWindow.postMessage(message, '*')
  }

  public async handleMessage(message: any) {
    if (!this.targetWindow) {
      this.targetWindow = message.source
    }

    console.log(message)

    switch (message.data) {
      case 'ping':
        return this.sendMessage('pong')
    }
  }
}
