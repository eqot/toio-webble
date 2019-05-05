export default class RpcCallee {
  targetWindow: Window

  resolves: { [key: string]: (any) => any } = {}

  constructor() {
    this.receiveCommand(this.handleCommand.bind(this))
  }

  public async sendMessage(message: string) {
    this.targetWindow.postMessage(message, '*')
  }

  public receiveMessage(listener: any) {
    window.addEventListener('message', (message: any) => {
      if (!this.targetWindow) {
        this.targetWindow = message.source
      }

      listener(message.data)
    })
  }

  public async sendCommand(command, ...args) {
    return new Promise(resolve => {
      this.resolves[command] = resolve

      const message = JSON.stringify([command, ...args])
      this.sendMessage(message)
    })
  }

  public receiveCommand(listener?: any) {
    this.receiveMessage((message: any) => {
      const [command, ...args] = JSON.parse(message)

      if (listener) {
        listener(command, args)
      }

      if (this.resolves[command]) {
        this.resolves[command](args)
        this.resolves[command] = null
      }
    })
  }

  public async handleCommand(command, args) {
    switch (command) {
      case 'ping':
        return this.sendCommand('ping', 'pong')
    }
  }
}
