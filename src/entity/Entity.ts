import { Vector3 } from "math3d";

interface DataFlag {
    name: string;
    flag: number;
    generic: boolean;
}

export default class Entity {
    public name: string | null;
    public dataFlags: Array<DataFlag>;
    public pitch: number = 0;
    public nbt: string | null = null;
    public networkId: number;
    public position = [0,0,0]; // Will be position soon:tm:
    private __pathEntity: Entity | null = null;
    
    constructor() {
        this.name = 'I ned to d0 dis';
        this.dataFlags = [];
        this.pitch = 69.42;
        this.nbt = 'k;exde;n0u={data}'; // Will change to proper nbt class
        this.networkId = -1;
    }

    public startPathFinding(entity: Entity, maxDistance: number = 20) {
        this.__pathEntity = entity;

        if (this.canSee(entity) && this.isNear(entity, maxDistance)) {

        }
    }

    public isPathFinding(entity: Entity) {

    }

    public canSee(position: any/*Position*/) {
        return true;
    }

    public isNear(position: any, maxDistance: number) {
        return false;
    }
}
