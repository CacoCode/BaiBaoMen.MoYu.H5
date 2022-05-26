<template>
	<view>
		<home v-if="PageCur=='home'"></home>
		<user v-if="PageCur=='user'"></user>
		<view class="cu-bar tabbar bg-white shadow foot">
			<view class="action" @click="NavChange" data-cur="home">
				<view :class="PageCur=='home'?'text-green':'text-gray'">
					<view class="cuIcon-homefill"></view>
					鱼塘
				</view>
			</view>

			<view class="action text-gray add-action">
				<button class="cu-btn cuIcon-add bg-green shadow"  @click="go"></button>
				摸鱼
			</view>

			<view class="action text-gray" @click="NavChange" data-cur="user">
				<view :class="PageCur=='user'?'text-green':'text-gray'">
					<view class="cuIcon-my"></view>
					我的
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				PageCur: 'home'
			}
		},
		methods: {
			NavChange: function(e) {
				this.PageCur = e.currentTarget.dataset.cur
			},
			go: function() {
				uni.navigateTo({
					url: './form'
				});
			}
		},
		onLoad: function (option) {
			this.PageCur = option.pageCur
		},
		created() {
			uni.showShareMenu();
		}
	}
</script>

<style>

</style>
