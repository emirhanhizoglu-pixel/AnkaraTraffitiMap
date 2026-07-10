export default class Region {

    constructor(x, y, radius) {

        this.center = { x, y };
        this.radius = radius;

    }

    getHeight(x, y) {

        const dx = x - this.center.x;
        const dy = y - this.center.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > this.radius) {

            return 2;

        }

        return 80;

    }

}