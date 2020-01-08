import PluginManager from "./PluginManager"
import PluginSettings from "./PluginSettings"
import Server from "../Server";
import { Logger } from "@/utils";

export interface Plugin {

    //constructor (server: Server, manager: PluginManager, dataDir: string, settings: PluginSettings): any;

    /**
     * Called when plugin is first enabled
     */
    onEnable(): any;

    /**
     * Called when a plugin is reloaded
     */
    onReload(): any;

    /**
     * Called when a plugin is disabled
     */
    onDisable(): any;
}
