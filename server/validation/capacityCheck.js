const course = require('../schema/course');
const selection = require('../schema/selection');

async function getEnrolledCount(course_ref_id) {
  const selectionItems = await selection.find({
    course_id: course_ref_id,
    status: { $in: ['enrolled', 'completed', 'failed'] },
  });
  return selectionItems.length;
}

// return true if there is spot available
async function checkHasSpot(course_ref_id) {
  const count = await getEnrolledCount(course_ref_id);
  const courseItem = await course.findOne({
    _id: course_ref_id,
  });
  if (!courseItem) {
    return false;
  }
  if (typeof courseItem.capacity === 'undefined') {
    return true;
  }
  return count < courseItem.capacity;
}

module.exports = {
  getEnrolledCount,
  checkHasSpot,
};
