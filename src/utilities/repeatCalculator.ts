import { addDays, addWeeks, addMonths, addYears, isSameDay, isAfter, isBefore, startOfDay } from "date-fns";
import { Repeat } from "@/entities/Repeat";

export function getNextOccurrence(repeat: Repeat, fromDate: Date): Date | null {
  if (!repeat.reference) return null;
  
  const { unit, interval } = repeat.frequency;
  let nextDate = new Date(repeat.reference);
  
  // Find the next occurrence after fromDate
  while (isBefore(nextDate, fromDate) || isSameDay(nextDate, fromDate)) {
    switch (unit) {
      case "day":
        nextDate = addDays(nextDate, interval);
        break;
      case "week":
        nextDate = addWeeks(nextDate, interval);
        break;
      case "month":
        nextDate = addMonths(nextDate, interval);
        break;
      case "year":
        nextDate = addYears(nextDate, interval);
        break;
    }
  }
  
  return nextDate;
}

export function shouldShowTemplateToday(template: any, today: Date): boolean {
  if (!template.repeat) return false;
  
  // For calendar type, we don't need a reference date
  if (template.repeat.type === "calendar") {
    const todayStart = startOfDay(today);
    const { unit, interval, on } = template.repeat.frequency || {};
    
    switch (unit) {
      case "day":
        // Every N days - for calendar type, show every N days
        // If interval is 1, show every day
        if (interval === 1) return true;
        // For other intervals, need a reference date to calculate
        if (!template.repeat.reference) return false;
        const referenceDate = new Date(template.repeat.reference);
        const daysDiff = Math.floor((todayStart.getTime() - startOfDay(referenceDate).getTime()) / (1000 * 60 * 60 * 24));
        return daysDiff % interval === 0;
        
      case "week":
        // Weekly repeats - just check if today is one of the specified days
        if (on && on.length > 0) {
          const todayDayOfWeek = todayStart.getDay();
          return on.includes(todayDayOfWeek);
        }
        // If no specific days, show every day
        return true;
        
      case "month":
        // Monthly - check if it's the right day of the month
        if (on && on.length > 0) {
          const todayDayOfMonth = todayStart.getDate();
          return on.includes(todayDayOfMonth);
        }
        return true;
        
      case "year":
        // Yearly - would need month and day specification
        return false;
        
      default:
        return false;
    }
  }
  
  // For on-complete type repeats
  if (template.repeat.type === "on-complete") {
    // If no reference (never completed), show every day
    if (!template.repeat.reference) return true;
    
    // Otherwise check based on last completion
    const referenceDate = new Date(template.repeat.reference);
    const repeat = new Repeat(template.repeat.type, referenceDate);
    Object.assign(repeat.frequency, template.repeat.frequency || {});
    
    const todayStart = startOfDay(today);
    const referenceStart = startOfDay(referenceDate);
    
    // Don't show if reference is in the future
    if (isAfter(referenceStart, todayStart)) return false;
    
    // Calculate days since last completion
    const daysDiff = Math.floor((todayStart.getTime() - referenceStart.getTime()) / (1000 * 60 * 60 * 24));
    const { unit, interval } = repeat.frequency;
    
    // Check if enough time has passed based on repeat frequency
    switch (unit) {
      case "day":
        return daysDiff >= interval;
      case "week":
        return daysDiff >= interval * 7;
      case "month":
        return daysDiff >= interval * 30; // Approximate
      case "year":
        return daysDiff >= interval * 365; // Approximate
      default:
        return false;
    }
  }
  
  // This shouldn't be reached but handle other cases
  const referenceDate = template.date ? new Date(template.date) : 
                        (template.repeat.reference ? new Date(template.repeat.reference) : null);
  
  const repeat = new Repeat(template.repeat.type, referenceDate);
  Object.assign(repeat.frequency, template.repeat.frequency || {});
  
  if (!repeat.reference) return false;
  
  const todayStart = startOfDay(today);
  const referenceStart = startOfDay(repeat.reference);
  
  // Check if today is a repeat day
  const { unit, interval } = repeat.frequency;
  
  // If reference is in the future, don't show
  if (isAfter(referenceStart, todayStart)) return false;
  
  // Calculate if today matches the repeat pattern
  const daysDiff = Math.floor((todayStart.getTime() - referenceStart.getTime()) / (1000 * 60 * 60 * 24));
  
  switch (unit) {
    case "day":
      return daysDiff % interval === 0;
    case "week": {
      // Check if we have specific days of week (on array)
      if (repeat.frequency.on && repeat.frequency.on.length > 0) {
        const todayDayOfWeek = todayStart.getDay();
        // Check if today is one of the specified days
        if (!repeat.frequency.on.includes(todayDayOfWeek)) {
          return false;
        }
        // Check if we're in a valid week based on the interval
        const weeksDiff = Math.floor(daysDiff / 7);
        return weeksDiff % interval === 0;
      }
      // Default weekly repeat without specific days
      return daysDiff % (interval * 7) === 0;
    }
    case "month": {
      // For months, check if it's the same day of month
      const monthsDiff = (todayStart.getFullYear() - referenceStart.getFullYear()) * 12 + 
                        (todayStart.getMonth() - referenceStart.getMonth());
      return monthsDiff % interval === 0 && 
             todayStart.getDate() === referenceStart.getDate();
    }
    case "year": {
      // For years, check if it's the same day and month
      const yearsDiff = todayStart.getFullYear() - referenceStart.getFullYear();
      return yearsDiff % interval === 0 && 
             todayStart.getMonth() === referenceStart.getMonth() &&
             todayStart.getDate() === referenceStart.getDate();
    }
    default:
      return false;
  }
}


function getPreviousOccurrence(repeat: Repeat, fromDate: Date): Date | null {
  if (!repeat.reference) return null;
  
  const { unit, interval } = repeat.frequency;
  let previousDate = new Date(repeat.reference);
  let lastValid = null;
  
  // Find the last occurrence before or on fromDate
  while (isBefore(previousDate, fromDate) || isSameDay(previousDate, fromDate)) {
    lastValid = new Date(previousDate);
    
    switch (unit) {
      case "day":
        previousDate = addDays(previousDate, interval);
        break;
      case "week":
        previousDate = addWeeks(previousDate, interval);
        break;
      case "month":
        previousDate = addMonths(previousDate, interval);
        break;
      case "year":
        previousDate = addYears(previousDate, interval);
        break;
    }
    
    // Stop if we've gone past fromDate
    if (isAfter(previousDate, fromDate)) break;
  }
  
  return lastValid;
}