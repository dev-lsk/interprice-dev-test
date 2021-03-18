import CompaniesParser from '../parsers/CompaniesParser'

export default {
    namespaced: true,

    actions: {
        async fetch({commit}) {
            try {
                let res = await fetch('/data.json');
                let json = await res.json();

                commit('SET_LOADED', json.Items);
            } catch (e) {
                commit('SET_FAILED', e);
            }
        },

        changeYears({commit}, year) {
            commit('CHANGE_YEARS', year);
        },

        changeCurrency({commit}, currency) {
            commit('SET_CURRENCY', currency);
        },

        changeDisplayValue({commit}, value) {
            commit('SET_DISPLAY_VALUE', value);
        },

        changeSort({commit}, sort) {
            commit('SET_SORT', sort);
        },

        search({commit}, name) {
            commit('SEARCH', name);
        },

        open({commit}, index) {
            commit('OPEN', index);
        }
    },

    mutations: {
        SET_LOADED(state, data) {
            state.data = data;

            state.list = CompaniesParser.run(state.data, state.dict, state.filter);

            state.status = 'loaded';
        },

        SET_FAILED(state, e) {
            console.error(e);

            state.status = 'failed';
        },

        CHANGE_YEARS(state, year) {
            state.dict.disabledYears[year] = state.dict.years[year];

            state.list = CompaniesParser.run(state.data, state.dict, state.filter);
        },

        SET_CURRENCY(state, currency) {
            state.filter.currency = currency;

            state.list = CompaniesParser.run(state.data, state.dict, state.filter);
        },

        SET_DISPLAY_VALUE(state, value) {
            state.filter.display = value;

            state.list = CompaniesParser.run(state.data, state.dict, state.filter);
        },

        SEARCH(state, name) {
            state.filter.name = name;

            state.list = CompaniesParser.run(state.data, state.dict, state.filter);
        },

        SET_SORT(state, sort) {
            if (state.filter.sort.field === sort) {
                state.filter.sort.asc = !state.filter.sort.asc;
            } else {
                state.filter.sort.field = sort;
                state.filter.sort.asc = true;
            }

            state.list = CompaniesParser.run(state.data, state.dict, state.filter);
        },

        OPEN(state, index) {
            state.list[index].isOpen = !state.list[index].isOpen;
        }
    },

    state: {
        status: null,
        data: [],
        list: [],
        dict: {
            displayValues: ['Spread', 'Yield', '3MLSpread'],
            currencies: [],
            years: {},
            disabledYears: {},
            totals: {}
        },
        filter: {
            name: '',
            sort: {
                field: 'dateSent',
                asc: true
            },
            display: 'Spread',
            currency: 'USD',
        }
    },

    getters: {
        list(state) {
            return state.list;
        },

        status(state) {
            return state.status;
        },

        currencies(state) {
            return state.dict.currencies;
        },

        displayValues(state) {
            return state.dict.displayValues;
        },

        years(state) {
            return state.dict.years;
        },

        totals(state) {
            return state.dict.totals;
        },

        filter(state) {
            return state.filter;
        },

        name(state) {
            return state.filter.name;
        },
    }
}