<template>
    <tbody>

    </tbody>
</template>

<script>
    import Company from '../models/Company';
    import {mapGetters} from 'vuex';

    export default {
        data() {
            return {
                isOpen: false,
            }
        },
        computed: {
            ...mapGetters('Companies', ['filter']),
        },

        props: {
            company: Company
        }
    }
</script>

<style scoped>

</style>