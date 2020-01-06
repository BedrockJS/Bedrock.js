const PluginBase = require('bedrockjs').PluginBase;
class MyPlugin extends PluginBase {
    onEnable() {
        this.main();
    }

    onDisable() {
        this.getLogger().log('Sorry but disabled now :(');
    }

    onReload() {
        this.getLogger().log('Plugin is now reloaded');
    }

    main() {
        const logger = this.getLogger();
        this.server.on('PlayerMoveEvent', (event) => {
            logger.info(event.getPlayer().getName() + ' has moved positions.');
        });
    }
}

export default MyPlugin;