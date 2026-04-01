# Data Collection Requirements: Minerva Pathfinder

To power the interactive exploration and matching, we need two primary datasets. These will be stored as static JSON files in the final application.

## 1. Curriculum Data
This dataset maps Minerva's academic offerings to student interests.

| Field | Description | Example |
| :--- | :--- | :--- |
| `id` | Unique identifier for the course | `CS101` |
| `name` | Official course title | `Foundations of Computer Science` |
| `description` | A student-friendly summary of the course | `Explore the core principles of logic and computation...` |
| `interests` | Array of tags linking the course to broad fields | `["Technology", "Problem Solving", "Logic"]` |
| `trajectories` | Potential career or academic paths this course supports | `["Software Engineering", "Data Science"]` |
| `level` | Year or difficulty level | `Freshman` |

## 2. Volunteer Network Data
This dataset contains information about current students and alumni who have volunteered to share their experiences.

| Field | Description | Example |
| :--- | :--- | :--- |
| `id` | Unique identifier for the volunteer | `V001` |
| `name` | First name or pseudonym (for prototype) | `Alex` |
| `type` | Role in the community | `Alumni` or `Student` |
| `nationality` | Nationality (consented for sharing) | `Vietnamese` |
| `interests` | Personal and professional interest tags | `["Social Entrepreneurship", "Education"]` |
| `experience` | Brief highlight of their Minerva or post-Minerva journey | `Founder of a non-profit in Hanoi...` |
| `contact_method` | Simulated platform for connection | `Minerva Hub` |

## Data Collection Plan
1. **Curriculum**: Extract from public Minerva course catalogs (to be verified and formatted).
2. **Network**: Use synthetic data for the initial M2/M3 build, with placeholders for real volunteer-provided information later.
3. **Verification**: All curriculum data must match official descriptions to ensure accuracy for admitted students.
