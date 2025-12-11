// quiz.js — GVAI Quick Quiz (20 questions, explanations included)

// -------------------- QUESTION BANK -------------------- //

const questions = [
  {
    id: 1,
    text: "What is the primary purpose of GraduationVaultsAI?",
    options: [
      "Generate investment returns for the school",
      "Provide transparent, student-linked savings vaults",
      "Replace teachers with automation",
      "Track school attendance"
    ],
    correctIndex: 1,
    explanation:
      "GraduationVaultsAI is built to create transparent, student-linked vaults so everyone can see how funds are growing for each learner."
  },
  {
    id: 2,
    text: "What does the phrase “Unlock Tomorrow. Today.” refer to?",
    options: [
      "Finishing high school early",
      "Students accessing their vault funds immediately",
      "Preparing students with digital tools and transparent savings",
      "A secret feature in NotebookLM"
    ],
    correctIndex: 2,
    explanation:
      "The tagline is about giving students future-focused advantages now: transparent savings plus modern AI and digital tools."
  },
  {
    id: 3,
    text: "What role does Self-Defi play in the GraduationVaultsAI ecosystem?",
    options: [
      "Holds custody of all student funds",
      "Designs decentralized infrastructure but never holds keys",
      "Acts as a traditional bank",
      "Chooses which students receive money"
    ],
    correctIndex: 1,
    explanation:
      "Self-Defi is the infrastructure architect. It helps design the vault system but never controls or holds private keys."
  },
  {
    id: 4,
    text: "What security model is used for managing vault control?",
    options: [
      "Single-password login",
      "School-only approval",
      "Multi-sig authorization",
      "Facial recognition"
    ],
    correctIndex: 2,
    explanation:
      "GraduationVaultsAI uses multi-signature (multi-sig) approval so no single person can move funds alone."
  },
  {
    id: 5,
    text: "Why is it important that no single person can move funds from a vault?",
    options: [
      "To comply with random banking rules",
      "To prevent any login from expiring",
      "To ensure shared accountability and youth safety",
      "To make transactions slower on purpose"
    ],
    correctIndex: 2,
    explanation:
      "Shared approvals protect students, reduce misuse risk, and keep everyone accountable for how funds move."
  },
  {
    id: 6,
    text: "Why are student vault balances hidden on public dashboards?",
    options: [
      "Because students never see their balances",
      "Youth safety and privacy",
      "The system cannot show balances correctly",
      "Schools asked to hide all numbers"
    ],
    correctIndex: 1,
    explanation:
      "Public dashboards show transparency without exposing individual student balances, protecting student privacy and safety."
  },
  {
    id: 7,
    text: "What does “Zero Custody by SD Advisory Group” mean?",
    options: [
      "The vaults are stored offline with SD Advisors",
      "Only SD Advisors can move funds",
      "SD Advisors never control or possess any private keys",
      "All vaults reset at the end of the year"
    ],
    correctIndex: 2,
    explanation:
      "Zero custody means SD Advisors design the system but never have keys or direct control over funds."
  },
  {
    id: 8,
    text: "What is the benefit of linking vaults to students personally instead of one shared school pool?",
    options: [
      "Creates extra work with no upside",
      "Reduces transparency on how funds are used",
      "Builds real-world financial literacy and ownership mindset",
      "Hides all transactions from donors"
    ],
    correctIndex: 2,
    explanation:
      "Student-linked vaults let learners see progress and build an ownership mindset about their future resources."
  },
  {
    id: 9,
    text: "Which AI tool is especially good for research with citations?",
    options: ["ChatGPT", "Canva", "Perplexity", "Replit"],
    correctIndex: 2,
    explanation:
      "Perplexity is optimized for research-style answers and includes sources so students can verify information."
  },
  {
    id: 10,
    text: "Which tool lets a student upload class notes or PDFs and ask questions directly against them?",
    options: ["NotebookLM", "Mindgrasp", "StudyFetch", "Replit AI"],
    correctIndex: 0,
    explanation:
      "NotebookLM is built to work against a specific set of documents so students can ask targeted questions about their materials."
  },
  {
    id: 11,
    text: "According to the GVAI materials, which combination of tools builds research and technical mindsets?",
    options: [
      "Canva, Google Docs, YouTube, Instagram, Excel",
      "ChatGPT, Perplexity, NotebookLM, Canva AI, Replit AI",
      "Snapchat, TikTok, Adobe, Sheets, Slides",
      "Only ChatGPT"
    ],
    correctIndex: 1,
    explanation:
      "The starter stack combines large language models, research tools, document-grounded AI, creative tools, and coding tools."
  },
  {
    id: 12,
    text: "What does “Prompt Discipline” mean in the context of AI tools?",
    options: [
      "Keeping prompts as short as possible",
      "Asking the AI to behave like an expert with clear instructions",
      "Limiting how often AI is used in class",
      "Turning in prompts for a grade"
    ],
    correctIndex: 1,
    explanation:
      "Prompt discipline is about giving clear roles and context so the AI responds with expert-level, useful output."
  },

  // -------------------- Additional 8 Questions -------------------- //

  {
    id: 13,
    text: "What is the main benefit of running the GVAI Quick Quiz fully client-side?",
    options: [
      "It uses the school’s database for tracking",
      "It requires a constant internet connection to a remote server",
      "No student data leaves the browser",
      "It lets advertisers track students"
    ],
    correctIndex: 2,
    explanation:
      "Client-side quizzes keep all responses local to the user’s device, protecting privacy and removing dependence on external servers."
  },
  {
    id: 14,
    text: "When using AI tools for schoolwork, what is the BEST next step after getting an answer?",
    options: [
      "Submit the AI answer without reading it",
      "Double-check facts and rewrite in your own words",
      "Copy/paste into multiple assignments",
      "Ask AI to shorten it and still turn it in as-is"
    ],
    correctIndex: 1,
    explanation:
      "Students should verify information and express it in their own voice to build understanding and avoid plagiarism."
  },
  {
    id: 15,
    text: "Which of these is a responsible way to use AI in academic projects?",
    options: [
      "Asking AI to generate fake sources",
      "Using AI to outline your ideas and then adding your own research",
      "Letting AI pick your opinion for you",
      "Using AI to impersonate another student"
    ],
    correctIndex: 1,
    explanation:
      "AI is strongest as a planning and support tool. Students should still research, think, and write for themselves."
  },
  {
    id: 16,
    text: "Why does GraduationVaultsAI emphasize clear, transparent dashboards?",
    options: [
      "To replace teachers with graphs",
      "So students and families can see how funds are building over time",
      "To confuse people with too many numbers",
      "To hide how vaults are structured"
    ],
    correctIndex: 1,
    explanation:
      "Transparent dashboards give students, families, and donors a shared, honest view of progress in each vault."
  },
  {
    id: 17,
    text: "If a student wants to explore coding or technical tinkering with AI, which tool from the stack is best?",
    options: ["Perplexity", "NotebookLM", "Replit AI", "Canva AI"],
    correctIndex: 2,
    explanation:
      "Replit AI is built around code, allowing students to experiment with scripts and learn technical problem solving."
  },
  {
    id: 18,
    text: "Why is it important that SD Advisory Group does not store or manage private keys for the school?",
    options: [
      "So SD Advisors can log in faster",
      "To keep the system legally classified as a bank",
      "To align with self-custody and avoid single points of failure",
      "So students never have to think about security"
    ],
    correctIndex: 2,
    explanation:
      "Self-custody means the school and trustees own their own keys, eliminating SD Advisory as a central point of control or risk."
  },
  {
    id: 19,
    text: "What is a smart way for students to use AI when preparing for an exam?",
    options: [
      "Ask AI for a fake answer key",
      "Have AI generate practice questions based on their notes",
      "Ask AI to take the exam for them",
      "Use AI only to translate answers into slang"
    ],
    correctIndex: 1,
    explanation:
      "Letting AI generate practice questions from real notes turns the tool into a study coach instead of a shortcut."
  },
  {
    id: 20,
    text: "What attitude toward AI does GraduationVaultsAI encourage?",
    options: [
      "AI as a cheat code to avoid learning",
      "AI as a replacement for teachers and mentors",
      "AI as a tool that amplifies disciplined students and clear systems",
      "AI as pure entertainment only"
    ],
    correctIndex: 2,
    explanation:
      "AI is framed as an amplifier: it makes disciplined systems and focused students more powerful, not a replacement for human effort."
  }
];

// -------------------- QUIZ STATE -------------------- //

let currentIndex = 0;
let score = 0;
let hasAnswered = false;

// -------------------- DOM REFERENCES -------------------- //

const questionTextEl = document.getElementById("question-text");
const choicesContainerEl = document.getElementById("choices-container");
const progressTextEl = document.getElementById("progress-text");
const scoreTextEl = document.getElementById("score-text");
const feedbackEl = document.getElementById("feedback");
const nextBtnEl = document.getElementById("next-btn");

// -------------------- RENDER FUNCTIONS -------------------- //

function renderQuestion() {
  const q = questions[currentIndex];
  hasAnswered = false;
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";

  // Progress text
  progressTextEl.textContent = `Question ${currentIndex + 1} of ${questions.length}`;
  scoreTextEl.textContent = `Score: ${score} / ${questions.length}`;

  // Question
  questionTextEl.textContent = q.text;

  // Choices
  choicesContainerEl.innerHTML = "";
  q.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = opt;
    btn.type = "button";
    btn.addEventListener("click", () => handleChoice(idx, btn));
    choicesContainerEl.appendChild(btn);
  });

  // Next button state
  nextBtnEl.disabled = true;
  nextBtnEl.textContent =
    currentIndex === questions.length - 1 ? "View Results" : "Next Question";
}

function handleChoice(selectedIndex, selectedBtn) {
  if (hasAnswered) return;
  hasAnswered = true;

  const q = questions[currentIndex];

  // Mark correct / incorrect
  const choiceButtons = choicesContainerEl.querySelectorAll(".choice-btn");
  choiceButtons.forEach((btn, idx) => {
    btn.disabled = true;

    if (idx === q.correctIndex) {
      btn.classList.add("correct");
    }

    if (idx === selectedIndex && idx !== q.correctIndex) {
      btn.classList.add("incorrect");
    }
  });

  // Update score + feedback
  const isCorrect = selectedIndex === q.correctIndex;
  if (isCorrect) {
    score++;
    feedbackEl.textContent = "Correct. " + q.explanation;
    feedbackEl.classList.add("feedback-correct");
  } else {
    feedbackEl.textContent = "Not quite. " + q.explanation;
    feedbackEl.classList.add("feedback-incorrect");
  }

  scoreTextEl.textContent = `Score: ${score} / ${questions.length}`;
  nextBtnEl.disabled = false;
}

// -------------------- NAVIGATION -------------------- //

function showResults() {
  questionTextEl.textContent = "Quiz Complete";
  choicesContainerEl.innerHTML = "";
  feedbackEl.className = "feedback feedback-summary";
  feedbackEl.textContent =
    `You scored ${score} out of ${questions.length}. ` +
    (score === questions.length
      ? "Perfect! You’ve locked in the GraduationVaultsAI concepts."
      : score >= Math.round(questions.length * 0.7)
      ? "Strong work. You have a solid grasp of the material."
      : "Good start. Review the video and slides, then try again.");

  progressTextEl.textContent = "Great work.";
  nextBtnEl.textContent = "Restart Quiz";
  nextBtnEl.disabled = false;
}

function handleNext() {
  // If we're at the end and user hits "Restart Quiz"
  if (currentIndex === questions.length) {
    currentIndex = 0;
    score = 0;
    renderQuestion();
    return;
  }

  // Move to next question OR results
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    renderQuestion();
  } else {
    currentIndex = questions.length; // lock state
    showResults();
  }
}

// -------------------- EVENT HOOKUP -------------------- //

nextBtnEl.addEventListener("click", handleNext);

// -------------------- INITIAL RENDER -------------------- //

renderQuestion();
