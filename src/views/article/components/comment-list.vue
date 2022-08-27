<template>
  <!-- 
    van-list 只有在滚动到可视范围位置时才触发 onload
    immediate-check 属性： 是否在初始化时立即执行滚动位置检查 -->
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    :error="error"
    error-text="加载失败，请稍后重试"
    :immediate-check="false"
    @load="onLoad"
  >
    <comment-item
      v-for="(item, index) in list"
      :key="index"
      :comment="item"
      @reply-click="$emit('reply-click', $event)"
    />
  </van-list>
</template>

<script>
import { getComments } from "@/api/comment";
import CommentItem from "./comment-item.vue";

export default {
  name: "CommentList",
  data() {
    return {
      //   list: [],
      loading: false,
      finished: false,
      offset: null, //获取评论数据的偏移量
      limit: 10, //获取评论数据个数
      error: false,
    };
  },
  components: {
    CommentItem,
  },
  props: {
    source: {
      type: [Number, String, Object],
      required: true,
    },
    list: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String,
      vaildator(value) {
        return ["a", "c"].includes(value);
      },
      default: "a",
    },
  },
  created() {
    //显示加载中的状态
    this.loading = true;
    this.onLoad();
  },
  methods: {
    async onLoad() {
      try {
        //1.请求获取数据
        const { data } = await getComments({
          type: this.type, //评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.source, //源id，文章id或评论id
          offset: this.offset, //获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: this.limit, //获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
        });

        // if (Math.random() > 0.5) {
        //   JSON.parse(fhasjkhfjksa);
        // }

        // 2.将数据添加到列表中
        const { results } = data.data;
        this.list.push(...results);
        // console.log(data);
        //将请求回来的数据传出去，显示评论数量
        this.$emit("onLoadSuccess", data.data);
        // 3.将 loading 设置为 false
        this.loading = false;
        // 4. 判断是否还有数据
        if (results.length) {
          //  有就获取下一页数据
          this.offset = data.data.last_id;
        } else {
          //  没有就将 finished 设置为结束
          this.finished = true;
        }
      } catch (error) {
        this.error = true;
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
</style>