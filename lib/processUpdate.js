module.exports = (group, data, userId) => {
  let {students } = group
  const {review,description,date} = data
  const update = {review,description,date}
  const dateDate = new Date(date)
  // const dateFudger = (date) => { return date.getFullYear().toString()+"-"+(date.getMonth()+1).toString()+"-"+date.getDate().toString()}
  function formatDate(date) {
    var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
  students = students.map(student=>{
    if(student._id.toString() ==userId){
      const exists = student.reviews.filter(r => formatDate(r.date) == data.date.toString())[0]
      if(exists) {
        student.reviews = [...student.reviews.filter(r => formatDate(r.date) != data.date.toString()),update]
      }  else { student.reviews = [...student.reviews, update] }
      student.lastReview = data.review
      console.log(student.reviews)
    }
    return student
  })
  return { group, students}

}
