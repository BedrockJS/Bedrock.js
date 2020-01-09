class KnownEntities {

    /**
     * @todo Add entity id's and actually implement them (after raknet, the thing i had no time for today).
     * I'll probably end up adding most of these functions to the entity classes themselves with the default
     * values being in inherited parent entity class.
     */

    public static NEUTRAL = {
        okay_epic_entity: 69
    };

    public static PASSIVE = {
        epic_entity: 420
    };

    public static HOSTILE = {
        not_epic_entity: 21
    };

    public static TAMABLE: Array<number> = [];

    public static isHostile(id: number): Boolean {
        return false;
    };

    public static isFriendly(id: number): Boolean {
        return [
            ...Object.values(KnownEntities.NEUTRAL),
            ...Object.values(KnownEntities.PASSIVE)
        ].includes(id);
    }

    public static isMonster(id: number): Boolean {
        return Object.values(KnownEntities.HOSTILE).includes(id);
    }

    public static canHurtOthers(id: number): Boolean {
        return !Object.values(KnownEntities.PASSIVE);
    }

    public static getEntityId(name: string): number | null {
        let check: string = name.toLowerCase();

        const allEntities = { 
            ...KnownEntities.PASSIVE,
            ...KnownEntities.HOSTILE,
            ...KnownEntities.NEUTRAL
        };

        return allEntities[name] || null;
    }

}