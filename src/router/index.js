import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/uploadDocument';
import Archive from '../views/archive';
import Login from '../views/login';
import LocalStorageResource from '../services/localStorage';

const localStorage = new LocalStorageResource();

Vue.use(VueRouter);

function requireAuth (to, from, next) {
    const publicPages = ['/login'];
    const authRequired = !publicPages.includes(to.path);
    localStorage.GetValue('token').then((res)=> {
        const token = res;
        if (authRequired && !token) {
            return next({
                path: '/login',
                query: { returnUrl: to.path }
            });
        }
        else {
            Vue.http.headers.common['X-Jobrouter-Authorization'] = 'Bearer ' + token;
            next();
        }
    });
}

const routes = [
    {
        path: '/',
        name: 'upload-document',
        component: Home,
        beforeEnter: requireAuth
    },
    {
        path: '/archive',
        name: 'archive',
        component: Archive
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    //used for mode: 'history'
    // {
    //     path: '*',
    //     redirect: '/'
    // }
];

//history mode doesn't work correctly with office-add-in url's frame
//path: "/taskpane.html"
//fullPath: "/taskpane.html?et="

const router = new VueRouter({
   // mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router
