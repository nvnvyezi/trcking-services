module.exports = {
  /**
   * 自定义响应body
   *
   * @param {boolean} [bool=true] 请求是否正确响应
   * @param {*} obj 响应body 自定义部分
   * @return {{success: boolean}} 响应body
   */
  responseBody(bool = true, obj = {}) {
    return { success: bool, ...obj }
  },
}
