
export class Vector {
    Circle3(centerX, minY, centerZ, maxY, radius) {
        return new Circle3(centerX, minY, centerZ, maxY, radius);
    }

    Vector3(beginX, beginY, beginZ, endX, endY, endZ) {
        return new Vector3(beginX, beginY, beginZ, endX, endY, endZ);
    }
}

class Circle3 {
    constructor(centerX, centerY, centerZ, height, radius) {
        this.centerX = centerX;
        this.centerY = centerY;
        this.centerZ = centerZ;
        this.height = height;
        this.radius = radius;
    }

    getCylinderPoints() {
        const centerX = this.centerX;
        const centerY = this.centerY;
        const centerZ = this.centerZ;
        const height = this.height;
        const radius = this.radius;

        if(height == undefined || radius == undefined || centerX == undefined || centerY == undefined || centerZ == undefined) return "no vector";
        if(typeof radius == "string" || typeof height == "string" || typeof centerX == "string" || typeof centerY == "string" || typeof centerZ == "string") return `isString`; 

        const circlePoints = [];
        const angleStep = 0.1;
        const heightStep = height / 10;

        for (let angle = 0; angle <= 2 * Math.PI; angle += angleStep) {
            for (let h = 0; h <= height; h += heightStep) {
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + h;
                const z = centerZ + radius * Math.sin(angle);

                circlePoints.push({ x: x, y: y, z: z });
            }
        }

        return circlePoints;
    }

    isInDimension3(x, y, z) {
        const centerX = this.centerX;
        const centerY = this.centerY;
        const centerZ = this.centerZ;
        const height = this.height;
        const radius = this.radius;

        if(x == undefined || y == undefined || z == undefined || height == undefined || radius == undefined || centerX == undefined || centerY == undefined || centerZ == undefined) return "no vector";
        if(typeof x == "string" || typeof y == "string" || typeof z == "string" || typeof radius == "string" || typeof height == "string" || typeof centerX == "string" || typeof centerY == "string" || typeof centerZ == "string") return `isString`;

        const distanceToAxis = Math.sqrt((x - centerX) ** 2 + (z - centerZ) ** 2);
        const isInHeightRange = y >= centerY && y <= centerY + height;

        return distanceToAxis <= radius && isInHeightRange;
    }

    getCenter() {

        const centerX = this.centerX;
        let centerY = this.centerY
        const centerZ = this.centerZ;

        if(centerX == undefined || centerY == undefined || centerZ == undefined) return "no vector";
        if(typeof centerX == "string" || typeof centerY == "string" || typeof centerZ == "string") return `isString`;

        centerY = centerY + this.height / 2;

        return { x: centerX, y: centerY, z: centerZ };
    }
}


class Vector3 {
    constructor(beginX, beginY, beginZ, endX, endY, endZ) {
        this.beginX = beginX;
        this.beginY = beginY;
        this.beginZ = beginZ;
        this.endX = endX;
        this.endY = endY;
        this.endZ = endZ;
    }

    isInDimension3(x, y, z) {

        let beginX = this.beginX;
        let beginY = this.beginY;
        let beginZ = this.beginZ;

        let endX = this.endX;
        let endY = this.endY;
        let endZ = this.endZ;

        if (beginX == undefined || beginY == undefined || beginZ == undefined || endX == undefined || endY == undefined || endZ == undefined || x == undefined || y == undefined || z == undefined) return "no vector";
        if(typeof x == "string" || typeof y == "string" || typeof z == "string" || typeof beginX == "string" || typeof beginY == "string" || typeof beginZ == "string" || typeof endX == "string" || typeof endY == "string" || typeof endZ == "string") return "isString";

        return {bool: (x >= beginX && x <= endX && y >= beginY && y <= endY && z >= beginZ && z <= endZ), location: {x: x, y: y, z: z}};
    }

    getLinearPath() {
        const beginX = this.beginX;
        const beginY = this.beginY;
        const beginZ = this.beginZ;
        const endX = this.endX;
        const endY = this.endY;
        const endZ = this.endZ;
    
        if (beginX == undefined || beginY == undefined || beginZ == undefined || endX == undefined || endY == undefined || endZ == undefined) return "no vector";
        if(typeof beginX == "string" || typeof beginY == "string" || typeof beginZ == "string" || typeof endX == "string" || typeof endY == "string" || typeof endZ == "string") return "isString";
    
        const x1 = Math.min(beginX, endX);
        const y1 = Math.min(beginY, endY);
        const z1 = Math.min(beginZ, endZ);
        const x2 = Math.max(beginX, endX);
        const y2 = Math.max(beginY, endY);
        const z2 = Math.max(beginZ, endZ);
    
        const path = [];
    
        for (let x = x1; x <= x2; x++) {
            path.push({x: x, y: y1, z: z1});
            path.push({x: x, y: y2, z: z1});
            path.push({x: x, y: y1, z: z2});
            path.push({x: x, y: y2, z: z2});
        }
    
        for (let y = y1 + 1; y < y2; y++) {
            path.push({x: x1, y: y, z: z1});
            path.push({x: x2, y: y, z: z1});
            path.push({x: x1, y: y, z: z2});
            path.push({x: x2, y: y, z: z2});
        }
    
        for (let z = z1 + 1; z < z2; z++) {
            path.push({x: x1, y: y1, z: z});
            path.push({x: x2, y: y1, z: z});
            path.push({x: x1, y: y2, z: z});
            path.push({x: x2, y: y2, z: z});
        }
    
        return path;
    }
    
    getCenter() {
        const beginX = this.beginX;
        const beginY = this.beginY;
        const beginZ = this.beginZ;
        const endX = this.endX;
        const endY = this.endY;
        const endZ = this.endZ;

        if (beginX == undefined || beginY == undefined || beginZ == undefined || endX == undefined || endY == undefined || endZ == undefined) return "no vector";
        if(typeof beginX == "string" || typeof beginY == "string" || typeof beginZ == "string" || typeof endX == "string" || typeof endY == "string" || typeof endZ == "string") return "isString";

        const centerX = (beginX + endX) / 2;
        const centerY = (beginY + endY) / 2;
        const centerZ = (beginZ + endZ) / 2;

        return { x: centerX, y: centerY, z: centerZ };
    }
}