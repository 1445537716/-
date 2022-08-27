<template>
  <div class="home-container">
    <!-- 顶部搜索按钮 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        slot="title"
        type="info"
        round
        size="small"
        icon="search"
        class="search-btn"
        text="搜索"
        to="/search"
      ></van-button>
    </van-nav-bar>
    <!-- 标签栏 -->
    <!-- 通过 v-model 绑定当前激活标签对应的索引值，默认情况下启用第一个标签。 -->
    <!-- 通过 animated 属性可以开启切换标签内容时的转场动画。 -->
    <!-- 通过 swipeable 属性可以开启滑动切换标签页。 -->
    <van-tabs class="channel-tabs" v-model="active" animated swipeable>
      <van-tab
        v-for="channel in channels"
        :key="channel.id"
        :title="channel.name"
      >
        <!-- 文章列表 -->
        <article-list :channel="channel"></article-list>
      </van-tab>
      <div slot="nav-right" class="placeholder"></div>
      <div
        slot="nav-right"
        class="hamburger-btn"
        @click="isChannelEditShow = true"
      >
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>

    <!-- 频道编辑弹出层 -->
    <van-popup
      class="edit-channel-popup"
      v-model="isChannelEditShow"
      position="bottom"
      closeable
      :style="{ height: '100%' }"
      close-icon-position="top-left"
    >
      <channel-edit
        :myChannels="channels"
        :active="active"
        @update-active="onUpdateActive"
      ></channel-edit>
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from "@/api/user";
import ArticleList from "./components/article-list.vue";
import ChannelEdit from "./components/channel-edit.vue";
import { mapState } from "vuex";
import { getItem } from "@/utils/storage";

export default {
  name: "HomeIndex",
  data() {
    return {
      active: 0,
      channels: [], //频道列表
      isChannelEditShow: false, //控制弹出层显示或隐藏
    };
  },
  created() {
    this.loadUserChannels();
  },
  components: {
    ArticleList,
    ChannelEdit,
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    async loadUserChannels() {
      try {
        let channels = [];
        if (this.user) {
          // 登录状态，获取线上频道列表
          const { data } = await getUserChannels();
          channels = data.data.channels;
        } else {
          // 未登录状态，获取本地存储的频道列表
          const localChannels = getItem("TOUTIAO_CHANNELS");
          if (localChannels) {
            channels = localChannels;
          } else {
            // 如果本地没有频道数据，则获取服务器提供的默认频道
            const { data } = await getUserChannels();
            channels = data.data.channels;
          }
        }

        this.channels = channels;
      } catch (err) {
        this.$toast("获取用户频道列表失败");
      }
    },

    onUpdateActive(index, isChannelEditShow = true) {
      // console.log("home", index);
      //更新激活频道

      this.active = index;
      //关闭弹出层
      this.isChannelEditShow = isChannelEditShow;
    },
  },
};
</script>



<style lang="less" scoped>
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;
  /deep/ .van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    font-size: 28px;
    border: none;
    .van-icon {
      font-size: 32px;
    }
  }
  /deep/ .channel-tabs {
    .van-tabs__nav {
      padding: 0;
    }
    .van-tabs__wrap {
      position: fixed;
      top: 92px;
      z-index: 1;
      left: 0;
      right: 0;
      height: 82px;
    }
    .van-tab {
      min-width: 200px;
      border-right: 1px solid #edeff3;
      font-size: 30px;
      color: #777777;
    }
    .van-tab--active {
      color: #333;
    }
    .van-tabs__nav--line {
      padding-bottom: 0;
    }
    .van-tabs__line {
      bottom: 8px;
      width: 31px;
      height: 6px;
      background-color: #3296fa;
    }
    .placeholder {
      flex-shrink: 0;
      width: 66px;
      height: 82px;
    }
    .hamburger-btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
      opacity: 0.902;
      &:before {
        content: "";
        position: absolute;
        left: 0;
        width: 1px;
        height: 100%;
        background: url("@/assets/gradient-gray-line.png");
        background-size: contain;
      }
      i.toutiao {
        font-size: 33px;
      }
    }
  }
  .edit-channel-popup {
    padding: 85px 0;
    box-sizing: border-box;
  }
}
</style>