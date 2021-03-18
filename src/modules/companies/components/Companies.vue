<template>
    <div>
        <div v-if="status === 'loaded'">
            <CompaniesFilter></CompaniesFilter>

            <CompaniesList></CompaniesList>
        </div>

        <div v-else-if="status === 'failed'">
            Error Loading Data
        </div>

        <div v-else>
            <div class="progress">
                <div class="progress-bar progress-bar-striped"
                     role="progressbar"
                     style="width: 100%"
                     aria-valuenow="10"
                     aria-valuemin="0"
                     aria-valuemax="100">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import CompaniesFilter from './CompaniesFilter.vue';
    import CompaniesList from './CompaniesList.vue';

    export default {
        computed: {
            ...mapGetters('Companies', ['status']),
        },

        mounted() {
            this.$store.dispatch('Companies/fetch');
        },

        components: {
            CompaniesFilter,
            CompaniesList
        },

    }
</script>