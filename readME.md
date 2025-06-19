# 📄 `dice-rng` Module Documentation

![Node.js Version](https://img.shields.io/badge/node.js-%3E%3D%2014.0.0-brightgreen)
![PRNG Strength](https://img.shields.io/badge/randomness-high-yellowgreen)
![Period](https://img.shields.io/badge/period-2%5E128%20--%201-lightgrey)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Repo](https://img.shields.io/badge/GitHub-repo-2ea44f?style=flat&logo=github)](https://github.com/yogieeeeee/dice-rng.git)


This module provides a fast and reliable pseudo-random number generator (PRNG) using the Xorshift128+ algorithm. Perfect for simulations, games, and applications requiring high-quality randomness without cryptographic requirements.

## 🚀 Installation

```bash
npm install dice-rng
```

## 💻 Basic Usage

```javascript
// ES6 Modules
import diceRng from 'dice-rng';

// CommonJS (if using require)
// const diceRng = require('dice-rng');

// Create generator with random seed
const rng = new diceRng();

// Generate random numbers
console.log(rng.nextRange(1, 6)); // Dice roll: 1-6
```

## 🔧 API Reference

### `new diceRng([seed])`
Creates a new generator instance:
- `seed` (optional): 
  - `undefined`: Use cryptographically secure random seed (recommended). If result is state [0n, 0n], state1 is automatically set to 1n.
  - `BigInt`: Single seed. Converted to state using formula:  
    `state0 = seed`  
    `state1 = seed ^ 0x6a09e667f3bcc909n`  
    If result is [0n, 0n], state1 is set to 1n.
  - `[state0, state1]`: Full state as BigInt array (must have exactly 2 elements).  
    ⚠️ **Cannot be [0n, 0n]** - will throw Error.

```javascript
// Initialization examples
const rng1 = new diceRng(); // Random seed
const rng2 = new diceRng(123456789n); // Fixed seed (note the 'n' for BigInt!)
const rng3 = new diceRng([0x123n, 0xABCn]); // Full state
```

### Generator Methods

#### `.next() → BigInt`
Generates a 64-bit random number as BigInt

```javascript
const bigIntValue = rng.next();
console.log(bigIntValue); // 18643850231453088000n
```

#### `.nextInt() → Number`
Generates a 32-bit integer (0 to 4294967295)

```javascript
const intValue = rng.nextInt();
console.log(intValue); // 3158275367
```

#### `.nextDouble() → Number`
Generates a double-precision float [0, 1) with **53-bit precision** (JavaScript's maximum precision)

```javascript
const floatValue = rng.nextDouble();
console.log(floatValue); // 0.3578451201923456
```

#### `.nextRange(min, max) → Number`
Generates an integer within range [min, max] (inclusive).  
⚠️ Throws error if:  
- `min` or `max` is not an integer  
- `min >= max`

```javascript
const diceRoll = rng.nextRange(1, 6); // Dice roll: 1-6
const lotteryNumber = rng.nextRange(1, 60); // Lottery number: 1-60
```

#### `.currentState() → [BigInt, BigInt]`
Returns current internal state for debugging

```javascript
const state = rng.currentState();
console.log(state); // [123456789n, 987654321n]
```

## 📖 Usage Examples

### Dice Simulation
```javascript
function rollDice(rng) {
  return rng.nextRange(1, 6);
}

const rng = new diceRng();
console.log('Dice roll result:', rollDice(rng));
```

### Card Deck Shuffling
```javascript
function shuffleDeck(rng) {
  const suits = ['♠', '♥', '♦', '♣'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  
  const deck = [];
  for (const suit of suits) {
    for (const value of values) {
      deck.push(`${value}${suit}`);
    }
  }
  
  // Fisher-Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = rng.nextRange(0, i); // [0, i] inclusive
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  
  return deck;
}

const rng = new diceRng();
const deck = shuffleDeck(rng);
console.log('Top card:', deck[0]);
```

### Procedural World Generation
```javascript
function generateTerrain(seed) {
  const rng = new diceRng(seed);
  const size = 5;
  let world = "";

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const tile = rng.nextRange(1, 4);
      world +=
        tile === 1
          ? "🌲" // Forest
          : tile === 2
          ? "⛰️" // Mountaint
          : tile === 3
          ? "🌊" // River
          : "🟫"; // Land
    }
    world += "\n";
  }
  return world;
}

const worldSeed = 1234n;
console.log(generateTerrain());
// Output example:
// 🌲⛰️🌊🟫🌲
// 🟫🌲⛰️🌊🟫
// 🌊🟫🌲⛰️🌊
// ⛰️🌊🟫🌲⛰️
// 🌲⛰️🌊🟫🌲



// Use fixed seed for reproducible world
const worldSeed = 2023n; // Note the 'n' for BigInt!
const world = generateWorld(worldSeed, 10, 10);
```

## ❗ Error Handling
This module throws errors in the following cases:
1. **Initialization**:
   - Seed array doesn't have exactly 2 elements
   - Resulting state is [0n, 0n]
   - Invalid seed type
2. **nextRange()**:
   - `min` or `max` is not an integer
   - `min >= max`
3. **Internal Operations**:
   - nextDouble() produces value outside [0, 1) (extremely rare)

## ⚠️ Important Notes

1. **Not for Cryptography**  
   This module is not suitable for security applications or cryptography

2. **Reproducibility**  
   Same seed will produce exactly the same sequence of numbers

3. **High Performance**  
   Capable of generating ~65 million numbers/second on modern CPUs

4. **Compatibility**  
   Requires Node.js v14.0+ (ES6 modules and BigInt support).  
   ⚠️ **Must use BigInt for seeds**:  
   `123n` (correct) vs `123` (incorrect)

5. **Double Precision**  
   `nextDouble()` uses 53-bit precision (not 64-bit) due to JavaScript limitations

6. **Module System**  
   Code uses ES6 modules (`import`/`export`). Ensure `package.json` has `"type": "module"` or use `.mjs` extension

## 📊 Comparison with Math.random()

Both `dice-rng` and `Math.random()` use the **same Xorshift128+ algorithm** under the hood (in V8 engine), but there are key differences in implementation and features:

| Feature            | dice-rng              | Math.random()         |
|--------------------|-----------------------|-----------------------|
| **Algorithm**      | Xorshift128+          | Xorshift128+ (V8)     |
| **Seed Control**   | ✅ Full control       | ❌ Auto-seeded        |
| **Reproducibility**| ✅ Deterministic      | ❌ Non-deterministic  |
| **State Access**   | ✅ Can inspect/save   | ❌ Hidden internal    |
| **Precision**      | 53-bit                | 53-bit                |
| **Period**         | 2<sup>128</sup>-1     | 2<sup>128</sup>-1     |
| **Performance**    | Very Fast             | Very Fast             |
| **Portability**    | ✅ Cross-platform     | ⚠️ Engine-dependent   |

## 🔧 package.json Configuration

To use ES6 modules, ensure your `package.json` has:

```json
{
  "name": "dice-rng",
  "type": "module",
  "engines": {
    "node": ">=14.0.0"
  }
}
```

## 🎯 Performance Benchmarks

```javascript
// Quick performance test
const rng = new diceRng();
const start = performance.now();

for (let i = 0; i < 1000000; i++) {
  rng.nextDouble();
}

const elapsed = performance.now() - start;
console.log(`Generated 1M numbers in ${elapsed.toFixed(2)}ms`);
```

## 🔬 Algorithm Details

**Xorshift128+** is a variant of the Xorshift family of PRNGs:
- **Period**: 2^128 - 1
- **State Size**: 128 bits (2 × 64-bit values)
- **Operations**: XOR, left shift, right shift
- **Quality**: Passes most statistical tests
- **Speed**: Excellent performance on modern CPUs

### Why Use dice-rng Instead of Math.random()?

Since both use the same algorithm, the main advantages of `dice-rng` are:

1. **🎯 Reproducibility**: Perfect for testing, debugging, and deterministic simulations
2. **🔧 Control**: You can save/restore generator state
3. **🎮 Gaming**: Essential for save/load functionality in games
4. **🧪 Scientific**: Reproducible experiments and research
5. **🔄 Portability**: Same results across different JavaScript engines

## 📜 License

MIT License. Free to use for personal and commercial projects.

---

*Made with ❤️ for developers who need reliable randomness*