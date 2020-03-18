<template>
    <div class="w100p h100p prod_choose_class borderbox disflex column-reverse"
         :class="status ? 'show' : '' "
         @click="closeModal">

        <div class="bgfff inner textc lh44">

            <p class="fs14 ca8 ">{{title}}</p>

            <p v-for="(v,k) in allClass" :key="k" class="fs16 c38" :class="choose_id == v.id ? 'cblue fbold' : '' "
               @click.stop="choose_tap(v.id,v.name)">
                {{v.name}}
            </p>

        </div>

    </div>
</template>

<script>
    export default {
        name: "prodChooseClass",
        props: ['title','choose_id', 'allClass' , 'status'],
        methods: {
            choose_tap(id , name) {
                this.$emit('choose_tap', id , name)
            },
            closeModal(){
                this.$emit('closeModal')
            }
        }
    }
</script>

<style>
    .prod_choose_class {
        position: fixed;
        left: 0;
        background: rgba(0, 0, 0, .5);
        z-index: 100;
        bottom: -100%;
        transition: .2s;
    }

    .prod_choose_class.show {
        bottom: 0;
    }

    .prod_choose_class .inner {
        border-radius: 10upx 10upx 0 0;
    }
</style>