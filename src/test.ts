/**
 * Test suite comparing both algorithms:
 * - math-solution.ts (Mathematical approach using Calkin-Wilf property)
 * - tree-search.ts (BFS tree traversal)
 * 
 * Tests assert that both algorithms return the same result.
 */

import { performance } from "perf_hooks";
import { canReach as canReachMath } from "./math-solution";
import { canReachBruteForce as canReachTree } from "./tree-search";

// ANSI color codes
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const RESET = "\x1b[0m";

// Test counter
let passed = 0;
let failed = 0;

/**
 * Format time in ms with appropriate precision
 */
function formatTime(ms: number): string {
  if (ms < 0.01) return "<0.01ms";
  if (ms < 1) return `${ms.toFixed(2)}ms`;
  return `${ms.toFixed(1)}ms`;
}

/**
 * Run test for BOTH algorithms and compare their results
 */
function test(
  a: string | number | bigint,
  b: string | number | bigint,
  c: string | number | bigint,
  skipTreeSearch: boolean = false
): void {
  const desc = `(${a},${b}) -> ${c}`;

  // Test math solution
  let mathResult: boolean;
  let mathTime: number;
  try {
    const start = performance.now();
    mathResult = canReachMath(a, b, c);
    mathTime = performance.now() - start;
    const time = formatTime(mathTime);
    const resultColor = mathResult ? GREEN : RED;
    const resultStr = mathResult ? "YES" : "NO";
    console.log(`  ${GREEN}[OK]${RESET} [math] ${time.padStart(8)} ${desc} ${resultColor}[${resultStr}]${RESET}`);
    passed++;
  } catch (error) {
    console.log(`  ${RED}[ERROR]${RESET} [math] ${desc}`);
    console.log(`    ${error instanceof Error ? error.message : error}`);
    failed++;
    return;
  }

  // Test tree search and compare with math
  if (!skipTreeSearch) {
    try {
      const start = performance.now();
      const treeResult = canReachTree(a, b, c);
      const treeTime = performance.now() - start;
      const time = formatTime(treeTime);
      const resultColor = treeResult ? GREEN : RED;
      const resultStr = treeResult ? "YES" : "NO";

      if (treeResult === mathResult) {
        console.log(`  ${GREEN}[OK]${RESET} [tree] ${time.padStart(8)} ${desc} ${resultColor}[${resultStr}]${RESET}`);
        passed++;
      } else {
        console.log(`  ${RED}[FAIL]${RESET} [tree] ${time.padStart(8)} ${desc} ${resultColor}[${resultStr}]${RESET}`);
        console.log(`    MISMATCH: math=${mathResult}, tree=${treeResult}`);
        failed++;
      }
    } catch (error) {
      console.log(`  ${RED}[ERROR]${RESET} [tree] ${desc}`);
      console.log(`    ${error instanceof Error ? error.message : error}`);
      failed++;
    }
  } else {
    console.log(`  - [tree] skipped  ${desc}`);
  }
}

console.log("=".repeat(60));
console.log("Running test suite for BOTH algorithms...");
console.log("Assertion: math result == tree result");
console.log("=".repeat(60));

// ============================================================
// Non-Reachable Cases
// ============================================================
console.log("");
console.log("--- Non-Reachable Cases ---");

test(3, 5, 2);
test(10, 15, 5);
test(2, 5, 3);
test(2, 5, 4);
test(2, 3, 4);
test(2, 3, 6);
test(3, 5, 4);
test(3, 5, 6);
test(3, 5, 7);

// ============================================================
// Larger Numbers (including thousands)
// ============================================================
console.log("");
console.log("--- Larger Numbers ---");

test(10, 15, 25);
test(10, 15, 35);
test(10, 15, 55);
test(100, 150, 250);
test(100, 150, 350);
test(5, 7, 123);
test(5, 7, 1000);
test(5, 7, 5000);
test(11, 13, 2500);
test(17, 23, 3000);

// ============================================================
// Pattern Tests
// ============================================================
console.log("");
console.log("--- Pattern Tests ---");

test(3, 7, 10);
test(3, 7, 17);
test(3, 7, 73);
test(3, 7, 13);

// ============================================================
// Very Large Numbers (math only)
// ============================================================
console.log("");
console.log("--- Very Large Numbers ---");

test(3, 7, 12344);

// ============================================================
// Summary
// ============================================================
console.log("");
console.log("=".repeat(60));
console.log(`Test Results: ${passed} passed, ${failed} failed`);
console.log("=".repeat(60));

if (failed > 0) {
  process.exit(1);
}