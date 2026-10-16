"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContourBackdrop from "@/components/ContourBackdrop";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-slate-400">
      Loading editor...
    </div>
  ),
});

/* -------------------------------------------------------------------------- */
/* CONSTANTS & TYPES                                                          */
/* -------------------------------------------------------------------------- */

type Lang = "python" | "c" | "java";
type Difficulty = "Easy" | "Medium" | "Hard";

const LANGS: { id: Lang; label: string }[] = [
  { id: "python", label: "Python" },
  { id: "c", label: "C" },
  { id: "java", label: "Java" },
];

const STARTERS: Record<Lang, string> = {
  python: `# Read input with input(), print the answer with print()

n = int(input())
print(n)
`,
  c: `#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    printf("%d\\n", n);
    return 0;
}
`,
  java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(n);
    }
}
`,
};

const CODING_TOPICS = [
  "Basics & Loops",
  "Arrays",
  "Strings",
  "Recursion",
  "Sorting & Searching",
  "Math & Number Theory",
  "Matrices",
  "Stacks & Queues",
  "Dynamic Programming",
];

const APTITUDE_CATEGORIES = [
  "Quantitative Aptitude",
  "Logical Reasoning",
  "Verbal Ability",
  "Data Interpretation",
];

const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];

type Problem = {
  title: string;
  description: string;
  inputFormat?: string;
  outputFormat?: string;
  constraints?: string[];
  samples: { input: string; output: string; explanation?: string }[];
  testCases: { input: string; output: string }[];
};

type RunResult = {
  stdout: string;
  stderr: string;
  compileOutput: string;
  status: string;
  statusId: number;
  time: string | null;
  memory: number | null;
};

type TestResult = {
  pass: boolean;
  input: string;
  expected: string;
  got: string;
  note?: string;
};

type MCQ = {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
};

const selectCls =
  "rounded-xl border border-sky-500/30 bg-[#070b16] px-3 py-2 text-sm font-medium text-sky-100 outline-none focus:border-sky-400 cursor-pointer";

const primaryBtn =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-sky-400/50 bg-gradient-to-r from-sky-600 to-sky-500 px-4 py-2 text-sm font-bold text-white shadow-[0_0_16px_rgba(56,189,248,0.35)] transition-all hover:from-sky-500 hover:to-sky-400 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer";

const ghostBtn =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-sky-400/30 bg-sky-500/10 px-4 py-2 text-sm font-semibold text-sky-200 transition-colors hover:bg-sky-500/20 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer";

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

async function runCode(language: Lang, source: string, stdin: string): Promise<RunResult> {
  const res = await fetch("/api/run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ language, source, stdin }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Run failed.");
  return data;
}

function normalize(s: string) {
  return s
    .replace(/\r/g, "")
    .trim()
    .split("\n")
    .map((l) => l.trimEnd())
    .join("\n");
}

function describeRun(r: RunResult) {
  if (r.compileOutput) return r.compileOutput;
  if (r.stderr) return r.stderr;
  return r.stdout;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-sky-200/50">{label}</span>
      {children}
    </label>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
      {message}
    </p>
  );
}

/* -------------------------------------------------------------------------- */
/* CODING TAB                                                                 */
/* -------------------------------------------------------------------------- */

function CodingTab() {
  const [topic, setTopic] = useState(CODING_TOPICS[0]);
  const [difficulty, setDifficulty] = useState<Difficulty>("Easy");
  const [problem, setProblem] = useState<Problem | null>(null);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState("");

  const [lang, setLang] = useState<Lang>("python");
  const [codes, setCodes] = useState<Record<Lang, string>>(STARTERS);
  const [stdin, setStdin] = useState("");

  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState<RunResult | null>(null);
  const [runError, setRunError] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState<TestResult[] | null>(null);

  async function generate() {
    setGenerating(true);
    setGenError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "coding", topic, difficulty }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not generate a problem.");
      setProblem(data.problem);
      setStdin(data.problem.samples?.[0]?.input ?? "");
      setOutput(null);
      setResults(null);
      setRunError("");
    } catch (e) {
      setGenError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setGenerating(false);
    }
  }

  async function run() {
    setRunning(true);
    setRunError("");
    setResults(null);
    try {
      setOutput(await runCode(lang, codes[lang], stdin));
    } catch (e) {
      setOutput(null);
      setRunError(e instanceof Error ? e.message : "Run failed.");
    } finally {
      setRunning(false);
    }
  }

  async function submit() {
    if (!problem) return;
    setSubmitting(true);
    setRunError("");
    setOutput(null);
    const collected: TestResult[] = [];
    setResults([]);
    try {
      for (const tc of problem.testCases) {
        const r = await runCode(lang, codes[lang], tc.input);
        if (r.statusId !== 3) {
          collected.push({
            pass: false,
            input: tc.input,
            expected: tc.output,
            got: describeRun(r),
            note: r.status,
          });
          setResults([...collected]);
          break; // compile/runtime error: no point running the rest
        }
        collected.push({
          pass: normalize(r.stdout) === normalize(tc.output),
          input: tc.input,
          expected: tc.output,
          got: r.stdout,
        });
        setResults([...collected]);
      }
    } catch (e) {
      setRunError(e instanceof Error ? e.message : "Submit failed.");
    } finally {
      setSubmitting(false);
    }
  }

  const passed = results?.filter((r) => r.pass).length ?? 0;
  const total = problem?.testCases.length ?? 0;
  const busy = running || submitting;

  return (
    <div className="space-y-6">
      {/* Generator controls */}
      <div className="flex flex-col gap-4 rounded-2xl border border-sky-500/20 bg-[#070b16]/80 p-4 backdrop-blur-md sm:flex-row sm:items-end">
        <Field label="Topic">
          <select value={topic} onChange={(e) => setTopic(e.target.value)} className={selectCls}>
            {CODING_TOPICS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field label="Difficulty">
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            className={selectCls}
          >
            {DIFFICULTIES.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </Field>
        <button type="button" onClick={generate} disabled={generating} className={primaryBtn}>
          {generating ? "Generating..." : problem ? "New problem with AI" : "Generate problem with AI"}
        </button>
        <p className="text-xs text-slate-400 sm:ml-auto sm:max-w-xs">
          You can also skip this and use the editor freely.
        </p>
      </div>

      {genError && <ErrorBox message={genError} />}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ---------------------------- Problem panel --------------------------- */}
        <section className="rounded-2xl border border-sky-500/20 bg-[#070b16]/80 p-5 sm:p-6 backdrop-blur-md lg:max-h-[880px] lg:overflow-y-auto">
          {generating && !problem ? (
            <p className="text-sm text-slate-400">Writing a problem for you...</p>
          ) : problem ? (
            <div className="space-y-5">
              <div>
                <span className="rounded-full border border-sky-400/30 bg-sky-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-sky-300">
                  {topic} &middot; {difficulty}
                </span>
                <h2 className="mt-3 text-xl font-bold text-white">{problem.title}</h2>
                <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-300">
                  {problem.description}
                </p>
              </div>

              {problem.inputFormat && (
                <div>
                  <h3 className="text-sm font-semibold text-sky-300">Input format</h3>
                  <p className="mt-1 whitespace-pre-line text-sm leading-6 text-slate-300">
                    {problem.inputFormat}
                  </p>
                </div>
              )}
              {problem.outputFormat && (
                <div>
                  <h3 className="text-sm font-semibold text-sky-300">Output format</h3>
                  <p className="mt-1 whitespace-pre-line text-sm leading-6 text-slate-300">
                    {problem.outputFormat}
                  </p>
                </div>
              )}
              {problem.constraints && problem.constraints.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-sky-300">Constraints</h3>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-300">
                    {problem.constraints.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {problem.samples.map((s, i) => (
                <div key={i} className="rounded-xl border border-white/10 bg-black/30 p-3">
                  <p className="mb-2 text-xs font-semibold text-slate-400">Sample {i + 1}</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="mb-1 text-[11px] uppercase tracking-wider text-slate-500">Input</p>
                      <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-sm text-slate-200">
                        {s.input}
                      </pre>
                    </div>
                    <div>
                      <p className="mb-1 text-[11px] uppercase tracking-wider text-slate-500">Output</p>
                      <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-sm text-slate-200">
                        {s.output}
                      </pre>
                    </div>
                  </div>
                  {s.explanation && (
                    <p className="mt-2 text-xs leading-5 text-slate-400">{s.explanation}</p>
                  )}
                  <button
                    type="button"
                    onClick={() => setStdin(s.input)}
                    className="mt-2 text-xs text-sky-400 hover:underline cursor-pointer"
                  >
                    Use as input
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full min-h-[220px] flex-col items-center justify-center text-center">
              <p className="text-base font-semibold text-white">No problem yet</p>
              <p className="mt-1 max-w-xs text-sm text-slate-400">
                Pick a topic and difficulty above and let AI write a problem, then solve it in the editor.
              </p>
            </div>
          )}
        </section>

        {/* ----------------------------- Editor panel --------------------------- */}
        <section className="flex flex-col gap-4">
          <div className="overflow-hidden rounded-2xl border border-sky-500/20 bg-[#0b0f1d]">
            <div className="flex flex-wrap items-center gap-3 border-b border-sky-500/20 bg-[#070b16] px-3 py-2.5">
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as Lang)}
                className={selectCls}
                aria-label="Programming language"
              >
                {LANGS.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setCodes((c) => ({ ...c, [lang]: STARTERS[lang] }))}
                className="text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Reset code
              </button>

              <div className="ml-auto flex gap-2">
                <button type="button" onClick={run} disabled={busy} className={ghostBtn}>
                  {running ? "Running..." : "Run"}
                </button>
                <button
                  type="button"
                  onClick={submit}
                  disabled={busy || !problem}
                  title={problem ? "Run against all test cases" : "Generate a problem to submit"}
                  className={primaryBtn}
                >
                  {submitting ? "Checking..." : "Submit"}
                </button>
              </div>
            </div>

            <div className="h-[380px] sm:h-[420px]">
              <Editor
                height="100%"
                theme="vs-dark"
                language={lang}
                value={codes[lang]}
                onChange={(v) => setCodes((c) => ({ ...c, [lang]: v ?? "" }))}
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 4,
                  padding: { top: 12 },
                }}
              />
            </div>
          </div>

          {lang === "java" && (
            <p className="text-xs text-amber-300/80">
              Java: keep the class name <code className="font-mono">Main</code>.
            </p>
          )}

          <Field label="Input (stdin)">
            <textarea
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              rows={3}
              placeholder="Type the input your program reads..."
              className="w-full resize-y rounded-xl border border-sky-500/20 bg-[#070b16] px-3 py-2 font-mono text-sm text-white placeholder-slate-600 outline-none focus:border-sky-400"
            />
          </Field>

          {runError && <ErrorBox message={runError} />}

          {/* Single run output */}
          {output && (
            <div className="rounded-2xl border border-sky-500/20 bg-[#070b16] p-4">
              <div className="mb-2 flex flex-wrap items-center gap-3 text-xs">
                <span
                  className={`rounded-full px-2.5 py-0.5 font-semibold ${
                    output.statusId === 3
                      ? "bg-emerald-500/15 text-emerald-300"
                      : "bg-rose-500/15 text-rose-300"
                  }`}
                >
                  {output.status}
                </span>
                {output.time && <span className="text-slate-500">{output.time}s</span>}
                {output.memory != null && (
                  <span className="text-slate-500">{Math.round(output.memory / 1024)} MB</span>
                )}
              </div>
              <pre className="max-h-64 overflow-auto whitespace-pre-wrap font-mono text-sm text-slate-200">
                {describeRun(output) || "(no output)"}
              </pre>
            </div>
          )}

          {/* Submit results */}
          {results && results.length > 0 && (
            <div className="rounded-2xl border border-sky-500/20 bg-[#070b16] p-4">
              <p className="mb-3 text-sm font-semibold text-white">
                {passed} / {total} test cases passed
                {!submitting && passed === total && (
                  <span className="ml-2 text-emerald-300">All clear</span>
                )}
              </p>
              <ul className="space-y-2">
                {results.map((r, i) => (
                  <li
                    key={i}
                    className={`rounded-xl border px-3 py-2 text-sm ${
                      r.pass
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                        : "border-rose-500/30 bg-rose-500/10 text-rose-200"
                    }`}
                  >
                    <p className="font-semibold">
                      Test {i + 1}: {r.pass ? "Passed" : r.note ? r.note : "Wrong answer"}
                    </p>
                    {!r.pass && (
                      <div className="mt-2 grid gap-2 font-mono text-xs text-slate-200 sm:grid-cols-2">
                        <div>
                          <p className="mb-0.5 text-slate-400">Expected</p>
                          <pre className="whitespace-pre-wrap">{r.expected}</pre>
                        </div>
                        <div>
                          <p className="mb-0.5 text-slate-400">Your output</p>
                          <pre className="whitespace-pre-wrap">{r.got || "(none)"}</pre>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* APTITUDE TAB                                                               */
/* -------------------------------------------------------------------------- */

function AptitudeTab() {
  const [category, setCategory] = useState(APTITUDE_CATEGORIES[0]);
  const [difficulty, setDifficulty] = useState<Difficulty>("Easy");
  const [count, setCount] = useState(5);
  const [questions, setQuestions] = useState<MCQ[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "aptitude", topic: category, difficulty, count }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not generate questions.");
      setQuestions(data.questions);
      setAnswers({});
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const answered = Object.keys(answers).length;
  const score = questions.reduce((n, q, i) => (answers[i] === q.answerIndex ? n + 1 : n), 0);
  const finished = questions.length > 0 && answered === questions.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-sky-500/20 bg-[#070b16]/80 p-4 backdrop-blur-md sm:flex-row sm:flex-wrap sm:items-end">
        <Field label="Category">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectCls}>
            {APTITUDE_CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="Difficulty">
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            className={selectCls}
          >
            {DIFFICULTIES.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </Field>
        <Field label="Questions">
          <select value={count} onChange={(e) => setCount(Number(e.target.value))} className={selectCls}>
            {[5, 10].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </Field>
        <button type="button" onClick={generate} disabled={loading} className={primaryBtn}>
          {loading ? "Generating..." : questions.length ? "New set with AI" : "Generate questions with AI"}
        </button>

        {questions.length > 0 && (
          <p className="text-sm text-slate-300 sm:ml-auto">
            Answered <strong className="text-white">{answered}</strong> / {questions.length} &middot; Score{" "}
            <strong className="text-sky-300">{score}</strong>
          </p>
        )}
      </div>

      {error && <ErrorBox message={error} />}

      {questions.length === 0 && !loading && (
        <div className="rounded-3xl border border-dashed border-sky-400/30 bg-[#070b16]/60 p-12 text-center">
          <p className="text-base font-semibold text-white">No questions yet</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-slate-400">
            Choose a category and difficulty, then generate a fresh set of MCQs.
          </p>
        </div>
      )}

      {loading && questions.length === 0 && (
        <p className="text-center text-sm text-slate-400">Writing questions for you...</p>
      )}

      <ol className="space-y-5">
        {questions.map((q, qi) => {
          const chosen = answers[qi];
          const done = chosen !== undefined;

          return (
            <li
              key={qi}
              className="rounded-2xl border border-sky-500/20 bg-[#070b16]/80 p-5 sm:p-6 backdrop-blur-md"
            >
              <p className="text-xs font-semibold text-sky-300">Question {qi + 1}</p>
              <p className="mt-1 text-base font-medium leading-7 text-white">{q.question}</p>

              <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {q.options.map((opt, oi) => {
                  let cls =
                    "border-white/10 bg-white/[0.03] text-slate-200 hover:border-sky-400/50 hover:bg-sky-500/10";
                  if (done) {
                    if (oi === q.answerIndex) {
                      cls = "border-emerald-400/60 bg-emerald-500/15 text-emerald-100";
                    } else if (oi === chosen) {
                      cls = "border-rose-400/60 bg-rose-500/15 text-rose-100";
                    } else {
                      cls = "border-white/5 bg-white/[0.02] text-slate-500";
                    }
                  }

                  return (
                    <button
                      key={oi}
                      type="button"
                      disabled={done}
                      onClick={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                      className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${cls} ${
                        done ? "cursor-default" : "cursor-pointer"
                      }`}
                    >
                      <span className="mt-px inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white/10 text-[11px] font-bold">
                        {String.fromCharCode(65 + oi)}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {done && (
                <div className="mt-4 rounded-xl border border-sky-400/20 bg-sky-500/5 px-4 py-3">
                  <p className="text-sm font-semibold text-white">
                    {chosen === q.answerIndex
                      ? "Correct"
                      : `Not quite. The answer is ${String.fromCharCode(65 + q.answerIndex)}.`}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-300">{q.explanation}</p>
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {finished && (
        <div className="rounded-2xl border border-sky-400/30 bg-sky-500/10 p-6 text-center shadow-[0_0_24px_rgba(56,189,248,0.2)]">
          <p className="font-jersey text-3xl text-white">
            You scored {score} / {questions.length}
          </p>
          <button type="button" onClick={generate} disabled={loading} className={`${primaryBtn} mt-4`}>
            Try another set
          </button>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function PracticePage() {
  const [tab, setTab] = useState<"coding" | "aptitude">("coding");

  const tabs = [
    { id: "coding" as const, label: "Coding Practice" },
    { id: "aptitude" as const, label: "Aptitude MCQ" },
  ];

  return (
    <main className="relative isolate min-h-screen w-full bg-[var(--theme-bg-main,#060913)] text-[var(--theme-bg-hero,#dce6ef)] selection:bg-sky-500 selection:text-white">
      <ContourBackdrop className="z-0" />

      <Navbar />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-28 pb-20 sm:px-6 lg:px-8">
        <section className="mb-10 max-w-4xl">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-[var(--theme-primary,#00f0ff)]/70">
            Department of ISE · Learn &amp; Practice
          </p>

          <h1 className="font-clash text-[clamp(2.8rem,6.5vw,5.5rem)] font-bold leading-[0.95] tracking-tight text-[var(--theme-bg-hero,#dce6ef)]">
            Practice <span className="text-[var(--theme-primary,#00f0ff)]">Arena.</span>
          </h1>

          <p className="mt-5 max-w-2xl font-cabinet text-base font-medium leading-relaxed text-white/75 sm:text-lg">
            Solve coding problems in Java, C or Python, and sharpen your aptitude with AI-generated questions.
          </p>
        </section>

        <div role="tablist" aria-label="Practice mode" className="mb-6 flex justify-start gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-full border px-5 py-2 text-sm font-semibold transition-all duration-300 cursor-pointer ${
                tab === t.id
                  ? "border-sky-400 bg-sky-500/25 text-white shadow-[0_0_16px_rgba(56,189,248,0.4)]"
                  : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-sky-400/40 hover:bg-sky-500/10 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Both tabs stay mounted so switching doesn't lose your code or questions */}
        <div hidden={tab !== "coding"}>
          <CodingTab />
        </div>
        <div hidden={tab !== "aptitude"}>
          <AptitudeTab />
        </div>
      </div>

      <Footer />
    </main>
  );
}
