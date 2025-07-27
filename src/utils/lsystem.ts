export class LSystemGenerator {
  generate(axiom: string, rules: Record<string, string>, generations: number): string {
    let current = axiom;
    
    for (let i = 0; i < generations; i++) {
      let next = '';
      
      for (const char of current) {
        next += rules[char] || char;
      }
      
      current = next;
    }
    
    return current;
  }
}