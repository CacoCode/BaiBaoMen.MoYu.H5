<template>
	<view>
		<cu-custom bgColor="bg-gradual-green" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">打卡规则</block>
		</cu-custom>


		<view class="cu-bar bg-white solid-bottom">
			<view class="action">
				<text class="cuIcon-title text-blue"></text>
				<view class="padding">工作时间打卡，获取<text class="text-red">1</text>积分。</view>
			</view>
		</view>
		<view class="cu-bar bg-white solid-bottom">
			<view class="action">
				<text class="cuIcon-title text-blue"></text>
				<view class="padding">非工作时间打卡，获取<text class="text-red">2</text>积分。</view>
			</view>
		</view>
		<view class="cu-bar bg-white solid-bottom">
			<view class="action">
				<text class="cuIcon-title text-blue"></text>
				<view class="padding">当日步行<text class="text-red">10000步以上（包含10000步）</text>，可上报获取<text
						class="text-red">2</text>积分。</view>
			</view>
		</view>
		<view class="cu-bar bg-white solid-bottom">
			<view class="action">
				<text class="cuIcon-title text-blue"></text>
				<view class="padding">以上三项积分不叠加，每日最多可获取<text class="text-red">2</text>积分。</view>
			</view>
		</view>
		<view class="cu-bar bg-white solid-bottom">
			<view class="action">
				<text class="cuIcon-title text-blue"></text>
				<view class="padding">打卡仅限于在官方给定范围之内有效。</view>
			</view>
		</view>
		<view class="cu-bar bg-white solid-bottom">
			<view class="action">
				<text class="cuIcon-title text-blue"></text>
				<view class="padding">打卡只能当日进行上传或上报，不得次日或以后补卡。</view>
			</view>
		</view>
		<view class="cu-bar bg-white solid-bottom">
			<view class="action">
				<text class="cuIcon-title text-blue"></text>
				<view class="padding">比赛时间为每个自然月的一日到月底，次月一日公布名次。</view>
			</view>
		</view>
		<view class="cu-bar bg-white solid-bottom">
			<view class="action">
				<text class="cuIcon-title text-blue"></text>
				<view class="padding">每月打卡次数超过<text class="text-red">10</text>天的，方有获奖资格。累计积分第一名🥇将获得BOSS亲自颁发的<text
						class="text-price text-red">200.00</text>最佳鱼王奖，多人并列第一则平分奖金。</view>
			</view>
		</view>
		<view class="cu-bar bg-white solid-bottom">
			<view class="action">
				<text class="cuIcon-title text-blue"></text>
				<view class="padding">请点击头像进入个人页面，将昵称修改为真实名字，用来做月底统计使用。</view>
			</view>
		</view>
		<view class="cu-bar bg-white solid-bottom">
			<view class="action">
				<text class="cuIcon-title text-blue"></text>
				<view class="padding">本程序将自动区分工作时间段与非工作时间段。</view>
			</view>
		</view>
		<view class="cu-load load-modal" v-if="loadModal">
			<image src="/static/logo.png" mode="aspectFit"></image>
			<view class="gray-text">加载中...</view>
		</view>


	</view>
</template>

<script>
	import request from "../../services/request.service.js";
	import storage from "../../services/storage.service.js";
	export default {
		data() {
			return {}

		},
		methods: {

		},
		created() {
			uni.showShareMenu();
		}
	}
</script>

<style>
</style>
