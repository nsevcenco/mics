# Задача

Determine if value `c` can be obtained from `(a, b)` by repeatedly adding one to the other.

## Project Structure

```
src/
├── math-solution.ts   # Mathematical O(1) solution (Calkin-Wilf theorem)
├── tree-search.ts     # Tree traversal algorithm
└── test.ts            # Test suite comparing both algorithms
```

## Usage

### Math Solution (fast)

```bash
npm start -- <a> <b> <c>

# Examples
npm start -- 3 5 8      # YES
npm start -- 3 5 11     # YES
npm start -- 4 6 20     # NO
npm start -- 1 2 12345678901234567890123456789  # YES (handles huge numbers)
```

### Tree Search (BFS traversal)

```bash
npm run tree-search -- <a> <b> <c>

# Examples
npm run tree-search -- 3 5 8     # YES
npm run tree-search -- 3 5 11    # YES
npm run tree-search -- 5 7 123   # YES
```

### Run Tests

```bash
npm test
```

## Docker

### Build

```bash
docker-compose build
```

### Run Math Solution

```bash
docker-compose run math-solution 3 5 8
docker-compose run math-solution 4 6 20
```

### Run Tree Search

```bash
docker-compose run tree-search 3 5 8
docker-compose run tree-search 5 7 123
```

### Run Tests

```bash
docker-compose run test
```

## Performance Notes

The tree-search algorithm can be improved with:
- **Multi-threading:** Parallelize BFS exploration across multiple workers
