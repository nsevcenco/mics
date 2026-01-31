/**
 * Tree Traversal Solution
 * 
 */

/**
 * Check if value c can be reached from (a, b) using brute-force BFS
 * 
 * @param inputA - First positive integer
 * @param inputB - Second positive integer  
 * @param inputC - Target value to find
 * @param maxIterations - Maximum nodes to explore (default 1,000,000)
 * @returns true if c is found in the tree, false otherwise
 * 
 * @example
 * canReachBruteForce(5, 7, 12)  // true: (5,7) -> (12,7) 
 * canReachBruteForce(2, 3, 4)   // false: 4 never appears
 * canReachBruteForce(5, 7, 123) // true: found after many iterations
 */
export function canReachBruteForce(
  inputA: bigint | number | string,
  inputB: bigint | number | string,
  inputC: bigint | number | string,
  maxIterations: number = 1_000_000
): boolean {
  // Convert inputs to BigInt for arbitrary precision
  const a = BigInt(inputA);
  const b = BigInt(inputB);
  const c = BigInt(inputC);

  // If c equals starting values, immediately return true
  // Example: canReachBruteForce(5, 7, 5) -> true (c is already present)
  if (c === a || c === b) {
    return true;
  }

  // If c is smaller than both a and b, it's impossible
  // We can only add, never subtract, so values only grow
  // Example: canReachBruteForce(5, 7, 3) -> false (3 < 5 and 3 < 7)
  if (c < a && c < b) {
    return false;
  }

  /**
   * visited: Set of already-explored pairs (as strings)
   * 
   * Why use strings? Because 2 different arrays [5n, 7n] and [5n, 7n] are not equal by reference.
   * 
   * We normalize keys as "smaller,larger" so that (5,7) and (7,5) 
   * produce the same key "5,7", avoiding redundant exploration.
   */
  const visited = new Set<string>();

  /**
   * queue: FIFO 
   * 
   * Example queue evolution for (5, 7):
   *   Initial:    [(5, 7)]
   *   After (5,7): [(12, 7), (5, 12)]     ← children added to end
   *   After (12,7): [(5, 12), (19, 7), (12, 19)]
   */
  const queue: Array<[bigint, bigint]> = [[a, b]];

  // Mark starting pair as visited
  // Example: "5,7" (since 5 < 7)
  const startKey = a < b ? `${a},${b}` : `${b},${a}`;
  visited.add(startKey);

  // Track iterations for safety limit
  let iterations = 0;

  // main loop here...    
  while (queue.length > 0) {
    // Safety: prevent infinite loops for unreachable values
    iterations++;
    if (iterations > maxIterations) {
      // Exceeded iteration limit - return false (may be wrong for very deep searches)
      return false;
    }

    /**
     * Dequeue the front element
     * 
     * Example: 
     *   queue = [[5, 7], [12, 7]]
     *   queue.shift() returns [5, 7]
     *   queue is now [[12, 7]]
     */
    const [x, y] = queue.shift()!;
  
    /**
     * Two possible operations from state (x, y):
     * 
     * Operation 1: a += b -> (x + y, y)
     *   Example: (5, 7) -> (5 + 7, 7) = (12, 7)
     * 
     * Operation 2: b += a -> (x, x + y)
     *   Example: (5, 7) -> (5, 5 + 7) = (5, 12)
     */
    const child1: [bigint, bigint] = [x + y, y];  // a += b
    const child2: [bigint, bigint] = [x, x + y];  // b += a

    /**
     * Iterate over both children
     * 
     * for (const [nx, ny] of [child1, child2]) unpacks each child:
     *   Iteration 1: nx = x + y, ny = y    (from child1)
     *   Iteration 2: nx = x,     ny = x + y (from child2)
     */
    for (const [nx, ny] of [child1, child2]) {
      
      /**
       * Check if c appears in this child pair
       * 
       * Example: Looking for c = 12
       *   child1 = (12, 7) -> nx = 12 -> found -> TRUE
       */
      if (nx === c || ny === c) {
        return true;
      }
      
      /**
       * If both nx and ny are greater than c then we should skip.
       * Values only grow, so we'll never find c in this path.
       * 
       * Example: Looking for c = 10
       *   child = (15, 20) -> 15 > 10 AND 20 > 10 SKIP
       */
      if (nx > c && ny > c) {
        continue;
      }

      /**
       * Create a normalized key: "smaller,larger"
       * 
       * This ensures (5, 12) and (12, 5) map to the same key "5,12"
       * 
       * Example:
       *   nx = 12, ny = 7 -> 12 < 7? No -> key = "7,12"
       *   nx = 5, ny = 12 -> 5 < 12? Yes -> key = "5,12"
       */
      const key = nx < ny ? `${nx},${ny}` : `${ny},${nx}`;

      /**
       * Only add to queue if not visited
       * 
       * This prevents:
       * 1. Processing the same state twice
       * 2. Infinite loops (if we could reach the same state via different paths)
       * 3. Exponential blowup of the search 
       */
      if (!visited.has(key)) {
        visited.add(key);      // Mark as visited
        queue.push([nx, ny]);  // Add to queue for later processing
      }
    }
  }
  
  /**
   * If we've processed all reachable states and never found c,
   * then c is not reachable from (a, b).
   * 
   * Example: canReachBruteForce(2, 3, 4)
   *   Explores: (2,3) -> (5,3) -> (5,8) -> (13,8) -> ...
   *   Never finds 4 because 4 can't be expressed as m*2 + n*3 with gcd(m,n)=1
   */
  return false;
}

/**
 * Solve and print result (brute-force version)
 */
export function solveBruteForce(
  a: string | number | bigint,
  b: string | number | bigint,
  c: string | number | bigint
): boolean {
  try {
    const result = canReachBruteForce(a, b, c);
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
    solveBruteForce(args[0], args[1], args[2]);
  } else {
    console.error("Usage: npm start -- <a> <b> <c>");
    process.exit(1);
  }
}