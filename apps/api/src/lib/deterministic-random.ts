/**
 * Deterministic Random Generator
 * 
 * A seeded random number generator that produces consistent results
 * across multiple runs, enabling reproducible demo environments.
 */

class SeededRandom {
  private seed: number;

  constructor(seed: number = 12345) {
    this.seed = seed;
  }

  /**
   * Generate a random number between 0 and 1
   */
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  /**
   * Generate a random integer between min and max (inclusive)
   */
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  /**
   * Pick a random element from an array
   */
  pick<T>(array: T[]): T {
    return array[this.nextInt(0, array.length - 1)];
  }

  /**
   * Pick N random elements from an array without duplicates
   */
  pickN<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => this.next() - 0.5);
    return shuffled.slice(0, Math.min(count, array.length));
  }

  /**
   * Generate a random boolean with given probability of true
   */
  nextBool(probability: number = 0.5): boolean {
    return this.next() < probability;
  }

  /**
   * Generate a random date within a range
   */
  nextDate(start: Date, end: Date): Date {
    const startTime = start.getTime();
    const endTime = end.getTime();
    return new Date(startTime + this.next() * (endTime - startTime));
  }

  /**
   * Generate a random phone number
   */
  nextPhone(): string {
    const area = this.nextInt(200, 999);
    const prefix = this.nextInt(200, 999);
    const line = this.nextInt(1000, 9999);
    return `(${area}) ${prefix}-${line}`;
  }

  /**
   * Generate a random email
   */
  nextEmail(name: string, domain: string = 'example.com'): string {
    const cleanName = name.toLowerCase().replace(/\s+/g, '.');
    return `${cleanName}${this.nextInt(1, 999)}@${domain}`;
  }

  /**
   * Generate a random address
   */
  nextAddress(): { street: string; city: string; state: string; zip: string } {
    const streets = [
      'Oak Street', 'Maple Avenue', 'Cedar Lane', 'Pine Road', 'Elm Drive',
      'Washington Boulevard', 'Main Street', 'Church Street', 'Park Avenue',
      'Springfield Drive', 'River Road', 'Hillside Avenue', 'Sunset Boulevard',
      'Lakeview Drive', 'Mountain Road', 'Valley Lane', 'Forest Avenue'
    ];
    const cities = [
      'Plano', 'Orlando', 'Austin', 'Dallas', 'Houston', 'San Antonio',
      'Jacksonville', 'Miami', 'Tampa', 'Atlanta', 'Charlotte', 'Nashville'
    ];
    const states = ['TX', 'FL', 'GA', 'NC', 'TN', 'AL', 'MS', 'LA'];
    
    return {
      street: `${this.nextInt(100, 9999)} ${this.pick(streets)}`,
      city: this.pick(cities),
      state: this.pick(states),
      zip: this.nextInt(10000, 99999).toString()
    };
  }

  /**
   * Generate a random amount
   */
  nextAmount(min: number, max: number): number {
    return Math.round(this.next() * (max - min) + min * 100) / 100;
  }

  /**
   * Generate a random UUID (deterministic based on seed)
   */
  nextUuid(): string {
    const hex = (n: number) => n.toString(16).padStart(2, '0');
    const bytes = Array.from({ length: 16 }, () => this.nextInt(0, 255));
    
    return [
      hex(bytes[0]), hex(bytes[1]), hex(bytes[2]), hex(bytes[3]),
      hex(bytes[4]), hex(bytes[5]), hex(bytes[6]), hex(bytes[7]),
      '-',
      hex(bytes[8]), hex(bytes[9]), hex(bytes[10]), hex(bytes[11]),
      '-',
      '4',
      hex(bytes[12] & 0x0f | 0x40),
      '-',
      hex(bytes[13] & 0x3f | 0x80),
      hex(bytes[14]),
      hex(bytes[15])
    ].join('');
  }

  /**
   * Shuffle an array deterministically
   */
  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}

// Create a singleton instance with a fixed seed for demo consistency
const demoRandom = new SeededRandom(42);

export { SeededRandom, demoRandom };
