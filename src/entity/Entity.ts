interface DataFlag {
    name: string;
    flag: number;
    generic: boolean;
}

export default class Entity {
    public name: string | null;
    public dataFlags: Array<DataFlag>;
    public pitch: Number = 0;
    public nbt: string | null = null;
    
    constructor() {
        this.name = 'I ned to d0 dis';
        this.dataFlags = [];
        this.pitch = 69.42;
        this.nbt = 'k;exde;n0u={data}'; // Will change to proper nbt class
    }
}
