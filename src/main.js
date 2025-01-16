import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
import App from './App.vue';
import router from './router';
import store from './store';

const axiosIntance = axios.create();

axiosIntance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
      console.log("Authorization:", config.headers['Authorization']);
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
axiosIntance.defaults.baseURL = process.env.VUE_APP_API;
Vue.prototype.$axios = axiosIntance;
Vue.config.productionTip = false;
Vue.use(ElementUI);

Vue.prototype.$bus = new Vue();

new Vue({
  //el: '#app',
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
