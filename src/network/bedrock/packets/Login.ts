import Protocol from '@/network/bedrock/Protocol'
import { BinaryStream } from '@/utils'
import { decodeJWT } from '@/utils/JWT'
import GamePacket from './GamePacket'

export interface LoginChainData {
  chain: string[],
}

export default class Login extends GamePacket {

  public protocol: number

  public chainData: LoginChainData = {chain: []}
  public clientData: any

  public username: string | null = null
  public clientUUID: string | null = null
  public xuid: string | null = null
  public publicKey: string | null = null

  public clientId: number | null = null
  public serverAddress: string | null = null

  constructor(stream: BinaryStream) {
    super(Protocol.LOGIN, stream)

    this.protocol = this.getStream().readInt()

    const str = this.getStream().readString()
    const loginStream = new BinaryStream(str)
    if(!loginStream.length) return
    const rawChainData = loginStream.read(loginStream.readLInt())
    this.chainData = JSON.parse(rawChainData.toString())

    this.chainData.chain.forEach(token => {
      const payload = decodeJWT(token)
      console.log(payload);
      if(payload.extraData) {
        if(payload.extraData.displayName) {
          this.username = payload.extraData.displayName
        }

        if(payload.extraData.identity) {
          this.clientUUID = payload.extraData.identity
        }

        if(payload.extraData.XUID) {
          this.xuid = payload.extraData.XUID
        }

        if(payload.identityPublicKey) {
          this.publicKey = payload.identityPublicKey
        }
      }
    })

    const rawClientData = loginStream.read(loginStream.readLInt())
    this.clientData = decodeJWT(rawClientData.toString())

    if(this.clientData.ClientRandomId) this.clientId = this.clientData.ClientRandomId
    if(this.clientData.ServerAddress) this.serverAddress = this.clientData.ServerAddress
  }

}
