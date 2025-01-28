export function formatDateToDay(dateString) {
  const date = new Date(dateString);
  const today = new Date();

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Если дата — это сегодняшний день
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }

  // Если дата — завтрашний день
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomrrow';
  }

  // Возвращаем название дня недели
  return dayNames[date.getDay()];
}
