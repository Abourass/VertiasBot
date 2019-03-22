
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TokenSchema = new Schema({
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
mongoose.model('token', TokenSchema)
