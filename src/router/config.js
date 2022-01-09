import LazyLoading from '../utils/lazyLoading'
// 组件动态懒加载引入
const StartPage = LazyLoading('startPage')
const HomePage = LazyLoading('homePage')
const DynamicPage = LazyLoading('dynamicPage')
const UserPage = LazyLoading('userPage')
const WarningList = LazyLoading('warningList')
const WarningDetail = LazyLoading('warningDetail')
const Login = LazyLoading('login')
const TrackQuery = LazyLoading('trackQuery')
const TrackResults = LazyLoading('trackResults')
const TrackDetails = LazyLoading('trackDetails')

const TestNot = LazyLoading('test/not')
const TestList = LazyLoading('test/list')
const TestDetail = LazyLoading('test/detail')

export default [
  {
    path: '/',
    redirect: '/startPage'
  },
  {
    path: '/not',
    component: TestNot
  },
  {
    path: '/list',
    meta: {keepAlive: true},
    component: TestList
  },
  {
    path: '/detail',
    component: TestDetail
  },
  {
    path: '/',
    component: () => import('@/pages/frame'),
    children: [
      {
        path: 'homePage',
        meta: {title: '实战平台'},
        component: HomePage
      },
      {
        path: 'dynamicPage',
        meta: {
          title: '最新动态',
          keepAlive: true
        },
        component: DynamicPage
      },
      {
        path: 'userPage',
        meta: {title: '我的'},
        component: UserPage
      },
    ]
  },
  {
    path: '/startPage',
    component: StartPage
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/trackQuery',
    meta: {title: '轨迹分析'},
    component: TrackQuery
  },
  {
    path: '/trackResults/:imsi',
    meta: {title: '轨迹分析'},
    component: TrackResults
  },
  {
    path: '/trackDetails/:imsi',
    meta: {title: '轨迹分析'},
    component: TrackDetails
  },
  {
    path: '/warningList',
    meta: {
      title: '预警结果',
      keepAlive: true
    },
    component: WarningList
  },
  {
    path: '/warningDetail/:id',
    meta: {title: '预警详情'},
    component: WarningDetail
  },
];
