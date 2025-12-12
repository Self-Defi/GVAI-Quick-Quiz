// quiz.js
// GVAI Quick Quiz — fully client-side, no external dependencies.
// Behavior: Tools + Quiz sections can stay hidden until buttons are pressed.
// Quiz does NOT render until "Quiz Yourself" is clicked.

const questions = [
  {
    id: 1,
    question: "What is the core purpose of GVAI (GraduationVaultsAI)?",
    options: {
      A: "To speculate on AI-related tokens and chase short-term yield.",
      B: "To replace teachers with automated agents.",
      C: "To give students a guided way to learn how AI and digital infrastructure work together.",
      D: "To run high-frequency trading strategies for schools."
    },
    correct: "C",
    explanation: "GVAI is framed as an academic learning hub: AI + digital infrastructure basics with responsible use."
  },
  {
    id: 2,
    question: "How should AI be used in an academic setting (best practice)?",
    options: {
      A: "As a tool that assists thinking while the student remains responsible for the final work.",
      B: "As a replacement for reading assignments.",
      C: "As a way to submit fully AI-written answers without review.",
      D: "As a way to share private student data for personalization."
    },
    correct: "A",
    explanation: "AI can support learning (summaries, outlines, clarification), but students must understand and own their work."
  },
  {
    id: 3,
    question: "Why is transparency important in systems like Graduation Vaults?",
    options: {
      A: "So only administrators can view activity.",
      B: "So activity can be hidden from families.",
      C: "So systems look more complex.",
      D: "So students, families, and partners can understand decisions and build trust."
    },
    correct: "D",
    explanation: "Transparency builds trust by making processes and outcomes visible and understandable."
  },
  {
    id: 4,
    question: "Which behavior is most aligned with responsible AI use?",
    options: {
      A: "Copying AI outputs word-for-word without reading them.",
      B: "Using AI to summarize and then verifying with class materials or a teacher.",
      C: "Sharing passwords so AI can ‘log in’ and help.",
      D: "Using AI to bypass school policy."
    },
    correct: "B",
    explanation: "Use AI to assist learning, then verify and refine using trusted sources and your own understanding."
  },
  {
    id: 5,
    question: "In a multi-sig model, who approves transactions?",
    options: {
      A: "Only one person, for speed.",
      B: "AI agents automatically approve transfers.",
      C: "Multiple human signers approve based on defined rules.",
      D: "Any donor can approve transactions."
    },
    correct: "C",
    explanation: "Multi-sig requires multiple human approvals, reducing single-point failure risk."
  },
  {
    id: 6,
    question: "Why avoid entering private information into AI tools?",
    options: {
      A: "AI tools always publish your data publicly.",
      B: "You can’t control downstream storage, retention, or training, so it’s safer to keep personal data out.",
      C: "AI tools can’t process names.",
      D: "Schools require students to share passwords."
    },
    correct: "B",
    explanation: "Even reputable tools may store data. Academic use should avoid personal identifiers and sensitive info."
  },
  {
    id: 7,
    question: "What is the best next step if an AI answer might be wrong?",
    options: {
      A: "Assume AI is correct and submit it.",
      B: "Ignore the topic completely.",
      C: "Cross-check with official materials, teachers, or multiple reliable sources.",
      D: "Ask AI to hide the uncertainty."
    },
    correct: "C",
    explanation: "Verification is key: compare against trusted sources and course content."
  },
  {
    id: 8,
    question: "Why emphasize the difference between ‘speculation’ and ‘infrastructure building’?",
    options: {
      A: "Because speculation is required for education.",
      B: "To clarify the work is about long-term systems and accountability, not gambling on price.",
      C: "To discourage any learning about finance.",
      D: "To promote meme tokens."
    },
    correct: "B",
    explanation: "The program focuses on durable systems and responsible operations, not price-chasing."
  },
  {
    id: 9,
    question: "Which prompt is most aligned with academic use?",
    options: {
      A: "Write my essay and make it undetectable.",
      B: "Give me the test answers.",
      C: "Explain this concept using a simple example and a short checklist.",
      D: "Hack my school portal."
    },
    correct: "C",
    explanation: "Academic use supports understanding (explanations, examples, study aids), not cheating or misuse."
  },
  {
    id: 10,
    question: "What does ‘local / client-side quiz’ mean?",
    options: {
      A: "Answers are uploaded to a server for grading.",
      B: "Answers are stored in a public database.",
      C: "Answers are processed in your browser; nothing is sent to a backend.",
      D: "Answers are emailed to the administrator."
    },
    correct: "C",
    explanation: "Client-side means everything happens in the browser, improving privacy and reducing dependencies."
  },

  // --- Governance / safety / systems questions ---
  {
    id: 11,
    question: "What is a core security rule in Self-Defi style systems?",
    options: {
      A: "Store seed phrases in shared group chats.",
      B: "Give one person full control for speed.",
      C: "Use only closed-source wallets for convenience.",
      D: "Use multi-sig or clear custody controls; never rely on blind trust."
    },
    correct: "D",
    explanation: "Security comes from shared controls, clear roles, and avoiding single points of failure."
  },
  {
    id: 12,
    question: "Why do governance policies matter even for small school systems?",
    options: {
      A: "They only matter at national scale.",
      B: "They create clear rules for decisions, accountability, and conflict resolution.",
      C: "They slow everything down for no benefit.",
      D: "They replace the need for leadership."
    },
    correct: "B",
    explanation: "Governance defines who can do what, when, and why—preventing confusion and misuse."
  },
  {
    id: 13,
    question: "Which is an example of 'defense-in-depth'?",
    options: {
      A: "One password and no backup.",
      B: "Multiple layers: strong auth, role separation, backups, and monitoring.",
      C: "Only using a new app because it’s popular.",
      D: "Sharing admin access with everyone."
    },
    correct: "B",
    explanation: "Defense-in-depth uses multiple controls so one failure doesn't compromise the system."
  },
  {
    id: 14,
    question: "What is the most appropriate use of AI for school staff?",
    options: {
      A: "Automatically approving financial actions without review.",
      B: "Replacing all staff meetings.",
      C: "Drafting clear summaries, checklists, and communications from school materials.",
      D: "Collecting private student data."
    },
    correct: "C",
    explanation: "AI can accelerate writing and organization, but humans keep decision authority."
  },
  {
    id: 15,
    question: "What is a safe approach to using AI for research?",
    options: {
      A: "Use one AI answer as the only source.",
      B: "Ask AI for citations, then verify sources and quote correctly.",
      C: "Avoid sources and rely on opinions.",
      D: "Copy/paste full paragraphs without attribution."
    },
    correct: "B",
    explanation: "AI can help find and summarize, but you must verify and cite real sources."
  },
  {
    id: 16,
    question: "Which is the best description of a 'single point of failure'?",
    options: {
      A: "A system where one compromised account can break the whole system.",
      B: "A system with multiple signers and backups.",
      C: "A system with documentation.",
      D: "A system with clear roles."
    },
    correct: "A",
    explanation: "When one person or system component can fail and compromise everything, that’s a single point of failure."
  },
  {
    id: 17,
    question: "What does 'least privilege' mean?",
    options: {
      A: "Give everyone admin access to avoid delays.",
      B: "Give users only the access they need for their role, nothing more.",
      C: "Remove all access so no one can work.",
      D: "Give donors control of student funds."
    },
    correct: "B",
    explanation: "Least privilege reduces risk by limiting what each user can do."
  },
  {
    id: 18,
    question: "What is the best practice for handling AI hallucinations?",
    options: {
      A: "Assume hallucinations never happen.",
      B: "Treat AI output as a draft; verify facts and adjust prompts.",
      C: "Hide the hallucination and submit anyway.",
      D: "Stop learning entirely."
    },
    correct: "B",
    explanation: "Hallucinations happen. The correct move is verification and improved prompting."
  },

  // --- Academic tools questions ---
  {
    id: 19,
    question: "Which tool is best known for step-by-step math and science computations?",
    options: {
      A: "Wolfram Alpha",
      B: "A random social media chatbot",
      C: "A meme generator",
      D: "A password manager"
    },
    correct: "A",
    explanation: "Wolfram Alpha specializes in computation and structured problem solving."
  },
  {
    id: 20,
    question: "What is a good use case for NotebookLM (in academic scope)?",
    options: {
      A: "Trading signals for SOL memes",
      B: "Studying from your own documents: notes, PDFs, class materials",
      C: "Sharing student passwords to auto-fill forms",
      D: "Bypassing school restrictions"
    },
    correct: "B",
    explanation: "NotebookLM is designed around learning from your own materials."
  },
  {
    id: 21,
    question: "Why are official links important in a curated tools list?",
    options: {
      A: "They guarantee price discounts.",
      B: "They prevent all internet risks forever.",
      C: "They reduce phishing risk and ensure students land on legitimate services.",
      D: "They increase ad tracking."
    },
    correct: "C",
    explanation: "Official links reduce the chance of phishing and keep resources trustworthy."
  },

  // --- Data / privacy / compliance ---
  {
    id: 22,
    question: "Which is safest to share with an AI tool for a class assignment?",
    options: {
      A: "Your seed phrase and wallet addresses",
      B: "A non-identifying example scenario without personal data",
      C: "Your full legal name and home address",
      D: "Your school login credentials"
    },
    correct: "B",
    explanation: "Use generalized examples; avoid sensitive personal identifiers and credentials."
  },
  {
    id: 23,
    question: "What is the safest meaning of ‘nothing is uploaded or tracked’ in this quiz context?",
    options: {
      A: "It runs locally in your browser without a server collecting answers.",
      B: "It automatically posts your score online.",
      C: "It emails your answers to administrators.",
      D: "It stores your answers in a shared spreadsheet."
    },
    correct: "A",
    explanation: "Client-side logic means no backend collection by default."
  },
  {
    id: 24,
    question: "What’s the best reason to implement save-and-resume locally?",
    options: {
      A: "To make answers public for transparency.",
      B: "To reduce privacy and force sign-in.",
      C: "To let students continue without creating accounts or uploading data.",
      D: "To share progress across all devices automatically."
    },
    correct: "C",
    explanation: "LocalStorage supports convenience while avoiding account systems."
  },

  // --- Systems thinking / operations ---
  {
    id: 25,
    question: "What is the best definition of 'infrastructure' in this context?",
    options: {
      A: "A set of tools, processes, and controls that support reliable operations over time.",
      B: "A meme coin strategy.",
      C: "Only physical buildings.",
      D: "A secret system that no one can understand."
    },
    correct: "A",
    explanation: "Infrastructure includes technical tools and operational processes that enable consistent outcomes."
  },
  {
    id: 26,
    question: "Which is a good example of an audit trail?",
    options: {
      A: "A log of actions: who did what, when, and why.",
      B: "A private conversation with no notes.",
      C: "Deleting mistakes immediately.",
      D: "Sharing admin passwords."
    },
    correct: "A",
    explanation: "Audit trails support accountability and review."
  },
  {
    id: 27,
    question: "If the goal is student safety, what’s the best approach to displaying balances publicly?",
    options: {
      A: "Show every student’s exact balance and identity.",
      B: "Hide all balances permanently even from trustees.",
      C: "Show aggregated totals, and protect individual student info where required by policy.",
      D: "Allow anyone to edit balances."
    },
    correct: "C",
    explanation: "Transparency should not compromise student privacy; use aggregation and protection policies."
  },

  // --- AI prompting / learning ---
  {
    id: 28,
    question: "Which prompt produces the most useful academic output?",
    options: {
      A: "Explain X to me and include 3 examples and 5 quiz questions.",
      B: "Do everything for me.",
      C: "Make it impossible to detect.",
      D: "Ignore all safety rules."
    },
    correct: "A",
    explanation: "Clear structure (examples + checks for understanding) improves learning value."
  },
  {
    id: 29,
    question: "What’s a strong way to use AI to learn a new topic?",
    options: {
      A: "Ask for a 1-page summary, then create a study plan and verify key facts.",
      B: "Ask for the final answers only.",
      C: "Ask AI to guess your grade.",
      D: "Ask for personal data on classmates."
    },
    correct: "A",
    explanation: "Combine summary + plan + verification for real learning."
  },

  // --- Digital literacy / security ---
  {
    id: 30,
    question: "What’s the best sign a site might be phishing?",
    options: {
      A: "It uses HTTPS, so it’s always safe.",
      B: "It looks professional.",
      C: "The URL is slightly misspelled or uses odd domains; it asks for passwords unexpectedly.",
      D: "It has a logo."
    },
    correct: "C",
    explanation: "Phishing often uses lookalike URLs and prompts for sensitive info unexpectedly."
  },
  {
    id: 31,
    question: "Why is it risky to use 'random online advice' for school systems?",
    options: {
      A: "Online advice is always wrong.",
      B: "It can conflict with school policies, safety requirements, and local context.",
      C: "It makes the internet slower.",
      D: "It is illegal to read advice."
    },
    correct: "B",
    explanation: "School systems require policy-aligned decisions and consistent guardrails."
  },

  // --- More quiz pool (mixed correct answers) ---
  {
    id: 32,
    question: "Which is the best example of 'verification' after using AI?",
    options: {
      A: "Publishing the AI answer without reading it",
      B: "Checking at least two reliable sources or course materials for key claims",
      C: "Changing the topic",
      D: "Deleting the prompt history"
    },
    correct: "B",
    explanation: "Verification means validating key claims with trusted sources."
  },
  {
    id: 33,
    question: "What’s the safest approach to passwords in any learning tool?",
    options: {
      A: "Reuse one password everywhere for convenience",
      B: "Share passwords with friends to speed up group work",
      C: "Use strong unique passwords and never share them",
      D: "Save passwords in public notes"
    },
    correct: "C",
    explanation: "Unique strong passwords + no sharing reduces account compromise risk."
  },
  {
    id: 34,
    question: "What does 'randomized question order' improve?",
    options: {
      A: "It prevents all cheating forever",
      B: "It makes the quiz harder to use",
      C: "It encourages real understanding by reducing memorization of order",
      D: "It removes the need for explanations"
    },
    correct: "C",
    explanation: "Randomization reduces pattern memorization and supports genuine comprehension checks."
  },
  {
    id: 35,
    question: "What is the main reason to keep this app static (no backend)?",
    options: {
      A: "To store student data centrally",
      B: "To reduce dependencies and keep privacy strong by default",
      C: "To require logins",
      D: "To track users across sessions"
    },
    correct: "B",
    explanation: "Static apps reduce attack surface and avoid server-side data collection."
  },
  {
    id: 36,
    question: "If a student wants to use AI to improve writing ethically, what’s best?",
    options: {
      A: "Ask AI to rewrite everything and submit as-is",
      B: "Ask AI for an outline and editing suggestions, then write in your own voice",
      C: "Ask AI to generate citations without sources",
      D: "Ask AI to pretend to be the teacher"
    },
    correct: "B",
    explanation: "Outlines and edits are fine; the student should produce the final writing authentically."
  },
  {
    id: 37,
    question: "Which statement best matches 'humans stay in control'?",
    options: {
      A: "AI approves decisions automatically",
      B: "AI can suggest options, but people decide and remain accountable",
      C: "AI replaces policy",
      D: "AI should be trusted without question"
    },
    correct: "B",
    explanation: "AI supports; humans decide and remain accountable."
  },
  {
    id: 38,
    question: "What is the safest way to use AI for studying a PDF?",
    options: {
      A: "Upload private documents with student identifiers to unknown tools",
      B: "Use a reputable tool and remove personal identifiers when possible",
      C: "Share the PDF publicly first",
      D: "Never read the PDF; only ask AI"
    },
    correct: "B",
    explanation: "Use reputable tools, minimize sensitive data, and still read/verify key sections."
  },
  {
    id: 39,
    question: "What does 'academic scope' mean in this resources section?",
    options: {
      A: "Tools are listed for entertainment only",
      B: "Tools are for cheating on exams",
      C: "Tools are limited to learning, research support, and study assistance",
      D: "Tools are for financial speculation"
    },
    correct: "C",
    explanation: "Academic scope means learning support: study, research, clarification, drafting—not misuse."
  },
  {
    id: 40,
    question: "A good ‘next step’ after finishing the quiz is:",
    options: {
      A: "Forget everything and move on",
      B: "Post your answers publicly with your name",
      C: "Identify confusing topics and discuss them with a teacher/mentor",
      D: "Retake until you memorize letters only"
    },
    correct: "C",
    explanation: "Use the quiz to surface learning gaps, then resolve them with trusted guidance."
  },
  {
    id: 41,
    question: "Which is a practical example of a checklist AI could help create?",
    options: {
      A: "A step-by-step study plan for a unit exam",
      B: "A list of student passwords",
      C: "A bypass guide for school rules",
      D: "A phishing template"
    },
    correct: "A",
    explanation: "AI is useful for organizing study steps and planning—never for sensitive or harmful tasks."
  },
  {
    id: 42,
    question: "Which is the best reason to include explanations after each answer?",
    options: {
      A: "To make the quiz longer",
      B: "To support learning by explaining why an answer is correct",
      C: "To hide the correct answers",
      D: "To reduce understanding"
    },
    correct: "B",
    explanation: "Explanations turn the quiz into a learning tool, not just a score."
  },
  {
    id: 43,
    question: "What’s a safe way to use Perplexity (or any cited-search tool) academically?",
    options: {
      A: "Copy the AI summary without reading sources",
      B: "Use it to locate sources, then read and cite the originals properly",
      C: "Use it to generate fake citations",
      D: "Use it to submit work without attribution"
    },
    correct: "B",
    explanation: "Citations are only useful if you actually consult the underlying sources."
  },
  {
    id: 44,
    question: "Why include a 'Book Consultation' link on the hub?",
    options: {
      A: "To replace students’ learning",
      B: "To upsell unrelated services",
      C: "To offer optional human support for setup, clarity, and responsible implementation",
      D: "To collect private student data"
    },
    correct: "C",
    explanation: "The CTA is for optional human support—aligned with infrastructure help and responsible guidance."
  },
  {
    id: 45,
    question: "Which is the best policy-aligned AI behavior for students?",
    options: {
      A: "Use AI for brainstorming and then write your own response",
      B: "Ask AI to impersonate a teacher",
      C: "Ask AI for confidential student data",
      D: "Ask AI to bypass restrictions"
    },
    correct: "A",
    explanation: "Brainstorming and outlining are appropriate; impersonation and data requests are not."
  },
  {
    id: 46,
    question: "What does a 'progress tracker' help with most?",
    options: {
      A: "Forces correct answers",
      B: "Shows completion status and motivates finishing thoughtfully",
      C: "Replaces explanations",
      D: "Makes questions easier"
    },
    correct: "B",
    explanation: "Progress tracking supports pacing and completion without changing question integrity."
  },
  {
    id: 47,
    question: "What’s a good reason to hide content until a user presses a button (Tools/Quiz)?",
    options: {
      A: "To make the page feel broken",
      B: "To reduce cognitive overload and keep the page clean on mobile",
      C: "To increase tracking",
      D: "To slow performance intentionally"
    },
    correct: "B",
    explanation: "Progressive disclosure keeps the experience clean and intentional, especially on phones."
  },
  {
    id: 48,
    question: "If a tool asks for a seed phrase, what should a student do?",
    options: {
      A: "Enter it so the tool can help",
      B: "Share it with a teacher",
      C: "Never share it; stop and ask a trusted adult/mentor if unsure",
      D: "Post it in a group chat"
    },
    correct: "C",
    explanation: "Seed phrases are private keys—never share them. If unsure, stop and get trusted help."
  }
];

// ---------------- State ----------------
let activeQuiz = [];
let quizLoaded = false;
const STORAGE_KEY = "gvai_quiz_state_v1";

// ---------------- Helpers ----------------
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function clampQuizSize(n) {
  const max = Math.max(1, questions.length);
  return Math.min(Math.max(1, n), max);
}

function getSelectedAnswers() {
  const answers = {};
  activeQuiz.forEach((q) => {
    const selected = document.querySelector(`input[name="q${q.id}"]:checked`);
    if (selected) answers[q.id] = selected.value;
  });
  return answers;
}

function setProgress() {
  const answered = activeQuiz.reduce((acc, q) => {
    const selected = document.querySelector(`input[name="q${q.id}"]:checked`);
    return acc + (selected ? 1 : 0);
  }, 0);

  const total = activeQuiz.length || 0;
  const pct = total ? Math.round((answered / total) * 100) : 0;

  const progressText = document.getElementById("progress-text");
  const progressPercent = document.getElementById("progress-percent");
  const progressFill = document.getElementById("progress-fill");
  const progressBar = document.querySelector(".progress-bar");

  if (progressText) progressText.textContent = `Progress: ${answered} / ${total}`;
  if (progressPercent) progressPercent.textContent = `${pct}%`;
  if (progressFill) progressFill.style.width = `${pct}%`;
  if (progressBar) progressBar.setAttribute("aria-valuenow", String(pct));
}

function saveState() {
  const sizeEl = document.getElementById("quiz-size");
  const payload = {
    size: sizeEl ? Number(sizeEl.value) : 20,
    activeIds: activeQuiz.map((q) => q.id),
    answers: getSelectedAnswers(),
    theme: document.documentElement.getAttribute("data-theme") || "light"
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function clearState() {
  localStorage.removeItem(STORAGE_KEY);
}

// ---------------- Render ----------------
function renderQuiz() {
  const form = document.getElementById("quiz-form");
  if (!form) return;

  form.innerHTML = "";

  activeQuiz.forEach((q, index) => {
    const questionNumber = index + 1;

    const questionDiv = document.createElement("div");
    questionDiv.className = "quiz-question";
    questionDiv.dataset.questionId = q.id;

    const heading = document.createElement("h3");
    heading.textContent = `${questionNumber}. ${q.question}`;
    questionDiv.appendChild(heading);

    const optionsList = document.createElement("ul");
    optionsList.className = "quiz-options";

    Object.entries(q.options).forEach(([key, text]) => {
      const li = document.createElement("li");

      const label = document.createElement("label");
      label.className = "quiz-option-label";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = `q${q.id}`;
      input.value = key;

      input.addEventListener("change", () => {
        setProgress();
        saveState();
      });

      const span = document.createElement("span");
      span.textContent = `${key}) ${text}`;

      label.appendChild(input);
      label.appendChild(span);
      li.appendChild(label);
      optionsList.appendChild(li);
    });

    const feedback = document.createElement("div");
    feedback.className = "quiz-feedback";
    feedback.id = `feedback-q${q.id}`;
    feedback.setAttribute("aria-live", "polite");

    questionDiv.appendChild(optionsList);
    questionDiv.appendChild(feedback);

    form.appendChild(questionDiv);
  });

  setProgress();
}

function hydrateAnswers(savedAnswers = {}) {
  Object.entries(savedAnswers).forEach(([qid, val]) => {
    const el = document.querySelector(`input[name="q${qid}"][value="${val}"]`);
    if (el) el.checked = true;
  });
  setProgress();
}

function buildNewQuiz(size) {
  const n = clampQuizSize(size);
  activeQuiz = shuffle(questions).slice(0, n);
  renderQuiz();
  // Clear feedback + summary when building a new quiz
  document.querySelectorAll(".quiz-feedback").forEach((el) => {
    el.textContent = "";
    el.className = "quiz-feedback";
  });
  const summary = document.getElementById("quiz-summary");
  if (summary) {
    summary.hidden = true;
    summary.textContent = "";
  }
  saveState();
}

function gradeQuiz() {
  let correctCount = 0;

  activeQuiz.forEach((q) => {
    const selected = document.querySelector(`input[name="q${q.id}"]:checked`);
    const feedbackEl = document.getElementById(`feedback-q${q.id}`);
    if (!feedbackEl) return;

    if (!selected) {
      feedbackEl.textContent = "No answer selected yet.";
      feedbackEl.className = "quiz-feedback neutral";
      return;
    }

    if (selected.value === q.correct) {
      correctCount++;
      feedbackEl.textContent = `✅ Correct. ${q.explanation}`;
      feedbackEl.className = "quiz-feedback correct";
    } else {
      feedbackEl.textContent = `❌ Not quite. Correct answer: ${q.correct}). ${q.explanation}`;
      feedbackEl.className = "quiz-feedback incorrect";
    }
  });

  const summary = document.getElementById("quiz-summary");
  if (summary) {
    summary.hidden = false;
    summary.textContent = `You answered ${correctCount} out of ${activeQuiz.length} correctly.`;
  }

  saveState();
}

function resetQuiz() {
  const form = document.getElementById("quiz-form");
  if (form) form.reset();

  document.querySelectorAll(".quiz-feedback").forEach((el) => {
    el.textContent = "";
    el.className = "quiz-feedback";
  });

  const summary = document.getElementById("quiz-summary");
  if (summary) {
    summary.hidden = true;
    summary.textContent = "";
  }

  setProgress();
  saveState();
}

function downloadPDF() {
  // Reliable “download” via print-to-PDF (client-side, no libs)
  window.print();
}

// ---------------- UI: open/close sections ----------------
function showSection(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.hidden = false;

  // Update hash without harsh jump
  history.replaceState(null, "", selector);

  setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
}

function hideSection(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.hidden = true;
  if (location.hash === selector) history.replaceState(null, "", "#resources");
}

// ---------------- Theme ----------------
function applyTheme(theme) {
  const t = theme === "dark" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", t);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  const next = current === "dark" ? "light" : "dark";
  applyTheme(next);

  // Only save if user has started interacting or state exists
  const saved = loadState();
  if (saved || quizLoaded) saveState();
}

// ---------------- Init (ONLY called when quiz opened) ----------------
function initQuizOnce() {
  if (quizLoaded) return;
  quizLoaded = true;

  const sizeEl = document.getElementById("quiz-size");
  const newBtn = document.getElementById("new-quiz");
  const checkBtn = document.getElementById("check-answers");
  const resetBtn = document.getElementById("reset-quiz");
  const dlBtn = document.getElementById("download-results");

  const saved = loadState();

  // Restore theme if saved
  if (saved?.theme) applyTheme(saved.theme);

  // Restore quiz state if saved
  if (saved && Array.isArray(saved.activeIds) && saved.activeIds.length) {
    const map = new Map(questions.map((q) => [q.id, q]));
    activeQuiz = saved.activeIds.map((id) => map.get(id)).filter(Boolean);

    if (sizeEl) sizeEl.value = String(clampQuizSize(saved.size || activeQuiz.length));

    renderQuiz();
    hydrateAnswers(saved.answers || {});
  } else {
    // First-time build
    const size = sizeEl ? Number(sizeEl.value) : 20;
    buildNewQuiz(size);
  }

  // Events
  if (sizeEl) {
    sizeEl.addEventListener("change", () => {
      buildNewQuiz(Number(sizeEl.value));
    });
  }

  if (newBtn) {
    newBtn.addEventListener("click", () => {
      const size = sizeEl ? Number(sizeEl.value) : 20;
      buildNewQuiz(size);
    });
  }

  if (checkBtn) checkBtn.addEventListener("click", gradeQuiz);
  if (resetBtn) resetBtn.addEventListener("click", resetQuiz);
  if (dlBtn) dlBtn.addEventListener("click", downloadPDF);
}

// ---------------- Global wiring (runs on load, does NOT render quiz) ----------------
document.addEventListener("DOMContentLoaded", () => {
  // Default theme
  applyTheme("light");

  // Theme toggle always available
  const themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) themeBtn.addEventListener("click", toggleTheme);

  // Open Tools
  const openTools = document.getElementById("open-tools");
  if (openTools) {
    openTools.addEventListener("click", () => showSection("#tools"));
  }

  // Open Quiz (only now do we init)
  const openQuiz = document.getElementById("open-quiz");
  if (openQuiz) {
    openQuiz.addEventListener("click", () => {
      showSection("#quiz");
      initQuizOnce();
    });
  }

  // Close buttons
  document.querySelectorAll("[data-close]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const sel = btn.getAttribute("data-close");
      if (sel) hideSection(sel);
    });
  });

  // Deep link support
  if (location.hash === "#tools") {
    showSection("#tools");
  }
  if (location.hash === "#quiz") {
    showSection("#quiz");
    initQuizOnce();
  }

  // If there is saved state and user deep-links later, it's handled above.
  // We intentionally do NOT auto-open quiz/tools on load.
});


