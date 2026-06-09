/**
 * TaskFlow — script.js
 * Modern Minimalist To-Do App
 * Vanilla JS · No dependencies · LocalStorage persisted
 */

'use strict';

/* ============================================================
   STATE
   ============================================================ */
let tasks = [];
let currentFilter = 'all';
let searchQuery = '';
let editingId = null;

/* ============================================================
   DOM REFERENCES
   ============================================================ */
const taskInput        = document.getElementById('task-input');
const addTaskBtn       = document.getElementById('add-task-btn');
const taskList         = document.getElementById('task-list');
const emptyState       = document.getElementById('empty-state');
const emptyTitle       = document.getElementById('empty-title');
const emptyDesc        = document.getElementById('empty-desc');
const searchInput      = document.getElementById('search-input');
const clearSearchBtn   = document.getElementById('clear-search');
const filterBtns       = document.querySelectorAll('.filter-btn');
const clearCompletedBtn= document.getElementById('clear-completed-btn');
const darkToggle       = document.getElementById('dark-mode-toggle');
const iconMoon         = document.getElementById('icon-moon');
const iconSun          = document.getElementById('icon-sun');
const editModal        = document.getElementById('edit-modal');
const editInput        = document.getElementById('edit-input');
const saveEditBtn      = document.getElementById('save-edit');
const cancelEditBtn    = document.getElementById('cancel-edit');
const countTotal       = document.getElementById('count-total');
const countActive      = document.getElementById('count-active');
const countDone        = document.getElementById('count-done');
const yearSpan         = document.getElementById('year');

/* ============================================================
   INIT
   ============================================================ */
function init() {
  loadFromStorage();
  applyTheme(getSavedTheme());
  yearSpan.textContent = new Date().getFullYear();
  render();
  bindEvents();
}

/* ============================================================
   LOCAL STORAGE
   ============================================================ */
function loadFromStorage() {
  try {
    const stored = localStorage.getItem('taskflow_tasks');
    tasks = stored ? JSON.parse(stored) : [];
  } catch {
    tasks = [];
  }
}

function saveToStorage() {
  try {
    localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
  } catch {
    showToast('Could not save tasks. Storage may be full.', 'error');
  }
}

function getSavedTheme() {
  return localStorage.getItem('taskflow_theme') || 'light';
}

function saveTheme(theme) {
  localStorage.setItem('taskflow_theme', theme);
}

/* ============================================================
   THEME
   ============================================================ */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  if (theme === 'dark') {
    iconMoon.style.display = 'none';
    iconSun.style.display  = 'block';
  } else {
    iconMoon.style.display = 'block';
    iconSun.style.display  = 'none';
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  saveTheme(next);
  showToast(`${next === 'dark' ? 'Dark' : 'Light'} mode enabled`, 'info');
}

/* ============================================================
   TASK CRUD
   ============================================================ */
function generateId() {
  return `task_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function addTask(text) {
  const trimmed = text.trim();
  if (!trimmed) {
    showToast('Please enter a task.', 'warning');
    taskInput.focus();
    return;
  }
  if (trimmed.length > 200) {
    showToast('Task is too long (max 200 chars).', 'error');
    return;
  }

  const task = {
    id: generateId(),
    text: trimmed,
    completed: false,
    createdAt: Date.now(),
  };

  tasks.unshift(task);
  saveToStorage();
  taskInput.value = '';
  taskInput.focus();
  render();
  showToast('Task added!', 'success');
}

function deleteTask(id) {
  const item = document.querySelector(`[data-id="${id}"]`);
  if (item) {
    item.classList.add('removing');
    setTimeout(() => {
      tasks = tasks.filter(t => t.id !== id);
      saveToStorage();
      render();
    }, 280);
  } else {
    tasks = tasks.filter(t => t.id !== id);
    saveToStorage();
    render();
  }
  showToast('Task deleted.', 'info');
}

function toggleTask(id) {
  tasks = tasks.map(t =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  saveToStorage();
  render();
}

function startEdit(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  editingId = id;
  editInput.value = task.text;
  openModal();
  setTimeout(() => {
    editInput.focus();
    editInput.select();
  }, 60);
}

function saveEdit() {
  const trimmed = editInput.value.trim();
  if (!trimmed) {
    showToast('Task cannot be empty.', 'warning');
    editInput.focus();
    return;
  }
  tasks = tasks.map(t =>
    t.id === editingId ? { ...t, text: trimmed } : t
  );
  saveToStorage();
  closeModal();
  render();
  showToast('Task updated!', 'success');
}

function clearCompleted() {
  const count = tasks.filter(t => t.completed).length;
  if (!count) {
    showToast('No completed tasks to clear.', 'info');
    return;
  }
  tasks = tasks.filter(t => !t.completed);
  saveToStorage();
  render();
  showToast(`Cleared ${count} completed task${count > 1 ? 's' : ''}.`, 'success');
}

/* ============================================================
   FILTER & SEARCH
   ============================================================ */
function getFilteredTasks() {
  let filtered = [...tasks];

  // Apply filter
  if (currentFilter === 'active')    filtered = filtered.filter(t => !t.completed);
  if (currentFilter === 'completed') filtered = filtered.filter(t =>  t.completed);

  // Apply search
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(t => t.text.toLowerCase().includes(q));
  }

  return filtered;
}

function setFilter(filter) {
  currentFilter = filter;
  filterBtns.forEach(btn => {
    const isActive = btn.dataset.filter === filter;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });
  render();
}

function highlightText(text, query) {
  if (!query) return escapeHtml(text);
  const escaped = escapeHtml(text);
  const escapedQuery = escapeHtml(query);
  const regex = new RegExp(`(${escapedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return escaped.replace(regex, '<mark>$1</mark>');
}

/* ============================================================
   RENDER
   ============================================================ */
function render() {
  const filtered = getFilteredTasks();

  // Update counters
  const totalCount  = tasks.length;
  const activeCount = tasks.filter(t => !t.completed).length;
  const doneCount   = tasks.filter(t =>  t.completed).length;
  countTotal.textContent  = totalCount;
  countActive.textContent = activeCount;
  countDone.textContent   = doneCount;

  // Render task items
  taskList.innerHTML = '';

  if (filtered.length === 0) {
    emptyState.style.display = 'flex';
    taskList.style.display   = 'none';
    if (!tasks.length) {
      emptyTitle.textContent = 'No tasks yet';
      emptyDesc.textContent  = 'Add your first task above to get started.';
    } else if (searchQuery) {
      emptyTitle.textContent = 'No matching tasks';
      emptyDesc.textContent  = `No tasks match "${searchQuery}". Try a different search.`;
    } else {
      emptyTitle.textContent = currentFilter === 'active' ? 'No active tasks' : 'No completed tasks';
      emptyDesc.textContent  = currentFilter === 'active'
        ? 'All your tasks are completed — great job!'
        : 'Complete some tasks to see them here.';
    }
    return;
  }

  emptyState.style.display = 'none';
  taskList.style.display   = 'block';

  filtered.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item${task.completed ? ' completed' : ''}${searchQuery ? ' search-highlight' : ''}`;
    li.setAttribute('data-id', task.id);
    li.setAttribute('role', 'listitem');

    const highlightedText = highlightText(task.text, searchQuery);

    li.innerHTML = `
      <input
        type="checkbox"
        class="task-checkbox"
        aria-label="Mark '${escapeHtml(task.text)}' as ${task.completed ? 'active' : 'complete'}"
        ${task.completed ? 'checked' : ''}
      />
      <span class="task-text" title="${escapeHtml(task.text)}">${highlightedText}</span>
      <div class="task-actions" role="group" aria-label="Task actions">
        <button
          class="task-action-btn edit-btn"
          aria-label="Edit task: ${escapeHtml(task.text)}"
          title="Edit"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button
          class="task-action-btn delete-btn"
          aria-label="Delete task: ${escapeHtml(task.text)}"
          title="Delete"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/>
            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
          </svg>
        </button>
      </div>
    `;

    // Bind item events
    const checkbox  = li.querySelector('.task-checkbox');
    const editBtn   = li.querySelector('.edit-btn');
    const deleteBtn = li.querySelector('.delete-btn');

    checkbox.addEventListener('change', () => toggleTask(task.id));
    editBtn.addEventListener('click', () => startEdit(task.id));
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    taskList.appendChild(li);
  });
}

/* ============================================================
   MODAL
   ============================================================ */
function openModal() {
  editModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  editModal.style.display = 'none';
  document.body.style.overflow = '';
  editingId = null;
}

/* ============================================================
   TOAST
   ============================================================ */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<span class="toast-dot"></span><span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hiding');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  }, 2800);
}

/* ============================================================
   UTILITIES
   ============================================================ */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

/* ============================================================
   EVENT BINDING
   ============================================================ */
function bindEvents() {
  // Add task
  addTaskBtn.addEventListener('click', () => addTask(taskInput.value));
  taskInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') addTask(taskInput.value);
  });

  // Search
  searchInput.addEventListener('input', e => {
    searchQuery = e.target.value;
    clearSearchBtn.style.display = searchQuery ? 'flex' : 'none';
    render();
  });
  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    clearSearchBtn.style.display = 'none';
    searchInput.focus();
    render();
  });

  // Filters
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => setFilter(btn.dataset.filter));
  });

  // Clear completed
  clearCompletedBtn.addEventListener('click', clearCompleted);

  // Dark mode
  darkToggle.addEventListener('click', toggleTheme);

  // Edit modal
  saveEditBtn.addEventListener('click', saveEdit);
  cancelEditBtn.addEventListener('click', closeModal);
  editInput.addEventListener('keydown', e => {
    if (e.key === 'Enter')  saveEdit();
    if (e.key === 'Escape') closeModal();
  });

  // Close modal on backdrop click
  editModal.addEventListener('click', e => {
    if (e.target === editModal) closeModal();
  });

  // Global keyboard shortcuts
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && editModal.style.display !== 'none') closeModal();
    // Ctrl/Cmd + K → focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    }
  });
}

/* ============================================================
   BOOT
   ============================================================ */
document.addEventListener('DOMContentLoaded', init);
