# Refactoring

You've been asked to refactor the function `deterministicPartitionKey` in [`dpk.js`](dpk.js) to make it easier to read and understand without changing its functionality. For this task, you should:

1. Write unit tests to cover the existing functionality and ensure that your refactor doesn't break it. We typically use `jest`, but if you have another library you prefer, feel free to use it.
2. Refactor the function to be as "clean" and "readable" as possible. There are many valid ways to define those words - use your own personal definitions, but be prepared to defend them. Note that we do like to use the latest JS language features when applicable.
3. Write up a brief (~1 paragraph) explanation of why you made the choices you did and why specifically your version is more "readable" than the original.

You will be graded on the exhaustiveness and quality of your unit tests, the depth of your refactor, and the level of insight into your thought process provided by the written explanation.

## Your Explanation Here

The general strategy for this refactor, was first to understand what the original function did. Once I had a clear picture in my head, the goal was to remove unecessary nesting, code duplication and use early returns to keep the code readable, simple, clean and maintanable. The choices I made and reasoning are listed below (additional information can also be found in the source code and are prefixed with *[INT]*).

1. *Moving the constant Variables to the top of the file*:
    - This cleans up the original function, making it easier to focus on the logic. It also consolidates the location of constant Variables, which can become hard to track down in larger projects.
1. *Factoring out `generateHash` function*:
    - This operation was performed in two different places, so consolidating it removes some duplication
    - More importantly, having a single `generateHash` function, makes it less likely to introduce a bug by changing one of the call site and forgetting the other
1. *Using function keyword instead of arrow function*:
    - This is mostly a personal preference, see note below for reasoning. 
1. *Early returns and no unassigned variables*:
    - The original code was hard to follow due to a lot of variables being conditionally reassigned. This made it hard to follow what each variable represented and what form/state a variable was in at any given point
    - To combat this, I used early returns to remove some of the early base cases. I removed any unassigned/reassigned variables to make it easier for a developer to know the state of any varible just by looking at the declaring;
    - I used ternary expression on a couple occasions since I find these to be a lot easier to quickly process than a reassignment through a if-else chain.
1. *JsDoc*
    - When not working with Typescript, I find that using JSDoc can help a lot with intellisense and also forces good documentation habits for developers

#### Function vs Arrow 
I generally prefer to use the function syntax instead of arrow functions. This is partly due to the semantics of the `this` keyword but also because I find that code readability is a little better when the `function` keyword is used. I generally like to keep arrow function for anonymous function calls (ex: .map(() => {}), etc...) or when writing a closure inside of another function
