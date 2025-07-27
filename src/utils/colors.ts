export function getColorScheme(scheme: string): number[][] {
  const colorSchemes: Record<string, number[][]> = {
    rainbow: [
      [1, 0, 0],     // Red
      [1, 0.5, 0],   // Orange
      [1, 1, 0],     // Yellow
      [0, 1, 0],     // Green
      [0, 1, 1],     // Cyan
      [0, 0, 1],     // Blue
      [0.5, 0, 1],   // Indigo
      [1, 0, 1]      // Violet
    ],
    fire: [
      [0, 0, 0],     // Black
      [0.5, 0, 0],   // Dark red
      [1, 0, 0],     // Red
      [1, 0.5, 0],   // Orange
      [1, 1, 0],     // Yellow
      [1, 1, 0.5],   // Light yellow
      [1, 1, 1],     // White
      [0.8, 0.8, 1]  // Light blue
    ],
    ocean: [
      [0, 0, 0.2],   // Deep blue
      [0, 0, 0.5],   // Dark blue
      [0, 0.3, 0.7], // Medium blue
      [0, 0.6, 1],   // Light blue
      [0.2, 0.8, 1], // Cyan
      [0.5, 1, 1],   // Light cyan
      [0.8, 1, 1],   // Very light cyan
      [1, 1, 1]      // White
    ],
    purple: [
      [0, 0, 0],     // Black
      [0.2, 0, 0.3], // Dark purple
      [0.5, 0, 0.5], // Purple
      [0.7, 0, 0.8], // Light purple
      [1, 0, 1],     // Magenta
      [1, 0.5, 1],   // Pink
      [1, 0.8, 1],   // Light pink
      [1, 1, 1]      // White
    ],
    dragon: [
      [0, 0, 0],     // Black
      [0.2, 0, 0],   // Dark red
      [0.5, 0.1, 0], // Red-brown
      [0.8, 0.2, 0], // Orange-red
      [1, 0.5, 0],   // Orange
      [1, 0.8, 0.2], // Yellow-orange
      [1, 1, 0.5],   // Light yellow
      [1, 1, 1]      // White
    ],
    spiral: [
      [0, 0, 0.3],   // Dark blue
      [0.1, 0, 0.5], // Purple-blue
      [0.3, 0, 0.7], // Purple
      [0.5, 0.2, 0.8], // Light purple
      [0.7, 0.5, 1], // Very light purple
      [1, 0.8, 1],   // Pink
      [1, 1, 0.8],   // Light yellow
      [1, 1, 1]      // White
    ],
    tree: [
      [0.1, 0.05, 0], // Dark brown
      [0.2, 0.1, 0],  // Brown
      [0.3, 0.2, 0.1], // Light brown
      [0.1, 0.3, 0.1], // Dark green
      [0.2, 0.5, 0.2], // Green
      [0.4, 0.7, 0.3], // Light green
      [0.6, 0.8, 0.4], // Very light green
      [0.8, 1, 0.6]   // Pale green
    ],
    ice: [
      [0, 0, 0.2],   // Deep blue
      [0.1, 0.1, 0.4], // Dark blue
      [0.2, 0.3, 0.6], // Medium blue
      [0.4, 0.5, 0.8], // Light blue
      [0.6, 0.7, 1],  // Very light blue
      [0.8, 0.9, 1],  // Pale blue
      [0.9, 1, 1],    // Very pale blue
      [1, 1, 1]       // White
    ]
  };

  return colorSchemes[scheme] || colorSchemes.rainbow;
}