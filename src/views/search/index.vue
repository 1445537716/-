<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <form action="/" class="search-form">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        background="#3296fa"
        @focus="isShowResult = false"
        @search="onSearch"
        @cancel="onCancel"
      />
    </form>
    <!-- 搜索栏 -->

    <!-- 搜索结果 -->
    <search-result v-if="isShowResult" :search-text="searchText" />
    <!-- 搜索结果 -->

    <!-- 联想建议 -->
    <search-suggestion
      v-else-if="searchText"
      :search-text="searchText"
      @search="onSearch"
    />
    <!-- 联想建议 -->

    <!-- 搜索历史 -->
    <search-history
      :search-histories="searchHistories"
      @clear-search-histories="searchHistories = []"
      @search="onSearch"
      v-else
    />
    <!-- 搜索历史 -->
  </div>
</template>

<script>
import SearchHistory from "./components/search-history.vue";
import SearchSuggestion from "./components/search-suggestion.vue";
import SearchResult from "./components/search-result.vue";
import { setItem, getItem } from "@/utils/storage";

export default {
  name: "SearchIndex",
  data() {
    return {
      searchText: "", //搜索关键词
      isShowResult: false,
      searchHistories: getItem("TOUTIAO_SEARCH_HISTORIES") || [], //搜索历史
    };
  },
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult,
  },
  watch: {
    searchHistories(val) {
      setItem("TOUTIAO_SEARCH_HISTORIES", val);
    },
  },
  methods: {
    onSearch(val) {
      // 更新搜索文本框
      this.searchText = val;
      //   存储搜索记录
      // 要求：不要有重复的历史记录
      const index = this.searchHistories.indexOf(val);
      if (index !== -1) {
        this.searchHistories.splice(index, 1);
      }
      //   最新的排在最前面
      this.searchHistories.unshift(val);
      //   显示搜索结果
      this.isShowResult = true;
    },
    onCancel() {
      this.$router.back();
    },
  },
};
</script>

<style lang="less" scoped>
.search-container {
  padding-top: 108px;
  .van-search__action {
    color: #fff;
  }
  .search-form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>