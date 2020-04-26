declare module 'bedrockjs' {
    // pls finish eks deee
    export interface ServerOptions {
        address?: string,
        port?: number,
        name: string,
        maxPlayers?: number,
    }

    export class Logger {
        constructor(name: string);
        
        public info(message: string, additional: string[]): void;
        public debug(message: string, additional: string[]): void;
        public error(message: string, additional: string[]): void;
        public warn(message: string, additional: string[]): void;

        private print(type: string, args: string[]): void;
    }

    export class Server {
        constructor(options: ServerOptions, bind: Boolean);

        public getLogger(): Logger;
    }
}