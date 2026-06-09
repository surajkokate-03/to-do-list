# TaskFlow — Web Application To-Do Lists

> A modern, minimal to-do list app built with pure HTML, CSS, and Vanilla JavaScript. No frameworks, no dependencies, just clean code.

![TaskFlow Preview](https://via.placeholder.com/800x450/7FBF6A/FFFFFF?text=TaskFlow+Preview)

---

## ✨ Features

| Feature | Details |
|---|---|
| ✅ Add Tasks | Type and press Enter or click "Add Task" |
| ✏️ Edit Tasks | Click the pencil icon; save with Enter or button |
| 🗑️ Delete Tasks | Click the trash icon per task |
| ☑️ Complete Tasks | Custom-styled checkbox to mark done |
| 🔢 Task Counter | Live counts for Total, Active, Done |
| 🔍 Search | Real-time search with keyword highlight |
| 🗂️ Filter | All / Active / Completed tabs |
| 🧹 Clear Completed | One-click bulk removal |
| 🌙 Dark Mode | Smooth toggle, preference saved |
| 💾 LocalStorage | Tasks and theme persist after refresh |
| 🔔 Toast Alerts | Success, info, warning, error notifications |
| 📱 Responsive | Mobile-first, works from 360 px up |
| ♿ Accessible | ARIA labels, keyboard navigation, focus rings |
| ⌨️ Keyboard | `Enter` to add/save · `Esc` to dismiss · `Ctrl+K` to search |

---

## 🖼️ Screenshots

> _Add screenshots here after deployment._

```
screenshots/
  light-mode.png
  dark-mode.png
  mobile.png
```

---

## 🗂️ Project Structure

```
todo-app/
├── index.html   # Semantic HTML5 markup
├── style.css    # CSS custom properties, animations, responsive
├── script.js    # Vanilla JS — state, CRUD, LocalStorage
└── README.md    # This file
```

---

## 🚀 Installation & Local Development

No build step required.

```bash
# 1. Clone the repo
git clone https://github.com/your-username/taskflow-todo.git

# 2. Open in browser
cd taskflow-todo
open index.html
# or drag index.html into any modern browser
```

For live-reload during development:

```bash
# Using VS Code Live Server extension (recommended)
# Right-click index.html → "Open with Live Server"

# Or using Python's built-in server
python3 -m http.server 8080
# then visit http://localhost:8080
```

---

## 🌐 GitHub Pages Deployment

1. Push the project to a GitHub repository.

2. Go to **Settings → Pages**.

3. Under **Source**, select **Deploy from a branch**.

4. Choose `main` branch and `/ (root)` folder.

5. Click **Save**. Your site will be live at:
   ```
   https://your-username.github.io/taskflow-todo/
   ```

> The project uses no server-side code and works directly on GitHub Pages.

---

## 🛠️ Tech Stack

- **HTML5** — Semantic markup, ARIA roles
- **CSS3** — Custom properties, Grid, Flexbox, animations
- **Vanilla JS** — ES6+, no dependencies
- **Google Fonts** — Inter (loaded from CDN)

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Enter` (in task input) | Add task |
| `Enter` (in edit modal) | Save changes |
| `Escape` | Close modal |
| `Ctrl + K` / `Cmd + K` | Focus search |

---

## 🎨 Design Tokens

| Token | Value |
|---|---|
| Accent | `#7FBF6A` |
| Accent Dark | `#5EA34F` |
| Border Radius | `10px – 32px` |
| Font | Inter |

---

## 📝 License

MIT — free to use, fork, and build upon.
