const { Service } = require('egg')

/**
 * 数据库返回用户类型
 *
 * @typedef {{data: {_id: string;username: string;password: string;team: string;email?: string}[]}} MongoUser
 */

class UserService extends Service {
  /**
   *  查询所有用户
   *
   * @return {MongoUser} 所有用户
   * @memberof UserService
   */
  async findAll() {
    const result = await this.ctx.model.User.find()
    return result
  }

  /**
   *查询一个用户
   *
   * @param {{username?: string;email?: string}} querys  用户name
   * @return {MongoUser} 某个具体的用户
   * @memberof UserService
   */
  async find(querys = {}) {
    const result = await this.ctx.model.User.findOne(querys)
    return result
  }

  /**
   *查询一个用户
   *
   * @param {string} uid  用户name
   * @return {MongoUser} 某个具体的用户
   * @memberof UserService
   */
  async findFromName(uid) {
    return this.find({ username: uid })
  }

  /**
   *查询一个用户
   *
   * @param {string} email  用户email
   * @return {MongoUser} 某个具体的用户
   * @memberof UserService
   */
  async findFromEmail(email) {
    return this.find({ email })
  }

  /**
   *查询一个用户
   *
   * @param {string} username  用户id
   * @param {string} password  用户password
   * @return {MongoUser} 某个具体的用户
   * @memberof UserService
   */
  async findFromLogin(username, password) {
    return this.find({ username, password })
  }

  /**
   *插入一个用户
   *
   * @param {{username: string;email: string;password: string;admin: boolean}} params  用户name
   * @return {MongoUser} 某个具体的用户
   * @memberof UserService
   */
  async insert(params) {
    const result = await this.ctx.model.User.create(params)
    return result
  }
}

module.exports = UserService
