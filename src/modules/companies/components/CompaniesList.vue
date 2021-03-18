<template>
    <div>
        <table v-if="list.length" class="table table-sm companies">
            <thead>
                <tr>
                    <th rowspan="2" class="companies__head-main"></th>
                    <th rowspan="2" class="companies__head-main">
                        <a href v-on:click.prevent="changeSort('dateSent')">
                            DATE SENT
                            <span class="fa" v-bind:class="getSortClass('dateSent')"></span>
                        </a>
                    </th>

                    <th rowspan="2" class="companies__head-main">
                        <a href v-on:click.prevent="changeSort('name')">
                            Company
                            <span class="fa" v-bind:class="getSortClass('name')"></span>
                        </a>
                    </th>

                    <th colspan="2" v-for="year in years" v-bind:key="'th-' + year" class="companies__head-year">
                        <div>{{year}} YRS</div>
                    </th>
                </tr>

                <tr>
                    <template v-for="year in years">
                        <th v-bind:key="'th-fix-' + year" class="companies__head">FIX</th>

                        <th v-bind:key="'th-frn-' + year" class="companies__head">FRN</th>
                    </template>
                </tr>
            </thead>

            <tbody>
                <template v-for="(item, ind) in list">
                    <tr v-bind:key="item.id" v-on:click="open(ind)">
                        <td width="20">
                            <div v-if="item.others.length">
                                <span class="fa" v-bind:class="item.isOpen ? 'fa-chevron-down': 'fa-chevron-right'"></span>
                            </div>
                        </td>

                        <td>{{item.dateSent | dateFormat}}</td>

                        <td>
                            <div class="companies__name" v-bind:class="{_active: item.hasCurrent}">{{item.name}}</div>
                        </td>

                        <template v-for="year in years">
                            <td v-bind:key="item.id + '-fix-' + year" class="companies__year">
                                <div v-if="item.current[year]">
                                    {{item.current[year].fix.sum | companyValue(filter.display)}}
                                </div>
                            </td>

                            <td v-bind:key="item.id + '-frn-' + year" class="companies__year">
                                <div v-if="item.current[year]">
                                    {{item.current[year].frn.sum | companyValue(filter.display)}}
                                </div>
                            </td>
                        </template>
                    </tr>

                    <template v-if="item.isOpen">
                        <tr v-for="(other, ind) in item.others" v-bind:key="item.id + '-' + ind">
                            <td colspan="2"></td>
                            <td>{{other.display}}</td>

                            <template v-for="year in years">
                                <td v-bind:key="item.id + other.display + '-fix-' + year" class="companies__year">
                                    <div v-if="other.values[year]">
                                        {{other.values[year].fix.sum | companyValue(other.display)}}
                                    </div>
                                </td>

                                <td v-bind:key="item.id + other.display + '-frn-' + year" class="companies__year">
                                    <div v-if="other.values[year]">
                                        {{other.values[year].frn.sum | companyValue(other.display)}}
                                    </div>
                                </td>
                            </template>
                        </tr>
                    </template>
                </template>
            </tbody>

            <tbody>
                <tr class="table-secondary">
                    <td colspan="2"></td>
                    <td>Average by {{filter.display}}</td>

                    <template v-for="year in years">
                        <td v-bind:key="'totals-fix-' + year" class="companies__year">
                            <div v-if="totals[year] && totals[year].fix && totals[year].fix.count">
                                {{(totals[year].fix.sum / totals[year].fix.count) | companyValue(filter.display)}}
                            </div>
                        </td>

                        <td v-bind:key="'totals-frn-' + year" class="companies__year">
                            <div v-if="totals[year] && totals[year].frn && totals[year].frn.count">
                                {{(totals[year].frn.sum / totals[year].frn.count) | companyValue(filter.display)}}
                            </div>
                        </td>
                    </template>
                </tr>
            </tbody>
        </table>

        <div v-else>
            Empty
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';

    export default {
        computed: {
            ...mapGetters('Companies', ['list', 'filter', 'totals']),

            years() {
                const all = this.$store.getters['Companies/years'];

                let list = [];
                for (let year in all) {
                    if (all[year]) {
                        list.push(year);
                    }
                }

                return list;
            }
        },

        methods: {
            ...mapActions('Companies', ['open', 'changeSort']),

            getSortClass(field) {
                if (this.filter.sort.field === field) {
                    return 'companies__sort-active ' + (this.filter.sort.asc ? 'fa-caret-down' : 'fa-caret-up');
                }
                return 'fa-caret-down';
            }
        }
    }
</script>

<style scoped>
    .companies__head-main {
        border-bottom: 1px solid #999;
    }
    .companies__head-main > a {
        color: #999999;
        text-decoration: none;
    }
    .companies__sort-active {
        color: #000;
    }
    .companies__head-year {
        text-align: center;
        border-bottom: none;
        padding-bottom: 0;
    }
    .companies__head-year > div {
        border-bottom: 1px solid #ccc;
        padding-bottom: 5px;
    }
    .companies__head {
        color: #999;
        border-bottom: 1px solid #999;
        font-weight: normal;
        text-align: center;
    }
    .companies__name {
        color: #ccc;
    }
    .companies__name._active {
        color: #000;
        font-weight: bold;
    }
    .companies__year {
        text-align: center;
    }
</style>