/**
 * GREEDY ALGORITHM: Optimal Appointment Slot Selection
 * 
 * This greedy algorithm finds the best available appointment slot based on:
 * 1. Earliest available date (prioritizes sooner appointments)
 * 2. Highest slot availability (avoids overcrowding)
 * 3. Mid-morning preference (8:30-10:00 AM for elderly patients)
 * 
 * Time Complexity: O(n * m) where n = number of days, m = number of time slots
 * Space Complexity: O(1) - only stores the current best slot
 */

export const findOptimalAppointmentSlot = (availableDates, timeSlots) => {
  let bestSlot = null;
  let bestScore = -1;

  // Iterate through all available dates
  for (const dateObj of availableDates) {
    // Skip dates with no available slots
    if (!dateObj.isAvailable || dateObj.slots === 0) continue;

    // Calculate date score (earlier dates get higher scores)
    const daysFromToday = Math.floor(
      (dateObj.date - new Date()) / (1000 * 60 * 60 * 24)
    );
    const dateScore = Math.max(0, 100 - daysFromToday); // Closer dates = higher score

    // Calculate availability score
    const availabilityScore = dateObj.slots; // More slots = higher score (daily total)

    // Evaluate each time slot for this date
    for (const timeSlot of timeSlots) {
      // Calculate time preference score (prefer mid-morning)
      const timeScore = getTimePreferenceScore(timeSlot);

      // GREEDY CHOICE: Calculate total score
      // Weighted formula: date (40%) + availability (40%) + time (20%)
      // With per-time-slot capacity (5 per slot), prefer times with more remaining.
      // If dateObj.timesRemainingPerSlot exists (map of time->remaining), incorporate it.
      const perTimeRemaining = (dateObj.timesRemainingPerSlot && typeof dateObj.timesRemainingPerSlot[timeSlot] === 'number')
        ? dateObj.timesRemainingPerSlot[timeSlot]
        : 5; // default capacity

      const totalScore =
        (dateScore * 0.35) +
        (availabilityScore * 0.25) +
        (timeScore * 0.20) +
        (perTimeRemaining * 0.20);

      // Select this slot if it has the highest score so far (greedy selection)
      if (totalScore > bestScore) {
        bestScore = totalScore;
        bestSlot = {
          date: dateObj.date.toDateString(),
          time: timeSlot,
          score: totalScore,
          reasoning: {
            dateScore: dateScore.toFixed(2),
            availabilityScore,
            timeScore: timeScore.toFixed(2),
            totalScore: totalScore.toFixed(2)
          }
        };
      }
    }
  }

  return bestSlot;
};

/**
 * Helper function: Calculate preference score for different time slots
 * Prefers mid-morning times (8:30-10:00 AM) for elderly patients
 */
const getTimePreferenceScore = (timeSlot) => {
  const preferences = {
    '7:00 AM': 60,
    '7:30 AM': 70,
    '8:00 AM': 85,
    '8:30 AM': 100,  // Optimal
    '9:00 AM': 100,  // Optimal
    '9:30 AM': 95,
    '10:00 AM': 90,
    '10:30 AM': 80,
    '11:00 AM': 70
  };

  return preferences[timeSlot] || 50;
};

/**
 * Format the reasoning for display to user
 */
export const formatRecommendationReason = (bestSlot, language) => {
  if (!bestSlot) return '';

  const reasons = {
    en: `This slot was selected because it has:
- Good availability (${bestSlot.reasoning.availabilityScore} slots)
- Convenient timing (Score: ${bestSlot.reasoning.timeScore})
- Available soon (Score: ${bestSlot.reasoning.dateScore})

Overall suitability score: ${bestSlot.reasoning.totalScore}/100`,
    tl: `Napili ang slot na ito dahil mayroon itong:
- Magandang availability (${bestSlot.reasoning.availabilityScore} slots)
- Maginhawang oras (Score: ${bestSlot.reasoning.timeScore})
- Available kaagad (Score: ${bestSlot.reasoning.dateScore})

Kabuuang suitability score: ${bestSlot.reasoning.totalScore}/100`
  };

  return reasons[language];
};