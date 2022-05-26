<template>
	<view>
		<cu-custom :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">排行榜</block>

		</cu-custom>
		<view>
			<scroll-view scroll-x class="bg-white nav text-center">
				<view class="cu-item" :class="index==TabCur?'text-green cur':''" v-for="(item,index) in items"
					:key="index" @tap="tabSelect" :data-id="index">
					{{item}}
				</view>
			</scroll-view>

			<view v-for="(item,index) in items" :key="index" v-if="index==TabCur" class="margin">
				<view class="flex">
					<view class="flex-sub padding-sm margin-xs radius avatar-view">
						<view style="text-align: center;">
							<view class="cu-avatar avatar-top23" :style="{backgroundImage:'url('+top2Style+')'}">
							</view>
							<view class="cu-avatar round avatar-view2" :style="StatisticList[1].wxUserAvatarUrlStyle">
							</view>
							<view class="name-view">
								{{StatisticList[1].nickName}}
							</view>
							<view class="top-view">{{StatisticList[1].integral}}</view>
						</view>
					</view>
					<view class="flex-sub padding-sm margin-xs radius avatar-view">
						<view style="text-align: center;">
							<view class="cu-avatar avatar-top1" :style="{backgroundImage:'url('+top1Style+')'}">
							</view>
							<view class="cu-avatar round avatar-view1" :style="StatisticList[0].wxUserAvatarUrlStyle">
							</view>
							<view class="name-view">
								{{StatisticList[0].nickName}}
							</view>
							<view class="top-view">{{StatisticList[0].integral}}</view>
						</view>
					</view>
					<view class="flex-sub padding-sm margin-xs radius avatar-view">
						<view style="text-align: center;">
							<view class="cu-avatar avatar-top23" :style="{backgroundImage:'url('+top3Style+')'}">
							</view>
							<view class="cu-avatar round avatar-view3" :style="StatisticList[2].wxUserAvatarUrlStyle">
							</view>
							<view class="name-view">
								{{StatisticList[2].nickName}}
							</view>
							<view class="top-view">{{StatisticList[2].integral}}</view>
						</view>
					</view>
				</view>

				<view class="cu-list menu-avatar radius shadow">
					<view class="cu-item" v-for="(item,index) in OtherRanks" :key="index">
						<view class="text-bold text-lg text-black rank-no">{{index+4}}</view>
						<view class="cu-avatar round lg rank-avatar" :style="item.wxUserAvatarUrlStyle">
						</view>
						<view class="content rank-content">
							<view class="text-grey nickname-content">
								{{item.nickName}}
							</view>

						</view>
						<view class="action">
							<view class="text-orange text-bold text-lg">{{item.integral}}</view>
						</view>
					</view>
				</view>


			</view>
		</view>
		<view class="cu-load load-modal" v-if="loadModal">
			<!-- <view class="cuIcon-emojifill text-orange"></view> -->
			<image src="/static/logo-t.png" mode="aspectFit"></image>
			<view class="gray-text">加载中...</view>
		</view>



	</view>
</template>

<script>
	import request from "../../services/request.service.js";
	import storage from "../../services/storage.service.js";
	export default {
		data() {
			return {
				loadModal: true,
				TabCur: 0,
				scrollLeft: 0,
				items: ['本月积分排行', '上月积分排行'],
				tag: 0,
				StatisticList: [],
				OtherRanks: [],
				top1Style: require('../../static/top1.png'),
				top2Style: require('../../static/top2.png'),
				top3Style: require('../../static/top3.png')
			}
		},
		methods: {
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
				console.log(e.currentTarget.dataset.id)
				if (e.currentTarget.dataset.id == 1) {
					this.tag = -1;
				} else {
					this.tag = e.currentTarget.dataset.id;
				}
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
				this.getData();
			},
			getData() {
				this.loadModal = true;
				request.get("api/services/client/WxUser/GetStatisticBy?tag=" + this.tag)
					.then(([error, res]) => {
						this.loadModal = false;
						this.StatisticList = res.data.result;
						this.OtherRanks = res.data.result.slice(3, res.data.result.length);
						console.log(res.data.result)
						console.log(this.OtherRanks)
					});
			}
		},
		created() {
			uni.showShareMenu();
			this.getData();
		},
	}
</script>

<style>
	page {
		background-image: linear-gradient(45deg, #39b54a, #8dc63f);
		color: #ffffff;
	}

	.avatar-view2 {
		width: 150rpx;
		height: 150rpx;
		border: #DCDCDC solid 4rpx;
	}

	.avatar-view1 {
		width: 180rpx;
		height: 180rpx;
		border: #FFD850 solid 4rpx;
	}

	.avatar-view3 {
		width: 150rpx;
		height: 150rpx;
		border: #FFB155 solid 4rpx;
	}

	.avatar-view {
		display: flex;
		align-items: flex-end;
	}

	.avatar-top1 {
		height: 90rpx;
		width: 120rpx;
		background-color: transparent;
		bottom: -26rpx;
	}

	.avatar-top23 {
		height: 74rpx;
		width: 95rpx;
		background-color: transparent;
		bottom: -22rpx;
	}

	.name-view {
		font-size: 36rpx;
		margin-top: 10rpx;
		margin-bottom: 10rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		width: 160rpx;
	}

	.top-view {
		font-size: 36rpx;
		margin-bottom: 10rpx;
	}

	.rank-no {
		position: absolute;
		left: 30rpx;
	}

	.rank-avatar {
		left: 80rpx !important;
	}

	.rank-content {
		left: 196rpx !important;
	}

	.nickname-content {
		overflow: hidden;
		white-space: nowrap;
	}
</style>
