<template>
  <div>
    <div class="c-textarea fs16">
      <label class="fbold lh49 c38">{{title}}</label>
      <div class="pb10 lh22">
            <textarea name="" v-model="text"
                      v-if="showTextarea"
                      @blur="this.showTextarea = false"
                      @input="upDateValue"
                      :focus="showTextarea"
                      maxlength="200"
                      class="textarea"
                      :placeholder="placeholder">
                </textarea>
        <div class="textarea"
             :class="{'empty': !text}"
             @click="showTextarea=true"
             v-else
        >
          {{text || placeholder}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "CTextarea",
    props: {
      title: {
        type: String,
        default: '',
      },
      placeholder: {
        type: String,
        default: '请输入',
      },
      value:{
        type: String,
        default: '',
      }
    },
    data(){
      return {
        showTextarea: false,
        text: '',
      }
    },
    mounted(){
      this.text = this.value;
    },
    methods:{
      upDateValue(){
        this.$emit('updateValue', this.text);
      },
    },
    watch:{
      value(){
        this.text = this.value;
      }
    },
  }
</script>

<style scoped>
  .c-textarea{

  }
  .textarea{
    width: 100%;
    min-height: 300upx;
    color: #333;
  }
  .empty{
    color: #a8a8a8;
  }
</style>
