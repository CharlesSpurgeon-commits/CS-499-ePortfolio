# CS 499 Milestone Three Algorithms and Data Structures

This submission contains the original and enhanced versions of the ABCU Computer Science Advising Tool.

## Contents

- `original/ProjectTwo.cpp`: original CS 300 artifact
- `enhanced/ProjectTwo.cpp`: CS 499 enhanced artifact
- `test-data/`: valid, cyclic, and duplicate course datasets used for verification
- `TESTING.md`: build instructions, test cases, and verified results

## Enhancement Summary

The enhanced program preserves the custom hash table with separate chaining while adding duplicate-key rejection, explicit resource ownership, normalized course identifiers, prerequisite validation, cycle detection using depth-first search, and a feasible course order using topological ordering. Invalid data is rejected without replacing previously valid data.

## Build and Run

```bash
g++ -std=c++17 -Wall -Wextra -Wpedantic enhanced/ProjectTwo.cpp -o abcu
./abcu
```

Choose option 1 and enter a CSV filename from `test-data`, or provide another file in the same format.

## Generative AI Acknowledgment

OpenAI ChatGPT was used to support code review, suggest enhancement approaches, help create test cases, and assist with revising the accompanying narrative. The submitted code and explanations were reviewed against the original artifact, compiled, and tested. The student remains responsible for verifying, understanding, and adapting the work in accordance with the course AI-use policy.
