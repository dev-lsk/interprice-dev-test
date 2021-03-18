import Company from '../models/Company'
import CompanyValues from '../models/CompanyValues'
import CompanyQuote from '../models/CompanyQuote'

export default class {
    constructor() {
        this.companies = [];
        this.list = [];
        this.currencies = [];
        this.years = {};
        this.totals = {};
        this.minimal = {};
        this.disabledYears = {};
        this.filter = {
            name: '',
            sort: {
                field: 'dateSent',
                asc: true
            },
            display: 'Spread',
            currency: 'USD',
        };
    }

    load(data) {
        for (let item of data) {
            let company = new Company(item.Id, item.Company, item.DateSent, item.Preferred);

            if (item.Quote) {
                this.initQuotes(company, item.Quote);
            }

            this.companies.push(company);
            this.list.push(company);
        }

        this.sort();
    }

    initQuotes(company, quotes) {
        let others = {};

        for (let item of quotes) {
            if (!this.validateQuote(item)) {
                continue;
            }

            let couponType = item.CouponType.toLowerCase();
            const displayValues = {
                Spread: item.Spread,
                Yield: item.Yield,
                '3MLSpread': item['3MLSpread'],
            };

            const quote = new CompanyQuote(item.Amount, item.Currency, item.Years, couponType, displayValues);

            company.quotes.push(quote);

            if (this.currencies.indexOf(quote.currency) === -1) {
                this.currencies.push(quote.currency);
            }

            this.updateQuote(company, quote, others);
        }

        company.others = Object.values(others);
    }

    validateQuote(quote) {
        if (quote.CouponType !== 'FIX' && quote.CouponType !== 'FRN') {
            console.error('Invalid coupon type: ' + quote.CouponType);

            return false;
        }

        return true;
    }

    updateQuote(company, quote, others) {
        if (this.filter.currency === quote.currency) {
            this.years[quote.years] = this.disabledYears[quote.years] !== true;

            for (const [display, displayValue] of Object.entries(quote.displayValues)) {
                if (this.years[quote.years] && displayValue) {
                    if (display === this.filter.display) {
                        company.hasCurrent = true;

                        this.incCompanyValues(company.current, quote.years, quote.couponType, displayValue);

                        this.incCompanyValues(this.totals, quote.years, quote.couponType, displayValue);

                        this.updMinimalValues(quote.years, quote.couponType, displayValue);
                    } else {
                        if (!others[display]) {
                            others[display] = {
                                display: display,
                                values: {}
                            };
                        }

                        this.incCompanyValues(others[display].values, quote.years, quote.couponType, displayValue);
                    }
                }
            }
        }
    }

    update() {
        this.list = [];
        this.years = {};
        this.totals = {};
        this.minimal = {};

        for (let company of this.companies) {
            if (!this.checkName(company.name)) {
                continue;
            }

            let others = {};
            company.current = {};

            for (let quote of company.quotes) {
                company.hasCurrent = false;

                this.updateQuote(company, quote, others);
            }

            company.others = Object.values(others);

            this.list.push(company);
        }

        this.sort();
    }

    search() {
        this.list = [];

        for (let company of this.companies) {
            if (this.checkName(company.name)) {
                this.list.push(company);
            }
        }

        this.sort();
    }

    checkName(name) {
        let search = this.filter.name ? this.filter.name.toUpperCase() : null;

        return !search || name.toUpperCase().indexOf(search) !== -1;
    }

    incCompanyValues(obj, years, couponType, value) {
        if (!obj[years]) {
            obj[years] = new CompanyValues();
        }

        obj[years].inc(couponType, value);
    }

    updMinimalValues(years, couponType, value) {
        if (!this.minimal[years]) {
            this.minimal[years] = new CompanyValues();
        }

        if (!this.minimal[years][couponType].sum || this.minimal[years][couponType].sum > value) {
            this.minimal[years][couponType].sum = value;
        }
    }

    sort() {
        let isAsc = this.filter.sort.asc;
        let field = this.filter.sort.field;

        this.list.sort(function (a, b) {
            if (b.hasCurrent && !a.hasCurrent) {
                return 1;
            }

            if (field === 'dateSent') {
                if (a.dateSent && b.dateSent) {
                    if (b.dateSent > a.dateSent) {
                        return isAsc ? 1 : -1;
                    } else if (b.dateSent < a.dateSent) {
                        return isAsc ? -1 : 1;
                    }
                } else if (b.dateSent || a.dateSent) {
                    return b.dateSent ? 1 : -1;
                }
            }

            if (field === 'name') {
                if (b.name !== a.name) {
                    return ((b.name > a.name && isAsc) || (b.name < a.name && !isAsc)) ? 1 : -1;
                }
            }

            if (b.isPreferred || a.isPreferred) {
                return b.isPreferred ? 1 : -1;
            }

            return b.name > a.name;
        });
    }
}