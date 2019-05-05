import { RpcCaller } from '../../src/rpc'

document.querySelector('#discover').addEventListener('click', async () => {
  const rpcCaller = new RpcCaller()
  const CoreCube: any = await rpcCaller.makeMirror('CoreCube')

  const cube = await CoreCube.discover()

  document.querySelector('#forward').addEventListener('click', () => {
    cube.move([70, 70], 500)
  })
  document.querySelector('#backward').addEventListener('click', () => {
    cube.move([-70, -70], 500)
  })
})
