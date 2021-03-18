<template>
    <div id="app">
        <div class="container">
            <h1 class="mb-4">InterPrice Technologies Developer Test</h1>

            <Companies></Companies>
        </div>
    </div>
</template>

<script>
    import 'bootstrap/dist/css/bootstrap.min.css';
    import 'font-awesome/css/font-awesome.css';
    import Companies from './modules/companies/components/Companies.vue';

    export default {
        name: 'App',
        components: {
            Companies
        }
    }
</script>
