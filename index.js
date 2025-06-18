import crypto from "crypto";

class diceRng {
  constructor(seed) {
    this.state0 = 0n;
    this.state1 = 0n;

    try {
      this.seed(seed);
    } catch (e) {
      throw new Error(`Initialization failed: ${e.message}`);
    }

    // Validate state after initialization
    if (this.state0 === 0n && this.state1 === 0n) {
      throw new Error("Invalid state: both states are zero");
    }
  }

  seed(seed) {
    if (seed === undefined) {
      // Generate cryptographically secure seed
      const buf = crypto.randomBytes(16);
      this.state0 = buf.readBigUInt64LE(0);
      this.state1 = buf.readBigUInt64LE(8);
      // Ensure state is not all zero
      if (this.state0 === 0n && this.state1 === 0n) this.state1 = 1n;
    } else if (typeof seed === "bigint") {
      // Single seed: derive both states
      this.state0 = seed;
      this.state1 = seed ^ 0x6a09e667f3bcc909n;
      if (this.state0 === 0n && this.state1 === 0n) this.state1 = 1n;
    } else if (Array.isArray(seed)) {
      // Full state
      if (seed.length !== 2)
        throw new Error("Seed array must have exactly 2 elements");
      this.state0 = BigInt(seed[0]);
      this.state1 = BigInt(seed[1]);
      if (this.state0 === 0n && this.state1 === 0n)
        throw new Error("State cannot be all zero");
    } else {
      throw new Error("Invalid seed type. Use BigInt, Array, or undefined");
    }
  }

  next() {
    let s1 = this.state0;
    let s0 = this.state1;

    this.state0 = s0;
    s1 ^= s1 << 23n;
    s1 ^= s1 >> 17n;
    s1 ^= s0;
    s1 ^= s0 >> 26n;
    this.state1 = s1;

    return this.state0 + this.state1;
  }

  nextInt() {
    const value = this.next();
    return Number(value & 0xffffffffn);
  }

  nextDouble() {
    // More accurate method for [0, 1)
    const bigIntVal = this.next();

    // Get 53 random bits (JavaScript's maximum precision)
    const highBits = Number(bigIntVal & 0x1fffffn) * 2 ** 32;
    const lowBits = Number((bigIntVal >> 32n) & 0xffffffffn);
    const full53 = highBits + lowBits;

    // Normalize to [0, 1)
    return full53 / 9007199254740992; // 2^53
  }

  nextRange(min, max) {
    if (!Number.isInteger(min) || !Number.isInteger(max)) {
      throw new Error("Min and max must be integers");
    }
    if (min >= max) throw new Error("Max must be greater than min");

    const range = max - min + 1;
    const randVal = this.nextDouble();

    // Validate random value
    if (randVal < 0 || randVal >= 1) {
      throw new Error(`Random value out of range: ${randVal}`);
    }

    return min + Math.floor(randVal * range);
  }

  // For debugging
  currentState() {
    return [this.state0, this.state1];
  }
}

export default diceRng;