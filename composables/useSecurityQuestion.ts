import { ref } from 'vue';

interface SecurityQuestion {
  question: string;
  answer: string;
}

const QUESTIONS: SecurityQuestion[] = [
  { question: 'What is the nickname of author?', answer: 'jholok' },
  { question: 'What is the college roll number of author?', answer: '4715' },
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
    return (
      userAnswer.value.toLowerCase().trim() === currentQuestion.value.answer.toLowerCase().trim()
    );
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
