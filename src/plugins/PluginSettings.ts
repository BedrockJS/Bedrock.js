import * as fs from 'fs';
import YAML from 'yamljs';

export default class PluginSettings {
    private name: string;
    private entryPoint: string | null;
    private authors: string;
    private api: Number | Array<Number>;
    private version: string | '1.0.0';
    private private: boolean;

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

    getName(): string {
        return this.name;
    }

    getAuthors(): string {
        return this.authors;
    }

    getEntryPoint(): string {
        return '/src/' + this.entryPoint;
    }

    getAPI(): Number | Array<Number> {
        return this.api;
    }

    isPrivate(): boolean {
        return this.private;
    }
}