<template>
  <div class="comment-reply">
    <van-nav-bar
      :title="
        comment.reply_count > 0 ? `${comment.reply_count}条回复` : '暂无回复'
      "
    >
      <van-icon slot="left" name="cross" @click="$emit('close')" />
    </van-nav-bar>
    <div class="scroll-wrap">
      <comment-item :comment="comment"></comment-item>
      <!-- 评论回复列表 -->
      <van-cell title="全部评论"></van-cell>
      <comment-list
        :list="commentList"
        type="c"
        :source="comment.com_id"
      ></comment-list>
      <!-- 评论回复列表 -->
    </div>

    <!-- 底部评论按钮 -->
    <div class="post-wrap">
      <van-button size="small" round class="post-btn" @click="isPostShow = true"
        >写评论</van-button
      >
    </div>
    <!-- 底部评论按钮 -->

    <!-- 发布评论弹层 -->
    <van-popup v-model="isPostShow" position="bottom">
      <comment-post
        :target="comment.com_id"
        @post-success="onSuccessPost"
      ></comment-post>
    </van-popup>
    <!-- 发布评论弹层 -->
  </div>
</template>

<script>
import CommentItem from "./comment-item.vue";
import CommentList from "./comment-list.vue";
import CommentPost from "./comment-post.vue";

export default {
  name: "CommentReply",
  data() {
    return {
      isPostShow: false,
      commentList: [], //评论回复列表
    };
  },
  components: {
    CommentItem,
    CommentList,
    CommentPost,
  },
  props: {
    comment: {
      type: Object,
      required: true,
    },
  },
  methods: {
    onSuccessPost(data) {
      //更新回复的数量
      this.comment.reply_count++;
      //关闭弹层
      this.isPostShow = false;
      //将最新回复放到列表顶部
      this.commentList.unshift(data.new_obj);
    },
  },
};
</script>

<style lang="less" scoped>
.scroll-wrap {
  position: fixed;
  left: 0;
  right: 0;
  top: 92px;
  bottom: 88px;
  overflow-y: auto;
}
.post-wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 88px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 0.5px solid #d8d8d8;
  .post-btn {
    width: 60%;
  }
}
</style>