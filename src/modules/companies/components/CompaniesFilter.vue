<template>
    <div>
        <div class="mb-4">
            <div class="btn-group me-5">
                <button type="button"
                        class="btn btn-outline-primary"
                        v-for="currency in currencies"
                        v-bind:key="currency"
                        v-bind:class="{active: filter.currency === currency}"
                        v-on:click="changeCurrency(currency)">
                    {{currency}}
                </button>
            </div>

            <div class="btn-group me-5">
                <button type="button"
                        class="btn btn-outline-primary"
                        v-for="(isActive, year) in years"
                        v-bind:class="{active: isActive}"
                        v-bind:key="year"
                        v-on:click="changeYears(year)">
                    {{year}} YRS
                </button>
            </div>

            <div class="btn-group">
                <button type="button"
                        class="btn btn-outline-primary"
                        v-for="value in displayValues"
                        v-bind:key="value"
                        v-bind:class="{active: filter.display === value}"
                        v-on:click="changeDisplayValue(value)">
                    {{value}}
                </button>
            </div>
        </div>

        <div class="mb-4">
            <input type="text"
                   class="form-control"
                   v-model="search"
                   placeholder="Filter by company name ..." />
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';

    export default {
        computed: {
            ...mapGetters('Companies', ['filter', 'years', 'displayValues', 'currencies']),

            search: {
                get() {
                    return this.filter.name;
                },
                set(value) {
                    return this.$store.dispatch('Companies/search', value)
                }
            }
        },

        methods: {
            ...mapActions('Companies', ['setName', 'changeYears', 'changeDisplayValue', 'changeCurrency']),
        }

    }
</script>