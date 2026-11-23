# 🎙️ VoxTask – Voice-Powered Task Manager

VoxTask is a simple and modern task management web application that helps users organize their daily activities through both manual input and voice-to-text functionality.

Instead of typing every task, users can speak into the microphone, convert their speech into text, review it, and add it to their task list.

Built using React and JavaScript, VoxTask focuses on making everyday task management easier and more convenient.

## 🚀 Live Demo

**Try VoxTask:** [https://vox-task.vercel.app/](https://vox-task.vercel.app/)

**GitHub Repository:** [aaditya1606/VoxTask](https://github.com/aaditya1606/VoxTask)

## ✨ Features

- **Voice-to-Text Input:** Convert spoken words into text using browser speech recognition.
- **Manual Task Creation:** Add tasks by typing.
- **Task Completion:** Mark tasks as completed or pending.
- **Edit Tasks:** Modify existing task titles.
- **Delete Tasks:** Remove unwanted tasks.
- **Task Filters:** View all tasks, pending tasks, or completed tasks.
- **LocalStorage Persistence:** Automatically save tasks in the browser so they remain available after refreshing.
- **Responsive Design:** Clean interface designed for desktop and mobile screens.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React | Building the user interface |
| JavaScript | Application functionality |
| Vite | Development server and build tool |
| CSS | Styling and responsive design |
| Web Speech API | Speech recognition |
| LocalStorage | Saving tasks in the browser |
| Git & GitHub | Version control and source code hosting |
| Vercel | Application deployment |

## 📂 Getting Started

Follow these instructions to run VoxTask locally.

### Prerequisites

- Node.js
- npm
- A modern browser

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/aaditya1606/VoxTask.git
```

**2. Navigate to the project folder**

```bash
cd VoxTask
```

**3. Install dependencies**

```bash
npm install
```

**4. Start the development server**

```bash
npm run dev
```

**5. Open the application**

Visit the local URL displayed in your terminal, usually:

```text
http://localhost:5173/
```

## 🎤 Using Voice Input

1. Open VoxTask in a supported browser.
2. Click the microphone button.
3. Allow microphone access when prompted.
4. Speak the task you want to add.
5. Review the converted text.
6. Click **Add Task** to save it.

The current voice recognition language is Indian English (`en-IN`).

Browser support for speech recognition varies. Some browsers use an online speech recognition service, so an internet connection may be required. Manual task entry remains available as a fallback.

## 💾 Data Storage

VoxTask uses browser LocalStorage to save tasks automatically.

This means:

- Tasks remain available after refreshing the page.
- Changes to tasks are saved automatically.
- Data is stored locally in the browser.
- Tasks are not synchronized between different devices or browsers.

Clearing the browser's site data can remove locally stored tasks.

## 📦 Production Build

To generate an optimized production build, run:

```bash
npm run build
```

To preview the production build locally, run:

```bash
npm run preview
```

To check code quality using ESLint, run:

```bash
npm run lint
```

## 🗺️ Future Improvements

Some features planned for future versions include:

- Smart voice commands for adding, editing and deleting tasks.
- Automatic priority detection.
- Task reminders and deadlines.
- Hindi and Hinglish voice support.
- AI-powered task interpretation.
- Improved productivity insights.

## 👨‍💻 Developer

**Aaditya Shakya**


GitHub: [@aaditya1606](https://github.com/aaditya1606)

---

Built with curiosity, code and a little bit of voice. 💜

**VoxTask – Say it. We'll save it.**