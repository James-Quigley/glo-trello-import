/* eslint-disable */
import {
  MdButton,
  MdCard,
  MdField,
  MdMenu,
  MdList,
  MdApp,
  MdContent,
  MdToolbar,
  MdProgress,
} from 'vue-material/dist/components';
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/black-green-dark.css'
// import 'vue-material/dist/theme/default-dark.css'

import Vue from 'vue';
import App from './App.vue';
import store from './store';

Vue.config.productionTip = false;


Vue.use(MdButton);
Vue.use(MdCard);
Vue.use(MdField);
Vue.use(MdMenu);
Vue.use(MdList);
Vue.use(MdApp);
Vue.use(MdContent);
Vue.use(MdToolbar);
Vue.use(MdProgress);
new Vue({
  store,
  render: h => h(App),
}).$mount('#app');