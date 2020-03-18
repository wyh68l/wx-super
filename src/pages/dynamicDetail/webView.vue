<template>
	<web-view :src="src"></web-view>
</template>
<script>
export default {
	data() {
		return {
			src: ''
		}
	},
	onLoad() {
		console.log(this.$root.$mp.query)
		this.src = this.$root.$mp.query.url
		console.log(this.src)
	}
}
</script>