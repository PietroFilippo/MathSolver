// ===================================================
// ========= MATH UTILS ALGEBRA EXPORTS ===============
// ===================================================

// Re-export everything from algebraAPI
export * from './algebraAPI';
export * from './algebraTypes';
export * from './algebraUtils';

// Re-export from subdirectories
export * from '../terms';
export * from '../expressions';

// Re-export inequalities with namespace to avoid name conflicts 
import * as inequalities from '../inequalities';
export { inequalities };

export * from '../examples';
