const API_BASE = "https://crm-project-w8j1.onrender.com";

const state = {
  isAuthenticated: false,
  token: null,
  currentUser: null,
  role: "superAdmin",
  activeView: "dashboard",
  leads: [],
  employees: [],
  documents: [],
  users: [],
  activityLogs: [],
};

const api = {
  async request(method, path, body = null) {
    const headers = { "Content-Type": "application/json" };
    if (state.token) headers["Authorization"] = `Bearer ${state.token}`;
    const opts = { method, headers };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(`${API_BASE}${path}`, opts);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Request failed");
    return data;
  },
  get: (path) => api.request("GET", path),
  post: (path, body) => api.request("POST", path, body),
  put: (path, body) => api.request("PUT", path, body),
  delete: (path) => api.request("DELETE", path),
};

const views = {
  dashboard: { title: "Dashboard", subtitle: "Real-time snapshot of CRM operations" },
  leads: { title: "Lead Management", subtitle: "Track lead lifecycle with advanced controls" },
  employees: { title: "Employee Directory", subtitle: "Manage personnel onboarding and performance visibility" },
  documents: { title: "Document Vault", subtitle: "Centralized repository for secure file metadata" },
  userManagement: { title: "User Management", subtitle: "Super Admin panel for administrator access control" },
  reports: { title: "Reports & Audit", subtitle: "System governance, intelligence, and access transparency" },
};

const navButtons = Array.from(document.querySelectorAll(".nav-btn"));
const allViewElements = Array.from(document.querySelectorAll(".view"));
const loginPage = document.getElementById("loginPage");
const appShell = document.getElementById("appShell");
const pageTitle = document.getElementById("pageTitle");
const pageSubtitle = document.getElementById("pageSubtitle");
const roleSelect = document.getElementById("roleSelect");
const leadTableBody = document.getElementById("leadTableBody");
const employeeTableBody = document.getElementById("employeeTableBody");
const documentStatsGrid = document.getElementById("documentStatsGrid");
const documentGrid = document.getElementById("documentGrid");
const documentSearch = document.getElementById("documentSearch");
const documentCategoryFilter = document.getElementById("documentCategoryFilter");
const documentEmptyState = document.getElementById("documentEmptyState");
const userStatsGrid = document.getElementById("userStatsGrid");
const userSearch = document.getElementById("userSearch");
const userTableBody = document.getElementById("userTableBody");
const statsGrid = document.getElementById("statsGrid");
const leadFunnel = document.getElementById("leadFunnel");
const activityLog = document.getElementById("activityLog");
const quickAnalytics = document.getElementById("quickAnalytics");

const leadStatusFilter = document.getElementById("leadStatusFilter");
const leadSourceFilter = document.getElementById("leadSourceFilter");
const leadAssigneeFilter = document.getElementById("leadAssigneeFilter");
const leadSearch = document.getElementById("leadSearch");

const modalOverlay = document.getElementById("modalOverlay");
const modalTitle = document.getElementById("modalTitle");
const dynamicForm = document.getElementById("dynamicForm");
const closeModalBtn = document.getElementById("closeModalBtn");

const switchAccountBtn = document.getElementById("switchAccountBtn");
const loginPageForm = document.getElementById("loginPageForm");
const logoutBtn = document.getElementById("logoutBtn");
const loginRole = document.getElementById("loginRole");

const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");

function addActivity(message) {
  state.activityLogs.unshift(message);
  state.activityLogs = state.activityLogs.slice(0, 20);
}

async function loadData() {
  try {
    const [leads, employees, documents] = await Promise.all([
      api.get("/leads"),
      api.get("/employees"),
      api.get("/documents"),
    ]);
    state.leads = leads;
    state.employees = employees;
    state.documents = documents;

    if (state.role === "superAdmin") {
      try {
        state.users = await api.get("/users");
      } catch {
        state.users = [];
      }
    }
  } catch (error) {
    console.error("Failed to load data:", error);
  }
}

function getBadgeClass(status) {
  const normalized = status.toLowerCase();
  if (normalized === "in-progress") return "progress";
  return normalized;
}

function hasAccess(moduleName) {
  const adminBlocked = ["reports", "userManagement"];
  if (state.role === "admin") {
    return !adminBlocked.includes(moduleName);
  }
  return true;
}

function renderDashboard() {
  const totalLeads = state.leads.length;
  const activeStaff = state.employees.filter((emp) => emp.status === "Active").length;
  const convertedLeads = state.leads.filter((lead) => lead.status === "Converted").length;
  const conversionRate = totalLeads ? Math.round((convertedLeads / totalLeads) * 100) : 0;

  const stats = [
    { label: "Total Leads", value: totalLeads },
    { label: "Active Staff", value: activeStaff },
    { label: "Converted Leads", value: convertedLeads },
    { label: "Conversion Rate", value: `${conversionRate}%` },
  ];

  statsGrid.innerHTML = stats
    .map(
      (item) => `
      <article class="stat">
        <small>${item.label}</small>
        <h4>${item.value}</h4>
      </article>
    `
    )
    .join("");

  const stages = ["New", "In-Progress", "Converted", "Rejected"];
  leadFunnel.innerHTML = stages
    .map((stage) => {
      const count = state.leads.filter((lead) => lead.status === stage).length;
      return `<div class="funnel-item"><span>${stage}</span><strong>${count}</strong></div>`;
    })
    .join("");

  activityLog.innerHTML = state.activityLogs
    .slice(0, 6)
    .map((log) => `<li>${log}</li>`)
    .join("");

  quickAnalytics.innerHTML = `
    <div class="analytics-item"><span>Total Documents</span><strong>${state.documents.length}</strong></div>
    <div class="analytics-item"><span>Inactive Employees</span><strong>${state.employees.filter((emp) => emp.status === "Inactive").length}</strong></div>
    <div class="analytics-item"><span>Lead Sources</span><strong>${new Set(state.leads.map((lead) => lead.source).filter(Boolean)).size}</strong></div>
  `;
}

function renderLeadFilters() {
  const statuses = ["all", ...new Set(state.leads.map((lead) => lead.status))];
  const sources = ["all", ...new Set(state.leads.map((lead) => lead.source).filter(Boolean))];
  const assignees = ["all", ...new Set(state.leads.map((lead) => lead.assignedTo).filter(Boolean))];

  const currentStatus = leadStatusFilter.value || "all";
  const currentSource = leadSourceFilter.value || "all";
  const currentAssignee = leadAssigneeFilter.value || "all";

  leadStatusFilter.innerHTML = statuses
    .map((status) => `<option value="${status}" ${status === currentStatus ? "selected" : ""}>${status}</option>`)
    .join("");
  leadSourceFilter.innerHTML = sources
    .map((source) => `<option value="${source}" ${source === currentSource ? "selected" : ""}>${source}</option>`)
    .join("");
  leadAssigneeFilter.innerHTML = assignees
    .map((assignee) => `<option value="${assignee}" ${assignee === currentAssignee ? "selected" : ""}>${assignee}</option>`)
    .join("");
}

function getFilteredLeads() {
  const status = leadStatusFilter.value;
  const source = leadSourceFilter.value;
  const assignee = leadAssigneeFilter.value;
  const search = leadSearch.value.trim().toLowerCase();

  return state.leads.filter((lead) => {
    const statusMatch = status === "all" || lead.status === status;
    const sourceMatch = source === "all" || lead.source === source;
    const assigneeMatch = assignee === "all" || lead.assignedTo === assignee;
    const searchMatch =
      !search ||
      (lead.clientName && lead.clientName.toLowerCase().includes(search)) ||
      (lead.email && lead.email.toLowerCase().includes(search));

    return statusMatch && sourceMatch && assigneeMatch && searchMatch;
  });
}

function renderLeadTable() {
  const leads = getFilteredLeads();
  leadTableBody.innerHTML = leads
    .map(
      (lead) => `
      <tr>
        <td>${lead.clientName || ""}</td>
        <td>${lead.phone || ""}</td>
        <td>${lead.email || ""}</td>
        <td>${lead.source || ""}</td>
        <td><span class="badge ${getBadgeClass(lead.status)}">${lead.status}</span></td>
        <td>${lead.assignedTo || ""}</td>
        <td>
          <button class="action-btn edit-lead" data-id="${lead._id}">Edit</button>
          <button class="action-btn delete-lead" data-id="${lead._id}">Delete</button>
        </td>
      </tr>
    `
    )
    .join("");
}

function renderEmployeeTable() {
  employeeTableBody.innerHTML = state.employees
    .map(
      (emp) => `
      <tr>
        <td>${emp.name}</td>
        <td>${emp.email}</td>
        <td>${emp.role}</td>
        <td>${emp.joiningDate ? new Date(emp.joiningDate).toISOString().slice(0, 10) : ""}</td>
        <td>${emp.status}</td>
        <td>
          <button class="action-btn toggle-employee" data-id="${emp._id}">
            ${emp.status === "Active" ? "Deactivate" : "Activate"}
          </button>
          <button class="action-btn delete-employee" data-id="${emp._id}">Delete</button>
        </td>
      </tr>
    `
    )
    .join("");
}

function getFilteredDocuments() {
  const query = documentSearch.value.trim().toLowerCase();
  const category = documentCategoryFilter.value;
  return state.documents.filter((doc) => {
    const matchesCategory = category === "all" || doc.category === category;
    const matchesQuery =
      !query ||
      (doc.name && doc.name.toLowerCase().includes(query)) ||
      (doc.linkedTo && doc.linkedTo.toLowerCase().includes(query)) ||
      (doc.uploader && doc.uploader.toLowerCase().includes(query));
    return matchesCategory && matchesQuery;
  });
}

function getCategoryClass(category) {
  return (category || "").toLowerCase().replace(/\s+/g, "-");
}

function renderDocumentFilters() {
  const categories = ["all", ...new Set(state.documents.map((doc) => doc.category).filter(Boolean))];
  const currentValue = documentCategoryFilter.value || "all";
  documentCategoryFilter.innerHTML = categories
    .map(
      (category) =>
        `<option value="${category}" ${currentValue === category ? "selected" : ""}>${category === "all" ? "All Categories" : category}</option>`
    )
    .join("");
}

function renderDocumentStats() {
  const total = state.documents.length;
  const invoices = state.documents.filter((doc) => doc.category === "Invoices").length;
  const contracts = state.documents.filter((doc) => doc.category === "Contracts").length;
  const identity = state.documents.filter((doc) => doc.category === "Identity Proofs").length;

  documentStatsGrid.innerHTML = `
    <div class="doc-stat total"><small>Total Documents</small><strong>${total}</strong></div>
    <div class="doc-stat invoices"><small>Invoices</small><strong>${invoices}</strong></div>
    <div class="doc-stat contracts"><small>Contracts</small><strong>${contracts}</strong></div>
    <div class="doc-stat identity"><small>ID Proofs</small><strong>${identity}</strong></div>
  `;
}

function renderDocumentCards() {
  const docs = getFilteredDocuments();
  documentGrid.innerHTML = docs
    .map((doc) => {
      const categoryClass = getCategoryClass(doc.category);
      return `
      <article class="document-item">
        <div class="document-item-head">
          <span class="document-icon">📄</span>
          <div class="document-actions">
            <button class="doc-mini-btn delete delete-document" title="Delete" data-id="${doc._id}">🗑</button>
          </div>
        </div>
        <h4 class="document-title">${doc.name}</h4>
        <p class="doc-category"><span class="doc-chip ${categoryClass}">${doc.category}</span></p>
        <p class="doc-meta">
          Linked: ${doc.linkedTo || "N/A"}<br />
          Uploaded: ${doc.createdAt ? new Date(doc.createdAt).toLocaleString("en-IN") : "N/A"}<br />
          By: ${doc.uploader || "N/A"}
        </p>
      </article>
    `;
    })
    .join("");

  documentEmptyState.classList.toggle("hidden", docs.length > 0);
}

function renderUserManagement() {
  const query = userSearch.value.trim().toLowerCase();
  const filteredUsers = state.users.filter((user) => {
    return (
      !query ||
      (user.name && user.name.toLowerCase().includes(query)) ||
      (user.email && user.email.toLowerCase().includes(query)) ||
      (user.role && user.role.toLowerCase().includes(query))
    );
  });

  const activeUsers = state.users.filter((user) => user.status === "Active").length;
  const superAdmins = state.users.filter((user) => user.role === "superAdmin").length;

  userStatsGrid.innerHTML = `
    <div class="doc-stat total"><small>Total Users</small><strong>${state.users.length}</strong></div>
    <div class="doc-stat identity"><small>Active Users</small><strong>${activeUsers}</strong></div>
    <div class="doc-stat contracts"><small>Super Admins</small><strong>${superAdmins}</strong></div>
  `;

  userTableBody.innerHTML = filteredUsers
    .map(
      (user) => `
      <tr>
        <td><strong>${user.name}</strong><br /><small>${user.email}</small></td>
        <td><span class="user-pill ${user.role.toLowerCase().replace(/\s+/g, "-")}">${user.role === "superAdmin" ? "Super Admin" : "Admin"}</span></td>
        <td><span class="status-pill">${user.status || "Active"}</span></td>
        <td>${user.createdAt ? new Date(user.createdAt).toISOString().slice(0, 10) : "N/A"}</td>
        <td>-</td>
        <td>
          <button class="action-btn edit-user" data-id="${user._id}">Edit</button>
          <button class="action-btn delete-user" data-id="${user._id}">Delete</button>
        </td>
      </tr>
    `
    )
    .join("");
}

function openModal(title, fields, submitHandler) {
  modalTitle.textContent = title;
  dynamicForm.innerHTML = fields
    .map((field) => {
      if (field.type === "textarea") {
        return `<label>${field.label}<textarea name="${field.name}" required>${field.value || ""}</textarea></label>`;
      }
      if (field.type === "select") {
        return `<label>${field.label}<select name="${field.name}" required>${field.options
          .map((option) => `<option value="${option}" ${option === field.value ? "selected" : ""}>${option}</option>`)
          .join("")}</select></label>`;
      }
      return `<label>${field.label}<input type="${field.type}" name="${field.name}" required value="${field.value || ""}" /></label>`;
    })
    .join("");

  dynamicForm.insertAdjacentHTML("beforeend", `
    <div class="form-actions">
      <button type="button" id="cancelFormBtn" class="action-btn">Cancel</button>
      <button type="submit" class="primary-btn">Save</button>
    </div>
  `);

  document.getElementById("cancelFormBtn").addEventListener("click", closeModal);
  dynamicForm.onsubmit = async (event) => {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(dynamicForm).entries());
    try {
      await submitHandler(formData);
      closeModal();
      await refreshData();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  modalOverlay.classList.remove("hidden");
}

function closeModal() {
  modalOverlay.classList.add("hidden");
}

async function refreshData() {
  await loadData();
  renderAll();
}

function setupRoleBasedUI() {
  const restrictedNav = document.querySelector('.nav-btn[data-view="reports"]');
  const restrictedUserNav = document.querySelector('.nav-btn[data-view="userManagement"]');
  const addEmployeeBtn = document.getElementById("addEmployeeBtn");
  const addDocumentBtn = document.getElementById("addDocumentBtn");

  if (state.role === "admin") {
    restrictedNav.style.display = "none";
    restrictedUserNav.style.display = "none";
    addEmployeeBtn.disabled = true;
    addDocumentBtn.disabled = false;
    addEmployeeBtn.title = "Only Super Admin can add employees";
    if (state.activeView === "reports" || state.activeView === "userManagement") switchView("dashboard");
  } else {
    restrictedNav.style.display = "block";
    restrictedUserNav.style.display = "block";
    addEmployeeBtn.disabled = false;
    addEmployeeBtn.title = "";
  }
}

function openDashboard() {
  state.isAuthenticated = true;
  loginPage.classList.add("hidden");
  appShell.classList.remove("hidden");
  switchView("dashboard");
}

function goToLoginPage() {
  state.isAuthenticated = false;
  state.token = null;
  state.currentUser = null;
  appShell.classList.add("hidden");
  loginPage.classList.remove("hidden");
}

function renderAll() {
  renderDashboard();
  renderLeadFilters();
  renderLeadTable();
  renderEmployeeTable();
  renderDocumentFilters();
  renderDocumentStats();
  renderDocumentCards();
  renderUserManagement();
  setupRoleBasedUI();
}

function switchView(viewName) {
  if (!hasAccess(viewName)) {
    alert("Access denied for current role.");
    return;
  }

  state.activeView = viewName;
  navButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.view === viewName));
  allViewElements.forEach((view) => view.classList.remove("active-view"));

  const viewElement = document.getElementById(`${viewName}View`);
  if (viewElement) {
    viewElement.classList.add("active-view");
  }

  pageTitle.textContent = views[viewName].title;
  pageSubtitle.textContent = views[viewName].subtitle;
}

function bindEvents() {
  navButtons.forEach((button) => {
    button.addEventListener("click", () => switchView(button.dataset.view));
  });

  roleSelect.addEventListener("change", () => {
    state.role = roleSelect.value;
    addActivity(`Role switched to ${state.role === "superAdmin" ? "Super Admin" : "Admin"}.`);
    renderAll();
  });

  [leadStatusFilter, leadSourceFilter, leadAssigneeFilter, leadSearch].forEach((el) => {
    el.addEventListener("input", renderLeadTable);
  });
  [documentSearch, documentCategoryFilter].forEach((el) => {
    el.addEventListener("input", renderDocumentCards);
    el.addEventListener("change", renderDocumentCards);
  });
  userSearch.addEventListener("input", renderUserManagement);

  document.getElementById("addLeadBtn").addEventListener("click", () => {
    openModal(
      "Add New Lead",
      [
        { label: "Client Name", name: "clientName", type: "text" },
        { label: "Phone", name: "phone", type: "text" },
        { label: "Email", name: "email", type: "email" },
        { label: "Source", name: "source", type: "text" },
        { label: "Status", name: "status", type: "select", options: ["New", "In-Progress", "Converted", "Rejected"], value: "New" },
        { label: "Assigned To", name: "assignedTo", type: "text" },
        { label: "Notes", name: "notes", type: "textarea" },
      ],
      async (data) => {
        await api.post("/leads", data);
        addActivity(`New lead '${data.clientName}' created.`);
      }
    );
  });

  document.getElementById("addEmployeeBtn").addEventListener("click", () => {
    if (state.role !== "superAdmin") return;
    openModal(
      "Add Employee",
      [
        { label: "Full Name", name: "name", type: "text" },
        { label: "Email", name: "email", type: "email" },
        { label: "Role", name: "role", type: "text" },
        { label: "Joining Date", name: "joiningDate", type: "date" },
        { label: "Status", name: "status", type: "select", options: ["Active", "Inactive"], value: "Active" },
      ],
      async (data) => {
        await api.post("/employees", data);
        addActivity(`Employee '${data.name}' onboarded.`);
      }
    );
  });

  document.getElementById("addDocumentBtn").addEventListener("click", () => {
    openModal(
      "Upload Document Metadata",
      [
        { label: "Document Name", name: "name", type: "text" },
        { label: "Category", name: "category", type: "select", options: ["Invoices", "Identity Proofs", "Contracts"], value: "Contracts" },
        { label: "Linked Lead/Employee", name: "linkedTo", type: "text" },
        { label: "Uploader", name: "uploader", type: "text" },
      ],
      async (data) => {
        await api.post("/documents/upload-metadata", data);
        addActivity(`Document '${data.name}' uploaded.`);
      }
    );
  });

  document.getElementById("addUserBtn").addEventListener("click", () => {
    if (state.role !== "superAdmin") return;
    openModal(
      "Add Admin User",
      [
        { label: "Name", name: "name", type: "text" },
        { label: "Email", name: "email", type: "email" },
        { label: "Password", name: "password", type: "text" },
        { label: "Role", name: "role", type: "select", options: ["admin", "superAdmin"], value: "admin" },
        { label: "Status", name: "status", type: "select", options: ["Active", "Inactive"], value: "Active" },
      ],
      async (data) => {
        await api.post("/users", data);
        addActivity(`Admin user '${data.name}' created by Super Admin.`);
      }
    );
  });

  leadTableBody.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    if (target.classList.contains("delete-lead")) {
      const id = target.dataset.id;
      const lead = state.leads.find((item) => item._id === id);
      api.delete(`/leads/${id}`).then(() => {
        addActivity(`Lead '${lead ? lead.clientName : id}' deleted.`);
        refreshData();
      });
    }

    if (target.classList.contains("edit-lead")) {
      const id = target.dataset.id;
      const lead = state.leads.find((item) => item._id === id);
      if (!lead) return;
      openModal(
        "Edit Lead",
        [
          { label: "Client Name", name: "clientName", type: "text", value: lead.clientName },
          { label: "Phone", name: "phone", type: "text", value: lead.phone },
          { label: "Email", name: "email", type: "email", value: lead.email },
          { label: "Source", name: "source", type: "text", value: lead.source },
          { label: "Status", name: "status", type: "select", options: ["New", "In-Progress", "Converted", "Rejected"], value: lead.status },
          { label: "Assigned To", name: "assignedTo", type: "text", value: lead.assignedTo },
          { label: "Notes", name: "notes", type: "textarea", value: lead.notes },
        ],
        async (data) => {
          await api.put(`/leads/${id}`, data);
          addActivity(`Lead '${data.clientName}' updated.`);
        }
      );
    }
  });

  employeeTableBody.addEventListener("click", async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const id = target.dataset.id;
    const employee = state.employees.find((emp) => emp._id === id);
    if (!employee) return;

    if (target.classList.contains("toggle-employee")) {
      const newStatus = employee.status === "Active" ? "Inactive" : "Active";
      await api.put(`/employees/${id}`, { status: newStatus });
      addActivity(`Employee '${employee.name}' marked ${newStatus}.`);
      await refreshData();
    }

    if (target.classList.contains("delete-employee")) {
      await api.delete(`/employees/${id}`);
      addActivity(`Employee '${employee.name}' removed.`);
      await refreshData();
    }
  });

  documentGrid.addEventListener("click", async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (!target.classList.contains("delete-document")) return;
    const id = target.dataset.id;
    const doc = state.documents.find((item) => item._id === id);
    await api.delete(`/documents/${id}`);
    addActivity(`Document '${doc ? doc.name : id}' removed.`);
    await refreshData();
  });

  userTableBody.addEventListener("click", async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const id = target.dataset.id;
    if (!id) return;
    const user = state.users.find((item) => item._id === id);
    if (!user) return;

    if (target.classList.contains("delete-user")) {
      await api.delete(`/users/${id}`);
      addActivity(`User '${user.name}' deleted from User Management.`);
      await refreshData();
      return;
    }

    if (target.classList.contains("edit-user")) {
      openModal(
        "Edit Admin User",
        [
          { label: "Name", name: "name", type: "text", value: user.name },
          { label: "Email", name: "email", type: "email", value: user.email },
          { label: "Role", name: "role", type: "select", options: ["admin", "superAdmin"], value: user.role },
          { label: "Status", name: "status", type: "select", options: ["Active", "Inactive"], value: user.status },
        ],
        async (data) => {
          await api.put(`/users/${id}`, data);
          addActivity(`User '${data.name}' updated in User Management.`);
        }
      );
    }
  });

  closeModalBtn.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (event) => {
    if (event.target === modalOverlay) closeModal();
  });

  switchAccountBtn.addEventListener("click", () => {
    goToLoginPage();
  });

  logoutBtn.addEventListener("click", () => {
    goToLoginPage();
  });

  loginPageForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const role = loginRole.value;

    try {
      const data = await api.post("/auth/login", { email, password });
      state.token = data.token;
      state.currentUser = data;
      state.role = data.role || role;
      roleSelect.value = state.role;
      addActivity(`User '${email}' logged in as ${state.role === "superAdmin" ? "Super Admin" : "Admin"}.`);
      await loadData();
      openDashboard();
      renderAll();
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  });

  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });
}

bindEvents();
renderAll();
goToLoginPage();
