// A simple math problem solver.
// WARNING: Uses eval(), which is not safe for production use with untrusted input.
// For a real app, a proper math expression parser should be implemented.

export const solveProblem = (problem: string): string => {
  try {
    // Sanitize the input to allow only basic math characters.
    // This is a minimal security measure.
    const sanitizedProblem = problem.replace(/[^0-9+\-*\/().\s]/g, '');

    if (sanitizedProblem !== problem) {
      return 'Invalid characters in problem';
    }

    // Using Function constructor is slightly safer than direct eval
    const result = new Function(`return ${sanitizedProblem}`)();
    
    // Check for division by zero
    if (!isFinite(result)) {
      return 'Error: Division by zero';
    }

    return result.toString();
  } catch (error) {
    return 'Invalid mathematical expression';
  }
};
