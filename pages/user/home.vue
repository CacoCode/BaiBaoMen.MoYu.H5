<template name="user">
	<view>
		<cu-custom bgColor="bg-green">
			<block slot="content">我的</block>
		</cu-custom>
		<view class="page">
			<view class="user-top">
				<view style="text-align: center;">
					<!-- <view class="avatar-view"></view> -->
					<view v-if="isHaveSession" class="cu-avatar round avatar-view" :style="avatarUrlStyle" @tap="detail"></view>
					<view v-if="isHaveSession" class="name-view">
						{{user.nickName}}
					</view>
					<view v-if="isHaveSession" class="cu-capsule radius">
						<view class='cu-tag bg-gradual-pink'>
							本月排名
						</view>
						<view class="cu-tag line-pink">
							<text class="text-bold">{{user.rank}}</text>
						</view>
					</view>
					<view v-if="isHaveSession" class="cu-capsule radius">
						<view class='cu-tag bg-gradual-orange '>
							本月积分
						</view>
						<view class="cu-tag line-orange">
							<text class="text-bold">{{user.integral}}</text>
						</view>
					</view>
					<view v-if="!isHaveSession" class="cu-avatar round avatar-view" style="background-image:url(./static/logo.png)"></view>
					<view v-if="!isHaveSession">
						<button class="login-btn bg-gradual-orange" type="primary" @click="login">
							登录
						</button>
					</view>
				</view>
			</view>


			<view class="cu-list grid" :class="['col-' + gridCol,gridBorder?'':'no-border']">
				<view class="cu-item" v-for="(item,index) in cuIconList" @tap="toChild" :data-url="item.url"
					:key="index" v-if="index<gridCol*2">
					<view :class="['cuIcon-' + item.cuIcon,'text-' + item.color]"></view>
					<text>{{item.name}}</text>
				</view>
			</view>

			<view class="cu-list menu sm-border card-menu margin-top">
				<view class="cu-item arrow" @tap="rule">
					<view class="content">
						<text class="cuIcon-newshotfill text-red  margin-right-xs"></text>
						<text class="text-grey">打卡规则</text>
					</view>

				</view>

				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-rankfill text-green  margin-right-xs"></text>
						<text class="text-grey">微信步数</text>
					</view>
					<view class="action">
						<view class="cu-tag round bg-green light">{{WeRunStep}}</view>
						<button class="cu-btn round bg-gradual-green shadow shoubao" :disabled="!isHaveSession" @tap="postWeRun">上报</button>
					</view>
				</view>

			</view>

		</view>
		<view class="cu-load load-modal" v-if="loadModal">
			<!-- <view class="cuIcon-emojifill text-orange"></view> -->
			<image src="/static/logo-t.png" mode="aspectFit"></image>
			<view class="gray-text">加载中...</view>
		</view>

		<view class="cu-modal " :class="modalName=='Error'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">提示</view>
				</view>
				<view class="padding-xl">
					{{errorMessage}}
				</view>
				<view class="cu-bar bg-white">
					<view class="action margin-0 flex-sub solid-left" @tap="hideModal">我知道了</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import request from "../../services/request.service.js";
	import storage from "../../services/storage.service.js";
	export default {
		name: "user",
		data() {
			return {
				user: {},
				avatarUrlStyle: "",
				avatarUrlDefaultStyle:'',
				isShowEdit: false,
				loadModal: false,
				cuIconList: [{
					cuIcon: 'picfill',
					color: 'yellow',
					url: "",
					name: '图像'
				}, {
					cuIcon: 'upstagefill',
					color: 'cyan',
					url: "/pages/user/rank",
					name: '排行榜'
				}, {
					cuIcon: 'discoverfill',
					color: 'purple',
					url: "",
					name: '发现'
				}],
				gridCol: 3,
				gridBorder: false,
				WeRunStep: 0,
				modalName: null,
				errorMessage: "",
				isHaveSession: false
			};
		},
		created() {
			uni.showShareMenu();
			this.isHaveSession = storage.get("Session");
			console.log(this.isHaveSession);
			// this.avatarUrlDefaultStyle = "background-image:url(" + user.avatarUrl + ")"
			if(this.isHaveSession)
			{
				this.loadModal = true;
				var user = storage.getUser();
				request.get("api/services/client/WxUser/GetWxUser?id=" + user.id)
					.then(([error, data]) => {
						this.loadModal = false;
						console.log(data.data.result)
						this.user = data.data.result
						storage.setUser(this.user);
						this.avatarUrlStyle = "background-image:url(" + user.avatarUrl + ")"
					});
				this.getWeRun();
			}
		},

		methods: {
			toChild(e) {
				if (!e.currentTarget.dataset.url) {
					uni.showToast({
						title: '此功能正在开发中',
						duration: 2000,
						icon: 'none'
					});
				} else {
					uni.navigateTo({
						url: e.currentTarget.dataset.url
					})
				}

			},
			detail() {
				uni.navigateTo({
					url: "/pages/user/detail"
				})
			},
			rule() {
				uni.navigateTo({
					url: "/pages/user/rule"
				})
			},
			getWeRun() {
				var sessionKey = storage.get("WxLogin");
				var that = this;
				wx.getWeRunData({
					success(res) {
						// 拿 encryptedData 到开发者后台解密开放数据
						const encryptedData = res.encryptedData
						console.log("encryptedData", res)
						request.get("api/services/client/WxUser/GetCurrentStep", {
								"iv": res.iv,
								"encryptedData": res.encryptedData,
								"sessionKey": sessionKey
							})
							.then(([error, data]) => {
								console.log(data.data.result)
								that.WeRunStep = data.data.result;
							});
					}
				})
			},
			postWeRun() {
				this.loadModal = true;
				var user = storage.getUser();
				request.post("api/services/client/MoYuRecord/PostStep", {
						"wxUserId": user.id,
						"step": this.WeRunStep
					})
					.then(([error, data]) => {
						this.loadModal = false;
						if (data.data.success == false) {
							this.errorMessage = data.data.error.message;
							this.modalName = "Error";
						} else {
							uni.showToast({
								title: '上报成功',
								duration: 2000
							});
						}

						console.log(data)
					});
			},
			hideModal(e) {
				this.modalName = null
			},
			login()
			{
				uni.redirectTo({
					url: '/pages/index/login'
				});
			}
		},

	}
</script>

<style>
	.login-btn {
		border-radius: 80rpx;
		margin: 70rpx 0;
		font-size: 30rpx;
	}
	.user-top {
		height: 30vh;
		background-color: #39B54A;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.avatar-size {
		width: 200rpx;
		height: 200rpx;
	}

	.avatar-view {
		width: 200rpx;
		height: 200rpx;
		border: #FFFFFF solid 4rpx;
		margin-top: 20rpx;
	}

	.name-view {
		font-size: 36rpx;
		font-weight: bold;
		color: #FFFFFF;
		margin-top: 20rpx;
		margin-bottom: 20rpx;
	}

	.top-view {
		font-size: 28rpx;
		color: #FFFFFF;
		margin-top: 20rpx;
	}

	.user-mid {
		background-color: #FFFFFF;

	}

	.shoubao {
		margin-left: 30rpx;
	}
</style>
