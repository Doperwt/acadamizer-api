module.exports = (group, data, userId) => {
  let {students } = group
  const {review,description,date} = data
  const update = {review,description,date}
  const dateDate = new Date(date)
  students = students.map(student=>{
    if(student._id ==userId){
      debugger

      const exists = student.reviews.filter(r => r.date == dateDate)[0]
      if(exists) {
        student.reviews = [...student.reviews.filter(r => r.date != data.date),update]
      }  else { student.reviews = [...student.reviews, update] }
      student.lastReview = data.review
    }
    return student
  })
  return { group, students}

}
