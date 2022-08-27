<template>
  <van-button
    v-if="isFollowed"
    class="follow-btn"
    round
    :loading="loading"
    size="small"
    @click="onFollow"
    >已关注</van-button
  >
  <van-button
    v-else
    class="follow-btn"
    type="info"
    color="#3296fa"
    round
    :loading="loading"
    size="small"
    icon="plus"
    @click="onFollow"
    >关注</van-button
  >
</template>

<script>
import { addFollow, deleteFollow } from "@/api/user";

export default {
  name: "FollowIndex",
  model: {
    prop: "isFollowed",
    event: "update-isFollowed",
  },
  props: {
    isFollowed: {
      type: Boolean,
      required: true,
    },
    userId: {
      type: [Number, String, Object],
      required: true,
    },
  },
  data() {
    return {
      loading: false, //按钮加载状态
    };
  },
  methods: {
    async onFollow() {
      this.loading = true;
      try {
        if (this.isFollowed) {
          //已关注状态，需取消关注用户
          await deleteFollow(this.userId);
        } else {
          //未关注状态，需关注用户
          await addFollow(this.userId);
        }
        //更新视图
        // this.article.is_followed = !this.article.is_followed;
        this.$emit("update-isFollowed", !this.isFollowed);
      } catch (error) {
        let message = "操作失败，请稍后重试";
        if (error.response.status === 400) {
          message = "你不能关注你自己 !";
        }
        this.$toast(message);
      }
      this.loading = false;
    },
  },
};
</script>

<style>
</style>