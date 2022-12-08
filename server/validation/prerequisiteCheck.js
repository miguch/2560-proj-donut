const course = require('../schema/course.js');

// return true if all prereq is satisfied
module.exports = {
  prerequisiteCheck(coursesTaken, course) {
    return course.prerequisites.every((prereq) =>
      coursesTaken.includes(prereq)
    );
  },

  async prereqLoopCheck(newCourse) {
    // check for prerequisite loops
    const visited = new Set();
    visited.add(newCourse.course_id);
    const stack = [newCourse];

    while (stack.length > 0) {
      const node = stack.pop();
      // we only need to check if any node in path has
      // newCourse as their prereq since we guarantee no
      // preexisting prereq loop
      if (node.prerequisites?.includes(newCourse.course_id)) {
        return false;
      }
      const prereqItems = await course.find({
        course_id: { $in: node.prerequisites || [] },
      });
      stack.push(...prereqItems.filter((e) => !visited.has(e.course_id)));
      prereqItems.map((e) => visited.add(e.course_id));
    }

    return true;
  },
};
