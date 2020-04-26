class Vector3 {
    public x: number;
    public y: number;
    public z: number;

    constructor (x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * Add a vector 3
     * @param vector Add a vector3 to the current vector
     */
    public add(vector: Vector3): Vector3 {
        return new Vector3(this.x + vector.x, this.y + vector.y, this.z + vector.z);
    }


    public subtract(vector: Vector3): Vector3 {
        return new Vector3(this.x - vector.x, this.y - vector.y, this.z - vector.z);
    }
    
    public scale(amt: number | Vector3): Vector3 {
        if (amt instanceof Vector3) {
            return new Vector3(this.x * amt.x, this.y * amt.y, this.z * amt.z);
        } else {
            return new Vector3(this.x * amt, this.y * amt, this.z * amt);
        }
    }

    /**
     * To do
     */
    public dot(): Vector3 {
        return this;
    }

    public distance(vector: Vector3): number {
        return Math.sqrt(this.distanceSquared(vector));
    }

    public distanceSquared(vector: Vector3): number {
        return ((this.x - vector.x) ^ 2) + ((this.x - vector.y) ^ 2) + ((this.z - vector.z) ^ 2);
    }
}