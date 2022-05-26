<template>
	<view>
		<view class="DrawerPage" :class="drawerName=='viewModal'?'show':''">
			<cu-custom bgColor="bg-gradual-green" :isBack="true">
				<block slot="backText">返回</block>
				<block slot="content">摸鱼</block>
			</cu-custom>
			<form>
				<view class="cu-bar bg-white margin-top">
					<view class="action">
						拍照上传
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

				<!-- !!!!! placeholder 在ios表现有偏移 建议使用 第一种样式 -->
				<view class="cu-form-group margin-top">
					<textarea maxlength="-1" @input="textareaAInput" placeholder="说点啥..."></textarea>
				</view>
				<view class="cu-bar bg-white solid-bottom margin-top">
					<view class="action">
						<text class="cuIcon-titles text-green "></text> 一键帮摸
					</view>
					<view class="action">
						<switch :class="isMany?'checked':''" :checked="isMany?true:false" @change="IsMany"></switch>
					</view>
				</view>
				<view class="margin cu-avatar-group" v-if="isMany">
					<view class="padding-lr cu-avatar round lg" v-for="(item,index) in selectWxUsers" :key="index"
						:style="[{ backgroundImage:'url(' + item.avatarUrl + ')' }]"></view>
					<view class="cu-avatar lg round add-user" @tap="showDrawerModal" data-target="viewModal">
						<text class="lg text-gray cuIcon-add"></text>
					</view>
				</view>

				<view class="padding flex flex-direction">
					<button class="cu-btn bg-green margin-tb-sm lg" @tap="LoadModal">摸鱼</button>
					<navigator class="other-type" url="/pages/index/form-one" hover-class="navigator-hover">
						已有照片或集体摸鱼请点击这里
					</navigator>
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
		<view class="DrawerClose" :class="drawerName=='viewModal'?'show':''" @tap="hideDrawerModal">
			<text class="cuIcon-pullright"></text>
		</view>
		<scroll-view scroll-y class="DrawerWindow" :class="drawerName=='viewModal'?'show':''">
			<checkbox-group class="block" @change="CheckboxChange">
				<view class="cu-list menu-avatar margin-top-xl margin-bottom-xl card-menu radius shadow-lg">
					<view class="cu-item" v-for="(item,index) in wxUsers" :key="index">

						<view class="cu-avatar round lg" :style="[{ backgroundImage:'url(' + item.avatarUrl + ')' }]">
						</view>
						<view class="content">
							<view class="text-grey">
								{{item.nickName}}
							</view>

						</view>
						<view class="action" style="width: 120rpx;">

							<checkbox v-if="!item.isLocked" :class="item.isChecked?'checked':''"
								:checked="item.isChecked?true:false" :value="item.id"></checkbox>
							<view v-if="item.isLocked" class="text-red">积分已满</view>

						</view>

					</view>
				</view>
			</checkbox-group>
		</scroll-view>
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
				drawerName: null,
				textareaAValue: '',
				uploadFilePath: '',
				errorMessage: "",
				wxUsers: [],
				isMany: false,
				selectWxUsers: [],
				selectWxUserIds: []
			};
		},
		methods: {

			ChooseImage() {
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['camera'],
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
					var togetherWxUserIds = this.selectWxUserIds.toString()
					console.log(togetherWxUserIds)
					request.post("api/services/client/MoYuRecord/Create", {
							wxUserId: user.id,
							imageUrl: this.uploadFilePath,
							desc: this.textareaAValue,
							openId: user.openId,
							togetherWxUsers: togetherWxUserIds
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


			showDrawerModal(e) {
				var isHaveSession = storage.get("Session");
				if (isHaveSession) {
					this.drawerName = e.currentTarget.dataset.target
					this.loadModal = true;
					var user = storage.getUser();
					request.get("api/services/client/WxUser/GetWxUsers?id=" + user.id)
						.then(([error, res]) => {
							if (res.data.success == true) {
								this.loadModal = false;
								this.wxUsers = Object.assign(res.data.result, this.wxUsers);
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
			hideDrawerModal(e) {
				this.drawerName = null
			},
			CheckboxChange(e) {
				this.selectWxUserIds = e.detail.value;
				console.log(this.selectWxUserIds);
				for (var i = 0, lenI = this.wxUsers.length; i < lenI; ++i) {
					this.wxUsers[i].isChecked = false;
					for (var j = 0, lenJ = this.selectWxUserIds.length; j < lenJ; ++j) {
						if (this.wxUsers[i].id == this.selectWxUserIds[j]) {
							this.wxUsers[i].isChecked = true;
							break
						}
					}
				}
				this.selectWxUsers = this.wxUsers.filter(a => a.isChecked);
			},
			IsMany(e) {
				this.isMany = e.detail.value
			},
		}
	}
</script>

<style>
	page {
		background-image: linear-gradient(45deg, #39b54a, #8dc63f);
	}

	.cu-form-group .title {
		min-width: calc(4em + 15px);
	}

	.other-type {
		text-align: center;
		background-color: unset;
		font-size: 28rpx;
		color: #f37b1d;
		text-decoration: underline;
	}

	.add-user {
		background-color: #FFFFFF;
		color: #8dc63f;
		border: #8dc63f 4rpx dashed !important;

	}


	.DrawerPage {
		position: fixed;
		width: 100vw;
		height: 100vh;
		left: 0vw;
		background-color: #f1f1f1;
		transition: all 0.4s;
	}

	.DrawerPage.show {
		transform: scale(0.9, 0.9);
		left: 85vw;
		box-shadow: 0 0 60upx rgba(0, 0, 0, 0.2);
		transform-origin: 0;
	}

	.DrawerWindow {
		position: absolute;
		width: 85vw;
		height: 100vh;
		left: 0;
		top: 0;
		transform: scale(0.9, 0.9) translateX(-100%);
		opacity: 0;
		pointer-events: none;
		transition: all 0.4s;
		padding: 100upx 0;
	}

	.DrawerWindow.show {
		transform: scale(1, 1) translateX(0%);
		opacity: 1;
		pointer-events: all;
	}

	.DrawerClose {
		position: absolute;
		width: 40vw;
		height: 100vh;
		right: 0;
		top: 0;
		color: transparent;
		padding-bottom: 30upx;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.01), rgba(0, 0, 0, 0.6));
		letter-spacing: 5px;
		font-size: 50upx;
		opacity: 0;
		pointer-events: none;
		transition: all 0.4s;
	}

	.DrawerClose.show {
		opacity: 1;
		pointer-events: all;
		width: 15vw;
		color: #fff;
	}

	.DrawerPage .cu-bar.tabbar .action button.cuIcon {
		width: 64upx;
		height: 64upx;
		line-height: 64upx;
		margin: 0;
		display: inline-block;
	}

	.DrawerPage .cu-bar.tabbar .action .cu-avatar {
		margin: 0;
	}

	.DrawerPage .nav {
		flex: 1;
	}

	.DrawerPage .nav .cu-item.cur {
		border-bottom: 0;
		position: relative;
	}

	.DrawerPage .nav .cu-item.cur::after {
		content: "";
		width: 10upx;
		height: 10upx;
		background-color: currentColor;
		position: absolute;
		bottom: 10upx;
		border-radius: 10upx;
		left: 0;
		right: 0;
		margin: auto;
	}

	.DrawerPage .cu-bar.tabbar .action {
		flex: initial;
	}
</style>
