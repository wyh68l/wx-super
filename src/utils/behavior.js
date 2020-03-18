import axios from "./request";

/**
 *
 * @param {any} companyId 被查看的企业id
 * @param {any} shareType 分享类型  1:名片，2:商品，3:预约，4:文章
 * @param {any} itemId 分享对象id 名片id、商品id、预约产品id、文章i
 * @param {any} uuid
 */
function addShareRecord(companyId, shareType, itemId, uuid) {
  return axios
    .POST(
      {
        companyId,
        shareType,
        itemId,
        uuid
      },
      "",
      "/shareRecord/addShareRecord"
    )
    .then(res => {
      return res;
    })
    .catch(err => {});
}

/**
 *
 * @param {any} shareRecordId 分享id
 */
function openShare(shareRecordId) {
  axios
    .POST(
      {
        uuid: shareRecordId
      },
      "",
      "/shareRecord/addOpenShareCount"
    )
    .then()
    .catch(err => {});
}
export { addShareRecord, openShare };
