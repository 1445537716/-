<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="加载失败，请稍后重试"
      @load="onLoad"
    >
      <van-cell
        v-for="(article, index) in list"
        :key="index"
        :title="article.title"
      />
    </van-list>
  </div>
</template>

<script>
import { getSearchResults } from "@/api/search";
export default {
  name: "SearchResult",
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      error: false,
      page: 1, //请求页数
      prePage: 20, //每页数据的数量
    };
  },
  props: {
    searchText: {
      type: String,
      required: true,
    },
  },
  methods: {
    async onLoad() {
      try {
        // 1. 请求获取数据
        const { data } = await getSearchResults({
          page: this.page,
          per_page: this.prePage,
          q: this.searchText,
        });
        // 模拟加载失败出现错误提示
        // if (Math.random() > 0.5) {
        //   JSON.parse("dfhasjkhdfjk");
        // }
        // 2. 将数据添加到列表中
        const { results } = data.data;
        this.list.push(...results);
        // console.log(this.list);
        // 3. 设置加载状态结束
        this.loading = false;
        // 4. 判断数据是否加载完毕
        if (results.length) {
          //如果还有数据，则更新页码
          this.page++;
        } else {
          this.finished = true;
        }
      } catch (error) {
        //展示加载失败的提示状态
        this.error = true;
        //加载失败了loading关闭
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
</style>