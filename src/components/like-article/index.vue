<template>
  <div class="like-article">
    <van-icon
      color="#777"
      :name="value === 1 ? 'good-job' : 'good-job-o'"
      :class="{ 'van-icon-style': value === 1 }"
      :loading="loading"
      @click="onLike"
    />
  </div>
</template>

<script>
import { addLike, deleteLike } from "@/api/article";

export default {
  name: "LikeArticle",
  data() {
    return {
      loading: false,
    };
  },
  props: {
    value: {
      type: Number,
      required: true,
    },
    articleId: {
      type: [Number, String, Object],
      required: true,
    },
  },
  methods: {
    async onLike() {
      this.loading = true;
      try {
        let status = -1;
        if (this.value === 1) {
          //已点赞，取消点赞
          await deleteLike(this.articleId);
        } else {
          //未点赞，点赞文章
          await addLike(this.articleId);
          status = 1;
        }
        //更新视图
        this.$emit("input", status);
        this.$toast.success(status === 1 ? "点赞成功" : "取消成功");
      } catch (error) {
        this.$toast.fail("操作失败，请稍后重试");
      }
      this.loading = false;
    },
  },
};
</script>

<style lang="less" scoped>
.like-article {
  .van-icon-style {
    color: #e5645f !important;
  }
}
</style>