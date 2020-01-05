import { id } from '../EntityIdentifiers.json'
import GamePacket from './GamePacket'

export default class AvailableEntityIdentifiers extends GamePacket {

  private tag: string = Buffer.from(id, 'base64').toString()

  protected encodeBody() {
    this.getStream().append(this.tag)
  }

}
