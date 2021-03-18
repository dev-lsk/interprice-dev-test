import Vue from "vue"
import dateFormat from './dateFormat';
import companyValue from './companyValue';

Vue.filter('dateFormat', dateFormat);
Vue.filter('companyValue', companyValue);