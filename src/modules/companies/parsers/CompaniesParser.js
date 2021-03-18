import Company from '../models/Company'
import CompanyValues from '../models/CompanyValues'

export default {
    run(data, dict, filter) {
        let list = [];
        let search = filter.name ? filter.name.toUpperCase() : null;

        dict.currencies = [];
        dict.years = {};
        dict.totals = {};

        for (let item of data) {
            let company = new Company(item.Id, item.Company, item.DateSent, item.Preferred);

            if (item.Quote) {
                this.parseQuotes(company, item.Quote, dict, filter);
            }

            if (!search || item.Company.toUpperCase().indexOf(search) !== -1) {
                list.push(company);
            }
        }

        this.sort(list, filter.sort.field, filter.sort.asc);

        return list;
    },

    parseQuotes(company, quotes, dict, filter) {
        let others = {};

        for (let quote of quotes) {
            let currency = quote.Currency;
            let years = quote.Years;
            let couponType = quote.CouponType.toLowerCase();

            if (couponType !== 'fix' && couponType !== 'frn') {
                console.error('Invalid coupon type: ' + couponType);

                continue;
            }

            if (dict.currencies.indexOf(currency) === -1) {
                dict.currencies.push(currency);
            }

            if (filter.currency === currency) {
                dict.years[years] = dict.disabledYears[years] !== true;

                for (let display of dict.displayValues) {
                    if (dict.years[years] && quote[display]) {
                        if (display === filter.display) {
                            company.hasCurrent = true;

                            this.incCompanyValues(company.current, years, couponType, quote[display]);

                            this.incCompanyValues(dict.totals, years, couponType, quote[display]);
                        } else {
                            if (!others[display]) {
                                others[display] = {
                                    display: display,
                                    values: {}
                                };
                            }

                            this.incCompanyValues(others[display].values, years, couponType, quote[display]);
                        }
                    }
                }
            }
        }

        company.others = Object.values(others);
    },

    incCompanyValues(obj, years, couponType, value) {
        if (!obj[years]) {
            obj[years] = new CompanyValues();
        }

        obj[years].inc(couponType, value);
    },

    sort(list, field, isAsc) {
        list.sort(function (a, b) {
            if (b.hasCurrent && !a.hasCurrent) {
                return 1;
            }

            if (field === 'dateSent') {
                if (a.dateSent && b.dateSent) {
                    if (b.dateSent > a.dateSent) {
                        return isAsc ? 1 : -1;
                    } else if (a.dateSent < b.dateSent) {
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