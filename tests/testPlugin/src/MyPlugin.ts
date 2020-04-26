/*
import PluginBase from '@/plugins/PluginBase';
import Player from "@/Player";
import { Logger } from '@/utils';

class MyPlugin extends PluginBase {
    onEnable(): any {
        return this.main();
    }

    main() {
        const Logger: Logger = this.getLogger();

        this.server.on('PlayerMoveEvent', (event: any) => {
            const player: Player = event.getPlayer();
            Logger.info(player.getAddress() + ' has moved');
        })
        return;
    }
}

export default MyPlugin;
*/