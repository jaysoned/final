import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Edit from '../views/Edit.vue';
import Requests from '../views/Request.vue';
import Login from '../views/Login.vue';
import Single from '../views/Single.vue';
import MyRequests from '../views/MyRequests.vue';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import Croppa from 'vue-croppa';
import 'vue-croppa/dist/vue-croppa.css';

Vue.use(Croppa);

//import './app.scss'

Vue.use(BootstrapVue)


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: "/Edit",
    name: "Edit",
    component: Edit
  },
  {
    path: "/Requests",
    name: "Requests",
    component: Requests
  },
  {
    path: "/Login",
    name: "Login",
    component: Login
  },
  {
    path: "/Single/:id",
    name: "Single",
    component: Single
  },
  {
    path: "/MyRequests",
    name: "MyRequests",
    component: MyRequests
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
