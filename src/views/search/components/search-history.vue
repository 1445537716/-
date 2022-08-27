<template>
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isShowDelete">
        <span @click="$emit('clear-search-histories')">全部删除</span>
        &nbsp;&nbsp;
        <span @click="isShowDelete = false">完成</span>
      </div>
      <van-icon v-else name="delete-o" @click="isShowDelete = true" />
    </van-cell>
    <van-cell
      :title="item"
      v-for="(item, index) in searchHistories"
      :key="index"
      @click="onSearchItemClick(item, index)"
    >
      <van-icon name="close" v-if="isShowDelete" />
    </van-cell>
  </div>
</template>

<script>
export default {
  name: "SearchHistory",
  data() {
    return {
      isShowDelete: false, //显示删除状态
    };
  },
  props: {
    searchHistories: {
      type: Array,
      required: true,
    },
  },
  methods: {
    onSearchItemClick(item, index) {
      if (this.isShowDelete) {
        //删除状态，点击历史记录删除数据
        this.searchHistories.splice(index, 1);
      } else {
        //非删除状态，点击历史记录进行搜索
        this.$emit("search", item);
      }
    },
  },
};
</script>

<style lang="less" scoped>
</style>