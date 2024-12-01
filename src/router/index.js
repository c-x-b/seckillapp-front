import Vue from 'vue';
import VueRouter from 'vue-router';
import Register from '../views/Register.vue';
import HomeView from '../views/HomeView.vue';
import UserInfo from '../views/UserInfo.vue'
import Login from '../views/Login.vue';
import ProductList from '../views/ProductList.vue';
import ProductDetail from '../views/ProductDetail.vue';
//import { component } from 'vue/types/umd';

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/userinfo',
    name: 'UserInfo',
    component: UserInfo
  },
  {
    path: '/products',
    name: 'ProductList',
    component: ProductList
  },
  {
    path: '/products/:id',
    name: 'ProductDetail',
    component: ProductDetail
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
