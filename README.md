# Student Study Planner & Grade Dashboard

Version 1.0 is a responsive, browser-only study planner built with HTML, CSS, and vanilla JavaScript.

## Included in v1

- Add, view, edit, and delete courses
- Add, view, edit, and delete assignments
- Associate assignments with an existing course
- Track due date, priority, and status
- Persist courses and assignments with browser `localStorage`
- Responsive layout for desktop and mobile screens

Version 1 intentionally does not include dashboard statistics or other Version 2 features.

## Run locally

No build step or dependencies are required. Open `index.html` directly in a modern browser, or serve the folder with any static web server.

## Test checklist

1. Add a course and edit it.
2. Delete the course.
3. Add several courses.
4. Add an assignment linked to one of the courses.
5. Edit and delete an assignment.
6. Add another assignment and change its priority and status through Edit.
7. Refresh or reopen the page and confirm the saved courses and assignments remain.

Data is stored under the localStorage key `studentStudyPlannerV1` for this browser origin. Clearing site data removes the saved planner data.
