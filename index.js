module.exports = async app => {
  const mongoose = require('mongoose')
  const request = require('request')
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
  const Token = mongoose.model('token', TokenSchema)
  const keys = require('./config/keys')
  const router = app.route('/api')
  router.use(require('express').static('public'))
  mongoose.connect(keys.mongoURI, { useNewUrlParser: true }).then(() => console.log('Atlas is shouldering our burden | Database Aloft!')).catch(err => console.log(err))
  const appGitHub = await app.auth()
  const owner = 'AssetVal'; const repo = 'AssetVal_Veritas'; let tagArray = []; let assArray = []
  router.get('/add', async (req, res) => {
    const installation = await appGitHub.apps.findRepoInstallation({ owner, repo }); const github = await app.auth(installation.data.id)
    const issue = {
      repo: repo,
      owner: owner,
      title: req.query.title,
      body: req.query.body,
      labels: tagArray.unshift(req.query.lab),
      assignees: assArray.unshift(req.query.as)
    }
    await github.issues.create(issue).then(res.send('Success')).catch(err => console.log(err))
  })

  router.get('/createSecToken/id/:uID/name/:userName', (req, res) => {
    Token.findOne({ userId: req.params.uID }).then(token => {
      if (token) {
        res.send({ success: false, msg: 'Token already exist' })
      } else {
        let token = new Token({
          userId: req.params.uID,
          userFullName: req.params.userName,
          securityToken: Math.floor((Math.random() * 10000) + 1)
        })
        token.save().catch(err => console.log(err))
        res.send({ success: true, msg: token.securityToken })
      }
    })
  })

  router.post('/createSecToken/id/:uID/name/:userName', (req, res) => {
    Token.findOne({ userId: req.params.uID }).then(token => {
      if (token) {
        res.send({ success: false, msg: 'Token already exist' })
      } else {
        let token = new Token({
          userId: req.params.uID,
          userFullName: req.params.userName,
          securityToken: Math.floor((Math.random() * 10000) + 1)
        })
        token.save().catch(err => console.log(err))
        res.send({ success: true, msg: token.securityToken })
      }
    })
  })
  
    router.post('/getSecToken/id/:uID/name/:userName', (req, res) => {
    Token.findOne({ userId: req.params.uID }).then(token => {
      if (token) {
        res.send({ token.SecurityToken })
      } else {
        res.send({ success: false, msg: `No token exist for ${req.params.uID}` })
      }
    })
  })

  app.on(`*`, async context => {
    context.log({ event: context.event, action: context.payload.action })
  })
}
