<template>
  <div class="fixed bottom-6 right-6 z-50">
    <!-- Floating Action Button -->
    <button
      :class="[
        'w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300',
        isOpen ? 'bg-red-500 hover:bg-red-600 rotate-0' : 'bg-blue-600 hover:bg-blue-700',
      ]"
      @click="toggleDrawer"
    >
      <svg
        v-if="!isOpen"
        class="w-6 h-6 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        ></path>
      </svg>
      <svg v-else class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        ></path>
      </svg>
    </button>

    <!-- Drawer Panel -->
    <Transition
      enter-active-class="transform transition-transform duration-300 ease-out"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transform transition-transform duration-200 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div
        v-if="isOpen"
        class="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] h-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700"
      >
        <!-- Header -->
        <div
          class="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-3 flex items-center justify-between flex-shrink-0"
        >
          <div class="flex items-center space-x-2">
            <span class="text-2xl">👩‍🏫</span>
            <span class="font-semibold text-sm">
              {{ context ? `Study Counselor - ${context}` : 'Study Counselor' }}
            </span>
          </div>
          <div class="flex items-center space-x-2">
            <button
              v-if="!voiceEnabled"
              class="p-1 rounded transition-colors bg-white/20 text-white text-xs px-2 py-1 hover:bg-white/30"
              title="Click to enable voice"
              @click="enableVoice"
            >
              <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
              </svg>
              Enable Voice
            </button>
            <button
              v-else
              class="p-1 rounded transition-colors bg-white/20 text-white"
              title="Disable voice"
              @click="toggleVoice"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
              </svg>
            </button>
            <button class="text-white hover:text-gray-200 transition-colors" @click="toggleDrawer">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Messages Area -->
        <div
          ref="messagesContainer"
          class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900"
        >
          <div
            v-if="messages.length === 0"
            class="text-center text-gray-500 dark:text-gray-400 mt-8"
          >
            <span class="text-5xl mb-3 block">👩‍🏫</span>
            <p class="text-sm font-medium mb-2">Hi! I'm your Study Counselor</p>
            <p v-if="context" class="text-xs">
              Ask me anything about <strong>{{ context }}</strong>
            </p>
            <p v-else class="text-xs">
              I can help with applications, visas, scholarships, and more
            </p>
            <div class="mt-4 space-y-2 text-xs">
              <p class="text-gray-400">Try asking:</p>
              <p
                class="text-blue-500 cursor-pointer hover:underline"
                @click="quickAsk('How do I apply?')"
              >
                How do I apply?
              </p>
              <p
                class="text-blue-500 cursor-pointer hover:underline"
                @click="quickAsk('What documents do I need?')"
              >
                What documents do I need?
              </p>
              <p
                class="text-blue-500 cursor-pointer hover:underline"
                @click="quickAsk('Are there scholarships?')"
              >
                Are there scholarships?
              </p>
            </div>
          </div>

          <div
            v-for="(message, index) in messages"
            :key="index"
            class="flex"
            :class="message.type === 'user' ? 'justify-end' : 'justify-start'"
          >
            <div
              :class="[
                'max-w-[85%] px-4 py-2 rounded-lg text-sm',
                message.type === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow border border-gray-200 dark:border-gray-600 rounded-bl-none',
              ]"
            >
              {{ message.content }}
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div
          class="border-t border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800 flex-shrink-0"
        >
          <div class="flex space-x-2">
            <input
              v-model="currentMessage"
              type="text"
              :placeholder="context ? `Ask about ${context}...` : 'Type your question...'"
              class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
              @keypress.enter="sendMessage"
            />
            <button
              :disabled="!currentMessage.trim()"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              @click="sendMessage"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, computed, watch } from 'vue';
import csePrograms from '~/assets/cse-programs.json';
import civilPrograms from '~/assets/civil-programs.json';

interface Props {
  context?: string;
}

const props = withDefaults(defineProps<Props>(), {
  context: '',
});

const isOpen = ref(false);
const messages = ref<Array<{ type: 'user' | 'assistant'; content: string }>>([]);
const currentMessage = ref('');
const messagesContainer = ref<HTMLElement | null>(null);
const voiceEnabled = ref(false);
const isSpeaking = ref(false);
const voiceReady = ref(false);
const voices = ref<SpeechSynthesisVoice[]>([]);

const loadVoices = () => {
  if (!('speechSynthesis' in window)) return;
  const available = window.speechSynthesis.getVoices();
  if (available.length > 0) {
    voices.value = Array.from(available);
    voiceReady.value = true;
  }
};

if (import.meta.client && typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

const enableVoice = () => {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance('Voice enabled');
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
  voiceEnabled.value = true;
  voiceReady.value = true;
};

// Flatten all programs from both JSON files
interface Program {
  id: string;
  university: string;
  course: string;
  country?: string;
  intake: string;
  startDate: string | null;
  endDate: string | null;
  portal: string;
  vpdRequired: string;
  moiAccepted: string;
  tuitionFee: number;
  entranceExamInterview: string;
  applicationFee: number;
  link: string;
  qsRanking?: string;
  restricted?: string;
}

const allPrograms = computed<Program[]>(() => {
  const cse = [...csePrograms.german, ...csePrograms.nonGerman];
  const civil = [...civilPrograms.german, ...civilPrograms.nonGerman];
  return [...cse, ...civil];
});

// Match context to a program
const matchedProgram = computed(() => {
  if (!props.context) return null;
  const ctx = props.context.toLowerCase();

  // Try exact match on "university - course" format
  const parts = props.context.split(' - ');
  if (parts.length >= 2) {
    const uniPart = parts[0].trim().toLowerCase();
    const coursePart = parts.slice(1).join(' - ').trim().toLowerCase();

    return (
      allPrograms.value.find((p) => {
        const pUni = p.university.toLowerCase();
        const pCourse = p.course.toLowerCase();
        return (
          (pUni.includes(uniPart) || uniPart.includes(pUni)) &&
          (pCourse.includes(coursePart) || coursePart.includes(pCourse))
        );
      }) || null
    );
  }

  // Fallback: search by any part of the context
  return (
    allPrograms.value.find((p) => {
      const searchable = `${p.university} ${p.course} ${p.country || ''}`.toLowerCase();
      return ctx.split(' ').some((word) => word.length > 2 && searchable.includes(word));
    }) || null
  );
});

// Program-specific responses
const getProgramResponse = (query: string, program: Program): string => {
  const lower = query.toLowerCase();

  // Build program info
  const uni = program.university;
  const course = program.course;
  const country = program.country || program.university;
  const deadline = program.endDate || 'Check program website';
  const tuition =
    program.tuitionFee === 0 ? 'No tuition fee' : `${program.tuitionFee.toLocaleString()} EUR/year`;
  const portal = program.portal;
  const intake = program.intake;
  const qsRank = program.qsRanking || 'Not ranked';
  const moi =
    program.moiAccepted === 'yes' ? 'Yes (MOI accepted)' : 'No (English certificate required)';
  const vpd = program.vpdRequired === 'Yes' ? 'Required (via uni-assist)' : 'Not required';
  const appFee = program.applicationFee === 0 ? 'Free' : `${program.applicationFee} EUR`;
  const entrance = program.entranceExamInterview === '-' ? 'None' : program.entranceExamInterview;

  if (
    lower.includes('deadline') ||
    lower.includes('when') ||
    lower.includes('date') ||
    lower.includes('due')
  ) {
    return `${course} at ${uni}: Application deadline is ${deadline}. Intake: ${intake}. Start date: ${program.startDate || 'Check website'}.`;
  }

  if (
    lower.includes('tuition') ||
    lower.includes('cost') ||
    lower.includes('fee') ||
    lower.includes('expensive')
  ) {
    return `${course} at ${uni}: Tuition is ${tuition}. Application fee: ${appFee}. Portal: ${portal}.`;
  }

  if (lower.includes('university') || lower.includes('school') || lower.includes('college')) {
    return `${course} is offered at ${uni}. QS Ranking: ${qsRank}. Country: ${country}.`;
  }

  if (lower.includes('requirement') || lower.includes('document') || lower.includes('need')) {
    return `${course} at ${uni}: VPD Required: ${vpd}. MOI Accepted: ${moi}. Entrance Exam: ${entrance}. Application Fee: ${appFee}.`;
  }

  if (lower.includes('apply') || lower.includes('application') || lower.includes('how')) {
    return `To apply for ${course} at ${uni}: 1) Apply via ${portal}, 2) Deadline: ${deadline}, 3) Application fee: ${appFee}, 4) VPD Required: ${vpd}.`;
  }

  if (lower.includes('scholarship') || lower.includes('funding') || lower.includes('financial')) {
    if (program.tuitionFee === 0) {
      return `${course} at ${uni}: No tuition fee! For living costs, check DAAD scholarships, Erasmus Mundus scholarships, or university-specific funding. Apply early for scholarships.`;
    }
    return `${course} at ${uni}: Tuition is ${tuition}. Check for university scholarships, DAAD (for Germany), or Erasmus Mundus funding. Apply early.`;
  }

  if (lower.includes('visa')) {
    const countryName = country.includes('/') ? country.split('/')[0] : country;
    return `For ${course} at ${uni} (${countryName}): Apply for student visa with admission letter, proof of finances (11,208 EUR/year blocked account for Germany), health insurance, and accommodation proof. Apply 3-6 months early.`;
  }

  if (
    lower.includes('ielts') ||
    lower.includes('toefl') ||
    lower.includes('english') ||
    lower.includes('language')
  ) {
    return `${course} at ${uni}: MOI Accepted: ${moi}. Most programs require IELTS 6.5+ or TOEFL 90+. Check program website for exact requirements.`;
  }

  if (lower.includes('gpa') || lower.includes('grade') || lower.includes('academic')) {
    return `${course} at ${uni}: QS Ranking: ${qsRank}. Minimum GPA varies by program. Germany typically requires 2.5+/4.0, Netherlands 3.0+/4.0.`;
  }

  if (lower.includes('link') || lower.includes('website') || lower.includes('url')) {
    return `${course} at ${uni}: Official program page: ${program.link}`;
  }

  // Default: provide full program overview
  return `${course} at ${uni} (${country})\n• Deadline: ${deadline}\n• Tuition: ${tuition}\n• Portal: ${portal}\n• Intake: ${intake}\n• VPD Required: ${vpd}\n• MOI Accepted: ${moi}\n• Entrance Exam: ${entrance}\n• Application Fee: ${appFee}\n• QS Ranking: ${qsRank}\n• Link: ${program.link}`;
};

// General knowledge base (kept for non-program-specific questions)
const knowledgeBase: Array<{ keywords: string[]; response: string }> = [
  {
    keywords: ['apply', 'application', 'how to apply'],
    response:
      'To apply to most universities: 1) Check the program website for requirements, 2) Prepare transcripts, CV, motivation letter, and reference letters, 3) Submit online before the deadline, 4) Pay application fee if required. For German universities, many use uni-assist for international applications.',
  },
  {
    keywords: ['document', 'documents', 'what do i need', 'requirements'],
    response:
      'Typical required documents: Bachelor degree certificate, Academic transcripts, CV/Resume, Motivation letter (SOP), 2 Reference letters, English proficiency proof (IELTS 6.5+ or TOEFL 90+), Passport copy, and sometimes GRE/GMAT scores.',
  },
  {
    keywords: ['visa', 'student visa', 'residence permit'],
    response:
      'For Germany: Apply for student visa at your local German embassy. You need: admission letter, proof of finances (approx 11,208 EUR/year in blocked account), health insurance, and accommodation proof. Apply 3-6 months before start date.',
  },
  {
    keywords: ['scholarship', 'scholarships', 'funding', 'financial aid'],
    response:
      'Major scholarships: DAAD (Germany, fully funded), Erasmus Mundus (EU, fully funded), CSC (China), Fulbright (USA), Chevening (UK). University-specific scholarships also available. Apply early - deadlines are 6-12 months before program starts.',
  },
  {
    keywords: ['ielts', 'toefl', 'english', 'language', 'proficiency'],
    response:
      'Most English-taught programs require IELTS 6.5+ (minimum 6.0 per band) or TOEFL 90+. Some accept Duolingo English Test or PTE. Check specific program requirements. Some German universities accept German language proficiency instead.',
  },
  {
    keywords: ['gpa', 'grade', 'academic', 'score'],
    response:
      'Minimum GPA varies: Germany 2.5/4.0 (good), Netherlands 3.0/4.0, Canada 3.0/4.0, UK 2:1 honors. Strong research experience, publications, or work experience can offset a lower GPA.',
  },
  {
    keywords: ['professor', 'contact professor', 'email professor', 'supervisor'],
    response:
      'When contacting professors: 1) Read their recent papers (last 2-3 years), 2) Be specific about how your interests align with their work, 3) Attach CV and transcripts, 4) Keep email concise (under 300 words), 5) Follow up after 2 weeks if no response.',
  },
  {
    keywords: ['motivation', 'motivation letter', 'sop', 'statement of purpose'],
    response:
      'Strong motivation letter structure: 1) Opening - why this specific program/university, 2) Academic background and relevant experience, 3) Research interests and goals, 4) Why this country/university specifically, 5) Career plans after graduation. Keep it 1-2 pages, be authentic.',
  },
  {
    keywords: ['deadline', 'deadlines', 'when', 'dates'],
    response:
      'Typical deadlines: Winter intake (October start) - apply by January to July. Summer intake (April start) - apply by October to January. Always check the specific university website as deadlines vary significantly between programs.',
  },
  {
    keywords: ['germany', 'german', 'study in germany'],
    response:
      'Germany is excellent for studying: Tuition-free at public universities, Strong English-taught programs, Post-study work visa (18 months), Many scholarships (DAAD), Top-ranked universities (TU Munich, RWTH Aachen, etc.). You need a blocked account with 11,208 EUR for visa.',
  },
  {
    keywords: ['canada', 'study in canada'],
    response:
      'Canada offers: High-quality education, Work while studying (20 hours/week), Post-graduation work permit (up to 3 years), Path to permanent residency, Diverse campuses. Top universities: UofT, UBC, McGill, University of Alberta.',
  },
  {
    keywords: ['netherlands', 'dutch', 'study in netherlands'],
    response:
      'Netherlands has: Many English-taught programs, Innovative teaching methods, International environment, Post-study orientation year visa. Top universities: TU Delft, University of Amsterdam, Utrecht University. Tuition: 2,000-15,000 EUR/year for non-EU.',
  },
  {
    keywords: ['visa rejection', 'rejected', 'denied'],
    response:
      'If your visa is rejected: 1) Read the rejection letter carefully, 2) Address the specific reason, 3) Provide additional documentation if needed, 4) Consider reapplying or appealing, 5) Consult with the university international office for support.',
  },
  {
    keywords: ['accommodation', 'housing', 'where to live'],
    response:
      'Finding accommodation: Apply early to student dormitories (Studentenwerk in Germany), Check university housing boards, Look at WG-Gesucht (Germany), Kamernet (Netherlands), or Facebook groups. Budget 300-600 EUR/month for shared housing.',
  },
  {
    keywords: ['health insurance', 'insurance', 'medical'],
    response:
      'Health insurance is mandatory for students in most European countries. In Germany, public insurance (TK, AOK, etc.) costs about 110 EUR/month for students. Some countries require proof of insurance for visa application.',
  },
  {
    keywords: ['work', 'part-time', 'job', 'working'],
    response:
      'Student work rules: Germany - 120 full days or 240 half days per year, Netherlands - 16 hours/week during studies, Canada - 20 hours/week off-campus, Singapore - 16 hours/week. Many universities have campus job opportunities.',
  },
  {
    keywords: ['ranking', 'qs ranking', 'university ranking'],
    response:
      'University rankings vary by subject. For CS: ETH Zurich, TU Munich, KTH are top in Europe. For Civil: TU Delft, ETH Zurich, Politecnico di Milano. Rankings matter less than program fit, research group, and supervisor quality.',
  },
  {
    keywords: ['phd', 'doctorate', 'doctoral', 'research'],
    response:
      'PhD in Europe: Usually 3-4 years, Paid positions (RA/TA), No tuition fees in Germany/Nordics, Strong research environment. Requirements: Masters degree, research experience, strong recommendation letters, research proposal.',
  },
  {
    keywords: ['masters', 'master', 'msc', 'ma'],
    response:
      'Masters programs: Usually 1-2 years, Many English-taught options in Europe, Germany/Nordics often tuition-free, Strong industry connections. Requirements: Bachelors degree, English proficiency, sometimes GRE/GMAT.',
  },
  {
    keywords: ['erasmus', 'emmc', 'emjm', 'mundus'],
    response:
      'Erasmus Mundus Joint Masters are fully funded EU scholarships covering tuition, living costs (1,400 EUR/month), travel, and insurance. Programs like EMMC IMAGINE, COSI, IPCVai, EMAI, EDISS, RESCO, and TERRA are excellent choices.',
  },
  {
    keywords: ['hello', 'hi', 'hey', 'greetings'],
    response:
      'Hello! I am your Study Counselor assistant. I can help you with information about university applications, visa requirements, scholarships, living costs, and more. What would you like to know?',
  },
  {
    keywords: ['thank', 'thanks'],
    response:
      'You are welcome! Feel free to ask if you have any more questions about your study abroad journey. Good luck with your applications!',
  },
  {
    keywords: ['help', 'what can you do', 'options'],
    response:
      'I can help with: Application process, Required documents, Visa requirements, Scholarships and funding, Living costs, Language requirements, GPA requirements, How to contact professors, Motivation letter tips, Deadlines, Country-specific information, and more!',
  },
];

const getResponse = (query: string): string => {
  const lower = query.toLowerCase();

  // If we have a matched program, prioritize program-specific responses
  if (matchedProgram.value) {
    // Check if the query is about this specific program
    const programKeywords = [
      matchedProgram.value.university.toLowerCase(),
      matchedProgram.value.course.toLowerCase(),
      matchedProgram.value.id.toLowerCase(),
    ];
    const isAboutProgram =
      programKeywords.some((kw) => lower.includes(kw)) ||
      lower.includes('this program') ||
      lower.includes('this one') ||
      lower.includes('it');

    if (isAboutProgram) {
      return getProgramResponse(query, matchedProgram.value);
    }

    // For general questions, still use program context if relevant
    for (const item of knowledgeBase) {
      if (item.keywords.some((kw) => lower.includes(kw))) {
        // Enhance general response with program context
        const generalResponse = item.response;
        const programInfo = `\n\nAbout ${matchedProgram.value.course} at ${matchedProgram.value.university}: Deadline: ${matchedProgram.value.endDate || 'Check website'}, Tuition: ${matchedProgram.value.tuitionFee === 0 ? 'Free' : matchedProgram.value.tuitionFee + ' EUR'}`;
        return generalResponse + programInfo;
      }
    }

    // Default program overview
    return getProgramResponse('overview', matchedProgram.value);
  }

  // No program context - use general knowledge base
  for (const item of knowledgeBase) {
    if (item.keywords.some((kw) => lower.includes(kw))) {
      return item.response;
    }
  }

  if (props.context) {
    return `I can help with information about ${props.context}. Could you be more specific? For example, ask about application requirements, deadlines, costs, or scholarships.`;
  }

  return 'I can help with questions about applications, visas, scholarships, costs, language requirements, and more. Could you rephrase your question or ask about a specific topic?';
};

const toggleDrawer = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value && messages.value.length === 0) {
    const greeting = props.context
      ? `Hi! I can help you with information about ${props.context}. What would you like to know?`
      : "Hi! I'm your Study Counselor. I can help with applications, visas, scholarships, and more. What would you like to know?";
    messages.value.push({ type: 'assistant', content: greeting });
  }
};

const openDrawer = () => {
  isOpen.value = true;
  if (messages.value.length === 0) {
    const greeting = props.context
      ? `Hi! I can help you with information about ${props.context}. What would you like to know?`
      : "Hi! I'm your Study Counselor. I can help with applications, visas, scholarships, and more. What would you like to know?";
    messages.value.push({ type: 'assistant', content: greeting });
  }
};

defineExpose({ openDrawer });

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const speak = (text: string) => {
  if (
    !import.meta.client ||
    !voiceEnabled.value ||
    typeof window === 'undefined' ||
    !('speechSynthesis' in window)
  )
    return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1.1;
  const availableVoices =
    voices.value.length > 0 ? voices.value : Array.from(window.speechSynthesis.getVoices());
  if (availableVoices.length > 0) {
    const femaleVoice = availableVoices.find(
      (v) =>
        v.name.includes('Samantha') ||
        v.name.includes('Victoria') ||
        v.name.includes('Female') ||
        v.name.includes('Google UK English Female') ||
        v.name.includes('Zira') ||
        v.name.includes('Hazel')
    );
    utterance.voice = femaleVoice || availableVoices[0];
  }
  utterance.onstart = () => {
    isSpeaking.value = true;
  };
  utterance.onend = () => {
    isSpeaking.value = false;
  };
  window.speechSynthesis.speak(utterance);
};

const toggleVoice = () => {
  if (voiceEnabled.value) {
    voiceEnabled.value = false;
    if (import.meta.client && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      isSpeaking.value = false;
    }
  } else {
    enableVoice();
  }
};

const quickAsk = (question: string) => {
  currentMessage.value = question;
  sendMessage();
};

const sendMessage = async () => {
  if (!currentMessage.value.trim()) return;

  const userMessage = currentMessage.value.trim();
  messages.value.push({ type: 'user', content: userMessage });
  currentMessage.value = '';
  isLoading.value = true;

  try {
    // Try to get AI response from server API
    const response = await $fetch('/api/ai-agent', {
      method: 'POST',
      body: {
        query: userMessage,
        context: props.context || undefined,
      },
    });

    messages.value.push({
      type: 'assistant',
      content: response.response,
    });
    speak(response.response);
  } catch (error) {
    // Fallback to local response if API fails
    console.warn('API call failed, using local response:', error);
    const response = getResponse(userMessage);
    messages.value.push({ type: 'assistant', content: response });
    speak(response);
  } finally {
    isLoading.value = false;
  }
};

watch(
  () => messages.value.length,
  () => {
    scrollToBottom();
  }
);
</script>
