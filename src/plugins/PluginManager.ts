import * as fs from 'fs';
import * as path from 'path';
import { Plugin } from './Plugin';
import Server from '../Server';

class PluginManager {
    public enabled: Map<String, Plugin> = new Map();
    public disabled: Map<String, Plugin> = new Map();
    private server: Server;

    constructor(server: Server) {
        this.server = server;
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