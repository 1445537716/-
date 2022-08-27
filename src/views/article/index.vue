<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      @click-left="$router.back()"
      title="黑马头条"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div v-if="loading" class="loading-wrap">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div v-else-if="article.aut_photo" class="article-detail markdown-body">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">
            {{ article.pubdate | relativeTime }}
          </div>

          <!-- 关注按钮组件 -->

          <!--
            模板中的 $event 是事件参数
            当我们传递给子组件的数据既要使用还要修改。
              传递：props
                :is-followed="article.is_followed"
              修改：自定义事件
                @update-is_followed="article.is_followed = $event"
            简写方式：在组件上使用 v-model
              value="article.is_followed"
              @input="article.is_followed = $event"

            如果需要修改 v-model 的规则名称，可以通过子组件的 model 属性来配置修改

            一个组件上只能使用一次 v-model，
            如果有多个数据需要实现类似于 v-model 的效果，咋办？
            可以使用属性的 .sync 修饰符。
           -->
          <!-- 模板中的 $event 是事件参数 -->
          <follow-user
            class="follow-btn"
            v-model="article.is_followed"
            :userId="article.aut_id"
          ></follow-user>
          <!-- 关注按钮组件 -->
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
          class="article-content"
          ref="article-content"
          v-html="article.content"
        ></div>
        <van-divider>正文结束</van-divider>

        <!-- 评论列表 -->
        <comment-list
          :source="article.art_id"
          @onLoadSuccess="commentCount = $event.total_count"
          :list="commentList"
          @reply-click="onReplyClick"
        ></comment-list>
        <!-- 评论列表 -->

        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click="isPostshow = true"
            >写评论</van-button
          >
          <van-icon name="comment-o" :badge="commentCount" color="#777" />
          <!-- 文章收藏组件 -->
          <collect-article
            v-model="article.is_collected"
            :article-id="article.art_id"
            class="van-icon"
          ></collect-article>
          <!-- 文章收藏组件 -->
          <!-- <van-icon color="#777" name="star-o" /> -->

          <!-- 点赞文章组件 -->
          <like-article
            v-model="article.attitude"
            :article-id="article.art_id"
            class="van-icon"
          ></like-article>
          <!-- 点赞文章组件 -->
          <!-- <van-icon color="#777" name="good-job-o" /> -->
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->
        <!-- 评论弹出层 -->
        <van-popup v-model="isPostshow" position="bottom">
          <comment-post
            :target="article.art_id"
            @post-success="onPostSuccess"
          ></comment-post>
        </van-popup>
        <!-- 评论弹出层 -->
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div v-else-if="errStatus === 404" class="error-wrap">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div v-else class="error-wrap">
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>

    <!-- 评论回复 -->
    <!-- 弹出层是懒渲染的，关闭不会销毁，会造成数据不更新 -->
    <van-popup v-model="isReplyshow" position="bottom" style="height: 100%">
      <comment-reply
        v-if="isReplyshow"
        :comment="currentComment"
        @close="isReplyshow = false"
      ></comment-reply>
    </van-popup>
    <!-- 评论回复 -->
  </div>
</template>

<script>
import { getArticleId } from "@/api/article";
import { ImagePreview } from "vant";
import FollowUser from "@/components/follow-user";
import CollectArticle from "@/components/collect-article";
import LikeArticle from "@/components/like-article";
import CommentList from "./components/comment-list.vue";
import CommentPost from "./components/comment-post.vue";
import CommentReply from "./components/comment-reply.vue";

// ImagePreview({
//   images: [
//     "https://img01.yzcdn.cn/vant/apple-1.jpg",
//     "https://img01.yzcdn.cn/vant/apple-2.jpg",
//   ],
//   //起始位置从0开始
//   startPosition: 1,
// });

export default {
  name: "ArticleIndex",
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    CommentList,
    CommentPost,
    CommentReply,
  },
  provide: function () {
    return {
      articleId: this.articleId,
    };
  },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true,
    },
  },
  data() {
    return {
      article: {}, //文章详情
      loading: true, //显示加载状态
      errStatus: 0,
      commentCount: 0, //评论数量
      isPostshow: false, //弹出层
      commentList: [], //评论列表
      isReplyshow: false, //评论回复弹出层
      currentComment: {},
    };
  },
  created() {
    this.loadArticle();
  },
  methods: {
    async loadArticle() {
      this.loading = true;
      try {
        const { data } = await getArticleId(this.articleId);
        //数据驱动视图不是立即的
        this.article = data.data;
        //加载成功关闭加载状态
        // this.loading = false;

        //初始化图片点击预览
        // console.log(this.$refs["article-content"];
        setTimeout(() => {
          this.previewImage();
        }, 0);
      } catch (error) {
        //加载失败关闭加载状态
        // this.loading = false;
        if (error.response && error.response.status === 404) {
          this.errStatus = 404;
        }
        console.log("数据获取失败", error);
      }
      //直接合并关闭加载状态写外面
      this.loading = false;
    },

    previewImage() {
      const articleContent = this.$refs["article-content"];
      //   console.log(articleContent);
      const imgs = articleContent.querySelectorAll("img");
      const images = [];
      imgs.forEach((img, index) => {
        images.push(img.src);
        //给每个图片添加点击预览功能
        img.onclick = () => {
          ImagePreview({
            images,
            //起始位置
            startPosition: index,
          });
        };
      });
    },

    onPostSuccess(data) {
      //关闭评论弹出层
      this.isPostshow = false;
      //将发布内容显示到列表顶部
      this.commentList.unshift(data.new_obj);
    },

    onReplyClick(comment) {
      this.currentComment = comment;
      //打开评论回复弹出层
      this.isReplyshow = true;
    },
  },
};
</script>

<style scoped lang="less">
@import "./github-markdown.css";
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
