<template>
  <div class="login-container">
    <van-nav-bar title="登录" class="page-nav-bar">
      <van-icon slot="left" name="arrow-left" @click="$router.back()" />
    </van-nav-bar>
    <van-form @submit="onLogin" ref="loginForm">
      <van-field
        name="mobile"
        placeholder="请输入手机号"
        v-model="user.mobile"
        :rules="userFormRules.mobile"
        type="number"
        maxlength="11"
      >
        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>
      <van-field
        name="code"
        placeholder="请输入验证码"
        v-model="user.code"
        :rules="userFormRules.code"
        type="number"
        maxlength="6"
      >
        <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
        <template #button>
          <van-count-down
            :time="1000 * 60"
            format="ss s"
            v-if="isCountDownShow"
            @finish="isCountDownShow = false"
          />
          <van-button
            class="send-sms-btn"
            native-type="button"
            round
            size="small"
            type="primary"
            @click="onSendSms"
            v-else
            >获取验证码</van-button
          >
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button class="login-btn" block type="info" native-type="submit"
          >登录</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from "@/api/user.js";
export default {
  name: "LoginPage",
  data() {
    return {
      user: {
        mobile: "",
        code: "",
      },
      userFormRules: {
        mobile: [
          {
            required: true,
            message: "手机号码不能为空",
          },
          {
            pattern: /^1[3|5|7|8]\d{9}$/,
            message: "手机号码格式错误",
          },
        ],
        code: [
          {
            required: true,
            message: "验证码不能为空",
          },
          {
            pattern: /^\d{6}$/,
            message: "验证码格式错误",
          },
        ],
      },
      isCountDownShow: false,
    };
  },
  methods: {
    async onLogin() {
      //获取表单数据
      // 表单验证
      // 提交表单验证
      // 根据响应结果处理后续操作
      this.$toast.loading({
        //加载中提示
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      try {
        const res = await login(this.user);
        this.$store.commit("setUser", res.data.data);
        this.$toast.success("登录成功"); //登录成功提示
        // console.log("登录成功", res);
        //登录成功后返回
        this.$router.back();
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail("登录失败"); //登录失败提示
          // console.log("登录失败", err);
        }
      }
    },
    async onSendSms() {
      console.log("onsensms");
      // 1.验证手机号
      try {
        await this.$refs.loginForm.validate("mobile");
      } catch (err) {
        return console.log("发送失败", err);
      }
      // 2.倒计时
      this.isCountDownShow = true;
      // 3.发送验证码
      try {
        const res = await sendSms(this.user.mobile);
        console.log(res);
        this.$toast("发送成功");
      } catch (err) {
        this.isCountDownShow = false;
        if (err.response.status === 429) {
          this.$toast("发送频繁，稍后重试");
        } else {
          this.$toast("发送失败，稍后重试");
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.login-container {
  .toutiao {
    font-size: 37px;
    padding-right: 16px;
  }
  .send-sms-btn {
    width: 152px;
    height: 46px;
    line-height: 46px;
    font-size: 22px;
    color: #666666;
    background-color: #ededed;
    border: none;
  }
  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
      border-radius: 10px;
    }
  }
}
</style>



