<template>
  <div class="bgfff pl15 pt15 pr15 card3">
    <div class="posre h213 overhidden">
      <img
        src="https://hq-one-stand.oss-cn-shenzhen.aliyuncs.com/yimai_photos/user/card3_bg.png"
        alt
        class="posab left0 top0 card3_bg w100p h100p"
      />

      <div class="cacrd3_left">
        <p class="fs12 cfff pb6">{{card_msg.tel || '电话'}}</p>
        <p class="fs12 cfff">{{card_msg.email || '邮箱'}}</p>
      </div>

      <div class="card3_right">
        <p
          style="width:102px;font-size:14px;"
          class="fs20 cdeepblue fbold"
        >{{card_msg.username || '姓名'}}</p>
        <p class="fs10 cdeepgreen">{{card_msg.post || '职位'}}</p>
      </div>

      <div class="align-cen fs10 ce8 card_company disflex">
        <span class="pr14">{{card_msg.company || '公司名称'}}</span>
        <div class="card_line_2"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "card_4",
  props: ["card_msg"]
};
</script>

<style>
.pb6 {
  margin-top: 26upx;
  padding-bottom: 18upx;
}
.card_line_2 {
  position: relative;
}

.card_line_2::before,
.card_line_2::after {
  position: absolute;
  width: 6upx;
  height: 16upx;
  background: #fff;
  top: 0;
  bottom: 0;
  margin: auto;
  content: "";
}

.card_line_2::before {
  right: 0;
}

.card_line_2::after {
  right: 10upx;
}

.card_company {
  position: absolute;
  right: 68upx;
  bottom: 30upx;
}

.card3 .cacrd3_left {
  position: absolute;
  left: 106upx;
  top: 96upx;
}

.card3 .card3_right {
  position: absolute;
  left: 398upx;
  top: 98upx;
}
</style>
