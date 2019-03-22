const mongoose = require('mongoose')
module.exports = async app => {
  const Schema = mongoose.Schema
  const SecTokenSchema = new Schema({
    userId: {
      type: String
    },
    userFullName: {
      type: String
    },
    securityToken: {
      type: String
    }
  })

  // Create collection and add Schema
  mongoose.model('secToken', SecTokenSchema)
}
