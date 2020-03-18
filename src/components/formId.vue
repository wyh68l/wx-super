<template>
  <form report-submit @submit="submitOrder">
    <label for="btn">
      <slot></slot>
      <button form-type="submit" id="btn" style="display: none"></button>
    </label>
  </form>
</template>

<script>
  import WXAJAX from '../utils/request'

  export default {
    name: "formId",
    methods:{
      submitOrder(e) {
        console.log('formid', e)
        if ('the formId is a mock one' == e.mp.detail.formId) return;

        WXAJAX.POST({
          formId: e.detail.formId,
          type: 1,
        }, '', '/personal/addFormId');
      }
    }
  }
</script>

<style scoped>

</style>
