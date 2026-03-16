function toDateOnlyString(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDueState(dueDate) {
  if (!dueDate) {
    return 'none';
  }

  const today = toDateOnlyString(new Date());

  if (dueDate < today) {
    return 'overdue';
  }

  if (dueDate === today) {
    return 'today';
  }

  return 'upcoming';
}

module.exports = {
  getDueState,
};
