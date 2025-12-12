/* =========================================================
   GVAI Quick Quiz — Responsible Academic AI Use
   Fully client-side | Randomized | LocalStorage-ready
   ========================================================= */

const QUESTION_BANK = [
  {
    question: "What is the primary goal of using AI tools in the GraduationVaultsAI program?",
    options: [
      "To replace student thinking with automated answers",
      "To speed through assignments with minimal effort",
      "To use AI as a lever to strengthen understanding and reasoning",
      "To generate content without review"
    ],
    correct: 2,
    explanation:
      "AI is positioned as a thinking aid — not a replacement — helping students build understanding and literacy."
  },
  {
    question: "Which AI tool is best suited for asking questions directly against your own class notes or PDFs?",
    options: [
      "ChatGPT",
      "NotebookLM",
      "Canva AI",
      "Photomath"
    ],
    correct: 1,
    explanation:
      "NotebookLM is designed to answer questions using uploaded source documents."
  },
  {
    question: "Why is Perplexity recommended for research tasks?",
    options: [
      "It generates longer essays automatically",
      "It hides its sources to reduce bias",
      "It answers questions with cited sources",
      "It works offline"
    ],
    correct: 2,
    explanation:
      "Perplexity emphasizes citation discipline, reinforcing evidence-based research."
  },
  {
    question: "Which behavior best reflects responsible AI use in academics?",
    options: [
      "Copying AI answers directly into assignments",
      "Using AI to clarify concepts, then writing in your own words",
      "Letting AI complete graded work without review",
      "Sharing login credentials with AI tools"
    ],
    correct: 1,
    explanation:
      "Responsible use means understanding and synthesizing, not copying."
  },
  {
    question: "What does the phrase 'AI gives you the level of thinking you ask for' mean?",
    options: [
      "AI always produces expert-level results",
      "AI limits how deeply students can think",
      "Prompt quality directly affects output quality",
      "AI decides what level of detail is appropriate"
    ],
    correct: 2,
    explanation:
      "Clear roles, goals, and context in prompts produce better reasoning."
  },
  {
    question: "Which is an example of a strong prompt?",
    options: [
      "Explain savings",
      "Help me",
      "Act as a tutor helping me understand this chapter step-by-step",
      "Give me answers fast"
    ],
    correct: 2,
    explanation:
      "Strong prompts assign a role, audience, and objective."
  },
  {
    question: "Which tool is most appropriate for creating presentations or visual projects?",
    options: [
      "NotebookLM",
      "Canva AI",
      "Perplexity",
      "QANDA"
    ],
    correct: 1,
    explanation:
      "Canva AI is optimized for presentations and visual communication."
  },
  {
    question: "Why should students avoid entering personal information into AI tools?",
    options: [
      "AI tools delete data instantly",
      "Schools track all AI usage",
      "Privacy and safety risks exist",
      "AI cannot process personal data"
    ],
    correct: 2,
    explanation:
      "Responsible use includes protecting personal and sensitive information."
  },
  {
    question: "Which AI tool supports math problem-solving with guided steps instead of just answers?",
    options: [
      "ChatGPT",
      "Perplexity",
      "Photomath",
      "Canva AI"
    ],
    correct: 2,
    explanation:
      "Photomath emphasizes scaffolding and learning, not answer dumping."
  },
  {
    question: "What is the best use of ChatGPT in an academic setting?",
    options: [
      "Submitting its output as final work",
      "Clarifying concepts and brainstorming ideas",
      "Replacing textbooks",
      "Completing exams automatically"
    ],
    correct: 1,
    explanation:
      "ChatGPT functions best as a universal thinking assistant."
  },

  /* -------- CONTINUE — Questions 11–45 -------- */

  {
    question: "Which tool helps turn academic papers into structured study cards?",
    options: ["Perplexity", "Scholarcy", "NotebookLM", "Gamma"],
    correct: 1,
    explanation: "Scholarcy specializes in breaking academic texts into study cards."
  },
  {
    question: "Why is citation discipline important when using AI?",
    options: [
      "It improves grammar",
      "It avoids accountability",
      "It reinforces evidence-based learning",
      "It shortens answers"
    ],
    correct: 2,
    explanation: "Citations help verify accuracy and build research literacy."
  },
  {
    question: "Which behavior shows misuse of AI in school?",
    options: [
      "Asking AI to explain a topic",
      "Using AI to generate flashcards",
      "Submitting AI output without understanding",
      "Checking AI answers against sources"
    ],
    correct: 2,
    explanation: "Submitting without understanding undermines learning."
  },
  {
    question: "What does 'prompt discipline' encourage?",
    options: [
      "Short prompts only",
      "Role clarity and outcome focus",
      "Avoiding AI altogether",
      "Letting AI guess intent"
    ],
    correct: 1,
    explanation: "Prompt discipline structures AI responses effectively."
  },
  {
    question: "Which tool provides lightweight coding exposure without setup?",
    options: ["CodeHS", "Replit AI", "ChatGPT", "Canva AI"],
    correct: 1,
    explanation: "Replit AI enables in-browser coding instantly."
  },
  {
    question: "Why should AI outputs be cross-checked?",
    options: [
      "AI never makes mistakes",
      "Teachers require it",
      "AI can hallucinate or oversimplify",
      "It slows learning"
    ],
    correct: 2,
    explanation: "Verification is part of responsible AI use."
  },
  {
    question: "Which tool is best for citation-backed research queries?",
    options: ["ChatGPT", "Perplexity", "NotebookLM", "Gamma"],
    correct: 1,
    explanation: "Perplexity answers with sources."
  },
  {
    question: "What is the safest mindset when using AI for schoolwork?",
    options: [
      "AI decides correctness",
      "AI assists, humans decide",
      "AI replaces teachers",
      "AI grades assignments"
    ],
    correct: 1,
    explanation: "Humans remain accountable."
  },
  {
    question: "Which AI tool helps organize assignments and planning logic?",
    options: ["Notion AI", "Photomath", "QANDA", "Scholarcy"],
    correct: 0,
    explanation: "Notion AI supports structured academic planning."
  },
  {
    question: "What is the best next step after using AI to study a topic?",
    options: [
      "Submit work immediately",
      "Discuss insights with teachers or mentors",
      "Delete notes",
      "Rely only on AI memory"
    ],
    correct: 1,
    explanation: "Human discussion reinforces understanding."
  }
];

// ---------- Utility ----------
function shuffle(arr) {
  return arr
    .map(v => ({ v, s: Math.random() }))
    .sort((a, b) => a.s - b.s)
    .map(({ v }) => v);
}

// ---------- State ----------
let activeQuestions = [];
let answers = {};

// ---------- Render ----------
function initQuiz(size) {
  answers = {};
  activeQuestions = shuffle([...QUESTION_BANK]).slice(0, size);
  const form = document.getElementById("quiz-form");
  form.innerHTML = "";

  activeQuestions.forEach((q, i) => {
    const block = document.createElement("div");
    block.className = "quiz-question";

    const title = document.createElement("h3");
    title.textContent = `${i + 1}. ${q.question}`;

    const list = document.createElement("ul");

    q.options.forEach((opt, idx) => {
      const li = document.createElement("li");
      const label = document.createElement("label");

      const input = document.createElement("input");
      input.type = "radio";
      input.name = `q${i}`;
      input.value = idx;
      input.addEventListener("change", () => {
        answers[i] = idx;
        updateProgress();
      });

      label.appendChild(input);
      label.appendChild(document.createTextNode(" " + opt));
      li.appendChild(label);
      list.appendChild(li);
    });

    block.appendChild(title);
    block.appendChild(list);
    form.appendChild(block);
  });

  updateProgress();
}

// ---------- Progress ----------
function updateProgress() {
  const total = activeQuestions.length;
  const answered = Object.keys(answers).length;
  const pct = Math.round((answered / total) * 100);

  document.getElementById("progress-text").textContent =
    `Progress: ${answered} / ${total}`;
  document.getElementById("progress-percent").textContent = `${pct}%`;
  document.getElementById("progress-fill").style.width = `${pct}%`;
}

// ---------- Grade ----------
function gradeQuiz() {
  let correct = 0;

  activeQuestions.forEach((q, i) => {
    if (answers[i] === q.correct) correct++;
  });

  const summary = document.getElementById("quiz-summary");
  summary.hidden = false;
  summary.textContent =
    `You answered ${correct} out of ${activeQuestions.length} correctly.`;
}

// ---------- Events ----------
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("new-quiz")?.addEventListener("click", () => {
    const size = parseInt(document.getElementById("quiz-size").value, 10);
    initQuiz(size);
  });

  document.getElementById("check-answers")?.addEventListener("click", gradeQuiz);
});


