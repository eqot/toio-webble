import { RpcCaller } from '../../src/rpc'

const rpcCaller = new RpcCaller()

document.querySelector('#discover').addEventListener('click', async () => {
  const result = await rpcCaller.ping()
  console.log(result)
})
