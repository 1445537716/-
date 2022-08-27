<template>
  <div class="article-list">
    <van-pull-refresh
      v-model="isReFreshLoading"
      @refresh="onRefresh"
      :success-text="successText"
      success-duration="1500"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
        <article-item
          v-for="(articleList, index) in list"
          :key="index"
          :article="articleList"
        ></article-item>
        <!-- <van-cell
          v-for="(articleList, index) in list"
          :key="index"
          :title="articleList.title"
        /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticleList } from "@/api/article";
import ArticleItem from "@/components/article-item/index.vue";
export default {
  name: "ArticleList",
  data() {
    return {
      list: [],
      loading: false, //上拉刷新加载数据得我状态
      finished: false, //是否加载结束
      timestamp: null, //请求获取下一页数据的时间戳
      error: false, //控制错误提示
      isReFreshLoading: true, //下拉刷新状态
      successText: "刷新成功",
    };
  },
  props: {
    channel: {
      type: Object,
      required: true,
    },
  },
  components: {
    ArticleItem,
  },
  methods: {
    async onLoad() {
      // 异步更新数据
      try {
        //1.请求获取数据
        const { data } = await getArticleList({
          channel_id: this.channel.id,
          timestamp: this.timestamp || Date.now(),
          // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
        });

        // 模拟加载失败出现错误提示
        // if (Math.random() > 0.5) {
        //   JSON.parse("dfhasjkhdfjk");
        // }

        //2.把数据同步给list数组
        const { results } = data.data;
        this.list.push(...results);

        //3.本次数据加载结束后要把加载状态设置为结束
        // loading关闭后才会触发下一次加载更多
        this.loading = false;

        //4.数据全部加载完成
        // 判断是否还有数据  没有则把finished设置为true 就不会继续加载
        if (results.length) {
          this.timestamp = data.data.pre_timestamp;
          //将时间戳设置为请求前一页历史数据的时间戳，才会继续加载下一页数据
        } else {
          this.finished = true;
        }
      } catch (error) {
        this.error = true; //触发错误提示
        this.loading = false; //取消加载
      }
    },
    async onRefresh() {
      //下拉刷新
      try {
        // 1.请求数据
        const { data } = await getArticleList({
          channel_id: this.channel.id,
          timestamp: Date.now(), //获取最新的时间戳
        });
        console.log(data);

        // 模拟加载失败出现错误提示
        // if (Math.random() > 0.5) {
        //   JSON.parse("dfhasjkhdfjk");
        // }

        // 2.将数据追加到列表顶部
        const { results } = data.data;
        this.list.unshift(...results);
        // 3.修改更新状态
        this.isReFreshLoading = false;
        // 修改刷新成功文本
        this.successText = `刷新成功！刷新了${results.length}条数据啦！`;
      } catch (error) {
        this.isReFreshLoading = false;
        this.successText = "刷新失败";
      }
    },
  },
};
</script>

<style lang="less" scoped>
.article-list {
  //   让文章有独立的滚动容器，就能记住文章列表的滚动位置，如何做？

  // 固定高度：height：xxx;

  // 溢出滚动：overflow-y:auto;
  height: 79vh;
  overflow-y: auto;
}
</style>
