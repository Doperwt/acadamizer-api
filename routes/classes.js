// routes/classes.js
const router = require('express').Router()
const passport = require('../config/auth')
const { Class } = require('../models')
// const utils = require('../lib/utils')
// const processMove = require('../lib/processMove')

const authenticate = passport.authorize('jwt', { session: false })

module.exports = io => {
  router
    .get('/classes', (req, res, next) => {
      Class.find()
        // Newest classes first
        .sort({ createdAt: -1 })
        // Send the data in JSON format
        .then((classes) => res.json(classes))
        // Throw a 500 error if something goes wrong
        .catch((error) => next(error))
    })
    .get('/classes/:id', (req, res, next) => {
      const id = req.params.id

      Class.findById(id)
        .then((group) => {
          if (!group) { return next() }
          res.json(group)
        })
        .catch((error) => next(error))
    })
    .post('/classes', authenticate, (req, res, next) => {
      console.log(req)
      // debugger
      const newClass = {
        name:  'batch-'+req.body.name,
        startDate: req.body.start,
        endDate: req.body.end,
        students: []
      }

      Class.create(newClass)
        .then((group) => {
          io.emit('action', {
            type: 'GAME_CREATED',
            payload: group
          })
          res.json(group)
        })
        .catch((error) => next(error))
    })
    .patch('/classes/:id', authenticate, (req, res, next) => {
      const id = req.params.id
      const userId = req.account._id.toString()

      Class.findById(id)
        .then((group) => {
          if (!group) { return next() }

          const updatedClass = processMove(group, req.body, userId)

          Class.findByIdAndUpdate(id, { $set: updatedClass }, { new: true })
            .then((group) => {
              io.emit('action', {
                type: 'GAME_UPDATED',
                payload: group
              })
              res.json(group)
            })
            .catch((error) => next(error))
        })
        .catch((error) => next(error))
    })
    .delete('/classes/:id', authenticate, (req, res, next) => {
      const id = req.params.id
      Class.findByIdAndRemove(id)
        .then(() => {
          io.emit('action', {
            type: 'GAME_REMOVED',
            payload: id
          })
          res.status = 200
          res.json({
            message: 'Removed',
            _id: id
          })
        })
        .catch((error) => next(error))
    })

  return router
}
