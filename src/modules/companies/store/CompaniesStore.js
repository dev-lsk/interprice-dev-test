import CompaniesManager from '../managers/CompaniesManager'

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
            commit('TOGGLE_COMPANY', index);
        }
    },

    mutations: {
        SET_LOADED(state, data) {
            state.manager.load(data);

            state.status = 'loaded';
        },

        SET_FAILED(state, e) {
            console.error(e);

            state.status = 'failed';
        },

        CHANGE_YEARS(state, year) {
            state.manager.disabledYears[year] = state.manager.years[year];

            state.manager.update();
        },

        SET_CURRENCY(state, currency) {
            state.manager.filter.currency = currency;

            state.manager.update();
        },

        SET_DISPLAY_VALUE(state, value) {
            state.manager.filter.display = value;

            state.manager.update();
        },

        SEARCH(state, name) {
            state.manager.filter.name = name;

            state.manager.search();
        },

        SET_SORT(state, sort) {
            let filter = state.manager.filter;

            if (filter.sort.field === sort) {
                filter.sort.asc = !filter.sort.asc;
            } else {
                filter.sort.field = sort;
                filter.sort.asc = true;
            }

            state.manager.sort();
        },

        TOGGLE_COMPANY(state, index) {
            state.manager.list[index].isOpen = !state.manager.list[index].isOpen;
        }
    },

    state: {
        status: null,
        manager: new CompaniesManager(),
    },

    getters: {
        status(state) {
            return state.status;
        },

        list(state) {
            return state.manager.list;
        },

        currencies(state) {
            return state.manager.currencies;
        },

        years(state) {
            return state.manager.years;
        },

        totals(state) {
            return state.manager.totals;
        },

        filter(state) {
            return state.manager.filter;
        },

        minimal(state) {
            return state.manager.minimal;
        },
    }
}