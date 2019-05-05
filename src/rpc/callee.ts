import { CoreCube } from '../coreCube'
import Mirror from './mirror'

export default class RpcCallee {
  targetWindow: Window

  targetObject: any = CoreCube
  coreCube: CoreCube = null

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

      case 'makeMirror':
        return this.makeMirror()

      case 'invoke':
        return this.invoke.apply(this, args)
    }
  }

  private async makeMirror() {
    const attributes = Mirror.getAttributes(this.targetObject)

    return this.sendCommand('makeMirror', attributes)
  }

  private async invoke(params: {
    objectName: string
    functionName: string
    args: any
  }) {
    let results
    if (params.objectName === 'coreCube') {
      results = await this.coreCube[params.functionName].apply(
        this.coreCube,
        params.args
      )
    } else {
      results = await this.targetObject[params.functionName].apply(
        this.targetObject,
        params.args
      )
    }
    // console.log(params.functionName)
    console.log(results)

    if (results instanceof CoreCube) {
      this.coreCube = results

      const attributes = Mirror.getAttributes(results)
      console.log(attributes)

      return this.sendCommand('invoke', attributes)
    }

    return this.sendCommand('invoke', results)
  }
}
