<template>
  <div class="channel-edit">
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        slot="default"
        type="danger"
        round
        plain
        size="mini"
        class="edit-btn"
        @click="isEdit = !isEdit"
        >{{ isEdit ? "完成" : "编辑" }}</van-button
      >
    </van-cell>
    <van-grid :gutter="10" class="my-gird">
      <van-grid-item
        v-for="(channel, index) in myChannels"
        :key="index"
        class="gird-item"
        @click="onMyChannelClick(channel, index)"
      >
        <!-- 推荐不显示关闭按钮方法一： v-show="isEdit && channel.name != '推荐'" -->
        <van-icon
          slot="icon"
          name="clear"
          v-show="isEdit && !fiexdChannel.includes(channel.id)"
        ></van-icon>
        <span slot="text" class="text" :class="{ active: index === active }">{{
          channel.name
        }}</span>
      </van-grid-item>
    </van-grid>

    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid :gutter="10" class="recommend-gird">
      <van-grid-item
        v-for="(channel, index) in recommendChannels"
        :key="index"
        :text="channel.name"
        icon="plus"
        class="gird-item"
        @click="onAddChannel(channel)"
      />
    </van-grid>
  </div>
</template>

<script>
import {
  getAllChannels,
  addUserChannel,
  deleteUserChannel,
} from "@/api/channel";
import { mapState } from "vuex";
import { setItem } from "@/utils/storage";

export default {
  name: "ChannelEdit",
  data() {
    return {
      allChannels: [], //存放所有频道
      isEdit: false, //编辑图标是否显示
      fiexdChannel: [0], //控制固定频道，不显示关闭按钮,用channel.id去判断控制
    };
  },

  props: {
    myChannels: {
      type: Array,
      required: true,
    },
    active: {
      type: Number,
      required: true,
    },
  },
  created() {
    this.loadAllChannels();
  },
  methods: {
    async loadAllChannels() {
      try {
        const { data } = await getAllChannels();
        this.allChannels = data.data.channels;
        // console.log(this.allChannels);
      } catch (error) {
        this.$toast("获取频道列表失败");
      }
    },

    async onAddChannel(channel) {
      this.myChannels.push(channel);
      // console.log(channel);
      //数据持久化处理
      try {
        if (this.user) {
          // 已登录，把数据请求接口放到线上
          await addUserChannel([
            {
              id: channel.id, //频道id
              seq: this.myChannels.length, //序号
            },
          ]);
        } else {
          // 未登录，把数据存储到本地
          setItem("TOUTIAO_CHANNELS", this.myChannels);
        }
      } catch (error) {
        console.log(error);
        this.$toast("添加频道失败");
      }
    },

    onMyChannelClick(channel, index) {
      if (this.isEdit) {
        //编辑状态，执行删除频道操作
        if (this.fiexdChannel.includes(channel.id)) {
          return;
        }
        if (index <= this.active) {
          this.$emit("update-active", this.active - 1, true);
        }

        this.myChannels.splice(index, 1);
        this.deleteChannel(channel);
      } else {
        //非编辑状态，执行切换频道操作
        // console.log(channel, index);
        this.$emit("update-active", index, false);
      }
    },

    async deleteChannel(channel) {
      try {
        if (this.user) {
          // 登录状态，删除线上频道
          await deleteUserChannel(channel.id);
        } else {
          // 未登录状态，删除本地存储频道
          setItem("TOUTIAO_CHANNELS", this.myChannels);
        }
      } catch (error) {
        this.$toast("删除用户频道失败");
      }
    },
  },
  computed: {
    ...mapState(["user"]),
    recommendChannels() {
      // 频道推荐=所有频道-我的频道
      //       - 遍历所有频道
      // - 对每一个频道都判断：该频道是否属于我的频道
      // - 如果不属于我的频道，则收集起来
      // - 直到遍历结束，剩下来就是那些剩余的推荐频道

      // 数组的filter方法：遍历数组，把符合条件的元素存储到新的数组中
      return this.allChannels.filter((channel) => {
        // 数组的find方法：遍历数组，把符合条件的第一个元素返回
        return !this.myChannels.find((myChannel) => {
          return myChannel.id === channel.id;
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.channel-edit {
  .title-text {
    font-size: 32px;
    color: #333;
  }
  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  /deep/.gird-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: red;
      }
    }
  }
  /deep/.my-gird {
    .van-icon-clear {
      position: absolute;
      top: -8px;
      right: -8px;
      font-size: 15px;
      color: #cacaca;
      z-index: 2;
    }
    .van-grid-item__icon-wrapper {
      position: unset;
    }
  }

  /deep/ .recommend-gird {
    .gird-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          padding-right: 6px;
        }
      }
    }
  }
}
</style>