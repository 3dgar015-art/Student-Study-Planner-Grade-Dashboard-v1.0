# Student Study Planner & Grade Dashboard

Version 2.0 is a responsive, browser-only study planner built with HTML, CSS, and vanilla JavaScript.

## Included in v2

- Add, view, edit, and delete courses
- Add, view, edit, and delete assignments
- Associate assignments with an existing course
- Track due date, priority, and status
- Add optional grades from 0 to 100
- View total, completed, remaining, overdue, and average-grade statistics
- Filter assignments by completion, overdue state, priority, or course
- Persist courses and assignments with browser `localStorage`
- Responsive layout for desktop and mobile screens

Older v1 assignments without a grade are automatically treated as ungraded. The average only includes assignments with valid grades.

## Run locally

No build step or dependencies are required. Open `index.html` directly in a modern browser, or serve the folder with any static web server.

## v2 test checklist

1. Create five assignments, complete two, and give one unfinished assignment a past due date.
2. Add grades to only three assignments, leaving two blank.
3. Confirm Total is 5, Completed is 2, Remaining is 3, Overdue is 1, and Average Grade uses only the three grades.
4. Try the All, Completed, Remaining, Overdue, Priority, and Course filters.
5. Refresh or reopen the page and confirm all courses, assignments, grades, dates, priorities, and statuses remain.

Data is stored under the existing localStorage key `studentStudyPlannerV1` for this browser origin so v1 data remains compatible. Clearing site data removes the saved planner data.
