import { Plugin } from "./Plugin";
import Server from "@/Server";
import PluginSettings from "./PluginSettings";
import PluginManager from "./PluginManager";
import { Logger } from "@/utils";

class PluginBase implements Plugin {
    public server: Server;
    public dataDir: string;
    public plugins: PluginManager;
    public settings: PluginSettings;
    public logger: Logger;

    constructor(server: Server, manager: PluginManager, dataDir: string, settings: PluginSettings) {
        this.server = server;
        this.plugins = manager;
        this.dataDir = dataDir;
        this.settings = settings;
        this.logger = new Logger(settings.name);
    }

    onEnable(): any {

    }

    onDisable(): any {

    }

    onReload(): any {
        return;
    }

}

export default PluginBase;