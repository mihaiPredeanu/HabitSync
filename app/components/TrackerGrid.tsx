import React from 'react';
import { View, StyleSheet } from 'react-native';

interface TrackerGridProps {
  data: Array<{ date: string; value: boolean | number }>; // One entry per day
  days?: number; // How many days to show (default: 30)
}

const TrackerGrid: React.FC<TrackerGridProps> = ({ data, days = 30 }) => {
  // Generate a grid for the last N days
  const today = new Date();
  const grid = Array.from({ length: days }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (days - 1 - i));
    const dateStr = d.toISOString().slice(0, 10);
    const entry = data.find(e => e.date === dateStr);
    return { date: dateStr, value: entry?.value };
  });

  // For numeric habits, calculate intensity (min/max)
  const numericValues = grid.filter(c => typeof c.value === 'number').map(c => c.value as number);
  const min = Math.min(...numericValues, 0);
  const max = Math.max(...numericValues, 1);

  function getCellColor(value: boolean | number | undefined) {
    if (typeof value === 'number') {
      // Intensity coloring: interpolate between light blue and dark blue
      const pct = max > min ? (value - min) / (max - min) : 1;
      const blue = Math.round(215 - pct * 80); // 215 to 135
      return `rgb(25, 118, ${blue})`;
    }
    if (value === true) return '#43a047'; // green for binary complete
    return '#e0e0e0'; // gray for incomplete
  }

  return (
    <View style={styles.grid}>
      {grid.map((cell, idx) => (
        <View
          key={cell.date}
          style={[styles.cell, { backgroundColor: getCellColor(cell.value) }]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 210,
    marginVertical: 12,
  },
  cell: {
    width: 18,
    height: 18,
    margin: 2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TrackerGrid;
