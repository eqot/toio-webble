import RpcCaller from './caller'

export default class Mirror {
  public static getAttributes(targetObject: any) {
    const functions = []
    const values = []
    for (const key in targetObject) {
      if (typeof targetObject[key] === 'function') {
        functions.push(key)
      } else {
        values.push(key)
      }
    }
    return { functions, values }
  }

  public static makeMirror(
    rpc: RpcCaller,
    objectName: string,
    attributes: any
  ) {
    const mirror = {}

    for (const functionName of attributes.functions) {
      mirror[functionName] = async (...args: any) => {
        console.log(`${functionName}() is called with ${args}`)

        const receivedArgs = (await rpc.sendCommand('invoke', {
          objectName,
          functionName,
          args
        }))[0]
        console.log(receivedArgs)

        return receivedArgs
      }
    }

    return mirror
  }
}
