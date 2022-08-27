import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
        path: '/login',
        name: 'login',
        component: () => import("@/views/login")
    },
    {
        path: '/',
        // name: 'layout',
        component: () => import("@/views/layout"),
        children: [{
                path: '', //默认子路由 采用重定向模式
                redirect: 'home'
            }, {
                path: 'home',
                name: 'home',
                component: () => import("@/views/home"),
            },
            {
                path: 'qa',
                name: 'qa',
                component: () => import("@/views/qa"),
            },
            {
                path: 'video',
                name: 'video',
                component: () => import("@/views/video"),
            },
            {
                path: 'my',
                name: 'my',
                component: () => import("@/views/my"),
            },
        ]
    },
    {
        path: '/search',
        name: 'search',
        component: () => import("@/views/search")
    },
    {
        path: '/article/:articleId',
        name: 'article',
        component: () => import("@/views/article"),
        props: true //开启props传参，把路由参数映射到组件中  
        // 点击文章列表（获取到文章id），接着传给路由对象，实现跳转，利用props传参传给组件
    },
    {
        path: '/user/profile',
        name: 'user-profile',
        component: () => import('@/views/user-profile')
    }
]

const router = new VueRouter({
    routes
})

export default router