import Vue from 'vue';
import Vuex from 'vuex';
import Companies from './modules/companies/store/CompaniesStore';

Vue.use(Vuex);

export default new Vuex.Store({
    strict: true,

    modules: {
        Companies,
    },

    getters: {
        baseUrl() {
            return process.env.API_URL || '/';
        }
    }
});