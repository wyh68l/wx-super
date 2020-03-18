<template>
    <div class="disflex fs18 textc lh49 fix_bottom bte8">
        <span class="w50p ca8 bgfff" @click="page_turn(left.url)">{{left.text}}</span>
        <span class="w50p bg_line_blue cfff" @click="page_turn(right.url)">{{right.text}}</span>
    </div>
</template>

<script>

    export default {
        name: '',
        props:['left' , 'right'],
        components: {},
        data() {
          return {

          }
        },
        mounted() {

        },
        methods: {
            page_turn(url){
                this.$emit('page_turn',url);
            }
        }
    }
</script>

<style>

</style>
