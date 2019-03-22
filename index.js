module.exports = async app => {
  const mongoose = require('mongoose')
  const Token = require('./models/Tokens')
  const keys = require('./config/keys')
  mongoose.connect(keys.mongoURI, { useNewUrlParser: true }).then(() => console.log('Atlas is shouldering our burden | Database Aloft!')).catch(err => console.log(err))
  const appGitHub = await app.auth()
  const router = app.route('/api')
  // Use any middleware
  router.use(require('express').static('public'))
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
    Token.findOne({ userId: req.query.uId }).then(token => {
      if (Token) {
        res.json({success: false, msg: 'Failed. A token for this user has already been generated'})
      } else {
        const newTokenNumber = Math.floor((Math.random() * 10000) + 1)
        const newToken = new Token({
          userId: req.query.uId,
          userFullName: req.query.name,
          securityToken: newTokenNumber
        })
        newToken.save().catch(err => console.log(err))
        res.json({ success: true, msg: `${newTokenNumber}`})
      }
    })
  })

  app.on(`*`, async context => {
    context.log({ event: context.event, action: context.payload.action })
  })
}
