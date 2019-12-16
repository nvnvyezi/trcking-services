const Service = require('egg').Service

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
    const users = await this.ctx.model.User.find()
    return users
  }

  /**
   *查询一个用户
   *
   * @param {string} uid  用户name
   * @param {string} password  用户密码
   * @param {string} team  用户team
   * @return {MongoUser} 某个具体的用户
   * @memberof UserService
   */
  async find(uid, password, team) {
    const users = await this.ctx.model.User.find({
      username: uid,
      password,
      team,
    })
    return users
  }
}

module.exports = UserService
