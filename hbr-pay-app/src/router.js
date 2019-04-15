import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Login from './components/Login.vue';
import Signup from './components/Signup.vue';
import Signout from './components/Signout.vue';
import Payment from './components/Payment.vue';
import { Auth } from 'aws-amplify';

Vue.use(Router);

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        guest: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        guest: true
      }
    },
    {
      path: '/signout',
      name: 'signout',
      component: Signout,
      meta: {
        guest: true
      }
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup,
      meta: {
        guest: true
      }
    },
    {
      path: '/home2',
      name: 'home2',
      component: Home,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/pay',
      name: 'pay',
      component: Payment,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ './views/About.vue'),
      meta: {
        requiresAuth: true,
        is_admin: true
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    Auth.currentAuthenticatedUser()
      .then(user => {
        //TODO check role
        console.log('err', user);
        next();
      })
      .catch(err => {
        console.log('err', err);
        next({
          path: '/login',
          params: { nextUrl: to.fullPath }
        });
      });
    // } else if (to.matched.some(record => record.meta.guest)) {
    //     next()
  } else {
    next();
  }
});

export default router;
