// return true if all prereq is satisfied
modules.exports = function prerequisiteCheck(coursesTaken, course): boolean {
  return course.prerequisites.every((prereq) => coursesTaken.includes(prereq));
};
