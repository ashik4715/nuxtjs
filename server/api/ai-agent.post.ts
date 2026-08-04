import fs from 'node:fs';
import path from 'node:path';

interface AiData {
  personal_info?: { name?: string; description?: string };
  skills?: string[];
  work_experience?: Array<{ position: string; company: string; duration: string }>;
  projects?: Array<{ name: string; description: string }>;
}

function findRelevantContext(query: string, aiData: AiData): string {
  const lowerQuery = query.toLowerCase();
  let context = '';

  if (lowerQuery.includes('skill') || lowerQuery.includes('technology')) {
    context += `Skills: ${aiData.skills?.join(', ') || 'Various technical skills'}. `;
  }

  if (lowerQuery.includes('experience') || lowerQuery.includes('work')) {
    context += `Experience: ${
      aiData.work_experience
        ?.map((exp) => `${exp.position} at ${exp.company} (${exp.duration})`)
        .join(', ') || 'Professional experience in software development'
    }. `;
  }

  if (lowerQuery.includes('project')) {
    context += `Projects: ${
      aiData.projects?.map((proj) => `${proj.name} - ${proj.description}`).join(', ') ||
      'Various development projects'
    }. `;
  }

  return (
    context ||
    `About: ${aiData.personal_info?.description || 'Full-stack developer with expertise in modern web technologies'}`
  );
}

function getResponse(query: string, context: string, aiData: AiData): string {
  const lower = query.toLowerCase();

  // Program-specific responses
  if (context) {
    if (lower.includes('deadline') || lower.includes('when')) {
      return `For ${context}: Please check the official program website for the most up-to-date deadline information. Application deadlines vary by program and intake. Typically, winter intake deadlines are January-July, and summer intake deadlines are October-January.`;
    }

    if (lower.includes('tuition') || lower.includes('cost') || lower.includes('fee')) {
      return `For ${context}: Tuition fees vary by program and country. German public universities are generally tuition-free (only semester contribution of 150-350 EUR). Canadian universities range from CAD 5,000-25,000/year. Check the program website for exact fees.`;
    }

    if (lower.includes('apply') || lower.includes('application') || lower.includes('portal')) {
      return `To apply to ${context}: 1) Visit the program website, 2) Check admission requirements, 3) Prepare required documents (transcripts, CV, motivation letter, reference letters, English proficiency proof), 4) Submit application before deadline, 5) Pay application fee if required. For German universities, many use uni-assist.`;
    }

    if (lower.includes('requirement') || lower.includes('document')) {
      return `Requirements for ${context}: Typically include Bachelor degree, academic transcripts, CV/Resume, motivation letter, 2 reference letters, English proficiency (IELTS 6.5+ or TOEFL 90+), and passport copy. Some programs may require GRE/GMAT.`;
    }

    if (lower.includes('scholarship') || lower.includes('funding')) {
      return `Scholarships for ${context}: Check DAAD (Germany), Erasmus Mundus (EU), university-specific scholarships, and government scholarships from your home country. Apply early as deadlines are 6-12 months before program start.`;
    }

    if (lower.includes('visa')) {
      return `For ${context}: Student visa requires admission letter, proof of finances (11,208 EUR/year blocked account for Germany), health insurance, and accommodation proof. Apply 3-6 months before start date.`;
    }

    return `Here's what I know about ${context}: Check the official program website for the most current information about deadlines, requirements, and fees. You can also contact the university's international admissions office directly.`;
  }

  // Profile-specific responses
  if (lower.includes('skill') || lower.includes('technology') || lower.includes('tech stack')) {
    return `Technical skills: ${aiData.skills?.join(', ') || 'TypeScript, JavaScript, Python, PHP, Node.js, NestJS, Laravel, Vue.js, React, PostgreSQL, AWS'}.`;
  }

  if (
    lower.includes('experience') ||
    lower.includes('work') ||
    lower.includes('job') ||
    lower.includes('role')
  ) {
    if (aiData.work_experience?.length) {
      return `Work experience: ${aiData.work_experience.map((exp) => `${exp.position} at ${exp.company} (${exp.duration})`).join('. ')}.`;
    }
    return 'Work experience: Senior Backend Engineer at WeGro (2024-present), Junior Software Consultant at Commerce Connections UK (2023), Lead PHP Developer at MNB Technology (2019-2022).';
  }

  if (lower.includes('publication') || lower.includes('paper') || lower.includes('research')) {
    return 'Publications: 4 international papers - IEEE Conference on Kinect 3D Reconstruction (2019), IJERT Journal on Kinect Sensor Applications (2018), Oxford FLE on Industrial Networking (2017), AUJST Journal on Data Mining Classification (2018).';
  }

  if (
    lower.includes('education') ||
    lower.includes('university') ||
    lower.includes('degree') ||
    lower.includes('study')
  ) {
    return 'Education: BSc in Computer Science and Engineering from BRAC University, Bangladesh (2019). Partial MSc in Information Technology at University of Wedel, Germany (2022, incomplete).';
  }

  if (lower.includes('contact') || lower.includes('email') || lower.includes('reach')) {
    return 'Contact: Email - ashikurjhalak@gmail.com, LinkedIn - linkedin.com/in/ashikur-rahman-0a272ba1, GitHub - github.com/ashik4715, Website - jholok.vercel.app';
  }

  if (lower.includes('who') || lower.includes('about') || lower.includes('tell me about')) {
    return 'I am Mohammed Ashikur Rahman, a Senior Software Engineer from Dhaka, Bangladesh. I specialize in backend development with NestJS, TypeScript, and PostgreSQL. I have research interests in 3D reconstruction, computer vision, and generative AI. I have 4 international publications.';
  }

  // General study abroad responses
  if (lower.includes('visa') || lower.includes('student visa')) {
    return 'For Germany student visa: Apply at your local German embassy with admission letter, proof of finances (approx 11,208 EUR/year in blocked account), health insurance, and accommodation proof. Apply 3-6 months before start date.';
  }

  if (lower.includes('scholarship') || lower.includes('funding')) {
    return 'Major scholarships: DAAD (Germany, fully funded), Erasmus Mundus (EU, fully funded), Fulbright (USA), Chevening (UK). University-specific scholarships also available. Apply early - deadlines are 6-12 months before program starts.';
  }

  if (
    lower.includes('ielts') ||
    lower.includes('toefl') ||
    lower.includes('english') ||
    lower.includes('language')
  ) {
    return 'Most English-taught programs require IELTS 6.5+ (minimum 6.0 per band) or TOEFL 90+. Some accept Duolingo English Test or PTE. Check specific program requirements.';
  }

  if (lower.includes('gpa') || lower.includes('grade') || lower.includes('academic')) {
    return 'Minimum GPA varies: Germany 2.5+/4.0, Netherlands 3.0+/4.0, Canada 3.0+/4.0. Strong research experience, publications, or work experience can offset a lower GPA.';
  }

  if (
    lower.includes('professor') ||
    lower.includes('contact professor') ||
    lower.includes('email professor')
  ) {
    return 'When contacting professors: 1) Read their recent papers, 2) Be specific about how your interests align with their work, 3) Attach CV and transcripts, 4) Keep email concise (under 300 words), 5) Follow up after 2 weeks.';
  }

  if (
    lower.includes('motivation') ||
    lower.includes('motivation letter') ||
    lower.includes('sop')
  ) {
    return 'Strong motivation letter: 1) Why this specific program/university, 2) Academic background and relevant experience, 3) Research interests and goals, 4) Career plans after graduation. Keep it 1-2 pages, be authentic.';
  }

  if (lower.includes('cost') || lower.includes('living cost') || lower.includes('expensive')) {
    return 'Living costs: Germany 850-1200 EUR/month, Netherlands 1000-1400 EUR/month, Canada 1500-2000 CAD/month. Germany public universities have no tuition fees (only semester contribution 150-350 EUR).';
  }

  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return 'Hello! I am your Study Counselor assistant. I can help you with information about university applications, visa requirements, scholarships, living costs, and more. What would you like to know?';
  }

  if (lower.includes('thank')) {
    return 'You are welcome! Feel free to ask if you have any more questions about your study abroad journey. Good luck with your applications!';
  }

  if (lower.includes('help') || lower.includes('what can you do')) {
    return 'I can help with: Application process, Required documents, Visa requirements, Scholarships, Living costs, Language requirements, GPA requirements, Professor contact tips, Motivation letter tips, and more!';
  }

  return 'I can help with questions about applications, visas, scholarships, costs, language requirements, and more. Could you rephrase your question or ask about a specific topic?';
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { query, context: chatContext } = body;

    if (!query) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Query is required',
      });
    }

    let aiData: AiData = {
      personal_info: {
        name: 'Mohammed Ashikur Rahman',
        description: 'Senior Software Engineer with expertise in modern web technologies',
      },
      skills: [
        'TypeScript',
        'JavaScript',
        'Python',
        'PHP',
        'Node.js',
        'NestJS',
        'Laravel',
        'Vue.js',
        'React',
        'PostgreSQL',
        'MySQL',
        'MongoDB',
        'AWS',
        'Docker',
        'GitHub CI/CD',
      ],
      work_experience: [
        {
          position: 'Senior Backend Engineer',
          company: 'WeGro Technologies',
          duration: 'Aug 2024 - Present',
        },
        {
          position: 'Junior Software Consultant',
          company: 'Commerce Connections LTD',
          duration: 'Sep 2023 - Dec 2023',
        },
        { position: 'Lead PHP Developer', company: 'MNB Technology', duration: '2019 - 2022' },
      ],
      projects: [],
    };

    const possiblePaths = [
      path.join(process.cwd(), 'static', 'ai-agent-data.json'),
      path.join(process.cwd(), 'public', 'ai-agent-data.json'),
    ];

    for (const dataPath of possiblePaths) {
      try {
        if (fs.existsSync(dataPath)) {
          aiData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
          break;
        }
      } catch {
        continue;
      }
    }

    const relevantContext = findRelevantContext(query, aiData);
    const responseText = getResponse(query, chatContext || '', aiData);

    return { response: responseText, context: relevantContext };
  } catch (error) {
    console.error('Error in AI agent:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to process query',
    });
  }
});
