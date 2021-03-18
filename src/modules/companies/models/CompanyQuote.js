export default class {
    constructor(amount, currency, years, couponType, displayValues) {
        this.amount = amount;
        this.currency = currency;
        this.years = years;
        this.couponType = couponType.toLowerCase();
        this.displayValues = displayValues;
    }
}