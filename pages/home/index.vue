<template name="home">
	<view>
		<cu-custom bgColor="bg-gradual-green">
			<block slot="content">鱼塘</block>
		</cu-custom>
		<view class="card-list shadow">
			<view class="cu-card dynamic moyu-card" v-for="(item,index) in MoYuRecords" :key="index">
				<view class="cu-item shadow">
					<view class="cu-tag bg-gradual-orange" v-if="item.moYuType==0">照片</view>
					<view class="cu-tag bg-gradual-purple" v-else>步数</view>
					<view class="cu-list menu-avatar">
						<view class="cu-item">
							<view class="cu-avatar round lg" :style="item.wxUserAvatarUrlStyle">
							</view>
							<view class="content flex-sub">
								<text class="text-bold text-green">{{item.wxUserNickName}}</text>
								<view class="cu-tag line-cyan moyu-tag">{{item.hour}}</view>
								<view class="cu-tag bg-cyan moyu-tag">{{item.date}}</view>
							</view>
						</view>
					</view>
					<view class="text-content" v-if="item.desc">
						{{item.desc}}
					</view>
					<view class="grid flex-sub padding-lr col-1 image-grid" v-if="item.imageUrl">
						<view class="bg-img only-img" :style="item.imageUrlStyle" @tap="ViewImage"
							:data-url="item.imageUrl">
						</view>
					</view>

					<view class="cu-list menu" v-if="item.togetherWxUserIds.length>0">
						<view class="cu-item">
							<view class="content">
								<text class="cuIcon-noticefill text-orange"></text>
								<text class="text-grey text-sm">{{item.togetherWxUserIds.length}}人跟随打卡</text>
							</view>
							<view class="action">
								<view class="cu-avatar-group costom-a">
									<view class="cu-avatar round sm"
										v-for="(togetherWxUser,index) in item.togetherWxUserAvatarUrl" :key="index"
										:style="[{ backgroundImage:'url(' + togetherWxUser + ')' }]">
									</view>


								</view>

							</view>
						</view>
					</view>

				</view>

			</view>
		</view>
		<view class="nonething"></view>
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
		name: "home",
		data() {
			return {
				MoYuRecords: [],
				loadModal: false
			};
		},
		created() {
			uni.showShareMenu();
			this.loadModal = true;
			request.get("api/services/client/MoYuRecord/GetMoYuRecords")
				.then(([error, res]) => {
					this.loadModal = false;
					this.MoYuRecords = res.data.result;
					console.log(res.data.result)
				});
		},
		methods: {
			ViewImage(e) {
				uni.previewImage({
					urls: [e.currentTarget.dataset.url],
					current: e.currentTarget.dataset.url
				});
			}
		}
	}
</script>

<style>
	/* .moyu-card{
		margin-bottom: 0rpx;
	} */

	.costom-a {
		width: 400rpx;

		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.image-grid {
		margin-bottom: 20rpx;
	}

	.cu-timeline {
		padding: 20rpx;
		padding-bottom: 100rpx;
	}

	.moyu-tag {
		float: right;
	}

	.moyu-capsule {
		width: 100%;
		display: inherit;
	}

	.cu-item::after {
		border-bottom: unset !important;
	}

	.nonething {
		height: 160rpx;
	}
</style>
