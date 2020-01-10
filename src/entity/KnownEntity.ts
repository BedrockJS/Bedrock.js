import Entity from "./Entity";

enum EntityIds {
    bat = 19,
    cat = 75,
    chicken = 10,
    cod = 112,
    cow = 11,
    donkey = 24,
    fox = 1,
    giant = 1,
    horse = 1,
    mooshroom = 6,
}

class KnownEntity {
    public static NEUTRAL: Array<number> = [];
    public static PASSIVE: Array<number> = [];
    public static HOSTILE: Array<number> = [];
    public static TAMABLE: Array<number> = [];

    public static getEntityIdFor(name: string): number | null {
        return EntityIds[name.toLowerCase()] || null;
    }

    private Entity: Entity;

    constructor(entity: Entity) {
        this.Entity = entity;
    }

    public isHostile(): Boolean {
        return KnownEntity.HOSTILE.includes(this.Entity.networkId);
    }

    public isTamable(id: number): Boolean {
        return KnownEntity.TAMABLE.includes(this.Entity.networkId);
    }

    public isFriendly(): Boolean {
        if (this.canHurtOthers()) {
            return this.Entity.dataFlags.includes({ name: '', flag: 1, generic: false });
        }

        return true;
    }

    public isMonster(): Boolean {
        return KnownEntity.HOSTILE.includes(this.Entity.networkId);
    }

    public canHurtOthers(): Boolean {
        return !KnownEntity.PASSIVE.includes(this.Entity.networkId);
    }

}