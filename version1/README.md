# Student Study Planner & Grade Dashboard

Version 1.0 is a responsive, browser-only study planner built with HTML, CSS, and vanilla JavaScript.

## Included in v1

- Add, view, edit, and delete courses
- Add, view, edit, and delete assignments
- Associate assignments with an existing course
- Track due date, priority, and status
- Persist courses and assignments with browser `localStorage`
- Responsive layout for desktop and mobile screens

Version 1 focuses on core course and assignment management. Dashboard statistics, grades, and assignment filters are Version 2 features.

## Run locally

No build step or dependencies are required. Open `index.html` directly in a modern browser, or serve the folder with any static web server.

## v1 test checklist

1. Add, edit, and delete courses.
2. Add, edit, and delete assignments linked to a course.
3. Change assignment priority and status.
4. Refresh or reopen the page and confirm the saved courses and assignments remain.

Data is stored under the localStorage key `studentStudyPlannerV1` for this browser origin. Clearing site data removes the saved planner data.
