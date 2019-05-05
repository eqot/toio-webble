import { RpcCaller } from '../../src/rpc'

const rpcCaller = new RpcCaller(window.parent)

document.querySelector('#discover').addEventListener('click', async () => {
  rpcCaller.ping()
})
