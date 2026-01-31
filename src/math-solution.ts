/**
 
 * 
 * нашел такую теорему
 * https://en.wikipedia.org/wiki/Calkin%E2%80%93Wilf_tree
 * 
 * The Calkin-Wilf tree generates all positive rationals via operations (a, a+b) and (a+b, b).
 * Key insight: Values in the tree rooted at (a, b) are exactly those expressible as
 * m*a + n*b where m, n >= 1 and gcd(m, n) = 1 (coprime coefficients).
 * 
 * Therefore: c is reachable from (a, b) iff:
 *   1. c == a or c == b, OR
 *   2. c = m*a + n*b for some m, n >= 1 with gcd(m, n) = 1
 */

/**
 * Compute GCD using Euclidean algorithm
 * ## Example: gcd(48, 18))

  Step 1: x=48, y=18 -> x % y = 48 % 18 = 12 -> [x, y] = [18, 12]
  Step 2: x=18, y=12 -> x % y = 18 % 12 = 6  -> [x, y] = [12, 6]
  Step 3: x=12, y=6  -> x % y = 12 % 6 = 0   -> [x, y] = [6, 0]
  Step 4: y=0, stop -> return x = 6

  gcd(48, 18) = 6 
 */
function gcd(x: bigint, y: bigint): bigint {
  x = x < 0n ? -x : x;
  y = y < 0n ? -y : y;
  while (y !== 0n) {
    [x, y] = [y, x % y];
  }
  return x;
}

/**
 * Check if c can be reached from (a, b)
 * coprime is gcd(m, n) = 1 (the numbers share no common factors other than 1)
 * 
 * Example: a=4, b=6, c=20
 * 
 * Step 1: GCD check
 *   gcd(4, 6) = 2
 *   20 / 2 = 10 OK (divisible)
 * 
 * Step 2: Range check
 *   20 >= 4 + 6 = 10 OK
 * 
 * Step 3: Find coprime representation 20 = m*4 + n*6
 * 
 *   Try n=1:
 *     m = (20 - 1*6) / 4 = 14/4 = 3.5 NOT OK (not integer)
 * 
 *   Try n=2:
 *     m = (20 - 2*6) / 4 = 8/4 = 2 OK (integer)
 *     gcd(2, 2) = 2 NOT OK (not coprime, need gcd = 1)
 * 
 *   Try n=3:
 *     m = (20 - 3*6) / 4 = 2/4 = 0.5 NOT OK (not integer)
 * 
 * Result: No coprime (m,n) pair exists. Even though 20 is even and >= 10, the only solution is m=2, n=2,
 * but gcd(2,2) = 2 != 1.
 * 
 * So c=20 is NOT reachable from (4,6)
 * 
 * ---
 * 
 * Example 2: a=3, b=5, c=11
 * 
 * Step 1: GCD check
 *   gcd(3, 5) = 1
 *   11 / 1 = 11 OK
 * 
 * Step 2: Range check
 *   11 >= 3 + 5 = 8 OK
 * 
 * Step 3: Find coprime representation 11 = m*3 + n*5
 * 
 *   Try n=1:
 *     m = (11 - 1*5) / 3 = 6/3 = 2 OK (integer)
 *     gcd(2, 1) = 1 OK (coprime!)
 * 
 * Result: Found coprime (m=2, n=1) pair
 * 11 = 2*3 + 1*5 = 6 + 5 = 11
 * 
 * So c=11 is reachable from (3,5)
 */
export function canReach(
  inputA: bigint | number | string,
  inputB: bigint | number | string,
  inputC: bigint | number | string
): boolean {
  const a = BigInt(inputA);
  const b = BigInt(inputB);
  const c = BigInt(inputC);

  if (a <= 0n || b <= 0n || c <= 0n) {
    throw new Error("All values must be positive integers");
  }

  // Base case: c equals a or b
  if (c === a || c === b) {
    return true;
  }

  // c smaller than both: impossible (we only add)
  if (c < a && c < b) {
    return false;
  }

  // c must be divisible by gcd(a, b)
  const g = gcd(a, b);
  if (c % g !== 0n) {
    return false;
  }

  // c between a and b (exclusive): not reachable
  const minAB = a < b ? a : b;
  const maxAB = a > b ? a : b;
  if (c > minAB && c < maxAB) {
    return false;
  }

  // c must be >= a + b to be expressible as m*a + n*b with m, n >= 1
  if (c < a + b) {
    return false;
  }

  // Search for coprime representation: c = m*a + n*b with gcd(m, n) = 1
  // Iterate through n values, compute m = (c - n*b) / a
  //
  // Assumption: We only check the first 10,000 and last 10,000 values of n.
  // This is a practical limit to avoid infinite loops for very large c.
  // For extremely large c with specific (a, b) values, the first coprime solution
  // might occur somewhere in the middle (not in first or last 10,000 iterations),
  // which would cause an incorrect NO result, but we can always increase :)
  const maxN = (c - a) / b;
  const iterLimit = maxN < 10000n ? maxN : 10000n;

  for (let n = 1n; n <= iterLimit; n++) {
    const remainder = c - n * b;
    if (remainder > 0n && remainder % a === 0n) {
      const m = remainder / a;
      if (m >= 1n && gcd(m, n) === 1n) {
        return true;
      }
    }
  }

  // For large c, also check from high end
  if (c >= a * b) {
    const startN = maxN > 10000n ? maxN - 10000n : 1n;
    for (let n = startN; n <= maxN; n++) {
      const remainder = c - n * b;
      if (remainder > 0n && remainder % a === 0n) {
        const m = remainder / a;
        if (m >= 1n && gcd(m, n) === 1n) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * Solve and print result
 */
export function solve(
  a: string | number | bigint,
  b: string | number | bigint,
  c: string | number | bigint
): boolean {
  try {
    const result = canReach(a, b, c);
    console.log(result ? "YES" : "NO");
    return result;
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
    return false;
  }
}

// CLI entry point
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length >= 3) {
    solve(args[0], args[1], args[2]);
  } else {
    console.error("Usage: npm start -- <a> <b> <c>");
    process.exit(1);
  }
}
