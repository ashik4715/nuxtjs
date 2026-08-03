import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useSecurityQuestion } from '~/composables/useSecurityQuestion';

describe('useSecurityQuestion', () => {
  let security: ReturnType<typeof useSecurityQuestion>;

  beforeEach(() => {
    security = useSecurityQuestion();
    vi.spyOn(Math, 'random').mockReturnValue(0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should select a random question', () => {
    security.askQuestion();

    expect(security.currentQuestion.value).not.toBeNull();
    expect(security.currentQuestion.value?.question).toBeDefined();
    expect(security.showDialog.value).toBe(true);
  });

  it('should verify correct answer (case-insensitive)', () => {
    security.askQuestion();

    // First question: "What is the nickname of author?" -> "jholok"
    security.userAnswer.value = 'JHOLOK';

    expect(security.verifyAnswer()).toBe(true);
  });

  it('should reject incorrect answer', () => {
    security.askQuestion();

    security.userAnswer.value = 'wrong answer';

    expect(security.verifyAnswer()).toBe(false);
  });

  it('should reset state', () => {
    security.askQuestion();
    security.userAnswer.value = 'test';

    security.reset();

    expect(security.currentQuestion.value).toBeNull();
    expect(security.showDialog.value).toBe(false);
    expect(security.userAnswer.value).toBe('');
  });
});
