<template>
  <GetPhoneNumber @next="page_turn('index')">
    <p class="fs12 ca8 pb15">{{card_msg.createTime}} 收录</p>
    <div class="bgfff bradius10">
      <BusinessCard :card_msg="card_msg"
                    :type="'plus'"
                    :hasCard="false"
                    :isdel="true"
                    :index="index"
                    @moreTap="moreTap"
                    @shareApp="shareApp"
      ></BusinessCard>
    </div>
  </GetPhoneNumber>
</template>

<script>
  import GetPhoneNumber from '@/components/getPhoneNumber'
  import BusinessCard from '@/components/BusinessCard'

  export default {
    name: "getPhoneNumberCard",
    props:{
      card_msg:{
        type: Object,
        default(){return {}},
      },
      index: {
        type: [String, Number],
        default: '',
      }
    },
    components: { GetPhoneNumber, BusinessCard },
    methods:{
      moreTap(recordId, cardId, isdel){
        this.$emit('moreTap' , recordId, cardId, isdel);
      },
      page_turn(url) {
        this.$emit('page_turn', url, this.card_msg.companyId , this.card_msg.cardId);
      },
    },
  }
</script>

<style scoped>

</style>
