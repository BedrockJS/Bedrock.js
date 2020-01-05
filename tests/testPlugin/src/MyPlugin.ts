import PluginBase from "@/plugins/Plugin";
import Player from "@/Player";
import MoveEvent from "@/events/Events";

class MyPlugin extends PluginBase {
    onEnable(): any {
        this.events.on('Build', (event: MoveEvent) => {
            event.getPlayer();
            event.getFrom();
            event.getTo();
            event.isCancelled();
            this.getLogger().log(event.getPlayer().getName() + ' has moved positions.');
        });
    }

    onDisable(): any {

    }

    onReload(): any {
        
    }
}

export default MyPlugin;