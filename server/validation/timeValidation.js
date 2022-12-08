// sections: {weekday: Number, startTime: Number, endTime: Number}[]
// return true if no conflict is detected
module.exports = function detectConflict(sections) {
  sections.sort((a, b) => {
    const order = ['weekday', 'startTime', 'endTime'];
    for (const field of order) {
      if (a[field] < b[field]) {
        return -1;
      } else if (a[field] > b[field]) {
        return 1;
      }
    }
    return 0;
  });
  for (let i = 0; i < sections.length - 1; i++) {
    if (sections[i].weekday === sections[i + 1].weekday) {
      if (sections[i].endTime >= sections[i + 1].startTime) {
        return false;
      }
    }
  }
  return true;
};
