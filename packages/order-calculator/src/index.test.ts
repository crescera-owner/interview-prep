import { describe, it, expect } from 'vitest';
import { add } from './index.js';

describe('add function', () => {
  it('should return 5 given 2 and 3', () => {
    expect(add(2, 3)).toBe(5);
  });
});
