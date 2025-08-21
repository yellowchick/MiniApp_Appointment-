// utils/calendarUtil.js

// 获取星期数组
exports.getWeekDays = () => ['日', '一', '二', '三', '四', '五', '六'];

// 生成日历
exports.generateCalendar = (year, month, eventDates = []) => {
  // 获取当月第一天是星期几（0-6，0代表星期日）
  const firstDay = new Date(year, month - 1, 1).getDay();
  
  // 获取当月的天数
  const daysInMonth = new Date(year, month, 0).getDate();
  
  // 获取上个月的天数
  const daysInPrevMonth = new Date(year, month - 1, 0).getDate();
  
  // 获取今天的日期
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
  
  // 创建日历数组
  const calendarDays = [];
  
  // 添加上个月的日期
  for (let i = daysInPrevMonth - firstDay + 1; i <= daysInPrevMonth; i++) {
    const prevMonth = month - 1 === 0 ? 12 : month - 1;
    const prevYear = month - 1 === 0 ? year - 1 : year;
    const dateStr = `${prevYear}-${prevMonth.toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
    
    calendarDays.push({
      day: i,
      isCurrentMonth: false,
      hasEvent: eventDates.includes(dateStr),
      date: dateStr,
      isToday: dateStr === todayStr
    });
  }
  
  // 添加当月的日期
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
    
    calendarDays.push({
      day: i,
      isCurrentMonth: true,
      hasEvent: eventDates.includes(dateStr),
      date: dateStr,
      isToday: dateStr === todayStr
    });
  }
  
  // 添加下个月的日期（补齐6行42天）
  const totalCells = 42; // 6行 * 7天
  const remaining = totalCells - calendarDays.length;
  for (let i = 1; i <= remaining; i++) {
    const nextMonth = month + 1 === 13 ? 1 : month + 1;
    const nextYear = month + 1 === 13 ? year + 1 : year;
    const dateStr = `${nextYear}-${nextMonth.toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
    
    calendarDays.push({
      day: i,
      isCurrentMonth: false,
      hasEvent: eventDates.includes(dateStr),
      date: dateStr,
      isToday: dateStr === todayStr
    });
  }
  
  return calendarDays;
};