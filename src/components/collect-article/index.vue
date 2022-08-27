<template>
  <div class="collect-article">
    <van-icon
      color="#777"
      :name="value ? 'star' : 'star-o'"
      :class="{ 'van-icon-style': value }"
      :loading="loading"
      @click="onCollect"
    />
  </div>
</template>

<script>
import { addCollect, deleteCollect } from "@/api/article";

export default {
  name: "CollectArticle",
  data() {
    return {
      loading: false, //按钮加载状态
    };
  },
  props: {
    value: {
      //收藏状态
      type: Boolean,
      required: true,
    },
    articleId: {
      type: [Number, String, Object],
      required: true,
    },
  },
  methods: {
    async onCollect() {
      this.loading = true;
      try {
        if (this.value) {
          //已收藏，取消收藏
          await deleteCollect(this.articleId);
        } else {
          //未收藏，点击收藏
          await addCollect(this.articleId);
        }
        //更新视图，改变收藏状态
        this.$emit("input", !this.value);
        this.$toast.success(this.value ? "取消成功" : "收藏成功");
      } catch (error) {
        this.$toast.fail("操作失败，请稍后重试！");
      }
      this.loading = false;
    },
  },
};
</script>

<style lang="less" scoped>
.collect-article {
  /deep/.van-icon-style {
    color: #ffa500 !important;
  }
}
</style>