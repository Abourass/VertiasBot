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

  router.post('/createSecToken', (req, res) => {
    let token = new Token({
      userId: req.body.id,
      userFullName: req.body.name,
      securityToken: Math.floor((Math.random() * 10000) + 1)
    })
    let errors = req.validationErrors()
    if (errors) {
      res.json({ success: false, msg: errors })
    } else {
      token.save().catch(err => console.log(err))
      res.json({ success: true, msg: token.securityToken })
    }
  })

  app.on(`*`, async context => {
    context.log({ event: context.event, action: context.payload.action })
  })
}
