import GamePacket from './GamePacket'
import Protocol from '../Protocol'

export enum PlayStatusIndicator {
  Okay = 0,
  OutdatedClient = 1,
  OutdatedServer = 2,
  Spawned = 3,
  InvalidTenant = 4,
  EditionMismatchEdu = 5,
  EditionMismatchVanilla = 6,
  ServerFull = 7,
}

export default class PlayStatus extends GamePacket {

  private status: PlayStatusIndicator

  constructor(status: PlayStatusIndicator) {
    super(Protocol.PLAY_STATUS)

    this.status = status
  }

  protected encodeBody() {
    this.getStream().writeInt(this.status)
  }

}
