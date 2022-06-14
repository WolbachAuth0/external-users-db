const mongoosePaginate = require('mongoose-paginate-v2')
const { Schema, model } = require('mongoose')
const User = require('./../library/User')

//https://mongoosejs.com/docs/schematypes.html#schematype-options

const schema = {
  email: { type: String, required: true, trim: true, unique: true, index: true },
  hash: { type: String, required: true },
  verified: { type: Boolean, default: false },
  profile: { type: Object, required: false, default: {} }
}
const options = { timestamps: true }
const userSchema = new Schema(schema, options)
userSchema.loadClass(User)
userSchema.plugin(mongoosePaginate)
const UserModel = model('User', userSchema)

module.exports = UserModel
