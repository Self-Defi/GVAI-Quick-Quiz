// quiz.js
// GVAI Quick Quiz — fully client-side, no external dependencies.

// Question bank
const questions = [
  {
    id: 1,
    question: "What is the core purpose of GVAI (GraduationVaultsAI)?",
    options: {
      A: "To speculate on AI-related tokens and chase short-term yield.",
      B: "To give school-age students a guided way to learn how AI and digital infrastructure work together.",
      C: "To replace teachers with fully automated AI agents.",
      D: "To run high-frequency trading strategies for the school."
    },
    correct: "B",
    explanation:
      "GVAI is framed as an educational bridge — helping students understand how AI and digital infrastructure work together, not as a trading or speculation product."
  },
  {
    id: 2,
    question: "How is AI framed in the GVAI materials?",
    options: {
      A: "As a full replacement for human decision-making in all areas.",
      B: "As a tool that can assist, explain, and organize information — with humans still in control.",
      C: "As a way to automatically move funds between student vaults.",
      D: "As something students should never use in school."
    },
    correct: "B",
    explanation:
      "AI is consistently framed as an assistant and explainer. Humans — students, staff, and families — stay in control of decisions."
  },
  {
    id: 3,
    question:
      "Why is transparency important in systems like Graduation Vaults and GVAI?",
    options: {
      A: "So only the school can see what’s happening.",
      B: "To make it easier to hide how decisions are made.",
      C: "So students, families, and partners can see how things work and build trust over time.",
      D: "It’s not important as long as the tech is new and exciting."
    },
    correct: "C",
    explanation:
      "The whole vault model leans on transparency so everyone can see how things work, which builds long-term trust."
  },
  {
    id: 4,
    question:
      "When students use AI tools in this context, which behavior is most aligned with the program?",
    options: {
      A: "Copying full answers without reading or understanding them.",
      B: "Using AI to help summarize, plan, or break down complex ideas — then deciding what to keep.",
      C: "Letting AI make all personal, financial, and academic decisions.",
      D: "Sharing private passwords with AI apps to make things easier."
    },
    correct: "B",
    explanation:
      "Students are encouraged to use AI as a thinking aid — to clarify and structure ideas — not as a shortcut that replaces understanding."
  },
  {
    id: 5,
    question:
      "In the GVAI framing, what is the relationship between AI and human signers on a vault?",
    options: {
      A: "AI is one of the formal signers that approves on-chain transactions.",
      B: "AI can override human signers if it detects a better decision.",
      C: "AI can suggest, explain, or model options, but human signers still approve decisions.",
      D: "There are no human signers once AI is turned on."
    },
    correct: "C",
    explanation:
      "Vault signers remain human. AI can prepare information or options, but multi-sig approvals stay in human hands."
  },
  {
    id: 6,
    question:
      "Why does the program emphasize local, school-aligned AI guidance instead of random online advice?",
    options: {
      A: "Because online AI tools never work.",
      B: "To keep explanations consistent with the school’s policies, values, and safety expectations.",
      C: "To prevent students from using any outside resources.",
      D: "Because local tools are always smarter than global ones."
    },
    correct: "B",
    explanation:
      "Local, curated AI guidance helps keep answers aligned with school rules and expectations while still being flexible and helpful."
  },
  {
    id: 7,
    question:
      "Which best describes how students should handle personal or sensitive information when using AI?",
    options: {
      A: "Type in full names, passwords, and account details so AI can personalize advice.",
      B: "Share screenshots of all financial and family documents.",
      C: "Avoid sharing private details and focus on general questions or examples.",
      D: "Let AI decide what is safe to share."
    },
    correct: "C",
    explanation:
      "Students should avoid putting sensitive data into AI tools and instead use generalized examples or non-identifying details."
  },
  {
    id: 8,
    question:
      "What is one educational goal of combining Graduation Vaults with AI explainers?",
    options: {
      A: "To teach students how to bypass school rules.",
      B: "To help students connect technical tools (vaults, multi-sig, records) with real-life financial and career planning.",
      C: "To keep families out of the loop.",
      D: "To automate grades and attendance."
    },
    correct: "B",
    explanation:
      "By seeing how vaults and AI can work together, students connect technology with real-world planning and long-term thinking."
  },
  {
    id: 9,
    question:
      "If a student is unsure whether an AI-generated answer is correct, what is the recommended next step?",
    options: {
      A: "Accept it anyway — AI is always right.",
      B: "Ignore it and never use AI again.",
      C: "Cross-check with trusted sources such as teachers, official materials, or multiple references.",
      D: "Ask a friend to copy their answer."
    },
    correct: "C",
    explanation:
      "AI responses should be checked against trusted humans and official resources, especially for important or high-impact decisions."
  },
  {
    id: 10,
    question:
      "Why does the program highlight the difference between 'crypto speculation' and 'infrastructure building'?",
    options: {
      A: "Because speculation is the main focus.",
      B: "To make it clear that the work is about long-term systems, not gambling on price swings.",
      C: "To discourage any financial learning.",
      D: "To promote meme tokens."
    },
    correct: "B",
    explanation:
      "The emphasis is on building durable systems — vaults, dashboards, and processes — not on trading or speculation."
  },
  {
    id: 11,
    question:
      "When experimenting with AI tools, what kind of questions are most encouraged for students?",
    options: {
      A: "Questions that help them understand concepts, processes, and options.",
      B: "Questions that trick AI or try to bypass filters.",
      C: "Questions asking AI to do their homework word-for-word.",
      D: "Questions about other students’ private information."
    },
    correct: "A",
    explanation:
      "Students are encouraged to use AI to deepen understanding — asking 'how' and 'why' questions, not to sidestep their own work."
  },
  {
    id: 12,
    question:
      "How does AI support staff and leadership in the Graduation Vaults / GVAI ecosystem?",
    options: {
      A: "By secretly changing vault balances.",
      B: "By generating clear summaries, drafts, and checklists based on the school’s own materials.",
      C: "By replacing all staff meetings.",
      D: "By controlling which families are allowed to participate."
    },
    correct: "B",
    explanation:
      "AI can help staff turn school documents and plans into clearer summaries, drafts, and checklists — speeding up communication, not replacing people."
  },
  // Extra 8 questions to reach 20
  {
    id: 13,
    question:
      "What is one benefit of keeping the quiz 100% client-side (local in the browser)?",
    options: {
      A: "It makes the quiz slower.",
      B: "It sends results to a central AI model for grading.",
      C: "It keeps responses private; nothing is uploaded or stored on a server.",
      D: "It prevents the quiz from working offline."
    },
    correct: "C",
    explanation:
      "Running the quiz entirely client-side means answers live only in the student’s browser session — nothing is sent to a backend."
  },
  {
    id: 14,
    question:
      "In the GVAI framing, what is a healthy mindset toward AI mistakes or hallucinations?",
    options: {
      A: "Assume they never happen.",
      B: "Use mistakes as a chance to double-check sources and improve questions.",
      C: "Blame the nearest person.",
      D: "Ignore them and keep copying outputs."
    },
    correct: "B",
    explanation:
      "Mistakes are expected. The right move is to verify information, refine prompts, and treat AI as a fallible assistant."
  },
  {
    id: 15,
    question:
      "Why is it useful to have a mind map alongside slides and video in the GVAI hub?",
    options: {
      A: "Mind maps look impressive but don’t help learning.",
      B: "They give a visual overview of how topics connect, which helps students see the bigger picture.",
      C: "They replace the need for any other resources.",
      D: "They are required to unlock the quiz."
    },
    correct: "B",
    explanation:
      "Mind maps show relationships between ideas, helping students see how AI, vaults, transparency, and governance connect."
  },
  {
    id: 16,
    question:
      "What’s the recommended way for students to use AI when planning long-term goals (like graduation or career steps)?",
    options: {
      A: "Ask AI to predict their entire future.",
      B: "Use AI to outline options, timelines, and questions to discuss with trusted adults.",
      C: "Let AI choose schools and jobs without human input.",
      D: "Avoid any planning; just focus on short-term tasks."
    },
    correct: "B",
    explanation:
      "AI can help students map options and timelines, but decisions should be reviewed with trusted adults and aligned with real-world constraints."
  },
  {
    id: 17,
    question:
      "How does the concept of 'Unlock Tomorrow. Today.' connect to GVAI?",
    options: {
      A: "It promises instant wealth.",
      B: "It means students skip learning and jump straight to results.",
      C: "It reflects using today’s tools (vaults + AI) to prepare for long-term opportunities.",
      D: "It only refers to graduation day itself."
    },
    correct: "C",
    explanation:
      "The slogan is about using current tools and habits to build future options — financial, educational, and career-related."
  },
  {
    id: 18,
    question:
      "Which of the following best reflects responsible AI collaboration in the GVAI context?",
    options: {
      A: "Treating AI as a teammate that offers drafts and ideas, while humans make the final call.",
      B: "Treating AI as the boss that decides everything.",
      C: "Never questioning anything AI outputs.",
      D: "Using AI only for entertainment."
    },
    correct: "A",
    explanation:
      "Responsible use means collaborating with AI: letting it propose ideas while humans remain accountable for decisions."
  },
  {
    id: 19,
    question:
      "What is one reason schools might prefer a curated AI experience instead of sending students directly to random public chatbots?",
    options: {
      A: "To completely block AI access.",
      B: "To align prompts, guardrails, and examples with school safety and learning goals.",
      C: "Because public tools cannot answer any questions.",
      D: "So students cannot learn how to prompt on their own."
    },
    correct: "B",
    explanation:
      "A curated experience lets schools shape how AI is used: safer prompts, aligned sources, and clearer expectations."
  },
  {
    id: 20,
    question:
      "After finishing the GVAI Quick Quiz, what is a powerful next step for a student?",
    options: {
      A: "Forget everything and move on.",
      B: "Share their score on social media with personal details.",
      C: "Note any confusing topics and bring them to a teacher, mentor, or family conversation.",
      D: "Keep retaking the quiz until they memorize the letters."
    },
    correct: "C",
    explanation:
      "The quiz is a checkpoint. The most valuable next move is turning confusion into real questions for trusted humans."
  }
];

// --------- Render quiz ---------
function renderQuiz() {
  const form = document.getElementById("quiz-form");
  if (!form) return;

  form.innerHTML = "";

  questions.forEach((q, index) => {
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
}

// --------- Grading logic ---------
function gradeQuiz() {
  let correctCount = 0;

  questions.forEach((q) => {
    const selected = document.querySelector(
      `input[name="q${q.id}"]:checked`
    );

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
    summary.textContent = `You answered ${correctCount} out of ${questions.length} correctly.`;
  }
}

function resetQuiz() {
  const form = document.getElementById("quiz-form");
  if (form) {
    form.reset();
  }
  document
    .querySelectorAll(".quiz-feedback")
    .forEach((el) => {
      el.textContent = "";
      el.className = "quiz-feedback";
    });
  const summary = document.getElementById("quiz-summary");
  if (summary) {
    summary.hidden = true;
    summary.textContent = "";
  }
}

// --------- Wire up events ---------
document.addEventListener("DOMContentLoaded", () => {
  renderQuiz();

  const checkBtn = document.getElementById("check-answers");
  const resetBtn = document.getElementById("reset-quiz");

  if (checkBtn) {
    checkBtn.addEventListener("click", gradeQuiz);
  }
  if (resetBtn) {
    resetBtn.addEventListener("click", resetQuiz);
  }
});

