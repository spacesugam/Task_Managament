const API_URL = '/api';
const API_KEY = 'my-secure-api-key-12345';
const HEADERS = {
    'Content-Type': 'application/json',
    'X-API-KEY': API_KEY
};

// State Management
let users = [];
let tasks = [];
let currentView = 'dashboard';

// DOM Elements
const views = {
    dashboard: document.getElementById('dashboardView'),
    tasks: document.getElementById('tasksView'),
    users: document.getElementById('usersView')
};

const navItems = document.querySelectorAll('.nav-links li');
const statElements = {
    todo: document.getElementById('statTodo'),
    progress: document.getElementById('statInProgress'),
    done: document.getElementById('statDone'),
    users: document.getElementById('statUsers')
};

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initEventListeners();
    refreshData();
});

function initEventListeners() {
    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            switchView(item.dataset.view);
        });
    });

    document.querySelectorAll('[data-view-btn]').forEach(btn => {
        btn.addEventListener('click', () => switchView(btn.dataset.viewBtn));
    });

    // Modals
    document.getElementById('btnAddTask').addEventListener('click', () => openTaskModal());
    document.getElementById('btnAddUser').addEventListener('click', () => openUserModal());
    document.getElementById('btnCloseTaskModal').addEventListener('click', closeModal);
    document.getElementById('btnCloseUserModal').addEventListener('click', closeModal);
    document.getElementById('modalOverlay').addEventListener('click', (e) => {
        if (e.target.id === 'modalOverlay') closeModal();
    });

    // Forms
    document.getElementById('taskForm').addEventListener('submit', handleTaskSubmit);
    document.getElementById('userForm').addEventListener('submit', handleUserSubmit);

    // Filters
    document.getElementById('filterStatus').addEventListener('change', fetchTasks);
    document.getElementById('filterPriority').addEventListener('change', fetchTasks);

    // Search
    document.getElementById('globalSearch').addEventListener('input', handleGlobalSearch);
}

// View Management
function switchView(viewName) {
    currentView = viewName;
    Object.keys(views).forEach(key => {
        views[key].classList.toggle('hidden', key !== viewName);
    });
    navItems.forEach(item => {
        item.classList.toggle('active', item.dataset.view === viewName);
    });
    refreshData();
}

// Data Fetching
async function refreshData() {
    await Promise.all([fetchUsers(), fetchTasks()]);
    updateStats();
    renderDashboard();
}

async function fetchUsers() {
    try {
        const response = await fetch(`${API_URL}/users?size=100`, { headers: HEADERS });
        const data = await response.json();
        users = data.content || [];
        renderUsers();
        updateAssignSelect();
    } catch (err) {
        showNotification('Error fetching users', 'error');
    }
}

async function fetchTasks() {
    try {
        const status = document.getElementById('filterStatus').value;
        const priority = document.getElementById('filterPriority').value;
        let url = `${API_URL}/tasks?size=100`;
        if (status) url += `&status=${status}`;
        if (priority) url += `&priority=${priority}`;

        const response = await fetch(url, { headers: HEADERS });
        const data = await response.json();
        tasks = data.content || [];
        renderTasks();
    } catch (err) {
        showNotification('Error fetching tasks', 'error');
    }
}

// Stats Update
function updateStats() {
    statElements.todo.innerText = tasks.filter(t => t.status === 'TODO').length;
    statElements.progress.innerText = tasks.filter(t => t.status === 'IN_PROGRESS').length;
    statElements.done.innerText = tasks.filter(t => t.status === 'DONE').length;
    statElements.users.innerText = users.length;
}

// Rendering
function renderDashboard() {
    const recentTasks = [...tasks].slice(0, 5);
    const recentUsers = [...users].slice(0, 5);

    const taskList = document.getElementById('recentTaskList');
    taskList.innerHTML = recentTasks.length ? '' : '<p class="text-muted text-center">No tasks found</p>';
    recentTasks.forEach(task => taskList.appendChild(createTaskCard(task, true)));

    const userList = document.getElementById('recentUserList');
    userList.innerHTML = recentUsers.length ? '' : '<p class="text-muted text-center">No users found</p>';
    recentUsers.forEach(user => userList.appendChild(createUserItem(user)));

    lucide.createIcons();
}

function renderTasks() {
    const grid = document.getElementById('fullTaskGrid');
    grid.innerHTML = '';
    tasks.forEach(task => grid.appendChild(createTaskCard(task)));
    lucide.createIcons();
}

function renderUsers() {
    const grid = document.getElementById('fullUserGrid');
    grid.innerHTML = '';
    users.forEach(user => grid.appendChild(createUserCard(user)));
    lucide.createIcons();
}

function createTaskCard(task, isCompact = false) {
    const div = document.createElement('div');
    div.className = isCompact ? 'task-item' : 'task-item vertical-task';
    div.innerHTML = `
        <div class="task-main">
            <div class="status-check ${task.status}" onclick="toggleTaskStatus(${task.id}, '${task.status}')"></div>
            <div class="task-details">
                <h4>${task.title}</h4>
                <div class="task-meta">
                    <span class="priority-tag priority-${task.priority}">${task.priority}</span>
                    ${task.assignedTo ? `<span><i data-lucide="user" style="width:12px"></i> ${task.assignedTo.name}</span>` : ''}
                </div>
            </div>
        </div>
        <div class="task-actions">
            <button class="btn-text" onclick="editTask(${task.id})"><i data-lucide="edit-3"></i></button>
            <button class="btn-text" style="color:var(--danger)" onclick="deleteTask(${task.id})"><i data-lucide="trash-2"></i></button>
        </div>
    `;
    return div;
}

function createUserItem(user) {
    const div = document.createElement('div');
    div.className = 'user-item';
    div.innerHTML = `
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}" class="user-avatar" alt="${user.name}">
        <div class="user-info">
            <h4>${user.name}</h4>
            <p>${user.email}</p>
        </div>
    `;
    return div;
}

function createUserCard(user) {
    const div = document.createElement('div');
    div.className = 'stat-card';
    div.style.flexDirection = 'column';
    div.style.alignItems = 'flex-start';
    div.innerHTML = `
        <div style="display:flex; align-items:center; gap:1rem; width:100%">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}" class="user-avatar" style="width:50px;height:50px">
            <div>
                <h4 style="font-size:1.1rem">${user.name}</h4>
                <p style="color:var(--text-muted); font-size:0.8rem">${user.email}</p>
            </div>
        </div>
    `;
    return div;
}

// Modal Actions
function openTaskModal(task = null) {
    const modal = document.getElementById('taskModal');
    const title = document.getElementById('taskModalTitle');
    const form = document.getElementById('taskForm');

    form.reset();
    document.getElementById('taskId').value = task ? task.id : '';
    title.innerText = task ? 'Edit Task' : 'Create Task';

    if (task) {
        document.getElementById('taskTitle').value = task.title;
        document.getElementById('taskDescription').value = task.description || '';
        document.getElementById('taskStatus').value = task.status;
        document.getElementById('taskPriority').value = task.priority;
        document.getElementById('taskDueDate').value = task.dueDate || '';
        document.getElementById('taskAssignedTo').value = task.assignedTo ? task.assignedTo.id : '';
    }

    document.getElementById('modalOverlay').classList.remove('hidden');
    modal.classList.remove('hidden');
}

function openUserModal() {
    document.getElementById('modalOverlay').classList.remove('hidden');
    document.getElementById('userModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modalOverlay').classList.add('hidden');
    document.getElementById('taskModal').classList.add('hidden');
    document.getElementById('userModal').classList.add('hidden');
}

// API Handlers
async function handleTaskSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('taskId').value;
    const body = {
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        status: document.getElementById('taskStatus').value,
        priority: document.getElementById('taskPriority').value,
        dueDate: document.getElementById('taskDueDate').value || null,
        assignedToId: document.getElementById('taskAssignedTo').value ? parseInt(document.getElementById('taskAssignedTo').value) : null
    };

    try {
        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_URL}/tasks/${id}` : `${API_URL}/tasks`;

        const response = await fetch(url, {
            method,
            headers: HEADERS,
            body: JSON.stringify(body)
        });

        if (response.ok) {
            showNotification(`Task ${id ? 'updated' : 'created'} successfully!`, 'success');
            closeModal();
            refreshData();
        } else {
            const err = await response.json();
            showNotification(err.message || 'Validation failed', 'error');
        }
    } catch (err) {
        showNotification('Operation failed', 'error');
    }
}

async function handleUserSubmit(e) {
    e.preventDefault();
    const body = {
        name: document.getElementById('userName').value,
        email: document.getElementById('userEmail').value
    };

    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: HEADERS,
            body: JSON.stringify(body)
        });

        if (response.ok) {
            showNotification('User created successfully!', 'success');
            closeModal();
            refreshData();
        } else {
            const err = await response.json();
            showNotification(err.message || 'Validation failed', 'error');
        }
    } catch (err) {
        showNotification('Operation failed', 'error');
    }
}

async function toggleTaskStatus(id, currentStatus) {
    const nextStatus = { 'TODO': 'IN_PROGRESS', 'IN_PROGRESS': 'DONE', 'DONE': 'TODO' }[currentStatus];
    try {
        await fetch(`${API_URL}/tasks/${id}/status`, {
            method: 'PATCH',
            headers: HEADERS,
            body: JSON.stringify({ status: nextStatus })
        });
        refreshData();
    } catch (err) {
        showNotification('Status update failed', 'error');
    }
}

async function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
        await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE', headers: HEADERS });
        showNotification('Task deleted', 'success');
        refreshData();
    } catch (err) {
        showNotification('Delete failed', 'error');
    }
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) openTaskModal(task);
}

// Helpers
function updateAssignSelect() {
    const select = document.getElementById('taskAssignedTo');
    const currentValue = select.value;
    select.innerHTML = '<option value="">Unassigned</option>';
    users.forEach(user => {
        const opt = document.createElement('option');
        opt.value = user.id;
        opt.innerText = user.name;
        select.appendChild(opt);
    });
    select.value = currentValue;
}

function handleGlobalSearch(e) {
    const term = e.target.value.toLowerCase();
    const results = document.getElementById('searchResults');

    if (!term) {
        results.classList.add('hidden');
        return;
    }

    const filteredTasks = tasks.filter(t => t.title.toLowerCase().includes(term));
    const filteredUsers = users.filter(u => u.name.toLowerCase().includes(term));

    if (filteredTasks.length || filteredUsers.length) {
        results.innerHTML = `
            ${filteredTasks.map(t => `<div class="search-item" onclick="editTask(${t.id})">Task: ${t.title}</div>`).join('')}
            ${filteredUsers.map(u => `<div class="search-item">User: ${u.name}</div>`).join('')}
        `;
        results.classList.remove('hidden');
    } else {
        results.classList.add('hidden');
    }
}

function showNotification(msg, type = 'success') {
    const container = document.getElementById('notificationContainer');
    const div = document.createElement('div');
    div.className = `notification ${type}`;
    div.innerHTML = `
        <i data-lucide="${type === 'success' ? 'check-circle' : 'alert-circle'}"></i>
        <span>${msg}</span>
    `;
    container.appendChild(div);
    lucide.createIcons();
    setTimeout(() => div.remove(), 3000);
}
