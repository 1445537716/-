<template>
  <!-- 
    to跳转路由
     方法一：'/article/' + article.art_id
     方法二：`/article/${article.art_id}`
 -->
  <van-cell
    class="article-item"
    :to="{
      //与VueRouter中的router—link的to用法一样
      //通过路由名字实现跳转
      name: 'article',
      // 传入参数
      params: {
        articleId: article.art_id,
      },
    }"
  >
    <div slot="title" class="title van-multi-ellipsis--l2">
      {{ article.title }}
    </div>

    <div slot="label">
      <div v-if="article.cover.type === 3" class="cover-wrap">
        <div
          class="cover-item"
          v-for="(img, index) in article.cover.images"
          :key="index"
        >
          <van-image :src="img" fit="cover" class="cover-item-img" />
        </div>
      </div>

      <div class="label-info-wrap">
        <span>{{ article.aut_name }}</span>
        <span>{{ article.comm_count }}评论</span>
        <span>{{ article.pubdate | relativeTime }}</span>
      </div>
    </div>
    <van-image
      v-if="article.cover.type === 1"
      slot="default"
      :src="article.cover.images[0]"
      fit="cover"
      class="right-cover"
    />
  </van-cell>
</template>

<script>
import "@/utils/dayjs";
export default {
  name: "ArticleItem",
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="less" scoped>
.article-item {
  .title {
    color: #3a3a3a;
    font-size: 32px;
  }
  .van-cell__value {
    flex: unset;
    width: 232px;
    height: 146px;
    padding-left: 25px;
  }
  .right-cover {
    width: 232px;
    height: 146px;
  }
  .label-info-wrap span {
    font-size: 23px;
    color: #b4b4b4;
    margin-right: 25px;
  }
  .cover-wrap {
    display: flex;
    margin: 30px 0;
    .cover-item {
      flex: 1;
      height: 146px;
      &:not(:last-child) {
        margin-right: 4px;
      }
      .cover-item-img {
        width: 100%;
        height: 146px;
      }
    }
  }
}
</style>