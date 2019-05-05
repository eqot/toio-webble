export default class RpcCaller {
  targetWindow: Window

  resolves: { [key: string]: (any) => any } = {}

  constructor() {
    this.receiveCommand()

    this.findTargetWindow()
  }

  private async findTargetWindow() {
    for (let i = 1; i < 3; i++) {
      let parents = []
      for (let j = 0; j < i; j++) {
        parents.push('parent')
      }
      const target = window[parents.join('.')]
      if (!target) {
        break
      }

      this.targetWindow = target
      const result = await this.sendCommand('ping', 'foo')
      if (result) {
        break
      }
    }
  }

  public async sendMessage(message: string) {
    this.targetWindow.postMessage(message, '*')
  }

  public receiveMessage(listener: any) {
    window.addEventListener('message', (message: any) => {
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

  public async ping() {
    return this.sendCommand('ping')
  }
}
