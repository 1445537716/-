import Vue from 'vue'
import App from './App.vue'
import router from './router'
//全局样式
import '@/styles/index.less'
import store from '@/store'
//配置基准值
import 'amfe-flexible'
import {
  NavBar,
  Form,
  Field,
  Button,
  Toast,
  CountDown,
  Tabbar,
  TabbarItem,
  Icon,
  Image as VanImage,
  Grid,
  GridItem,
  Cell,
  Dialog,
  Tab,
  Tabs,
  List,
  PullRefresh,
  Popup,
  Search,
  Loading,
  Divider,
  Picker,
  DatetimePicker
} from 'vant';

Vue.use(Form);
Vue.use(DatetimePicker);
Vue.use(Picker);
Vue.use(Divider);
Vue.use(Loading);
Vue.use(Search);
Vue.use(Popup);
Vue.use(PullRefresh);
Vue.use(List);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(Dialog);
Vue.use(Cell);
Vue.use(Grid);
Vue.use(GridItem);
Vue.use(VanImage);
Vue.use(Icon);
Vue.use(Tabbar);
Vue.use(TabbarItem);
Vue.use(CountDown);
Vue.use(Toast);
Vue.use(Button);
Vue.use(Field);
Vue.use(NavBar);
Vue.use(router)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')