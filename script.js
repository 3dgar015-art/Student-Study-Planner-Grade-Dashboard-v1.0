const STORAGE_KEY = "studentStudyPlannerV1";

const state = loadState();
const elements = {
  courseForm: document.querySelector("#course-form"),
  courseId: document.querySelector("#course-id"),
  courseName: document.querySelector("#course-name"),
  courseCode: document.querySelector("#course-code"),
  courseCancel: document.querySelector("#course-cancel"),
  courseSubmitLabel: document.querySelector("#course-submit-label"),
  courseList: document.querySelector("#course-list"),
  courseCount: document.querySelector("#course-count"),
  assignmentForm: document.querySelector("#assignment-form"),
  assignmentId: document.querySelector("#assignment-id"),
  assignmentTitle: document.querySelector("#assignment-title"),
  assignmentCourse: document.querySelector("#assignment-course"),
  assignmentDueDate: document.querySelector("#assignment-due-date"),
  assignmentPriority: document.querySelector("#assignment-priority"),
  assignmentGrade: document.querySelector("#assignment-grade"),
  assignmentStatus: document.querySelector("#assignment-status"),
  assignmentCancel: document.querySelector("#assignment-cancel"),
  assignmentSubmitLabel: document.querySelector("#assignment-submit-label"),
  assignmentList: document.querySelector("#assignment-list"),
  assignmentCount: document.querySelector("#assignment-count"),
  assignmentFilter: document.querySelector("#assignment-filter"),
  filterValueWrap: document.querySelector("#filter-value-wrap"),
  filterValueLabel: document.querySelector("#filter-value-label"),
  filterValue: document.querySelector("#filter-value"),
  statTotal: document.querySelector("#stat-total"),
  statCompleted: document.querySelector("#stat-completed"),
  statRemaining: document.querySelector("#stat-remaining"),
  statOverdue: document.querySelector("#stat-overdue"),
  statAverage: document.querySelector("#stat-average")
};

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return {
      courses: Array.isArray(saved?.courses) ? saved.courses : [],
      assignments: Array.isArray(saved?.assignments) ? saved.assignments : []
    };
  } catch (error) {
    return { courses: [], assignments: [] };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", "\"": "&quot;"
  }[character]));
}

function formatDate(dateString) {
  if (!dateString) return "No due date";
  const date = new Date(`${dateString}T00:00:00`);
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

function isOverdue(assignment) {
  if (!assignment.dueDate || assignment.status === "Completed") return false;
  const today = new Date();
  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  return assignment.dueDate < todayString;
}

function getGrade(assignment) {
  if (assignment.grade === "" || assignment.grade === null || assignment.grade === undefined) return null;
  const grade = Number(assignment.grade);
  return Number.isFinite(grade) && grade >= 0 && grade <= 100 ? grade : null;
}

function render() {
  renderCourses();
  renderCourseOptions();
  renderDashboard();
  renderFilterOptions();
  renderAssignments();
}

function renderDashboard() {
  const total = state.assignments.length;
  const completed = state.assignments.filter((assignment) => assignment.status === "Completed").length;
  const overdue = state.assignments.filter(isOverdue).length;
  const grades = state.assignments.map(getGrade).filter((grade) => grade !== null);
  const average = grades.length ? (grades.reduce((sum, grade) => sum + grade, 0) / grades.length).toFixed(1).replace(".0", "") : "—";
  elements.statTotal.textContent = total;
  elements.statCompleted.textContent = completed;
  elements.statRemaining.textContent = total - completed;
  elements.statOverdue.textContent = overdue;
  elements.statAverage.textContent = average;
}

function renderFilterOptions() {
  const filterType = elements.assignmentFilter.value;
  const showValue = filterType === "priority" || filterType === "course";
  elements.filterValueWrap.classList.toggle("hidden", !showValue);
  if (!showValue) return;
  const previousValue = elements.filterValue.value;
  const values = filterType === "priority"
    ? ["Low", "Medium", "High"]
    : state.courses.map((course) => course.id);
  elements.filterValueLabel.textContent = filterType === "priority" ? "Priority" : "Course";
  elements.filterValue.innerHTML = values.map((value) => {
    if (filterType === "priority") return `<option value="${value}">${value}</option>`;
    const course = state.courses.find((item) => item.id === value);
    return `<option value="${value}">${escapeHtml(course.name)} (${escapeHtml(course.code)})</option>`;
  }).join("");
  if (values.includes(previousValue)) elements.filterValue.value = previousValue;
}

function getFilteredAssignments() {
  const filterType = elements.assignmentFilter.value;
  const filterValue = elements.filterValue.value;
  return state.assignments.filter((assignment) => {
    if (filterType === "completed") return assignment.status === "Completed";
    if (filterType === "remaining") return assignment.status !== "Completed";
    if (filterType === "overdue") return isOverdue(assignment);
    if (filterType === "priority") return assignment.priority === filterValue;
    if (filterType === "course") return assignment.courseId === filterValue;
    return true;
  });
}

function renderCourses() {
  const count = state.courses.length;
  elements.courseCount.textContent = `${count} ${count === 1 ? "course" : "courses"}`;
  if (!count) {
    elements.courseList.innerHTML = '<p class="empty-state">No courses yet. Add your first course above to get started.</p>';
    return;
  }
  elements.courseList.innerHTML = state.courses.map((course) => `
    <article class="course-item">
      <div>
        <p class="item-title">${escapeHtml(course.name)}</p>
        <p class="item-meta">${escapeHtml(course.code)}</p>
      </div>
      <div class="item-actions">
        <button class="icon-button" type="button" data-action="edit-course" data-id="${course.id}">Edit</button>
        <button class="icon-button delete" type="button" data-action="delete-course" data-id="${course.id}">Delete</button>
      </div>
    </article>`).join("");
}

function renderCourseOptions() {
  const currentValue = elements.assignmentCourse.value;
  elements.assignmentCourse.innerHTML = '<option value="">Select a course</option>' + state.courses.map((course) => `<option value="${course.id}">${escapeHtml(course.name)} (${escapeHtml(course.code)})</option>`).join("");
  if (state.courses.some((course) => course.id === currentValue)) elements.assignmentCourse.value = currentValue;
  elements.assignmentCourse.disabled = state.courses.length === 0;
}

function renderAssignments() {
  const count = state.assignments.length;
  elements.assignmentCount.textContent = `${count} ${count === 1 ? "assignment" : "assignments"}`;
  if (!count) {
    elements.assignmentList.innerHTML = '<p class="empty-state">Your assignment list is clear. Add an assignment when work comes into view.</p>';
    return;
  }
  const courseNames = new Map(state.courses.map((course) => [course.id, `${course.name} · ${course.code}`]));
  const sortedAssignments = getFilteredAssignments().sort((first, second) => first.dueDate.localeCompare(second.dueDate));
  if (!sortedAssignments.length) {
    elements.assignmentList.innerHTML = '<p class="empty-state">No assignments match this filter.</p>';
    return;
  }
  elements.assignmentList.innerHTML = sortedAssignments.map((assignment) => {
    const priorityClass = assignment.priority.toLowerCase();
    const statusClass = assignment.status.toLowerCase().replace(" ", "-");
    const grade = getGrade(assignment);
    const overdueClass = isOverdue(assignment) ? " overdue" : "";
    return `
      <article class="assignment-item${overdueClass}">
        <div class="assignment-top">
          <div>
            <p class="assignment-title">${escapeHtml(assignment.title)}</p>
            <p class="assignment-course">${escapeHtml(courseNames.get(assignment.courseId) || "Course removed")}</p>
          </div>
          <div class="item-actions">
            <button class="icon-button" type="button" data-action="edit-assignment" data-id="${assignment.id}">Edit</button>
            <button class="icon-button delete" type="button" data-action="delete-assignment" data-id="${assignment.id}">Delete</button>
          </div>
        </div>
        <div class="assignment-bottom">
          <span class="tag tag-date">Due ${formatDate(assignment.dueDate)}</span>
          <span class="tag tag-priority ${priorityClass}">${escapeHtml(assignment.priority)} priority</span>
          <span class="tag tag-status ${statusClass}">${escapeHtml(assignment.status)}</span>
          <span class="tag tag-grade">${grade === null ? "Ungraded" : `${grade}%`}</span>
          ${isOverdue(assignment) ? '<span class="tag tag-overdue">Overdue</span>' : ""}
        </div>
      </article>`;
  }).join("");
}

function resetCourseForm() {
  elements.courseForm.reset();
  elements.courseId.value = "";
  elements.courseSubmitLabel.textContent = "Add course";
  elements.courseCancel.classList.add("hidden");
}

function resetAssignmentForm() {
  elements.assignmentForm.reset();
  elements.assignmentId.value = "";
  elements.assignmentPriority.value = "Medium";
  elements.assignmentGrade.value = "";
  elements.assignmentStatus.value = "Not Started";
  elements.assignmentSubmitLabel.textContent = "Add assignment";
  elements.assignmentCancel.classList.add("hidden");
}

function editCourse(id) {
  const course = state.courses.find((item) => item.id === id);
  if (!course) return;
  elements.courseId.value = course.id;
  elements.courseName.value = course.name;
  elements.courseCode.value = course.code;
  elements.courseSubmitLabel.textContent = "Save changes";
  elements.courseCancel.classList.remove("hidden");
  elements.courseName.focus();
}

function editAssignment(id) {
  const assignment = state.assignments.find((item) => item.id === id);
  if (!assignment) return;
  elements.assignmentId.value = assignment.id;
  elements.assignmentTitle.value = assignment.title;
  elements.assignmentCourse.value = assignment.courseId;
  elements.assignmentDueDate.value = assignment.dueDate;
  elements.assignmentPriority.value = assignment.priority;
  elements.assignmentGrade.value = assignment.grade ?? "";
  elements.assignmentStatus.value = assignment.status;
  elements.assignmentSubmitLabel.textContent = "Save changes";
  elements.assignmentCancel.classList.remove("hidden");
  elements.assignmentTitle.focus();
}

elements.courseForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const courseData = { name: elements.courseName.value.trim(), code: elements.courseCode.value.trim().toUpperCase() };
  const existingCourse = state.courses.find((course) => course.id === elements.courseId.value);
  if (existingCourse) Object.assign(existingCourse, courseData);
  else state.courses.push({ id: createId(), ...courseData });
  saveState();
  resetCourseForm();
  render();
});

elements.assignmentForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const assignmentData = {
    title: elements.assignmentTitle.value.trim(),
    courseId: elements.assignmentCourse.value,
    dueDate: elements.assignmentDueDate.value,
    priority: elements.assignmentPriority.value,
    grade: elements.assignmentGrade.value === "" ? "" : Number(elements.assignmentGrade.value),
    status: elements.assignmentStatus.value
  };
  const existingAssignment = state.assignments.find((assignment) => assignment.id === elements.assignmentId.value);
  if (existingAssignment) Object.assign(existingAssignment, assignmentData);
  else state.assignments.push({ id: createId(), ...assignmentData });
  saveState();
  resetAssignmentForm();
  render();
});

elements.courseCancel.addEventListener("click", resetCourseForm);
elements.assignmentCancel.addEventListener("click", resetAssignmentForm);
elements.assignmentFilter.addEventListener("change", () => { renderFilterOptions(); renderAssignments(); });
elements.filterValue.addEventListener("change", renderAssignments);

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const { action, id } = button.dataset;
  if (action === "edit-course") editCourse(id);
  if (action === "edit-assignment") editAssignment(id);
  if (action === "delete-course") {
    const hasAssignments = state.assignments.some((assignment) => assignment.courseId === id);
    const message = hasAssignments ? "This course has assignments attached. Delete the course and those assignments too?" : "Delete this course?";
    if (!window.confirm(message)) return;
    state.courses = state.courses.filter((course) => course.id !== id);
    state.assignments = state.assignments.filter((assignment) => assignment.courseId !== id);
    saveState();
    resetCourseForm();
    render();
  }
  if (action === "delete-assignment") {
    if (!window.confirm("Delete this assignment?")) return;
    state.assignments = state.assignments.filter((assignment) => assignment.id !== id);
    saveState();
    resetAssignmentForm();
    render();
  }
});

render();
