/* quiz.js — GVAI Quick Quiz (client-side, no dependencies)
   - Quiz does NOT render until "Quiz Yourself" button is pressed
   - Resourceful Tools does NOT show until its button is pressed
   - Randomized question order + randomized answer order (correct answers not always B)
   - Progress tracker
   - Dark mode toggle (persists)
   - Save & resume via LocalStorage
   - 50-question pool (AI-focused: tools, use-cases, terms, ethics)
   - “Download PDF Results” opens a print-ready report (use “Save as PDF”)

   UPDATES (2025-12-12):
   - Restyle support hooks: add stable DOM id per question (#q-1, #q-2, ...)
   - After "Check Answers": show which question(s) were missed with clickable jump-to chips
   - Add subtle pulse highlight when jumping to a missed question
*/

(() => {
  "use strict";

  // ---------- CONFIG ----------
  const STORAGE_KEY = "gvai_quick_quiz_state_v3";
  const THEME_KEY = "gvai_quick_quiz_theme_v1";

  // If you change question text/choices substantially later, bump this:
  const BANK_VERSION = "2025-12-12-ai50-v1";

  // ---------- HELPERS ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function safeJsonParse(str, fallback = null) {
    try { return JSON.parse(str); } catch { return fallback; }
  }

  function nowIso() {
    return new Date().toISOString();
  }

  // Creates a stable-ish id if missing
  function uid(prefix = "q") {
    return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
  }

  // ---------- QUESTION BANK (50, AI-focused) ----------
  // NOTE: correct answer index is defined for the unshuffled choices below.
  // At render time we SHUFFLE choices per question and re-map the correct index.
  const QUESTION_BANK = [
    {
      id: "ai_001",
      question: "What is a large language model (LLM) primarily trained to do?",
      choices: [
        "Predict the next token (word/piece of a word) in a sequence.",
        "Directly verify facts using a built-in internet browser.",
        "Store your personal files permanently by default.",
        "Control devices like cameras and microphones automatically."
      ],
      answer: 0,
      explanation: "LLMs learn statistical patterns in language and generate text by predicting the next token; they do not automatically verify facts or browse unless a tool is explicitly used."
    },
    {
      id: "ai_002",
      question: "In an academic setting, what is the safest first move when AI gives you a confident answer you’re unsure about?",
      choices: [
        "Submit it as-is because confidence means accuracy.",
        "Cross-check with the class materials, teacher guidance, or reliable sources.",
        "Hide the uncertainty by rewriting it in your own words.",
        "Ask AI to guess the teacher’s grading rubric."
      ],
      answer: 1,
      explanation: "Responsible academic use means verification: compare against trusted course sources and multiple reliable references."
    },
    {
      id: "ai_003",
      question: "What does “hallucination” mean in AI text generation?",
      choices: [
        "The model refuses to answer any question.",
        "The model outputs text in a different language than requested.",
        "The model generates information that sounds plausible but is incorrect or made up.",
        "The model only responds with citations."
      ],
      answer: 2,
      explanation: "Hallucinations are confident-sounding mistakes or fabricated details. Always verify important claims."
    },
    {
      id: "ai_004",
      question: "Which prompt is most likely to produce a useful study plan?",
      choices: [
        "“Give me the final answers to chapter 5.”",
        "“Explain chapter 5 like I’m 5 years old.”",
        "“Create a 7-day study plan for chapter 5 with daily goals, practice questions, and self-checks.”",
        "“Write an essay and include fake citations.”"
      ],
      answer: 2,
      explanation: "Good prompts give structure, timeframe, and clear outputs (goals + practice + checks)."
    },
    {
      id: "ai_005",
      question: "What is “prompting” in the context of AI tools?",
      choices: [
        "Installing an AI tool on a computer.",
        "Giving the AI clear instructions and context to shape its output.",
        "Deleting your browsing history.",
        "Encrypting files before uploading them."
      ],
      answer: 1,
      explanation: "Prompting is the skill of providing clear instructions, constraints, and context so the model can respond appropriately."
    },
    {
      id: "ai_006",
      question: "When using AI for writing help, what is the most ethical approach?",
      choices: [
        "Use AI to generate a full paper and submit it as your original work.",
        "Use AI for outlining and feedback, then write in your own voice and cite sources appropriately.",
        "Ask AI to mimic another author exactly and copy it.",
        "Hide all AI use from school policy checks."
      ],
      answer: 1,
      explanation: "Use AI as a learning assistant (outline, critique, clarity) while keeping authorship and citations honest and aligned with school policy."
    },
    {
      id: "ai_007",
      question: "What’s the biggest privacy rule for students using AI tools?",
      choices: [
        "Never use AI tools on weekends.",
        "Always include your full name and address for personalization.",
        "Do not enter passwords, student IDs, or private personal information into AI tools.",
        "Share your login with classmates to collaborate faster."
      ],
      answer: 2,
      explanation: "Protect personal data. Don’t put passwords, IDs, or sensitive info into prompts."
    },
    {
      id: "ai_008",
      question: "What is “bias” in AI outputs?",
      choices: [
        "A required feature that makes all answers correct.",
        "A tendency to produce unfair or skewed results due to data or design.",
        "A setting that improves image quality.",
        "A way to guarantee citations."
      ],
      answer: 1,
      explanation: "Bias can appear when training data or evaluation fails to represent groups fairly or when patterns reflect historical inequities."
    },
    {
      id: "ai_009",
      question: "Which is a good use of AI for math homework?",
      choices: [
        "Ask for step-by-step reasoning, then compare with your textbook method and teacher’s examples.",
        "Ask for final answers only and submit them.",
        "Ask the AI to pretend it’s your teacher and grade you with hidden criteria.",
        "Ask for your classmate’s personal data to “personalize” explanations."
      ],
      answer: 0,
      explanation: "Responsible use: learn the method, validate with course materials, and understand each step."
    },
    {
      id: "ai_010",
      question: "What does “citation” mean in research writing?",
      choices: [
        "A random link pasted at the end.",
        "A reference showing where an idea, quote, or fact came from.",
        "A secret note to the teacher.",
        "A way to make writing longer."
      ],
      answer: 1,
      explanation: "Citations credit sources and let others verify claims."
    },
    {
      id: "ai_011",
      question: "Why is asking AI for sources and then verifying them important?",
      choices: [
        "Because AI always provides perfect references.",
        "Because AI can fabricate citations; verification prevents misinformation.",
        "Because sources are optional in academics.",
        "Because citations replace doing any reading."
      ],
      answer: 1,
      explanation: "Some tools can produce incorrect or non-existent citations. Verify by opening and checking the source."
    },
    {
      id: "ai_012",
      question: "What is “context window” in an AI chat?",
      choices: [
        "The size of your monitor.",
        "How much conversation/document text the model can consider at once.",
        "A setting that blocks dark mode.",
        "A feature that guarantees accuracy."
      ],
      answer: 1,
      explanation: "Models have limits on how much text they can process at one time; beyond that, details can be lost."
    },
    {
      id: "ai_013",
      question: "Which is the best example of using AI for brainstorming responsibly?",
      choices: [
        "Generate ideas, pick one, and develop it with your own reasoning and evidence.",
        "Generate a full final project and submit it untouched.",
        "Ask AI to copy a classmate’s style exactly.",
        "Use AI to fake experiments you didn’t do."
      ],
      answer: 0,
      explanation: "Brainstorming support is fine; the learning still needs to be yours, with real work and evidence."
    },
    {
      id: "ai_014",
      question: "What is “plagiarism”?",
      choices: [
        "Using your own words to explain a concept.",
        "Copying someone else’s work (or AI output) and presenting it as your own without permission/citation.",
        "Adding citations to sources you didn’t use.",
        "Asking questions during office hours."
      ],
      answer: 1,
      explanation: "Plagiarism is misrepresenting authorship. Follow school policy on AI and citations."
    },
    {
      id: "ai_015",
      question: "When should you prefer a tool like Wolfram Alpha over a general chat model?",
      choices: [
        "When you need reliable math/science computations and structured results.",
        "When you want the model to guess your password.",
        "When you need private student records summarized.",
        "When you want to avoid learning the steps."
      ],
      answer: 0,
      explanation: "Specialized tools are better for computation and formal math; still validate with your course requirements."
    },
    {
      id: "ai_016",
      question: "What is a good definition of “model” vs “tool”?",
      choices: [
        "They are identical; there is no difference.",
        "A model is the AI engine; a tool is the product/interface that uses one or more models.",
        "A tool is always offline; a model is always online.",
        "A model is only for images; tools are only for text."
      ],
      answer: 1,
      explanation: "A model is the underlying system; tools wrap models with features like chat, file upload, search, or formatting."
    },
    {
      id: "ai_017",
      question: "What does “RAG” (Retrieval-Augmented Generation) generally mean?",
      choices: [
        "The AI refuses all questions.",
        "The AI searches or retrieves relevant documents, then uses them to answer.",
        "The AI deletes your notes after reading them.",
        "The AI turns every answer into poetry."
      ],
      answer: 1,
      explanation: "RAG combines retrieval (finding relevant text) with generation (writing an answer using that text)."
    },
    {
      id: "ai_018",
      question: "NotebookLM is best described as:",
      choices: [
        "A study assistant that works from documents you provide (notes, PDFs, etc.).",
        "A cryptocurrency trading bot.",
        "A password manager for student accounts.",
        "A tool that automatically submits assignments."
      ],
      answer: 0,
      explanation: "NotebookLM is designed around your sources, helping summarize and answer questions grounded in those documents."
    },
    {
      id: "ai_019",
      question: "Perplexity-style tools are often used for:",
      choices: [
        "Research discovery with links/citations to sources.",
        "Storing confidential student IDs.",
        "Replacing teachers in classrooms.",
        "Generating unverified medical prescriptions."
      ],
      answer: 0,
      explanation: "Research tools help find sources; you still need to evaluate credibility and relevance."
    },
    {
      id: "ai_020",
      question: "What is a “prompt injection” risk?",
      choices: [
        "When a user tries to trick an AI system into ignoring rules or revealing restricted info.",
        "When your laptop installs updates.",
        "When a PDF includes too many pages.",
        "When dark mode is enabled."
      ],
      answer: 0,
      explanation: "Prompt injection is a social/technical trick to override safe behavior or retrieve data the system shouldn’t reveal."
    },
    {
      id: "ai_021",
      question: "Which is the best academic rule for using AI-generated text?",
      choices: [
        "Copy-paste as long as you change two words.",
        "Treat it as a draft; verify facts, rewrite in your own voice, and follow school AI policy.",
        "Never read your work after AI writes it.",
        "Avoid citations because AI already knows everything."
      ],
      answer: 1,
      explanation: "Use AI to support learning, not to replace it; verification and policy compliance matter."
    },
    {
      id: "ai_022",
      question: "What does “temperature” usually control in text generation?",
      choices: [
        "How warm your laptop gets.",
        "How creative vs consistent the outputs are (higher = more varied).",
        "How many citations are included.",
        "How many PDFs you can open."
      ],
      answer: 1,
      explanation: "Temperature influences randomness/creativity; it does not guarantee correctness."
    },
    {
      id: "ai_023",
      question: "Which is a strong way to ask AI for help with reading comprehension?",
      choices: [
        "“Summarize this chapter, define key terms, and ask me 5 self-check questions.”",
        "“Give me the test answers.”",
        "“Write a fake quote from the author.”",
        "“Skip the chapter and just tell me what to think.”"
      ],
      answer: 0,
      explanation: "Good prompts produce summaries + definitions + self-checks so you actually learn."
    },
    {
      id: "ai_024",
      question: "What is “fine-tuning”?",
      choices: [
        "Changing the font size of the UI.",
        "Training a model further on a specific dataset to better fit a task/domain.",
        "Deleting incorrect answers automatically.",
        "Turning citations on and off."
      ],
      answer: 1,
      explanation: "Fine-tuning adapts a general model to a specialized task using additional training data."
    },
    {
      id: "ai_025",
      question: "Which behavior best reduces misinformation when using AI for research?",
      choices: [
        "Only use one AI tool and trust it fully.",
        "Ask for claims plus sources, then open the sources and confirm details.",
        "Avoid reading any sources to save time.",
        "Use the longest answer regardless of evidence."
      ],
      answer: 1,
      explanation: "Verification with primary/credible sources is the key guardrail."
    },
    {
      id: "ai_026",
      question: "What is “data privacy” in the context of AI tools?",
      choices: [
        "A guarantee that AI will never make mistakes.",
        "Rules and practices that protect personal/sensitive information from being exposed or misused.",
        "A setting that speeds up Wi-Fi.",
        "A way to remove citations from essays."
      ],
      answer: 1,
      explanation: "Privacy is about protecting sensitive data (identity, passwords, private records) and following policy."
    },
    {
      id: "ai_027",
      question: "Which is an example of responsible AI use for a presentation?",
      choices: [
        "Use AI to create an outline and speaker notes, then fact-check and add your own examples.",
        "Use AI to invent data and charts you didn’t verify.",
        "Use AI to copy a copyrighted deck exactly.",
        "Use AI to include classmates’ private data for “impact.”"
      ],
      answer: 0,
      explanation: "AI can help structure; you must verify facts and keep content ethical and legal."
    },
    {
      id: "ai_028",
      question: "What is an “embedding” commonly used for?",
      choices: [
        "Turning text into a numeric representation so similar items can be searched/compared.",
        "Making your computer screen brighter.",
        "Guaranteeing the correct answer.",
        "Hiding your homework from teachers."
      ],
      answer: 0,
      explanation: "Embeddings help with semantic search, clustering, and retrieval."
    },
    {
      id: "ai_029",
      question: "Which statement best describes “AI literacy”?",
      choices: [
        "Knowing how to get AI to do everything for you.",
        "Understanding what AI can/can’t do, how to use it responsibly, and how to verify outputs.",
        "Memorizing every AI tool’s logo.",
        "Avoiding all technology permanently."
      ],
      answer: 1,
      explanation: "AI literacy is capability + judgment: limits, verification, ethics, and good workflows."
    },
    {
      id: "ai_030",
      question: "What is the main reason schools have AI policies?",
      choices: [
        "To ban learning.",
        "To protect academic integrity, student privacy, and fair evaluation.",
        "To guarantee AI always works.",
        "To replace textbooks with chatbots."
      ],
      answer: 1,
      explanation: "Policies exist to keep learning honest, safe, and equitable."
    },
    {
      id: "ai_031",
      question: "Which is the best way to use AI for vocabulary building?",
      choices: [
        "Ask for definitions, example sentences, and a short quiz, then practice with your own sentences.",
        "Ask AI to replace every word in your essay with harder words automatically.",
        "Ask AI to guess which words will be on the test and ignore the rest.",
        "Ask AI to share classmates’ grades to compare."
      ],
      answer: 0,
      explanation: "Practice + application beats automation that may distort meaning."
    },
    {
      id: "ai_032",
      question: "What is “grounding” in AI answers?",
      choices: [
        "Turning the device off and on.",
        "Basing the response on provided sources or evidence rather than guessing.",
        "Using only emojis.",
        "Making the answer shorter."
      ],
      answer: 1,
      explanation: "Grounded answers reference reliable sources/documents instead of making things up."
    },
    {
      id: "ai_033",
      question: "Which is a responsible way to use AI in group work?",
      choices: [
        "Use AI to generate ideas and split tasks, but each student contributes and understands the final work.",
        "Use AI to write everything and put everyone’s names on it.",
        "Use AI to impersonate another student.",
        "Share one account password with the whole class."
      ],
      answer: 0,
      explanation: "Collaboration still requires real participation, understanding, and honesty."
    },
    {
      id: "ai_034",
      question: "What is “copyright” most relevant to when using AI in school projects?",
      choices: [
        "Whether you can copy protected text/images without permission or proper licensing.",
        "Whether you can use punctuation.",
        "Whether AI is allowed to answer questions.",
        "Whether your device can run dark mode."
      ],
      answer: 0,
      explanation: "Don’t copy protected content improperly; use licensed/public-domain materials and cite sources."
    },
    {
      id: "ai_035",
      question: "Which prompt best supports critical thinking?",
      choices: [
        "“Give me the fastest shortcut answer.”",
        "“Argue both sides, list assumptions, and show what evidence would change the conclusion.”",
        "“Tell me what to believe.”",
        "“Write it so I don’t have to read anything.”"
      ],
      answer: 1,
      explanation: "Critical thinking prompts request assumptions, competing arguments, and evidence tests."
    },
    {
      id: "ai_036",
      question: "What is the safest approach to logins when using AI tools for school?",
      choices: [
        "Reuse one password everywhere for convenience.",
        "Share passwords with friends to speed up group work.",
        "Use strong unique passwords and never share them.",
        "Save passwords in public notes."
      ],
      answer: 2,
      explanation: "Strong unique passwords + no sharing is basic security hygiene."
    },
    {
      id: "ai_037",
      question: "What does “local / client-side quiz” mean on this site?",
      choices: [
        "Answers are emailed to an administrator.",
        "Answers are processed in your browser; nothing is sent to a backend.",
        "Answers are stored in a public database.",
        "Answers are uploaded to a grading server."
      ],
      answer: 1,
      explanation: "Everything runs on your device. Optional LocalStorage saves are also local to your browser."
    },
    {
      id: "ai_038",
      question: "Which is a good reason to include explanations after each quiz answer?",
      choices: [
        "To make the quiz longer.",
        "To support learning by explaining why an answer is correct.",
        "To hide the correct answers.",
        "To reduce understanding."
      ],
      answer: 1,
      explanation: "Explanations turn assessment into learning, helping you correct misunderstandings."
    },
    {
      id: "ai_039",
      question: "What is “evaluation” in AI terms (basic idea)?",
      choices: [
        "Testing how well a model/tool performs on tasks and checking for errors and bias.",
        "Making the UI look cooler.",
        "Deleting hard questions.",
        "Avoiding any feedback."
      ],
      answer: 0,
      explanation: "Evaluation measures quality (accuracy, usefulness, bias, safety) using tests and review."
    },
    {
      id: "ai_040",
      question: "Which is a strong way to use AI to prepare for a test?",
      choices: [
        "Ask for a custom practice quiz, then review explanations and redo missed items.",
        "Ask for answers to the real test.",
        "Ask AI to predict the teacher’s mood.",
        "Ask AI to hide mistakes."
      ],
      answer: 0,
      explanation: "Practice + feedback improves learning; cheating requests violate integrity."
    },
    {
      id: "ai_041",
      question: "What is “ethical AI” mainly about in school use?",
      choices: [
        "Using AI to avoid learning.",
        "Using AI in ways that are fair, honest, privacy-safe, and aligned with policy.",
        "Using only the most expensive AI tool.",
        "Using AI only at night."
      ],
      answer: 1,
      explanation: "Ethics = fairness, honesty, privacy, and responsibility."
    },
    {
      id: "ai_042",
      question: "What is a practical way to reduce bias in your AI-assisted work?",
      choices: [
        "Ask for multiple perspectives, check sources, and compare with trusted materials.",
        "Pick the first answer you see.",
        "Avoid any sources so it’s “pure AI.”",
        "Only ask leading questions that confirm your opinion."
      ],
      answer: 0,
      explanation: "Bias is reduced by cross-checking, seeking diverse viewpoints, and using evidence."
    },
    {
      id: "ai_043",
      question: "Which is the best use of AI for coding practice (beginner level)?",
      choices: [
        "Ask for a small example, then explain each line and try a variation yourself.",
        "Ask AI to write a full app and submit it as your work without understanding.",
        "Ask AI to hide security issues so it runs faster.",
        "Ask AI to hack a website for “learning.”"
      ],
      answer: 0,
      explanation: "Learning comes from understanding and experimenting, not copy-pasting."
    },
    {
      id: "ai_044",
      question: "What does “training data” mean?",
      choices: [
        "The homework you feed into a chatbot every day.",
        "The dataset used to teach a model patterns during training.",
        "A tool that guarantees citations.",
        "A setting that removes bias completely."
      ],
      answer: 1,
      explanation: "Training data is what the model learns from; it affects strengths, weaknesses, and bias."
    },
    {
      id: "ai_045",
      question: "Which prompt is best for creating flashcards from a reading assignment?",
      choices: [
        "“Create 15 flashcards: term on front, definition on back, plus 5 ‘application’ cards.”",
        "“Give me the answers to the worksheet.”",
        "“Make it shorter by deleting the hard parts.”",
        "“Write citations without sources.”"
      ],
      answer: 0,
      explanation: "Clear format + quantity + application cards make study tools actually useful."
    },
    {
      id: "ai_046",
      question: "What is the best practice if you use AI to help write an essay introduction?",
      choices: [
        "Use it as a starting draft, then rewrite in your own voice and confirm claims with sources.",
        "Copy it exactly and remove citations.",
        "Ask AI to mimic your teacher’s writing so it “sounds graded.”",
        "Avoid reading the rest of your essay."
      ],
      answer: 0,
      explanation: "Drafting is fine if you maintain honest authorship, verify claims, and comply with policy."
    },
    {
      id: "ai_047",
      question: "Which is a good “use-case” for ChatGPT-style tools in academics?",
      choices: [
        "Explaining a concept in different levels (simple → advanced) and generating practice questions.",
        "Storing your school password and ID permanently.",
        "Submitting assignments automatically without review.",
        "Creating fake lab results."
      ],
      answer: 0,
      explanation: "Best use-cases: explanations, outlining, practice, and feedback—then you verify and apply."
    },
    {
      id: "ai_048",
      question: "What is “academic integrity” in one sentence?",
      choices: [
        "Doing work honestly, showing your real understanding, and giving proper credit to sources.",
        "Getting the highest grade by any means.",
        "Avoiding collaboration completely.",
        "Using the longest AI prompt possible."
      ],
      answer: 0,
      explanation: "Integrity is honesty in learning and credit; it’s the foundation of fair evaluation."
    },
    {
      id: "ai_049",
      question: "Which is a smart way to ask AI for help with research questions?",
      choices: [
        "“Suggest 5 research questions, explain why each matters, and list what sources would support them.”",
        "“Write the entire paper and include 20 random links.”",
        "“Tell me what my opinion should be.”",
        "“Give me a question that guarantees an A.”"
      ],
      answer: 0,
      explanation: "Good research starts with strong questions and a plan for evidence."
    },
    {
      id: "ai_050",
      question: "What should you do if an AI tool’s answer conflicts with your textbook or teacher?",
      choices: [
        "Assume the AI is right because it’s newer tech.",
        "Ignore the conflict and submit anyway.",
        "Flag the conflict, ask for clarification, and follow the teacher/course materials.",
        "Post the disagreement online to get votes."
      ],
      answer: 2,
      explanation: "Course authority + verification wins. Use the conflict as a learning moment and ask for guidance."
    }
  ];

  // ---------- STATE ----------
  const state = {
    initialized: false,        // quiz UI rendered
    bankVersion: BANK_VERSION,
    quizOpen: false,
    toolsOpen: false,
    checked: false,
    size: 20,
    // questions in current attempt will be stored in a "shuffled & mapped" form:
    // [{id, question, choices, correctIndex, explanation}]
    quiz: [],
    // answers: { [questionId]: selectedIndex }
    answers: {},
    lastSavedAt: null
  };

  // ---------- DOM REFS (lazy-bound) ----------
  const dom = {
    themeToggle: null,
    openToolsBtn: null,
    openQuizBtn: null,
    toolsSection: null,
    quizSection: null,
    quizForm: null,
    sizeSelect: null,
    newQuizBtn: null,
    checkBtn: null,
    resetBtn: null,
    downloadBtn: null,
    summary: null,
    progressText: null,
    progressPercent: null,
    progressBar: null,
    progressFill: null
  };

  // ---------- THEME ----------
  function getSavedTheme() {
    const t = localStorage.getItem(THEME_KEY);
    return t === "dark" ? "dark" : "light";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  function toggleTheme() {
    const cur = document.documentElement.getAttribute("data-theme") || "light";
    applyTheme(cur === "dark" ? "light" : "dark");
    // persist within quiz state too (optional)
    persistState();
  }

  // ---------- COLLAPSIBLE SECTIONS ----------
  function openSection(sectionEl) {
    if (!sectionEl) return;
    sectionEl.hidden = false;
    sectionEl.classList.add("is-open");
    // simple scroll into view for mobile
    sectionEl.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function closeSection(sectionEl) {
    if (!sectionEl) return;
    sectionEl.classList.remove("is-open");
    sectionEl.hidden = true;
  }

  // ---------- QUIZ BUILDING ----------
  function buildQuiz(size) {
    const n = clamp(Number(size) || 20, 1, 50);
    const picked = shuffle(QUESTION_BANK).slice(0, n);

    // shuffle answer choices for each question and remap correct index
    const mapped = picked.map(q => {
      const indexed = q.choices.map((text, idx) => ({ text, idx }));
      const shuffled = shuffle(indexed);
      const correctIndex = shuffled.findIndex(x => x.idx === q.answer);

      return {
        id: q.id || uid("q"),
        question: q.question,
        choices: shuffled.map(x => x.text),
        correctIndex,
        explanation: q.explanation || ""
      };
    });

    state.size = n;
    state.quiz = mapped;
    state.answers = {};
    state.checked = false;
    state.lastSavedAt = null;
  }

  // ---------- RENDER ----------
  function renderQuiz() {
    if (!dom.quizForm) return;

    dom.quizForm.innerHTML = "";

    state.quiz.forEach((q, i) => {
      const fieldset = document.createElement("fieldset");
      fieldset.className = "q-card";
      fieldset.dataset.qid = q.id;

      // NEW: stable per-question id for jump-to (#q-1, #q-2, ...)
      fieldset.id = `q-${i + 1}`;

      const legend = document.createElement("legend");
      legend.className = "q-title";
      legend.textContent = `${i + 1}. ${q.question}`;
      fieldset.appendChild(legend);

      const choicesWrap = document.createElement("div");
      choicesWrap.className = "q-choices";

      q.choices.forEach((choiceText, idx) => {
        const id = `${q.id}_${idx}`;

        const label = document.createElement("label");
        label.className = "choice";

        const input = document.createElement("input");
        input.type = "radio";
        input.name = q.id;
        input.value = String(idx);
        input.id = id;

        if (state.answers[q.id] === idx) input.checked = true;

        input.addEventListener("change", () => {
          state.answers[q.id] = idx;
          state.checked = false; // if they change answers after checking, reset checked state
          if (dom.summary) dom.summary.hidden = true;
          persistState();
          updateProgress();
          // remove old correctness styling (if any)
          fieldset.classList.remove("is-correct", "is-wrong", "pulse");
          $$(".choice", fieldset).forEach(c => c.classList.remove("correct", "wrong", "selected"));
          // restore "selected" visual
          label.classList.add("selected");
        });

        const span = document.createElement("span");
        span.className = "choice-text";
        span.textContent = choiceText;

        label.appendChild(input);
        label.appendChild(span);
        choicesWrap.appendChild(label);
      });

      fieldset.appendChild(choicesWrap);

      // Explanation (hidden until checked)
      const exp = document.createElement("div");
      exp.className = "explain";
      exp.hidden = true;
      exp.textContent = q.explanation || "";
      fieldset.appendChild(exp);

      dom.quizForm.appendChild(fieldset);
    });

    updateProgress();
  }

  function updateProgress() {
    const total = state.quiz.length || 0;
    const answered = Object.keys(state.answers).length;
    const pct = total === 0 ? 0 : Math.round((answered / total) * 100);

    if (dom.progressText) dom.progressText.textContent = `Progress: ${answered} / ${total}`;
    if (dom.progressPercent) dom.progressPercent.textContent = `${pct}%`;
    if (dom.progressBar) dom.progressBar.setAttribute("aria-valuenow", String(pct));
    if (dom.progressFill) dom.progressFill.style.width = `${pct}%`;
  }

  // ---------- CHECK / SCORE ----------
  function checkAnswers() {
    const total = state.quiz.length || 0;
    if (!total) return;

    let correct = 0;
    const missedNums = []; // NEW: store missed question numbers (1-based)

    state.quiz.forEach((q, idx) => {
      const selected = state.answers[q.id];
      const isCorrect = selected === q.correctIndex;

      // if unanswered OR wrong -> missed
      if (!isCorrect) missedNums.push(idx + 1);

      const card = dom.quizForm?.querySelector(`fieldset[data-qid="${q.id}"]`);
      if (!card) return;

      const explain = $(".explain", card);
      if (explain) explain.hidden = false;

      // style the choices
      const labels = $$(".choice", card);
      labels.forEach((labelEl, choiceIdx) => {
        labelEl.classList.remove("correct", "wrong", "selected");
        const input = $("input", labelEl);
        const checked = !!(input && input.checked);

        if (choiceIdx === q.correctIndex) labelEl.classList.add("correct");
        if (checked) labelEl.classList.add("selected");
        if (checked && choiceIdx !== q.correctIndex) labelEl.classList.add("wrong");
      });

      card.classList.toggle("is-correct", isCorrect);
      card.classList.toggle("is-wrong", !isCorrect);

      if (isCorrect) correct++;
    });

    const scorePct = Math.round((correct / total) * 100);
    const missed = total - correct;

    if (dom.summary) {
      dom.summary.hidden = false;

      dom.summary.innerHTML = `
        <div class="summary-card">
          <div class="summary-title">Results</div>

          <div class="summary-metrics">
            <div><strong>${correct}</strong> correct</div>
            <div><strong>${missed}</strong> missed</div>
            <div><strong>${scorePct}%</strong> score</div>
          </div>

          ${
            missedNums.length
              ? `
                <div class="missed-block">
                  <div class="missed-title">Missed question(s):</div>
                  <div class="missed-list">
                    ${missedNums.map(n => `<button type="button" class="missed-chip" data-jump="${n}">#${n}</button>`).join("")}
                  </div>
                </div>
              `
              : `<div class="missed-title">Perfect score 🎯</div>`
          }

          <div class="summary-note">Review explanations on missed questions, then try a new randomized quiz.</div>
        </div>
      `;

      // NEW: jump-to handlers
      $$(".missed-chip", dom.summary).forEach(btn => {
        btn.addEventListener("click", () => {
          const n = btn.getAttribute("data-jump");
          const el = document.getElementById(`q-${n}`);
          if (!el) return;

          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.classList.remove("pulse");
          // reflow to restart animation reliably
          void el.offsetWidth; // eslint-disable-line no-unused-expressions
          el.classList.add("pulse");
          setTimeout(() => el.classList.remove("pulse"), 1200);
        });
      });
    }

    state.checked = true;
    persistState();
  }

  // ---------- PRINT / "PDF" EXPORT ----------
  function buildResultsHtml() {
    const total = state.quiz.length || 0;
    let correct = 0;

    const rows = state.quiz.map((q, idx) => {
      const selected = state.answers[q.id];
      const isCorrect = selected === q.correctIndex;
      if (isCorrect) correct++;

      const chosenText = (selected === undefined) ? "— (no answer)" : q.choices[selected];
      const correctText = q.choices[q.correctIndex];

      return `
        <div class="r-q ${isCorrect ? "ok" : "bad"}">
          <div class="r-q-title">${idx + 1}. ${escapeHtml(q.question)}</div>
          <div class="r-q-meta">
            <div><strong>Your answer:</strong> ${escapeHtml(chosenText)}</div>
            <div><strong>Correct:</strong> ${escapeHtml(correctText)}</div>
          </div>
          ${q.explanation ? `<div class="r-q-exp"><strong>Why:</strong> ${escapeHtml(q.explanation)}</div>` : ""}
        </div>
      `;
    }).join("\n");

    const scorePct = total ? Math.round((correct / total) * 100) : 0;

    return `
      <!doctype html>
      <html>
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>GVAI Quick Quiz — Results</title>
        <style>
          :root { color-scheme: light; }
          body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; margin: 24px; }
          .hdr { display:flex; justify-content:space-between; gap:16px; align-items:flex-start; margin-bottom: 16px; }
          .brand { font-weight: 800; font-size: 18px; }
          .sub { color: #444; font-size: 12px; margin-top: 4px; }
          .score { text-align:right; }
          .score .big { font-size: 28px; font-weight: 900; }
          .pill { display:inline-block; padding: 6px 10px; border-radius: 999px; background:#f1f5f9; border:1px solid #e2e8f0; font-size:12px; }
          .r-q { border: 1px solid #e5e7eb; border-radius: 12px; padding: 12px; margin: 12px 0; }
          .r-q.ok { border-color:#86efac; background:#f0fdf4; }
          .r-q.bad { border-color:#fecaca; background:#fff1f2; }
          .r-q-title { font-weight: 700; margin-bottom: 8px; }
          .r-q-meta { display:grid; gap:4px; font-size: 13px; }
          .r-q-exp { margin-top: 8px; font-size: 13px; }
          .footer { margin-top: 18px; font-size: 12px; color:#555; }
          @media print {
            .no-print { display:none !important; }
            body { margin: 12mm; }
          }
        </style>
      </head>
      <body>
        <div class="hdr">
          <div>
            <div class="brand">GVAI Quick Quiz — Results</div>
            <div class="sub">Academic use only • Generated locally in your browser</div>
            <div class="sub">Generated: ${escapeHtml(new Date().toLocaleString())}</div>
          </div>
          <div class="score">
            <div class="pill">Quiz size: ${total}</div><br/>
            <div class="big">${scorePct}%</div>
            <div class="sub">${correct} correct • ${total - correct} missed</div>
          </div>
        </div>

        <div class="no-print" style="margin: 10px 0 14px;">
          <button onclick="window.print()">Print / Save as PDF</button>
        </div>

        ${rows}

        <div class="footer">
          Powered by Self-Defi • GVAI Quick Quiz • ${escapeHtml(BANK_VERSION)}
        </div>
      </body>
      </html>
    `;
  }

  function escapeHtml(s) {
    return String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function downloadPdfResults() {
    // No external libraries: open a print-ready report.
    // User can choose “Save as PDF” in the browser print dialog.
    const html = buildResultsHtml();
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
    // Don’t auto-print (some browsers block it); user clicks button or uses Ctrl+P.
  }

  // ---------- LOCALSTORAGE SAVE/RESUME ----------
  function persistState() {
    // Only persist quiz state after quiz has been opened at least once,
    // so the page loads clean and doesn't “auto-show” quiz/tools.
    const payload = {
      bankVersion: BANK_VERSION,
      size: state.size,
      quiz: state.quiz,
      answers: state.answers,
      checked: state.checked,
      lastSavedAt: nowIso()
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      state.lastSavedAt = payload.lastSavedAt;
    } catch {
      // ignore quota / privacy mode
    }
  }

  function restoreStateIfCompatible() {
    const saved = safeJsonParse(localStorage.getItem(STORAGE_KEY), null);
    if (!saved) return false;
    if (saved.bankVersion !== BANK_VERSION) return false;
    if (!Array.isArray(saved.quiz) || !saved.quiz.length) return false;

    state.size = Number(saved.size) || 20;
    state.quiz = saved.quiz;
    state.answers = saved.answers || {};
    state.checked = !!saved.checked;
    state.lastSavedAt = saved.lastSavedAt || null;
    return true;
  }

  function clearSavedState() {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    state.answers = {};
    state.checked = false;
    state.lastSavedAt = null;
  }

  // ---------- INIT + EVENTS ----------
  function bindDom() {
    dom.themeToggle = $("#theme-toggle");
    dom.openToolsBtn = $("#open-tools");
    dom.openQuizBtn = $("#open-quiz");

    dom.toolsSection = $("#tools");
    dom.quizSection = $("#quiz");

    dom.quizForm = $("#quiz-form");
    dom.sizeSelect = $("#quiz-size");
    dom.newQuizBtn = $("#new-quiz");

    dom.checkBtn = $("#check-answers");
    dom.resetBtn = $("#reset-quiz");
    dom.downloadBtn = $("#download-results");

    dom.summary = $("#quiz-summary");

    dom.progressText = $("#progress-text");
    dom.progressPercent = $("#progress-percent");
    dom.progressBar = $(".progress-bar");
    dom.progressFill = $("#progress-fill");
  }

  function ensureQuizBuiltOrRestored() {
    // Try restore first; if not, create a fresh quiz with current size
    const ok = restoreStateIfCompatible();
    if (!ok) buildQuiz(dom.sizeSelect ? dom.sizeSelect.value : state.size);
  }

  function initQuizUIOnce() {
    if (state.initialized) return;

    // size select default
    if (dom.sizeSelect) dom.sizeSelect.value = String(state.size);

    ensureQuizBuiltOrRestored();
    renderQuiz();

    // If a restored quiz was previously checked, re-apply check styling
    if (state.checked) {
      // temporarily mark selections in DOM
      state.quiz.forEach(q => {
        const selected = state.answers[q.id];
        if (selected === undefined) return;
        const input = dom.quizForm?.querySelector(`input[name="${q.id}"][value="${selected}"]`);
        if (input) input.checked = true;
      });
      checkAnswers();
    }

    state.initialized = true;
  }

  function openQuiz() {
    // show quiz section and render only now
    openSection(dom.quizSection);
    initQuizUIOnce();

    // optional: update URL hash without forcing display on reload
    try { history.replaceState(null, "", "#quiz"); } catch {}

    state.quizOpen = true;
  }

  function openTools() {
    openSection(dom.toolsSection);
    try { history.replaceState(null, "", "#tools"); } catch {}
    state.toolsOpen = true;
  }

  function closeBySelector(sel) {
    const el = $(sel);
    if (!el) return;
    closeSection(el);
    if (el === dom.quizSection) state.quizOpen = false;
    if (el === dom.toolsSection) state.toolsOpen = false;
  }

  function wireEvents() {
    // Theme toggle
    dom.themeToggle?.addEventListener("click", toggleTheme);

    // Show tools/quiz on button press only
    dom.openToolsBtn?.addEventListener("click", openTools);
    dom.openQuizBtn?.addEventListener("click", openQuiz);

    // Close buttons for collapsibles (data-close="#tools" etc.)
    $$("[data-close]").forEach(btn => {
      btn.addEventListener("click", () => closeBySelector(btn.getAttribute("data-close")));
    });

    // Quiz controls
    dom.sizeSelect?.addEventListener("change", () => {
      // Change size but do not auto-render unless quiz is open/initialized.
      state.size = clamp(Number(dom.sizeSelect.value) || 20, 1, 50);

      // If quiz already initialized, rebuild immediately
      if (state.initialized) {
        buildQuiz(state.size);
        renderQuiz();
        if (dom.summary) dom.summary.hidden = true;
        persistState();
      } else {
        // if not initialized, just persist preference later
        persistState();
      }
    });

    dom.newQuizBtn?.addEventListener("click", () => {
      buildQuiz(dom.sizeSelect ? dom.sizeSelect.value : state.size);
      renderQuiz();
      if (dom.summary) dom.summary.hidden = true;
      persistState();
    });

    dom.checkBtn?.addEventListener("click", checkAnswers);

    dom.resetBtn?.addEventListener("click", () => {
      clearSavedState();
      buildQuiz(dom.sizeSelect ? dom.sizeSelect.value : state.size);
      renderQuiz();
      if (dom.summary) dom.summary.hidden = true;
      persistState();
    });

    dom.downloadBtn?.addEventListener("click", () => {
      // Encourage checking first (still allow export)
      downloadPdfResults();
    });

    // Optional: if user lands on #quiz via link, do NOT auto-open.
    // (Requirement: quiz shouldn’t generate until button pressed.)
    // We leave it closed. If you ever want hash-open behavior later, change here.
  }

  // ---------- BOOT ----------
  document.addEventListener("DOMContentLoaded", () => {
    bindDom();

    // Always apply saved theme immediately
    applyTheme(getSavedTheme());

    // Make sure tools/quiz stay hidden on load
    if (dom.toolsSection) dom.toolsSection.hidden = true;
    if (dom.quizSection) dom.quizSection.hidden = true;

    wireEvents();
  });

})();


