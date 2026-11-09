import React, { useState } from "react";
import { parse } from "mathjs";
import {
  House,
  Atom,
  Sigma,
  Calculator as CalculatorIcon,
  BrainCircuit,
  FlaskConical,
  BookOpen,
  Menu,
  X,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import "./App.css";

// Mathematical expression solver
function solveExpression(expression) {
  if (!expression.trim()) {
    throw new Error("Please enter a mathematical expression.");
  }

  const node = parse(expression);
  const steps = [];

  function solveNode(n) {
    // Remove parentheses and solve their contents first
    if (n.isParenthesisNode) {
      return solveNode(n.content);
    }

    // Solve binary and unary operators
    if (n.isOperatorNode) {
      const values = n.args.map((arg) => solveNode(arg));
      const answer = n.evaluate();

      if (n.args.length === 2) {
        steps.push(
          `${values[0]} ${n.op} ${values[1]} = ${answer}`
        );
      } else if (n.args.length === 1) {
        steps.push(`${n.op}${values[0]} = ${answer}`);
      }

      return answer;
    }

    // Handle numbers, constants, functions such as sin(), cos()
    return n.evaluate();
  }

  const answer = solveNode(node);

  return {
    answer: String(answer),
    steps,
  };
}

function PhysicsSolver() {
  const [topic, setTopic] = React.useState("Velocity");
  const [values, setValues] = React.useState({
    distance: "",
    time: "",
    initialVelocity: "",
    finalVelocity: "",
    mass: "",
    acceleration: "",
    force: "",
    displacement: "",
    work: ""
  });

  const [result, setResult] = React.useState(null);
  const [error, setError] = React.useState("");

  const topics = [
    "Velocity",
    "Acceleration",
    "Force",
    "Work",
    "Power"
  ];

  const fields = {
    Velocity: [
      ["distance", "Distance (metre)"],
      ["time", "Time (second)"]
    ],
    Acceleration: [
      ["initialVelocity", "Initial velocity (m/s)"],
      ["finalVelocity", "Final velocity (m/s)"],
      ["time", "Time (second)"]
    ],
    Force: [
      ["mass", "Mass (kg)"],
      ["acceleration", "Acceleration (m/s²)"]
    ],
    Work: [
      ["force", "Force (newton)"],
      ["displacement", "Displacement (metre)"]
    ],
    Power: [
      ["work", "Work done (joule)"],
      ["time", "Time (second)"]
    ]
  };

  const formulas = {
    Velocity: "v = s / t",
    Acceleration: "a = (v - u) / t",
    Force: "F = m × a",
    Work: "W = F × s",
    Power: "P = W / t"
  };

  function calculate() {
    setError("");
    setResult(null);

    const required = fields[topic];

    for (const [key, label] of required) {
      if (values[key].trim() === "") {
        setError("Please enter " + label);
        return;
      }

      if (!Number.isFinite(Number(values[key]))) {
        setError("Please enter a valid number for " + label);
        return;
      }
    }

    const n = key => Number(values[key]);

    let answer;
    let unit;
    let steps = [];

    if (topic === "Velocity") {
      const s = n("distance");
      const t = n("time");

      if (t === 0) {
        setError("Time cannot be zero.");
        return;
      }

      answer = s / t;
      unit = "m/s";

      steps = [
        "Formula: v = s / t",
        `Substitute: v = ${s} / ${t}`,
        `Calculation: v = ${answer} m/s`
      ];
    }

    else if (topic === "Acceleration") {
      const u = n("initialVelocity");
      const v = n("finalVelocity");
      const t = n("time");

      if (t === 0) {
        setError("Time cannot be zero.");
        return;
      }

      answer = (v - u) / t;
      unit = "m/s²";

      steps = [
        "Formula: a = (v - u) / t",
        `Substitute: a = (${v} - ${u}) / ${t}`,
        `Calculation: a = ${answer} m/s²`
      ];
    }

    else if (topic === "Force") {
      const m = n("mass");
      const a = n("acceleration");

      answer = m * a;
      unit = "N";

      steps = [
        "Formula: F = m × a",
        `Substitute: F = ${m} × ${a}`,
        `Calculation: F = ${answer} N`
      ];
    }

    else if (topic === "Work") {
      const f = n("force");
      const s = n("displacement");

      answer = f * s;
      unit = "J";

      steps = [
        "Formula: W = F × s",
        `Substitute: W = ${f} × ${s}`,
        `Calculation: W = ${answer} J`
      ];
    }

    else {
      const w = n("work");
      const t = n("time");

      if (t === 0) {
        setError("Time cannot be zero.");
        return;
      }

      answer = w / t;
      unit = "W";

      steps = [
        "Formula: P = W / t",
        `Substitute: P = ${w} / ${t}`,
        `Calculation: P = ${answer} W`
      ];
    }

    if (!Number.isFinite(answer)) {
      setError("Unable to calculate this answer.");
      return;
    }

    setResult({
      answer: Number(answer.toFixed(6)),
      unit,
      steps
    });
  }

  const inputStyle = {
    width: "100%",
    padding: "13px",
    margin: "8px 0 15px",
    borderRadius: "10px",
    border: "1px solid #428bff",
    background: "#101c3c",
    color: "white",
    fontSize: "16px",
    boxSizing: "border-box"
  };

  return (
    <div style={{
      padding: "25px",
      color: "white",
      maxWidth: "850px",
      margin: "auto"
    }}>
      <h2>Physics Numerical Solver</h2>
      <p>Select a physics topic and enter the given values.</p>

      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        margin: "20px 0"
      }}>
        {topics.map(item => (
          <button
            key={item}
            onClick={() => {
              setTopic(item);
              setResult(null);
              setError("");
            }}
            style={{
              padding: "12px 17px",
              borderRadius: "9px",
              border: "1px solid #168cff",
              background: topic === item ? "#087cff" : "#17264b",
              color: "white",
              cursor: "pointer"
            }}
          >
            {item}
          </button>
        ))}
      </div>

      <div style={{
        background: "#142347",
        padding: "22px",
        borderRadius: "15px"
      }}>
        <h3>{topic}</h3>

        <p>
          <strong>Formula:</strong> {formulas[topic]}
        </p>

        {fields[topic].map(([key, label]) => (
          <div key={key}>
            <label>{label}</label>
            <input
              type="number"
              step="any"
              value={values[key]}
              onChange={e =>
                setValues({
                  ...values,
                  [key]: e.target.value
                })
              }
              placeholder={"Enter " + label}
              style={inputStyle}
            />
          </div>
        ))}

        <button
          onClick={calculate}
          style={{
            padding: "13px 25px",
            border: "none",
            borderRadius: "10px",
            background: "#00aaff",
            color: "white",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Calculate Answer
        </button>

        {error && (
          <p style={{ color: "#ff7777", marginTop: "15px" }}>
            {error}
          </p>
        )}

        {result && (
          <div style={{
            marginTop: "25px",
            padding: "20px",
            background: "#0b1835",
            borderRadius: "12px"
          }}>
            <h3>Step-by-Step Solution</h3>

            {result.steps.map((step, index) => (
              <p key={index}>
                {index + 1}. {step}
              </p>
            ))}

            <hr />

            <h2 style={{ color: "#20dfff" }}>
              Final Answer: {result.answer} {result.unit}
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}
function App() {
  const [activePage, setActivePage] = useState("Home");
  const [mobileMenu, setMobileMenu] = useState(false);

  const [mathExpression, setMathExpression] = useState("");
  const [mathResult, setMathResult] = useState("");
  const [mathSteps, setMathSteps] = useState([]);
  const [mathError, setMathError] = useState("");

  const [calcExpression, setCalcExpression] = useState("");
  const [calcResult, setCalcResult] = useState("");
  const [calcError, setCalcError] = useState("");

  const [question, setQuestion] = useState("");

  const navigation = [
    { name: "Home", icon: House },
    { name: "Physics Solver", icon: Atom },
    { name: "Math Solver", icon: Sigma },
    { name: "Calculator", icon: CalculatorIcon },
    { name: "AI Tutor", icon: BrainCircuit },
  ];

  function openPage(page) {
    setActivePage(page);
    setMobileMenu(false);
  }

  function calculateMath() {
    try {
      const output = solveExpression(mathExpression);

      setMathResult(output.answer);
      setMathSteps(output.steps);
      setMathError("");
    } catch (error) {
      setMathResult("");
      setMathSteps([]);
      setMathError(error.message || "Invalid mathematical expression.");
    }
  }

  function calculateCalculator() {
    try {
      const output = solveExpression(calcExpression);

      setCalcResult(output.answer);
      setCalcError("");
    } catch (error) {
      setCalcResult("");
      setCalcError(error.message || "Invalid expression.");
    }
  }

  function addCalculatorValue(value) {
    setCalcExpression((previous) => previous + value);
  }

  function clearCalculator() {
    setCalcExpression("");
    setCalcResult("");
    setCalcError("");
  }

  function askTutor() {
    if (!question.trim()) return;

    alert(
      "AI Tutor connection will be added in the next development phase. Your question is: " +
        question
    );
  }

  return (
    <div className="app-container">
      {/* Mobile menu button */}
      <button
        className="mobile-menu-button"
        onClick={() => setMobileMenu(!mobileMenu)}
        aria-label="Toggle menu"
      >
        {mobileMenu ? <X /> : <Menu />}
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon">
            <FlaskConical size={27} />
          </div>

          <div>
            <h2>PhysicsMath AI</h2>
            <p>Pi Edition</p>
          </div>
        </div>

        <div className="menu-heading">MAIN MENU</div>

        <nav className="navigation">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={`nav-item ${
                  activePage === item.name ? "active" : ""
                }`}
                onClick={() => openPage(item.name)}
              >
                <Icon size={20} />
                <span>{item.name}</span>
                <ArrowRight className="nav-arrow" size={15} />
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <Sparkles size={18} />
            <p>Learn Physics and Mathematics with confidence.</p>
          </div>
          <p className="version">Version 1.0 · Pi Edition</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="topbar-small">WELCOME TO</p>
            <h1>{activePage}</h1>
          </div>

          <div className="topbar-badge">
            <span className="online-dot"></span>
            Learning Mode
          </div>
        </header>

        {/* HOME PAGE */}
        {activePage === "Home" && (
          <section className="page-content">
            <div className="hero-card">
              <div className="hero-text">
                <span className="eyebrow">YOUR SMART LEARNING SPACE</span>
                <h2>
                  Explore the world of
                  <span> Physics & Mathematics</span>
                </h2>
                <p>
                  Solve mathematical expressions, explore physics concepts
                  and improve your problem-solving skills.
                </p>

                <button
                  className="primary-button"
                  onClick={() => openPage("Math Solver")}
                >
                  Start Solving <ArrowRight size={18} />
                </button>
              </div>

              <div className="hero-visual">
                <Atom size={130} strokeWidth={1} />
                <div className="floating-symbol symbol-one">π</div>
                <div className="floating-symbol symbol-two">∑</div>
                <div className="floating-symbol symbol-three">E=mc²</div>
              </div>
            </div>

            <h3 className="section-title">Explore Tools</h3>

            <div className="tool-grid">
              <button
                className="tool-card"
                onClick={() => openPage("Physics Solver")}
              >
                <div className="tool-icon purple">
                  <Atom size={28} />
                </div>
                <h3>Physics Solver</h3>
                <p>Explore physics problems and concepts.</p>
                <span>Explore tool →</span>
              </button>

              <button
                className="tool-card"
                onClick={() => openPage("Math Solver")}
              >
                <div className="tool-icon blue">
                  <Sigma size={28} />
                </div>
                <h3>Math Solver</h3>
                <p>Calculate expressions with solution steps.</p>
                <span>Explore tool →</span>
              </button>

              <button
                className="tool-card"
                onClick={() => openPage("Calculator")}
              >
                <div className="tool-icon green">
                  <CalculatorIcon size={28} />
                </div>
                <h3>Scientific Calculator</h3>
                <p>Perform mathematical calculations.</p>
                <span>Explore tool →</span>
              </button>

              <button
                className="tool-card"
                onClick={() => openPage("AI Tutor")}
              >
                <div className="tool-icon orange">
                  <BrainCircuit size={28} />
                </div>
                <h3>AI Tutor</h3>
                <p>Ask questions and learn new concepts.</p>
                <span>Explore tool →</span>
              </button>
            </div>
          </section>
        )}

        {/* PHYSICS SOLVER */}
        {activePage === "Physics Solver" && (
  <section className="page-content">
    <PhysicsSolver />
  </section>
)}

        {/* MATH SOLVER */}
        {activePage === "Math Solver" && (
          <section className="page-content">
            <div className="solver-card">
              <div className="solver-heading">
                <div className="large-icon">
                  <Sigma size={35} />
                </div>
                <div>
                  <h2>Math Solver</h2>
                  <p>Enter an expression to calculate its answer.</p>
                </div>
              </div>

              <label className="input-label">
                Mathematical Expression
              </label>

              <input
                className="expression-input"
                type="text"
                value={mathExpression}
                onChange={(event) => setMathExpression(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") calculateMath();
                }}
                placeholder="Example: (2+3)*4"
              />

              <p className="input-help">
                Examples: (2+3)*4, 25*sin(pi/2), sqrt(144), 10/2+5
              </p>

              <button
                className="primary-button solve-button"
                onClick={calculateMath}
              >
                Solve <ArrowRight size={18} />
              </button>

              {mathError && (
                <div className="error-box">{mathError}</div>
              )}

              {mathResult !== "" && (
                <div className="solution-area">
                  <div className="answer-box">
                    <span className="result-label">FINAL ANSWER</span>
                    <h2>{mathResult}</h2>
                  </div>

                  <div className="steps-box">
                    <h3>
                      <BookOpen size={20} />
                      Step-by-Step Solution
                    </h3>

                    {mathSteps.length > 0 ? (
                      <ol className="steps-list">
                        {mathSteps.map((step, index) => (
                          <li key={index}>
                            <span className="step-number">
                              {index + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p className="muted-text">
                        This expression does not require separate
                        arithmetic steps.
                      </p>
                    )}

                    <div className="final-answer">
                      Final Answer: <strong>{mathResult}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* CALCULATOR */}
        {activePage === "Calculator" && (
          <section className="page-content">
            <div className="calculator-card">
              <div className="solver-heading">
                <div className="large-icon">
                  <CalculatorIcon size={35} />
                </div>
                <div>
                  <h2>Scientific Calculator</h2>
                  <p>Calculate mathematical expressions.</p>
                </div>
              </div>

              <input
                className="expression-input calculator-display"
                type="text"
                value={calcExpression}
                onChange={(event) => setCalcExpression(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") calculateCalculator();
                }}
                placeholder="Enter expression"
              />

              <div className="calculator-buttons">
                {[
                  "7", "8", "9", "/",
                  "4", "5", "6", "*",
                  "1", "2", "3", "-",
                  "0", ".", "(", ")",
                  "pi", "sqrt(", "^", "+",
                ].map((value) => (
                  <button
                    key={value}
                    onClick={() => addCalculatorValue(value)}
                  >
                    {value}
                  </button>
                ))}

                <button onClick={() => addCalculatorValue("sin(")}>
                  sin
                </button>
                <button onClick={() => addCalculatorValue("cos(")}>
                  cos
                </button>
                <button onClick={() => addCalculatorValue("tan(")}>
                  tan
                </button>
                <button onClick={() => addCalculatorValue("log10(")}>
                  log
                </button>
              </div>

              <div className="calculator-actions">
                <button className="clear-button" onClick={clearCalculator}>
                  Clear
                </button>
                <button
                  className="primary-button"
                  onClick={calculateCalculator}
                >
                  Calculate
                </button>
              </div>

              {calcError && <div className="error-box">{calcError}</div>}

              {calcResult !== "" && (
                <div className="answer-box calculator-answer">
                  <span className="result-label">RESULT</span>
                  <h2>{calcResult}</h2>
                </div>
              )}
            </div>
          </section>
        )}

        {/* AI TUTOR */}
        {activePage === "AI Tutor" && (
          <section className="page-content">
            <div className="section-card tutor-card">
              <div className="large-icon">
                <BrainCircuit size={38} />
              </div>

              <h2>AI Physics & Mathematics Tutor</h2>
              <p className="muted-text">
                Ask a question about Physics or Mathematics.
              </p>

              <textarea
                className="question-input"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Example: Explain Newton's second law..."
              />

              <button className="primary-button" onClick={askTutor}>
                Ask Question <ArrowRight size={18} />
              </button>

              <p className="input-help">
                AI API connection will be added in a future development
                phase. This feature is currently a demo.
              </p>
            </div>
          </section>
        )}

        <footer className="footer">
          <FlaskConical size={17} />
          <span>PhysicsMath AI – Pi Edition</span>
          <span className="footer-right">Learn • Explore • Discover</span>
        </footer>
      </main>
    </div>
  );
}

export default App;