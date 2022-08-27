<template>
  <div class="update-photo">
    <img :src="img" class="img" ref="img" />

    <div class="toolbar">
      <div class="cancel" @click="$emit('close')">取消</div>
      <div class="confirm" @click="onConfirm">完成</div>
    </div>
  </div>
</template>

<script>
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import { updateUserPhoto } from "@/api/user";

export default {
  name: "UpdatePhoto",
  data() {
    return {
      cropper: null,
    };
  },
  props: {
    img: {
      type: [String, Object],
      required: true,
    },
  },
  mounted() {
    const image = this.$refs.img;
    this.cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: "move",
      aspectRatio: 1,
      autoCropArea: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
      movable: true,
    });
  },
  methods: {
    onConfirm() {
      //基于服务端的裁切使用 getData 放法获取裁切参数
      // console.log(this.cropper.getData());

      //纯客户端的裁切使用getCroppedCanvas()获取裁切对象
      this.cropper.getCroppedCanvas().toBlob((blob) => {
        this.updateUserPhoto(blob);
      });
    },
    async updateUserPhoto(blob) {
      try {
        this.$toast.loading({
          //加载中提示
          message: "修改中...",
          forbidClick: true,
          duration: 0,
        });
        //错误的用法
        // 如果接口要求content-type 是 application/json 则传递普通js对象
        // updateUserPhoto({
        //   photo: blob,
        // });
        const formData = new FormData();
        formData.append("photo", blob);
        const { data } = await updateUserPhoto(formData);
        //关闭弹出层
        this.$emit("close");
        //更新视图
        this.$emit("update-photo", data.data.photo);
        this.$toast.success("修改成功！");
      } catch (error) {
        this.$toast.fail("修改失败，请稍后重试！");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.update-photo {
  background-color: #000;
  height: 100%;
  .toolbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    .cancel,
    .confirm {
      display: flex;
      width: 90px;
      height: 90px;
      font-size: 30px;
      justify-content: center;
      align-items: center;
      color: #fff;
    }
  }
}
.img {
  display: block;
  max-width: 100%;
}
</style>