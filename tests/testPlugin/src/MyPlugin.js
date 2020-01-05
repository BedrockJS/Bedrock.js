const PluginBase = require('bedrockjs').PluginBase;
class MyPlugin extends PluginBase {
    onEnable() {
        this.events.on('Build', (event) => {
            this.getLogger().log(event.getPlayer().getName() + ' has moved positions.');
        });
    }

    onDisable() {
        this.getLogger().log('Sorry but disabled now :(');
    }

    onReload() {
        this.getLogger().log('Plugin is now reloaded');
    }
}

export default MyPlugin;