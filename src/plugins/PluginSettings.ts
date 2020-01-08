import * as fs from 'fs';
import YAML from 'yamljs';

export default class PluginSettings {
    public name: string;
    public entryPoint: string | null;
    public authors: string;
    public api: Number | Array<Number>;
    public version: string | '1.0.0';
    public private: boolean;

    /**
     * Initialize settings
     * @param settings - String of file plugin.yml
     */
    constructor(loaded: string) {
        const settings: any = YAML.load(loaded);
        this.name = settings.name || 'GenericPlugin';
        this.entryPoint = settings.main || 'plugin.js';
        this.authors = (!settings.authors) ? 'BedrockJS' : (settings.authors instanceof Array) ? settings.authors.join(', ') : settings.authors;
        this.api = settings.api || 1.0;
        this.version = settings.version || '1.0.0';
        this.private = settings.private || false;
    }

    getEntryPoint(): string {
        return '/src/' + this.entryPoint;
    }
}