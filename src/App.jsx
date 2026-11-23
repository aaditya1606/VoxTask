import { useEffect, useState } from "react";
import "./App.css";

// Initial sample tasks
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
  // Task-related states
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = window.localStorage.getItem("voxtask_tasks");

      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);

        if (Array.isArray(parsedTasks)) {
          return parsedTasks;
        }
      }

      return sampleTasks;
    } catch (error) {
      console.error("Error loading tasks:", error);
      return sampleTasks;
    }
  });
  const [newTask, setNewTask] = useState("");
  const [message, setMessage] = useState("");

  // Editing-related states
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");

  // Filter-related state
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    try {
      window.localStorage.setItem("voxtask_tasks", JSON.stringify(tasks));
    } catch (error) {
      console.error("Error saving tasks:", error);
    }
  }, [tasks]);

  // Add a new task
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

    setTasks((previousTasks) => [task, ...previousTasks]);

    setNewTask("");
    setMessage("");
    setActiveFilter("all");
  }

  // Mark a task as completed or pending
  function handleToggleTask(taskId) {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  // Delete a task
  function handleDeleteTask(taskId) {
    setTasks((previousTasks) =>
      previousTasks.filter((task) => task.id !== taskId),
    );

    if (editingTaskId === taskId) {
      setEditingTaskId(null);
      setEditedTitle("");
    }
  }

  // Start editing a task
  function handleStartEdit(task) {
    setEditingTaskId(task.id);
    setEditedTitle(task.title);
  }

  // Save edited task
  function handleSaveEdit(taskId) {
    const updatedTitle = editedTitle.trim();

    if (updatedTitle === "") {
      return;
    }

    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === taskId ? { ...task, title: updatedTitle } : task,
      ),
    );

    setEditingTaskId(null);
    setEditedTitle("");
  }

  // Cancel editing
  function handleCancelEdit() {
    setEditingTaskId(null);
    setEditedTitle("");
  }

  // Filter tasks according to the selected category
  const filteredTasks = tasks.filter((task) => {
    switch (activeFilter) {
      case "pending":
        return task.completed === false;

      case "completed":
        return task.completed === true;

      case "all":
      default:
        return true;
    }
  });

  // Dynamic empty-state message
  function getEmptyMessage() {
    if (tasks.length === 0) {
      return "No tasks available. Add a new task to get started!";
    }

    if (activeFilter === "pending") {
      return "No pending tasks available!";
    }

    if (activeFilter === "completed") {
      return "No completed tasks available!";
    }

    return "No tasks available.";
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

        {/* Task list section */}
        <section className="tasks-section">
          <div className="section-heading">
            <div>
              <h2>Your tasks</h2>

              <p>Keep track of the things that matter.</p>
            </div>

            <span className="task-count">
              {filteredTasks.length}{" "}
              {filteredTasks.length === 1 ? "task" : "tasks"}
            </span>
          </div>

          {/* Task filters */}
          <div className="filters">
            <button
              type="button"
              className={`filter ${activeFilter === "all" ? "active" : ""}`}
              onClick={() => setActiveFilter("all")}
              aria-pressed={activeFilter === "all"}
            >
              All tasks
            </button>

            <button
              type="button"
              className={`filter ${activeFilter === "pending" ? "active" : ""}`}
              onClick={() => setActiveFilter("pending")}
              aria-pressed={activeFilter === "pending"}
            >
              Pending
            </button>

            <button
              type="button"
              className={`filter ${
                activeFilter === "completed" ? "active" : ""
              }`}
              onClick={() => setActiveFilter("completed")}
              aria-pressed={activeFilter === "completed"}
            >
              Completed
            </button>
          </div>

          {/* Task cards */}
          <div className="task-list">
            {filteredTasks.length === 0 ? (
              <p className="empty-state">{getEmptyMessage()}</p>
            ) : (
              filteredTasks.map((task) => (
                <div className="task-item" key={task.id}>
                  {/* Completion checkbox */}
                  <button
                    type="button"
                    className={`task-checkbox ${
                      task.completed ? "checked" : ""
                    }`}
                    onClick={() => handleToggleTask(task.id)}
                    aria-label={
                      task.completed
                        ? `Mark ${task.title} as pending`
                        : `Mark ${task.title} as completed`
                    }
                  >
                    {task.completed ? "✓" : ""}
                  </button>

                  {/* Task details and editing */}
                  <div className="task-details">
                    {editingTaskId === task.id ? (
                      <div className="edit-task-form">
                        <input
                          type="text"
                          className="edit-task-input"
                          value={editedTitle}
                          onChange={(event) =>
                            setEditedTitle(event.target.value)
                          }
                          autoFocus
                        />

                        <button
                          type="button"
                          className="save-edit-button"
                          onClick={() => handleSaveEdit(task.id)}
                        >
                          Save
                        </button>

                        <button
                          type="button"
                          className="cancel-edit-button"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className={task.completed ? "completed-text" : ""}>
                          {task.title}
                        </p>

                        <span>{task.category}</span>
                      </>
                    )}
                  </div>

                  {/* Priority */}
                  <span className={`priority ${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>

                  {/* Edit and Delete buttons */}
                  {editingTaskId !== task.id && (
                    <div className="task-actions">
                      <button
                        type="button"
                        className="edit-button"
                        onClick={() => handleStartEdit(task)}
                        aria-label={`Edit ${task.title}`}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="delete-button"
                        onClick={() => handleDeleteTask(task.id)}
                        aria-label={`Delete ${task.title}`}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <p>A little progress every day adds up.</p>

          <span>Made with focus by VoxTask</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
