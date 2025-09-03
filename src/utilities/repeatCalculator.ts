import { addDays, addWeeks, addMonths, addYears, isSameDay, isAfter, isBefore, startOfDay } from "date-fns";
import { Repeat } from "@/entities/Repeat";

export function getNextOccurrence(repeat: Repeat, fromDate: Date): Date | null {
  if (!repeat.reference) return null;
  
  const { unit, multiple } = repeat.frequency;
  let nextDate = new Date(repeat.reference);
  
  // Find the next occurrence after fromDate
  while (isBefore(nextDate, fromDate) || isSameDay(nextDate, fromDate)) {
    switch (unit) {
      case "day":
        nextDate = addDays(nextDate, multiple);
        break;
      case "week":
        nextDate = addWeeks(nextDate, multiple);
        break;
      case "month":
        nextDate = addMonths(nextDate, multiple);
        break;
      case "year":
        nextDate = addYears(nextDate, multiple);
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
    const { unit, multiple, on } = template.repeat.frequency || {};
    
    switch (unit) {
      case "day":
        // Every N days - always show if no reference, or calculate from reference
        if (!template.repeat.reference) return true;
        const referenceDate = new Date(template.repeat.reference);
        const daysDiff = Math.floor((todayStart.getTime() - startOfDay(referenceDate).getTime()) / (1000 * 60 * 60 * 24));
        return daysDiff % multiple === 0;
        
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
  
  // Original logic for todo type repeats (which do need reference for "last completed")
  const referenceDate = template.date ? new Date(template.date) : 
                        (template.repeat.reference ? new Date(template.repeat.reference) : null);
  
  const repeat = new Repeat(template.repeat.type, referenceDate);
  Object.assign(repeat.frequency, template.repeat.frequency || {});
  
  if (!repeat.reference) return false;
  
  const todayStart = startOfDay(today);
  const referenceStart = startOfDay(repeat.reference);
  
  // Check if today is a repeat day
  const { unit, multiple } = repeat.frequency;
  
  // If reference is in the future, don't show
  if (isAfter(referenceStart, todayStart)) return false;
  
  // Calculate if today matches the repeat pattern
  const daysDiff = Math.floor((todayStart.getTime() - referenceStart.getTime()) / (1000 * 60 * 60 * 24));
  
  switch (unit) {
    case "day":
      return daysDiff % multiple === 0;
    case "week": {
      // Check if we have specific days of week (on array)
      if (repeat.frequency.on && repeat.frequency.on.length > 0) {
        const todayDayOfWeek = todayStart.getDay();
        // Check if today is one of the specified days
        if (!repeat.frequency.on.includes(todayDayOfWeek)) {
          return false;
        }
        // Check if we're in a valid week based on the multiple
        const weeksDiff = Math.floor(daysDiff / 7);
        return weeksDiff % multiple === 0;
      }
      // Default weekly repeat without specific days
      return daysDiff % (multiple * 7) === 0;
    }
    case "month": {
      // For months, check if it's the same day of month
      const monthsDiff = (todayStart.getFullYear() - referenceStart.getFullYear()) * 12 + 
                        (todayStart.getMonth() - referenceStart.getMonth());
      return monthsDiff % multiple === 0 && 
             todayStart.getDate() === referenceStart.getDate();
    }
    case "year": {
      // For years, check if it's the same day and month
      const yearsDiff = todayStart.getFullYear() - referenceStart.getFullYear();
      return yearsDiff % multiple === 0 && 
             todayStart.getMonth() === referenceStart.getMonth() &&
             todayStart.getDate() === referenceStart.getDate();
    }
    default:
      return false;
  }
}

export function shouldShowTemplateTodoType(template: any, today: Date): boolean {
  if (!template.repeat || template.repeat.type !== "todo") return false;
  
  // Use template.date as the reference date, or fall back to repeat.reference
  const referenceDate = template.date ? new Date(template.date) : 
                        (template.repeat.reference ? new Date(template.repeat.reference) : null);
  
  const repeat = new Repeat(template.repeat.type, referenceDate);
  Object.assign(repeat.frequency, template.repeat.frequency || {});
  
  if (!repeat.reference) return false;
  
  const todayStart = startOfDay(today);
  const nextOccurrence = getNextOccurrence(repeat, todayStart);
  
  // For todo type, show if today is between intended repeat day and next occurrence
  // This means the task should have been done but hasn't been completed yet
  const previousOccurrence = getPreviousOccurrence(repeat, todayStart);
  
  if (!previousOccurrence) return false;
  
  // Show if today is on or after the previous occurrence and before the next
  return (isSameDay(todayStart, previousOccurrence) || isAfter(todayStart, previousOccurrence)) &&
         (!nextOccurrence || isBefore(todayStart, nextOccurrence));
}

function getPreviousOccurrence(repeat: Repeat, fromDate: Date): Date | null {
  if (!repeat.reference) return null;
  
  const { unit, multiple } = repeat.frequency;
  let previousDate = new Date(repeat.reference);
  let lastValid = null;
  
  // Find the last occurrence before or on fromDate
  while (isBefore(previousDate, fromDate) || isSameDay(previousDate, fromDate)) {
    if (isBefore(previousDate, fromDate) || isSameDay(previousDate, fromDate)) {
      lastValid = new Date(previousDate);
    }
    
    switch (unit) {
      case "day":
        previousDate = addDays(previousDate, multiple);
        break;
      case "week":
        previousDate = addWeeks(previousDate, multiple);
        break;
      case "month":
        previousDate = addMonths(previousDate, multiple);
        break;
      case "year":
        previousDate = addYears(previousDate, multiple);
        break;
    }
    
    // Stop if we've gone past fromDate
    if (isAfter(previousDate, fromDate)) break;
  }
  
  return lastValid;
}