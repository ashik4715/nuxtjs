import { ref } from 'vue';

interface SecurityQuestion {
  question: string;
  encodedAnswer: string;
}

const encode = (text: string): string => btoa(text);
const decode = (encoded: string): string => atob(encoded);

const QUESTIONS: SecurityQuestion[] = [
  { question: 'What is the nickname of author?', encodedAnswer: encode('jholok') },
  { question: 'What is the college roll number of author?', encodedAnswer: encode('4715') },
];

export function useSecurityQuestion() {
  const currentQuestion = ref<SecurityQuestion | null>(null);
  const showDialog = ref(false);
  const userAnswer = ref('');

  const askQuestion = () => {
    const randomIndex = Math.floor(Math.random() * QUESTIONS.length);
    currentQuestion.value = QUESTIONS[randomIndex];
    showDialog.value = true;
    userAnswer.value = '';
  };

  const verifyAnswer = (): boolean => {
    if (!currentQuestion.value) return false;
    const expected = decode(currentQuestion.value.encodedAnswer).toLowerCase().trim();
    return userAnswer.value.toLowerCase().trim() === expected;
  };

  const reset = () => {
    currentQuestion.value = null;
    showDialog.value = false;
    userAnswer.value = '';
  };

  return {
    currentQuestion,
    showDialog,
    userAnswer,
    askQuestion,
    verifyAnswer,
    reset,
  };
}
