// routes/classes.js
const router = require('express').Router()
const passport = require('../../config/auth')
const { Class, User } = require('../../models')
const authenticate = passport.authorize('jwt', { session: false })
const processUpdate = require('../../lib/processUpdate.js')


const loadClass = (req, res, next) => {
  const id = req.params.id

  Class.findById(id)
    .then((group) => {
      req.group = group
      next()
    })
    .catch((error) => next(error))
}

const getStudents = (req, res, next) => {
  Promise.all(req.group.students.map(student => User.findById(student._id)))
    .then((users) => {
      console.log(req)
      // Combine student data and user's name
      req.students = req.group.students.map((student) => {
        const { name } = users
          .filter((u) => u._id.toString() === student._id.toString())[0]

        return {
          _id: student._id,
          reviews: student.reviews,
          name: student.name,
          lastReview: student.lastReview
        }
      })
      next()
    })
    .catch((error) => next(error))
}

module.exports = io => {
  router
    .get('/classes/:id/students', loadClass, (req, res, next) => {
      if (!req.group || !req.group.students) { return next() }
      res.json(req.group.students)
    })

    .post('/classes/:id/students', authenticate, loadClass, (req, res, next) => {
      if (!req.group) { return next() }
      console.log(req)

      let student = {name:req.body.name,picture:req.body.picture,reviews:[],lastReview:'negative'}
      // Add the user to the students
      req.group.students = [student,...req.group.students]

      req.group.save()
        .then((group) => {
          req.group = group
          next()
        })
        .catch((error) => next(error))
    },
    // Fetch new student data
    // Respond with new student data in JSON and over socket
    (req, res, next) => {
      io.emit('action', {
        type: 'CLASS_STUDENTS_UPDATED',
        payload: {
          group: req.group,
          students: req.group.students
        }
      })
      res.json(req.students)
    })
    .patch('/classes/:id/students/:studentId', authenticate, (req, res, next) => {
      const id = req.params.id
      const studentId = req.params.studentId
      console.log(req.params)
      Class.findById(id)
        .then((group) => {
          if (!group) { return next() }
          // debugger
          const {review,date,description} = req.body
          const update = {review:review,date:date,description:description}
          // const updatedClass = processReview(group, req.body, studentId)

          const student = group.students.filter(s => s._id.toString() === studentId)[0]
          // const exists = student.reviews.filter(r => r.date === update.date)[0]
          // if(!!exists) {
          //   student.reviews = [student.reviews.filter(r => r.date !== update.date ),update]
          // } else if(student.reviews.length === 0 ) {
          //   student.reviews = [update]
          // } else { student.reviews = [student.reviews, update] }
          // student.lastReview = update.review
          const updatedClass = processUpdate(group,update,studentId)
          Class.findByIdAndUpdate(id, { $set: updatedClass }, { new: true })
            .then((group) => {
              io.emit('action', {
                type: 'CLASS_UPDATED',
                payload: group
              })
              res.json(group)
            })
            .catch((error) => next(error))
        })
        .catch((error) => next(error))
    })
    .delete('/classes/:id/students', authenticate,loadClass, (req, res, next) => {
      if (!req.group) { return next() }
      console.log(req.group)
      const userId = req.body.studentId
      // debugger
      console.log(userId,req.group.students[0]._id.toString())

      const currentStudent = req.group.students.filter(p => p._id.toString() === userId)[0]

      if (!currentStudent) {
        const error = Error.new('You are not a student of this group!')
        error.status = 401
        return next(error)
      }

      req.group.students = req.group.students.filter(p => p._id.toString() !== userId)
      req.group.save()
        .then((group) => {
          req.group = group
          next()
        })
        .catch((error) => next(error))

    },
    // Fetch new student data
    // getStudents,
    // Respond with new student data in JSON and over socket
    (req, res, next) => {
      io.emit('action', {
        type: 'CLASS_STUDENTS_UPDATED',
        payload: {
          group: req.group,
          students: req.group.students
        }
      })
      res.json(req.group.students)
    })

  return router
}
