import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () =>
    import ('../components/Login')
const Home = () =>
    import ('../components/Home')
const Welcome = () =>
    import ('../components/Welcome')
const Users = () =>
    import ('../components/users/Users.vue')
const Rights = () =>
    import ('../components/power/Rights.vue')
const Roles = () =>
    import ('../components/power/Roles.vue')
const Cate = () =>
    import ('../components/goods/Cate.vue')
const Params = () =>
    import ('../components/goods/Params.vue')

Vue.use(VueRouter)

const routes = [{
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/home',
        component: Home,
        redirect: '/welcome',
        children: [
            { path: '/welcome', component: Welcome },
            { path: '/users', component: Users },
            { path: '/rights', component: Rights },
            { path: '/roles', component: Roles },
            { path: '/categories', component: Cate },
            { path: '/params', component: Params },
        ]
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next();
    const token = window.sessionStorage.getItem('token');
    if (!token) return next('login');
    next();
})

export default router