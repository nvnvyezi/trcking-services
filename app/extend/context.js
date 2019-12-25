module.exports = {
  /**
   * 自定义响应body
   *
   * @param {boolean} [bool=true] 请求是否正确响应
   * @param {*} obj 响应body 自定义部分
   * @return {{status: boolean}} 响应body
   */
  responseBody(bool = true, obj = {}) {
    return { status: bool, ...obj }
  },
  /**
   * validate date with rules
   *
   * @param {*} rules validate rule object [parameter](https://github.com/node-modules/parameter)
   * @param {*} date validate target
   */
  validate(rules, date) {
    const errors = this.app.validator.validate(rules, date)
    return errors
  },
}
