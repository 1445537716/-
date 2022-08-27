<template>
  <div class="my-container">
    <!-- 登录 -->
    <div v-if="user" class="header user-info">
      <div class="base-info">
        <div class="left">
          <van-image class="avatar" round fit="cover" :src="userInfo.photo" />
          <span class="name">{{ userInfo.name }}</span>
        </div>
        <div class="right">
          <van-button round size="mini" class="base-btn" to="/user/profile"
            >编辑资料</van-button
          >
        </div>
      </div>
      <div class="data-stats">
        <div class="data-items">
          <span class="count">{{ userInfo.art_count }}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-items">
          <span class="count">{{ userInfo.follow_count }}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-items">
          <span class="count">{{ userInfo.fans_count }}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-items">
          <span class="count">{{ userInfo.like_count }}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>
    <!-- 未登录 -->
    <div v-else class="header not-login">
      <div class="login-btn" @click="$router.push('/login')">
        <img src="@/assets/mobile.png" alt="" class="mobile-img" />
        <span class="login-text">登录 / 注册</span>
      </div>
    </div>

    <!-- 收藏、历史模块 -->
    <van-grid class="gird-nav" clickable :column-num="2">
      <van-grid-item class="gird-item">
        <i slot="icon" class="toutiao toutiao-shoucang"></i>
        <span slot="text" class="text">收藏</span>
      </van-grid-item>
      <van-grid-item class="gird-item">
        <i slot="icon" class="toutiao toutiao-lishi"></i>
        <span slot="text" class="text">历史</span>
      </van-grid-item>
    </van-grid>
    <!-- 消息通知、小智同学、退出登录模块 -->
    <van-cell title="消息通知" is-link />
    <van-cell title="小智同学" class="md9" is-link />
    <van-cell
      v-if="user"
      title="退出登录"
      class="lgout-cell"
      clickable
      @click="onlogOut"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getUserInfo } from "@/api/user";

export default {
  data() {
    return {
      userInfo: {}, //存放用户资料
    };
  },
  name: "MyIndex",
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    onlogOut() {
      // 退出提示
      this.$dialog
        .confirm({
          message: "确定要退出登录吗？",
        })
        .then(() => {
          // 删除vuex容器里的登录状态  会自动同步到本队存储
          this.$store.commit("setUser", null);
        })
        .catch(() => {
          console.log("取消");
        });
    },
    async loadUserInfo() {
      try {
        const { data } = await getUserInfo();
        this.userInfo = data.data;
      } catch (err) {
        this.$toast("获取用户信息失败，请稍后重试！");
      }
    },
  },
  created() {
    if (this.user) {
      this.loadUserInfo();
    }
  },
};
</script>

<style lang="less" scoped>
.my-container {
  .header {
    height: 361px;
    background: url("@/assets/banner.png") no-repeat;
    background-size: 100%;
  }
  //未登录样式
  .not-login {
    .login-btn {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .mobile-img {
        width: 132px;
        height: 132px;
      }
      .login-text {
        padding-top: 15px;
        font-size: 28px;
        color: #fff;
      }
    }
  }
  //已登录样式
  .user-info {
    .base-info {
      display: flex;
      height: 231px;
      justify-content: space-between;
      align-items: center;
      padding: 76px 32px 23px;
      box-sizing: border-box;
      .left {
        display: flex;
        align-items: center;
        .avatar {
          width: 132px;
          height: 132px;
          border: 4px solid #fff;
        }
        .name {
          font-size: 30px;
          color: #fff;
          margin-left: 20px;
        }
      }
      .right {
        .base-btn {
          font-size: 20px;
          color: #666;
        }
      }
    }
    .data-stats {
      display: flex;
      height: 130px;
      .data-items {
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        .count {
          font-size: 36px;
        }
        .text {
          font-size: 23px;
        }
      }
    }
  }
  //收藏、历史模块
  .gird-nav {
    .gird-item {
      height: 141px;
      i.toutiao {
        font-size: 45px;
      }
      .toutiao-shoucang {
        color: #eb5253;
      }
      .toutiao-lishi {
        color: #ff9d1d;
      }
      .text {
        font-size: 28px;
      }
    }
  }
  .md9 {
    margin-bottom: 9px;
  }
  //退出登录样式
  .lgout-cell {
    text-align: center;
    color: #d86262;
  }
}
</style>