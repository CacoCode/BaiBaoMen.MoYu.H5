<template>
	<view>
		<cu-custom bgColor="bg-gradual-green">
			<block slot="content">授权登录</block>
		</cu-custom>
		<view class="login-page">
			<view>
				<view class='header'>
					<image :src='imageUrl'></image>
				</view>
				<view class='content'>
					<view>申请获取以下权限</view>
					<text>获得你的公开信息(昵称、头像、运动步数)</text>
				</view>

			</view>
			<button class="login-btn" type="primary" @click="getUserInfo">
				授权登录
			</button>
		</view>

	</view>
</template>

<script>
	import request from "../../services/request.service.js";
	import storage from "../../services/storage.service.js";
	export default {
		data() {
			return {
				imageUrl: require('../../static/logo.png')
			}
		},
		methods: {
			getUserInfo() {
				// 展示加载框
				uni.showLoading({
					title: '加载中',
				});
				uni.getUserProfile({
					desc: '登录后可同步数据',
					success: async (obj) => {
						console.log('obj', obj);
						uni.login({
							provider: 'weixin',
							success: (res) => {
								this.code = res.code;

								if (res.errMsg == 'login:ok') {
									request.post("api/services/client/WxUser/CreateWxUser", {
											code: this.code,
											avatarUrl: obj.userInfo.avatarUrl,
											nickName: obj.userInfo.nickName
										})
										.then(([error, data]) => {
											uni.redirectTo({
												url: '/pages/index/index'
											});
											console.log("user", data.data.result)
											storage.setUser(data.data.result)
											storage.set("WxLogin", data.data.result.sessionKey)
											storage.set("Session", true);
										});
								}
							},
						});
					},
					fail: () => {
						uni.showToast({
							title: '授权已取消',
							icon: 'error',
							mask: true,
						});
					},
					complete: () => {
						// 隐藏loading
						uni.hideLoading();
					},
				});
			},
		},
		created() {

		}
	}
</script>

<style>
	.login-page {
		padding: 100rpx;
	}

	.header {
		margin: 30rpx 0;
		border-bottom: 1px solid #ccc;
		text-align: center;
		line-height: 350rpx;
	}

	.header image {
		width: 200rpx;
		height: 200rpx;
		border-radius: 50%;
	}

	.content {}

	.content text {
		display: block;
		color: #9d9d9d;
		margin-top: 40rpx;
	}

	.login-btn {
		border-radius: 80rpx;
		margin: 70rpx 0;
		font-size: 35rpx;
	}
</style>
