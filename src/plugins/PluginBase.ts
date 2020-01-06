import { Plugin } from "./Plugin";
import Server from "@/Server";
import PluginSettings from "./PluginSettings";
import PluginManager from "./PluginManager";
import { Logger } from "@/utils";

class PluginBase implements Plugin {
    public server: Server;
    private manager: PluginManager;
    private dataDir: string;
    private settings: PluginSettings;

    constructor(server: Server, manager: PluginManager, dataDir: string, settings: PluginSettings) {
        this.server = server;
        this.manager = manager;
        this.dataDir = dataDir;
        this.settings = settings;
    }

    onEnable(): any {

    }

    onDisable(): any {

    }

    onReload(): any {
        return;
    }

    getName(): string {
        return this.settings.getName();
    }

    getLogger(): Logger {
        return this.server.getLogger();
    }

}

export default PluginBase;