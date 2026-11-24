import { useEffect, useRef, useState } from "react";
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

// Detect the intention behind a voice command
function detectVoiceCommand(transcript) {
  const text = transcript
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.!?]+$/, "");

  // 1. Detect task-filter commands
  const filterMatch = text.match(
    /^(?:please\s+)?(?:show|display|view|list)(?:\s+me)?\s+(?:my\s+)?(all|pending|completed)(?:\s+tasks?)?$/i,
  );

  if (filterMatch) {
    return {
      intent: "show_tasks",
      filter: filterMatch[1].toLowerCase(),
    };
  }

  // 2. Detect task creation commands
  const addMatch = text.match(
    /^(?:please\s+)?(?:add|create)\s+(?:a\s+)?(?:new\s+)?task(?:\s+(?:to|called|named))?\s*[:,-]?\s*(.*)$/i,
  );

  if (addMatch) {
    const taskTitle = addMatch[1].trim();

    if (!taskTitle) {
      return {
        intent: "add_task_missing_title",
      };
    }

    return {
      intent: "add_task",
      taskTitle: taskTitle,
    };
  }

  // 3. Detect task-completion commands
  const markMatch = text.match(
    /^(?:please\s+)?(?:mark|set)\s+(?:the\s+)?(.+?)\s+(?:as\s+)?(?:completed|complete|done)$/i,
  );

  if (markMatch) {
    return {
      intent: "complete_task",
      taskTitle: markMatch[1].trim(),
    };
  }

  const completeMatch = text.match(
    /^(?:please\s+)?(?:complete|finish)\s+(?:the\s+)?(?:task\s+)?(.+)$/i,
  );

  if (completeMatch) {
    return {
      intent: "complete_task",
      taskTitle: completeMatch[1].trim(),
    };
  }

  // 4. Detect task-deletion commands
  const deleteMatch = text.match(
    /^(?:please\s+)?(?:delete|remove)\s+(?:(?:the|my)\s+)?(?:task\s+)?(.+)$/i,
  );

  if (deleteMatch) {
    return {
      intent: "delete_task",
      taskTitle: deleteMatch[1].trim(),
    };
  }

  // 5. Unknown command
  return {
    intent: "unknown",
    originalText: text,
  };
}

function App() {
  // Task-related states
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = window.localStorage.getItem("voxtask_tasks");

      if (savedTasks !== null) {
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

  // Voice recognition states
  const [isListening, setIsListening] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState("");
  const recognitionRef = useRef(null);

  // Save tasks automatically in LocalStorage
  useEffect(() => {
    try {
      window.localStorage.setItem("voxtask_tasks", JSON.stringify(tasks));
    } catch (error) {
      console.error("Error saving tasks:", error);
    }
  }, [tasks]);

  // Clean up speech recognition when the component unmounts
  useEffect(() => {
    return () => {
      const recognition = recognitionRef.current;

      if (recognition) {
        recognition.onend = null;
        recognition.onerror = null;

        try {
          recognition.abort();
        } catch (error) {
          console.error("Speech cleanup error:", error);
        }

        recognitionRef.current = null;
      }
    };
  }, []);

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
    setVoiceMessage("");
    setActiveFilter("all");
  }
  // Add task directly through voice command
  function handleVoiceAddTask(taskTitle) {
    const title = taskTitle.trim();

    if (!title) {
      setVoiceMessage("Please provide a task title.");
      return;
    }

    const task = {
      id: Date.now(),
      title: title,
      category: "General",
      priority: "Medium",
      completed: false,
    };

    setTasks((previousTasks) => [task, ...previousTasks]);

    setNewTask("");
    setMessage("");
    setActiveFilter("all");

    setVoiceMessage(`Task added successfully: ${title}`);
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

  // Voice-to-text functionality
  function handleVoiceInput() {
    // Stop recognition if it is already active
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setVoiceMessage("Stopping voice input...");
      } catch (error) {
        console.error("Error stopping recognition:", error);

        recognitionRef.current = null;
        setIsListening(false);
        setVoiceMessage("Unable to stop microphone. Please try again.");
      }

      return;
    }

    // Check secure context
    if (!window.isSecureContext) {
      setVoiceMessage("Voice recognition requires HTTPS or localhost.");
      return;
    }

    // Check browser support
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceMessage(
        "Speech recognition is not supported in this browser. Please use Chrome or Edge, or type your task manually.",
      );
      return;
    }

    let recognition;

    try {
      // Create recognition instance
      recognition = new SpeechRecognition();

      recognitionRef.current = recognition;

      // Recognition settings
      recognition.lang = "en-IN";
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      // When listening starts
      recognition.onstart = () => {
        setIsListening(true);
        setVoiceMessage("Listening... Speak your task.");
      };

      // When speech is converted into text

      recognition.onresult = (event) => {
        const result = event.results?.[event.resultIndex] || event.results?.[0];

        const transcript = result?.[0]?.transcript?.trim() || "";

        if (!transcript) {
          setVoiceMessage("No clear speech detected. Please try again.");
          return;
        }

        // Detect the user's intention
        const command = detectVoiceCommand(transcript);

        // Display results in browser console
        console.log("Recognized Speech:", transcript);
        console.log("Detected Command:", command);

        setMessage("");

        // Handle the detected intent for now
        switch (command.intent) {
          case "add_task":
            handleVoiceAddTask(command.taskTitle);
            break;

          case "add_task_missing_title":
            setVoiceMessage(
              "Add-task command detected, but the task title is missing.",
            );
            break;

          case "complete_task":
            setVoiceMessage(
              `Complete task detected: "${command.taskTitle}". Action not executed yet.`,
            );
            break;

          case "delete_task":
            setVoiceMessage(
              `Delete task detected: "${command.taskTitle}". Action not executed yet.`,
            );
            break;

          case "show_tasks":
            setVoiceMessage(
              `Show ${command.filter} tasks command detected. Action not executed yet.`,
            );
            break;

          default:
            setNewTask(transcript);
            setVoiceMessage(
              "No supported command detected. You can still add this text manually.",
            );
        }
      };

      // Handle recognition errors
      recognition.onerror = (event) => {
        const errorCode = event.error || "unknown";

        console.error("Speech Recognition Error:", {
          error: errorCode,
          message: event.message,
        });

        const errorMessages = {
          "not-allowed":
            "Microphone permission denied. Allow microphone access in Chrome settings.",

          "service-not-allowed":
            "The browser has blocked its speech recognition service.",

          "no-speech": "No speech detected. Please try speaking again.",

          "audio-capture":
            "Microphone not found. Check your microphone connection.",

          network:
            "The browser could not reach its speech recognition service. Check your internet connection, VPN or firewall. You can still type your task manually.",

          aborted: "Voice recognition was interrupted. Please try again.",

          "language-not-supported":
            "The selected recognition language is not supported. Try en-IN or en-US.",
        };

        setVoiceMessage(
          errorMessages[errorCode] || `Speech recognition error: ${errorCode}`,
        );

        setIsListening(false);

        if (recognitionRef.current === recognition) {
          recognitionRef.current = null;
        }
      };

      // When listening ends
      recognition.onend = () => {
        setIsListening(false);

        if (recognitionRef.current === recognition) {
          recognitionRef.current = null;
        }
      };

      // Start recognition
      setVoiceMessage("Starting microphone...");

      recognition.start();
    } catch (error) {
      // Correctly handle synchronous JavaScript/API errors
      console.error("Unable to start Speech Recognition:", error);

      if (recognitionRef.current === recognition) {
        recognitionRef.current = null;
      }

      setIsListening(false);

      if (error.name === "NotAllowedError") {
        setVoiceMessage(
          "Microphone permission was denied. Allow access in browser settings.",
        );
      } else if (error.name === "InvalidStateError") {
        setVoiceMessage("Microphone is already active. Please try again.");
      } else {
        setVoiceMessage(
          `Unable to start microphone: ${error.message || error.name || "Unknown error"}`,
        );
      }
    }
  }

  // Filter tasks according to selected category
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
            <button
              type="button"
              className={`mic-button ${isListening ? "listening" : ""}`}
              onClick={handleVoiceInput}
              aria-label={
                isListening ? "Stop voice input" : "Start voice input"
              }
              aria-pressed={isListening}
            >
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
            </button>

            <span>
              {isListening
                ? "Listening... Tap to stop"
                : "Tap to start speaking"}
            </span>
          </div>
        </section>

        {/* Voice feedback */}
        {voiceMessage && (
          <p className="voice-message" role="status">
            {voiceMessage}
          </p>
        )}

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
                setVoiceMessage("");
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
