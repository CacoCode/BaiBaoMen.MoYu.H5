<template>
	<view>
		<cu-custom bgColor="bg-gradual-green" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">个人中心</block>
		</cu-custom>
		<view class="cu-list menu sm-border card-menu margin-top">
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-appreciatefill text-red  margin-right-xs"></text>
					<text class="text-grey">本月打卡次数</text>
				</view>
				<view class="action">
					<view class="cu-tag round bg-olive light">{{user.moYuCount}}</view>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-selectionfill text-orange margin-right-xs"></text>
					<text class="text-grey">本月累计积分</text>
				</view>
				<view class="action">
					<view class="cu-tag round bg-orange light">{{user.integral}}</view>
				</view>
			</view>
			<view class="cu-item">
				<view class="content">
					<text class="cuIcon-peoplefill text-green"></text>
					<text class="text-grey">真实姓名</text>
				</view>
				<view class="action">
					<input style="text-align: right;" placeholder="打卡统计姓名" name="nickName" v-model="nickName"></input>
				</view>
			</view>
		</view>

		<view class="padding flex flex-direction">
			<button class="cu-btn bg-green margin-tb-sm lg" @tap="LoadModal">修改</button>
		</view>
		<view class="cu-load load-modal" v-if="loadModal">
			<!-- <view class="cuIcon-emojifill text-orange"></view> -->
			<image src="/static/logo.png" mode="aspectFit"></image>
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
					<view class="action margin-0 flex-sub  solid-left" @tap="hideModal">我知道了</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import request from "../../services/request.service.js";
	import storage from "../../services/storage.service.js";
	export default {
		data() {
			return {
				nickName: "",
				loadModal: false,
				user: {},
				modalName: null,
				errorMessage: "",
			}

		},
		methods: {
			LoadModal(e) {
				this.loadModal = true;

				request.put("api/services/client/WxUser/UpdateNickName", {
						id: this.user.id,
						nickName: this.nickName
					})
					.then(([error, res]) => {
						if (res.data.success == true) {
							this.loadModal = false;
							this.user.nickName = this.nickName;
							storage.setUser(this.user);
							uni.redirectTo({
								url: '/pages/index/index?pageCur=user'
							});
						} else {
							this.loadModal = false;
							console.log(res.data);
							this.errorMessage = res.data.error.message;
							this.modalName = "Error";
						}

					});
			},
		},
		created() {
			this.user = storage.getUser();
			console.log(this.user)
			this.nickName = this.user.nickName;
		}
	}
</script>

<style>
</style>
