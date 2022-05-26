<template>
	<view>
		<cu-custom bgColor="bg-gradual-green" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">摸鱼</block>
		</cu-custom>
		<form>
			<view class="cu-bar bg-white margin-top">
				<view class="action">
					图片上传
				</view>
				<view class="action">
					{{imgList.length}}/1
				</view>
			</view>
			<view class="cu-form-group">
				<view class="grid col-4 grid-square flex-sub">
					<view class="bg-img" v-for="(item,index) in imgList" :key="index" @tap="ViewImage"
						:data-url="imgList[index]">
						<image :src="imgList[index]" mode="aspectFill"></image>
						<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
							<text class='cuIcon-close'></text>
						</view>
					</view>
					<view class="solids" @tap="ChooseImage" v-if="imgList.length<1">
						<text class='cuIcon-cameraadd'></text>
					</view>
				</view>
			</view>
			<view class="cu-form-group">
				<view class="title">时间选择</view>
				<picker mode="time" :value="time" start="00:01" end="23:50" @change="TimeChange">
					<view class="picker">
						{{time}}
					</view>
				</picker>
			</view>
			<view class="cu-form-group margin-top">
				<textarea maxlength="-1" @input="textareaAInput" placeholder="说点啥..."></textarea>
			</view>

			<view class="padding flex flex-direction">
				<button class="cu-btn bg-green margin-tb-sm lg" @tap="LoadModal">摸鱼</button>
			</view>
			<view class="cu-load load-modal" v-if="loadModal">
				<!-- <view class="cuIcon-emojifill text-orange"></view> -->
				<image src="/static/logo-t.png" mode="aspectFit"></image>
				<view class="gray-text">加载中...</view>
			</view>
		</form>

		<view class="cu-modal " :class="modalName=='Error'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">提示</view>
				</view>
				<view class="padding-xl">
					{{errorMessage}}
				</view>
				<view class="cu-bar bg-white">
					<view class="action margin-0 flex-sub  solid-left" @tap="hideModal">我知道了</view>
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	import BASE_URL from "../../services/environment.service.js";
	import request from "../../services/request.service.js";
	import storage from "../../services/storage.service.js";

	export default {
		data() {
			return {
				index: -1,
				loadModal: false,
				imgList: [],
				modalName: null,
				textareaAValue: '',
				uploadFilePath: '',
				errorMessage: "",
				time: new Date().getHours() + ':' + (new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() :
					new Date().getMinutes()),
			};
		},
		methods: {

			ChooseImage() {
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'],
					success: (res) => {
						console.log('chooseImage', res)
						if (this.imgList.length != 0) {
							this.imgList = this.imgList.concat(res.tempFilePaths)
						} else {
							this.imgList = res.tempFilePaths
						}
						this.loadModal = true;
						uni.uploadFile({
							url: BASE_URL + "api/services/client/File/UploadImage", //仅为示例，非真实的接口地址
							filePath: res.tempFilePaths[0],
							header: {
								"content-type": "application/json"
							},
							name: "file",
							success: (uploadFileRes) => {
								console.log(uploadFileRes.data);
								var data = JSON.parse(uploadFileRes.data);
								this.uploadFilePath = data.result.path
								this.loadModal = false;
							}
						});
					}
				});
			},
			ViewImage(e) {
				uni.previewImage({
					urls: this.imgList,
					current: e.currentTarget.dataset.url
				});
			},
			DelImg(e) {
				uni.showModal({
					title: '提示',
					content: '确定要删除这张照片吗？',
					cancelText: '取消',
					confirmText: '确定',
					success: res => {
						if (res.confirm) {
							this.imgList.splice(e.currentTarget.dataset.index, 1)
						}
					}
				})
			},
			LoadModal(e) {
				var isHaveSession = storage.get("Session");
				if (isHaveSession) {
					this.loadModal = true;
					var user = storage.getUser();
					request.post("api/services/client/MoYuRecord/Create", {
							wxUserId: user.id,
							imageUrl: this.uploadFilePath,
							desc: this.textareaAValue,
							moYuRealTime: this.time,
							openId: user.openId
						})
						.then(([error, res]) => {
							if (res.data.success == true) {
								this.loadModal = false;

								uni.redirectTo({
									url: '/pages/index/index'
								});
							} else {
								this.loadModal = false;
								this.errorMessage = res.data.error.message;
								this.modalName = "Error";
							}

						});
				} else {
					uni.redirectTo({
						url: '/pages/index/login'
					});
				}
			},
			textareaAInput(e) {
				this.textareaAValue = e.detail.value
			},
			hideModal(e) {
				this.modalName = null
			},
			TimeChange(e) {
				this.time = e.detail.value
			},
		}
	}
</script>

<style>
	.cu-form-group .title {
		min-width: calc(4em + 15px);
	}
</style>
