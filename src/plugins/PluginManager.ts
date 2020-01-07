import * as fs from 'fs';
import * as path from 'path';
import { Plugin } from './Plugin';
import Server from '../Server';

class PluginManager {
    private enabled: Map<String, Plugin> = new Map();
    private disabled: Map<String, Plugin> = new Map();
    private server: Server;

    constructor(server: Server) {
        this.server = server;
        //this.server.loadPlugins(this);
    }

    public loadPlugins(directory: string): Map<String, Plugin> {
        const plugins = this.getDirectories(directory);
        const self = this;

        return this.enabled;
    }

    /**
     * enablePlugin
     */

    public enablePlugin(pl: Plugin) {

    }

    public disablePlugin(pl: Plugin) {

    }

    public getPlugin(plugin: string) {

    }

    private getDirectories(path: string): Array<String> {
        return fs.readdirSync(path).filter(function (file) {
            return fs.statSync(path + '/' + file).isDirectory();
        });
    }

    private getFiles(path: string) {
        return fs.readdirSync(path).filter(function (file) {
            return !fs.statSync(path + '/' + file).isDirectory();
        });
    }
}

export default PluginManager;