<template>
  <div class="search-suggestion">
    <van-cell
      icon="search"
      v-for="(text, index) in suggestions"
      :key="index"
      @click="$emit('search', text)"
    >
      <!-- 在vue中用 v-html 才能渲染带html标签的字符串 -->
      <div slot="title" v-html="highlight(text, searchText)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from "@/api/search";
import { debounce } from "lodash";

export default {
  name: "SearchSuggestion",
  props: {
    searchText: {
      //搜索关键词
      type: String,
      required: true,
    },
  },
  data() {
    return {
      suggestions: [], //存放最新获取的联想建议
    };
  },
  watch: {
    searchText: {
      // debounce 函数
      // 参数1：函数
      // 参数2：防抖时间
      // 返回值：防抖之后的函数，和参数1功能是一样的
      handler: debounce(function (val) {
        this.loadSearchSuggestions(val);
      }, 200),

      //   数据变化则执行handler函数
      //   handler(val) {
      //     this.loadSearchSuggestions(val);
      //   },
      immediate: true,
    },
  },
  methods: {
    async loadSearchSuggestions(q) {
      try {
        const { data } = await getSearchSuggestions(q);
        this.suggestions = data.data.options;
        // console.log(this.suggestions);
      } catch (error) {
        this.$toast("获取数据失败，请稍后重试");
      }
    },
    highlight(text, keyword) {
      // /searchContent/ 正则表达式中的一切内容都会当做字符串使用
      // 这里可以 new RegExp 方式根据字符串创建一个正则表达式
      // RegExp 是原生 JavaScript 的内置构造函数
      // 参数1：字符串，注意，这里不要加 //
      // 参数2：匹配模式，g 全局，i 忽略大小写
      // console.log("text值", text);
      const highStr = `<span style="color: #3296fa">${keyword}</span>`;
      const reg = new RegExp(keyword, "gi");
      return text.replace(reg, highStr);
    },
  },
};
</script>

<style lang="less" scoped>
.search-suggestion {
  /deep/span.active {
    color: #3296fa;
  }
}
</style>