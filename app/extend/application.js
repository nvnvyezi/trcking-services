module.exports = {
  /**
   * validate date with rules
   *
   * @param {*} rules validate rule object [parameter](https://github.com/node-modules/parameter)
   * @param {*} date validate target
   */
  validate(rules, date) {
    return this.validator.validate(rules, date)
  },
}
