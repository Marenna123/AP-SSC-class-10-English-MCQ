import { Question } from '../types';
import { getAllBuiltInQuestions } from './questionBank';

/**
 * Authoritative questions dynamically imported from all AP SSC Class 10 English curriculum and practice sources.
 * Deduplicated by question ID.
 */
export const INITIAL_QUESTIONS: Question[] = getAllBuiltInQuestions();
