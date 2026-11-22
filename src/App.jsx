import { useState } from "react";
import "./App.css";

const sampleTasks = [
  {
    id: 1,
    title: "Complete C++ assignment",
    category: "Study",
    priority: "High",
    completed: false,
  },
  {
    id: 2,
    title: "Revise Engineering Mathematics",
    category: "Study",
    priority: "Medium",
    completed: false,
  },
  {
    id: 3,
    title: "Update GitHub README",
    category: "Personal",
    priority: "Low",
    completed: true,
  },
];

function App() {
  const [tasks, setTasks] = useState(sampleTasks);
  const [newTask, setNewTask] = useState("");
  const [message, setMessage] = useState("");

  function handleAddTask(event) {
    event.preventDefault();

    const taskTitle = newTask.trim();

    if (taskTitle === "") {
      setMessage("Please enter a task first.");
      return;
    }

    const task = {
      id: Date.now(),
      title: taskTitle,
      category: "General",
      priority: "Medium",
      completed: false,
    };

    setTasks([task, ...tasks]);
    setNewTask("");
    setMessage("");
  }
  function handleToggleTask(taskId) {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  }
  return (
    <div className="app">
      {/* Navigation */}
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <h2>VoxTask</h2>
        </div>

        <div className="profile">
          <span className="profile-dot"></span>
          <span>My Workspace</span>
        </div>
      </header>

      <main className="container">
        {/* Welcome section */}
        <section className="welcome">
          <div>
            <p className="eyebrow">YOUR PERSONAL TASK SPACE</p>
            <h1>Make space for what matters.</h1>
            <p className="subtitle">Organize your day, one task at a time.</p>
          </div>

          <div className="date-label">
            <span>✦</span> A fresh start
          </div>
        </section>

        {/* Voice input section */}
        <section className="voice-card">
          <div className="voice-content">
            <p className="eyebrow">VOICE ASSISTANT</p>
            <h2>Say it. We'll save it.</h2>
            <p>
              Capture your thoughts and turn them into tasks using your voice.
            </p>
          </div>

          <div className="voice-action">
            <div className="mic-button">
              <svg
                viewBox="0 0 24 24"
                width="29"
                height="29"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="2" width="6" height="13" rx="3" />
                <path d="M5 10a7 7 0 0 0 14 0" />
                <path d="M12 17v5" />
                <path d="M8 22h8" />
              </svg>
            </div>
            <span>Tap to start speaking</span>
          </div>
        </section>

        {/* Manual task input */}
        <div className="task-entry">
          <form className="add-task" onSubmit={handleAddTask}>
            <div className="input-icon">+</div>

            <input
              type="text"
              className="task-input"
              placeholder="Add a task manually..."
              value={newTask}
              onChange={(event) => {
                setNewTask(event.target.value);
                setMessage("");
              }}
            />

            <button type="submit" className="add-button">
              Add task
            </button>
          </form>

          {message && <p className="input-message">{message}</p>}
        </div>

        {/* Task list */}
        <section className="tasks-section">
          <div className="section-heading">
            <div>
              <h2>Your tasks</h2>
              <p>Keep track of the things that matter.</p>
            </div>

            <span className="task-count">
              {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
            </span>
          </div>

          {/* Task filters */}
          <div className="filters">
            <span className="filter active">All tasks</span>
            <span className="filter">Pending</span>
            <span className="filter">Completed</span>
          </div>

          {/* Task cards */}
          <div className="task-list">
            {tasks.map((task) => (
              <div className="task-item" key={task.id}>
                <button
                  type="button"
                  className={`task-checkbox ${task.completed ? "checked" : ""}`}
                  onClick={() => handleToggleTask(task.id)}
                  aria-label={
                    task.completed ? "Mark as pending" : "Mark as completed"
                  }
                >
                  {task.completed ? "✓" : ""}
                </button>

                <div className="task-details">
                  <p className={task.completed ? "completed-text" : ""}>
                    {task.title}
                  </p>
                  <span>{task.category}</span>
                </div>

                <span className={`priority ${task.priority.toLowerCase()}`}>
                  {task.priority}
                </span>

                <div className="task-menu">•••</div>
              </div>
            ))}
          </div>
        </section>

        <footer className="footer">
          <p>A little progress every day adds up.</p>
          <span>Made with focus by VoxTask</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
