<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- /导航栏 -->
    <input type="file" hidden ref="file" @change="onFileChange" />
    <!-- 个人信息 -->
    <van-cell
      class="avatar-cell"
      title="头像"
      is-link
      center
      @click="$refs.file.click()"
    >
      <van-image class="avatar" round fit="cover" :src="UserProfile.photo" />
    </van-cell>
    <van-cell
      title="昵称"
      :value="UserProfile.name"
      is-link
      @click="isUpdateNameShow = true"
    />
    <van-cell
      title="性别"
      :value="UserProfile.gender === 0 ? '男' : '女'"
      is-link
      @click="isUpdateGenderShow = true"
    />
    <van-cell
      title="生日"
      :value="UserProfile.birthday"
      is-link
      @click="isUpdateBirthdayShow = true"
    />
    <!-- /个人信息 -->

    <!-- 编辑昵称 -->
    <van-popup
      v-model="isUpdateNameShow"
      style="height: 100%"
      position="bottom"
    >
      <update-name
        v-if="isUpdateNameShow"
        v-model="UserProfile.name"
        @close="isUpdateNameShow = false"
      />
    </van-popup>
    <!-- /编辑昵称 -->

    <!-- 编辑性别 -->
    <van-popup v-model="isUpdateGenderShow" position="bottom">
      <update-gender
        v-if="isUpdateGenderShow"
        v-model="UserProfile.gender"
        @close="isUpdateGenderShow = false"
      />
    </van-popup>
    <!-- /编辑性别 -->

    <!-- 编辑生日 -->
    <van-popup v-model="isUpdateBirthdayShow" position="bottom">
      <update-birthday
        v-if="isUpdateBirthdayShow"
        v-model="UserProfile.birthday"
        @close="isUpdateBirthdayShow = false"
      />
    </van-popup>
    <!-- /编辑生日 -->

    <!-- 编辑头像 -->
    <van-popup
      v-model="isUpdatePhotoShow"
      position="bottom"
      style="height: 100%"
    >
      <update-photo
        v-if="isUpdatePhotoShow"
        :img="img"
        @close="isUpdatePhotoShow = false"
        @update-photo="UserProfile.photo = $event"
      ></update-photo>
    </van-popup>
    <!-- /编辑头像 -->
  </div>
</template>

<script>
import { getUserProfile } from "@/api/user";
import UpdateName from "./components/update-name.vue";
import UpdateGender from "./components/update-gender.vue";
import UpdateBirthday from "./components/update-birthday.vue";
import UpdatePhoto from "./components/update-photo.vue";

export default {
  name: "UserProfile",
  props: {},
  data() {
    return {
      UserProfile: {}, //用户个人资料
      isUpdateNameShow: false,
      isUpdateGenderShow: false,
      isUpdateBirthdayShow: false,
      isUpdatePhotoShow: false,
      img: null, //预览图片的地址
    };
  },
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto,
  },
  created() {
    this.loadUserProfile();
  },
  methods: {
    async loadUserProfile() {
      try {
        const { data } = await getUserProfile();
        this.UserProfile = data.data;
      } catch (error) {
        this.$toast.fail("获取用户资料失败！");
      }
    },

    onFileChange() {
      //获取文件对象(路径)
      const file = this.$refs.file.files[0];
      //基于文章对象获取 blob 数据
      this.img = window.URL.createObjectURL(file);
      //展示预览图片
      this.isUpdatePhotoShow = true;
      //file-input 如果选了同一个文件不会触发 change 事件
      // 解决办法就是每次使用完让它的 value 清空
      this.$refs.file.value = "";
    },
  },
};
</script>

<style scoped lang="less">
.user-profile {
  .avatar-cell {
    .van-cell__value {
      display: flex;
      flex-direction: row-reverse;
    }
    .avatar {
      width: 60px;
      height: 60px;
    }
  }
}
</style>
