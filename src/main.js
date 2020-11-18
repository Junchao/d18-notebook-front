import Vue from 'vue'
import VueRouter from 'vue-router'

import app from './app'
import homeComp from './components/home'
import notesComp from './components/notes'
import noteComp from './components/note'
import writingComp from './components/writing'
import aboutComp from './components/about'
import searchComp from './components/search'
import auth from './components/auth'

Vue.use(VueRouter);

const Routes = [
    {
        path: '/',
        name: 'home',
        component: homeComp
    },
    {
        path: '/notes',
        name: 'notes',
        component: notesComp
    },
    {
        path: '/note/:noteID',
        name: 'note',
        component: noteComp
    },
    {
        path: '/writing',
        name: 'writing',
        component: writingComp
    },
    {
        path: '/about',
        name: 'about',
        component: aboutComp
    },
    {
        path: '/search',
        name: 'search',
        component: searchComp
    },
    {
        path: '/auth',
        name: 'auth',
        component: auth
    }
];

const Router = new VueRouter(
    {routes: Routes}
);

new Vue(
    {
        el: '#app',
        router: Router,
        render: h => h(app)
    }
);