const rnd = require('../random');

describe('random module', () => {
    it('random can be called with a simple integer argument', () => {
        const result = rnd.random(2);
        
        // there should be a choice made
        expect(Number.isInteger(result.index)).toBe(true);
        expect(result.index).toBeDefined();
        expect(result.index).toBeGreaterThanOrEqual(0);
        expect(result.index).toBeLessThanOrEqual(1);
        
        expect(result.iterations).toBe(1);
        
        expect(result.freq).toBe(1);
    });
    
    it('random can be called with an expected number of iterations', () => {
        const iterations = 11;
        const result = rnd.random(2, iterations);

        // there should be a choice made
        expect(Number.isInteger(result.index)).toBe(true);
        expect(result.index).toBeDefined();
        expect(result.index).toBeGreaterThanOrEqual(0);
        expect(result.index).toBeLessThanOrEqual(1);

        expect(result.iterations).toBe(iterations);

        expect(result.freq).toBeGreaterThan(0.5);
    });
    
    it('random fails when no arguments provided', () => {
        expect(() => rnd.random()).toThrow(/random function expects at least one argument/);
    });
    
    it('random fails if called with a non integer parameter', () => {
        expect(() => rnd.random('a string')).toThrow(/must be an integer greater than 1/);
    });
    
    it('random fails if called with a integer <= 1', () => {
        expect(() => rnd.random(1)).toThrow(/must be greater than 1/);
        expect(() => rnd.random(0)).toThrow(/must be greater than 1/);
        expect(() => rnd.random(-1)).toThrow(/must be greater than 1/);
    });
});
