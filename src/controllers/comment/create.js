const { mmComment, mmUser, mmNotification, mmContribution } = require('../../database/models')
const { errorResponse, payloadValidator } = require('../../../helpers')
const mailgun = require('mailgun-js')
const DOMAIN = process.env.MAILGUN_DOMAIN
const mg = mailgun({ apiKey: process.env.MAILGUN_KEY, domain: DOMAIN })
const mailcomposer = require('mailcomposer')

const validate = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(422).json({
        message: 'Nothing to create.'
      })
    }

    const payloadSchema = {
      type: 'object',
      properties: {
        comment: {
          type: 'string',
          maxLength: 10000
        },
        userId: {
          type: 'string',
          maxLength: 100
        },
        contributionId: {
          type: 'integer'
        }
      },
      required: ['comment']
    }

    const payloadData = {
      comment: req.body.comment,
      userId: req.body.userId,
      contributionId: req.body.contributionId
    }

    const payloadValid = payloadValidator(payloadSchema, payloadData)

    if (payloadValid !== true) {
      res.status(422).json({
        message: payloadValid
      })
    }

    req.payload = payloadData

    return next()
  } catch (error) {
    const response = errorResponse(error)

    res.status(500).json(response)
  }
}

const create = async (req, res, next) => {
  try {
    const checkUser = await mmUser.findOne({
      where: {
        id: req.body.userId
      }
    })
    const checkContribution = await mmContribution.findOne({
      where: {
        id: req.body.contributionId
      }
    })
    if (checkUser && checkUser.emailNotification) {
      const mail = await mailcomposer({
        from: `Mail Gun Test <postmaster@${process.env.MAILGUN_DOMAIN}>`,
        to: checkUser.email,
        subject: 'Hello',
        text: 'Testing some Mailgun awesomness!',
        html: `<!DOCTYPE html>
        <html>
          <head>
            <title>Peak Leadership Webapp</title>
          </head>
          <body style="padding: 100px; background-color: #121B3D; margin:0 auto;">
            <div>
            <div>
                <img style="width: 100px;position: absolute; right: 0; top: 0" src="cid:https://mimosa-backendapp.herokuapp.com/top.png" />
            </div>
            <div>
                <img style="width: 100px;position: absolute; left: 0; bottom: 0"  src="cid:https://mimosa-backendapp.herokuapp.com/bottom.png"
            </div>
            <div style="text-align: center; margin-bottom: 10px">
                <img style="width: 200px"   src="cid:https://mimosa-backendapp.herokuapp.com/logo.png" />
            </div>
            <div style="background-color: white; text-align: center; padding: 60px; border-radius: 8px">
              <p style="font-family: Arial, Helvetica, sans-serif; text-align: center; font-size: 20px;"> Hello ${checkUser.firstName}! </p>
              <p style="font-family: Arial, Helvetica, sans-serif; text-align: center;">
                <b>Charles Smith</b> commented on your <b style="color: gold">Question</b> Contributions.
              </p>
              <p>${req.body.comment}</p>
              <a href="/">
                <button style="font-size: large; background-color: #f7882b; border: none; padding: 10px; width: 250px; border-radius: 25px; color: white;"> Click here to View </button>
              </a>
            </div>
            </div>
          </body>
        </html>`,
        inline: ['top.png', 'bottom.png', 'logo.png']
      })
      await mail.build(async function (mailBuildError, message) {
        const dataToSend = {
          to: 'cloyd@offshorly.com',
          message: message.toString('ascii')
        }

        await mg.messages().sendMime(dataToSend, async function (sendError, body) {
          if (sendError) {
            res.status(500).json(response)
          }
          next()
        })
      })
    }
    const newComment = await mmComment.create(req.payload)
    const notificationData = {
      poster: checkContribution.userId,
      user: req.body.userId,
      comment: req.body.comment,
      type: checkContribution.category,
      commentId: newComment.id,
      contributionId: req.body.contributionId
    }
    await mmNotification.create(notificationData)
    req.data = {
      data: newComment.dataValues
    }

    return next()
  } catch (error) {
    // TODO: Create a better error handling for sequelize validation errors
    if (
      error.name === 'SequelizeUniqueConstraintError' &&
      error.message === 'Validation error'
    ) {
      return res.status(409).json({ message: error.errors[0].message })
    }

    const response = errorResponse(error)

    res.status(500).json(response)
  }
}

const response = async (req, res) => {
  try {
    res.status(201).json(req.data)
  } catch (error) {
    const response = errorResponse(error)

    res.status(500).json(response)
  }
}

module.exports = {
  validate,
  create,
  response
}
