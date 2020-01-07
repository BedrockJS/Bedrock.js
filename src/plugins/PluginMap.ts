import { Plugin } from './Plugin';

class PluginMap {
    private plugins: Map<String, Plugin> = new Map();

    constructor() {
        this.plugins = new Map();
    }

    enablePlugin(plugin: Plugin): Boolean {
        try {
            plugin.onEnable();
            return true;
        } catch (e) {
            return false;
        }
    }

    getPlugins(): Array<any> {
        return Array.from(this.plugins.entries());
    }
}