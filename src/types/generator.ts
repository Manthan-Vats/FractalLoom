export interface GeneratorParams {
  angle1: number;        // 0-360°, step 1°
  angle2: number;        // 0-360°, step 1°
  iterations: number;    // 1-12, step 1
  branches: number;      // 1-10, step 1
  startLength: number;   // 0-10 units, step 0.1
  lengthMultiplier: number; // 0-5, step 0.01
  startWidth: number;    // 0-5 units, step 0.1
  widthMultiplier: number;  // 0-5, step 0.01
}

export interface GeneratorPreset {
  name: string;
  params: GeneratorParams;
}

export const defaultGeneratorParams: GeneratorParams = {
  angle1: 61,
  angle2: 30,
  iterations: 6,
  branches: 3,
  startLength: 2.9,
  lengthMultiplier: 0.58,
  startWidth: 0.8,
  widthMultiplier: 0.8
};

export const generatorPresets: GeneratorPreset[] = [
  {
    name: "Classic Tree",
    params: {
      angle1: 30,
      angle2: 0,
      iterations: 8,
      branches: 2,
      startLength: 2.9,
      lengthMultiplier: 0.75,
      startWidth: 1.29,
      widthMultiplier: 0.8
    }
  },
  {
    name: "Spiral Growth",
    params: {
      angle1: 60,
      angle2: 15,
      iterations: 7,
      branches: 3,
      startLength: 3,
      lengthMultiplier: 0.6,
      startWidth: 0.72,
      widthMultiplier: 0.6
    }
  },
  {
    name: "Dense Forest",
    params: {
      angle1: 25,
      angle2: 5,
      iterations: 6,
      branches: 4,
      startLength: 3,
      lengthMultiplier: 0.65,
      startWidth: 0.94,
      widthMultiplier: 0.7
    }
  },
  {
    name: "Crystalline",
    params: {
      angle1: 90,
      angle2: 0,
      iterations: 5,
      branches: 4,
      startLength: 3.7,
      lengthMultiplier: 0.5,
      startWidth: 2.01,
      widthMultiplier: 0.6
    }
  }
];