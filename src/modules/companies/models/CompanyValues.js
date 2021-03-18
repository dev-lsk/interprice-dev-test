export default class {
    constructor() {
        this.fix = {
            count: 0,
            sum: 0
        };

        this.frn = {
            count: 0,
            sum: 0
        };
    }

    inc(type, sum, count = 1) {
        if (type === 'fix' || type === 'frn') {
            this[type].sum += sum;
            this[type].count += count;
        }
    }
}