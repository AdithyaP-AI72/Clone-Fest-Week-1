# CloneFest-Week-1

#Problem Statement : 
📝 CloneFest 2025 Problem Statement: Modernizing Chyrp
Background
Chyrp is a lightweight, extensible blogging engine originally written to be simple yet powerful. It allowed bloggers to publish content in multiple formats (“Feathers”), extend functionality via modules, and customize appearance with themes. While innovative in its time, Chyrp now feels outdated compared to today’s modern, responsive, API-driven web applications.
Your challenge in this hackathon is to rebuild Chyrp as a modern web application that preserves its flexibility and lightweight philosophy while implementing its key features.

Features to Implement
Core
Easy to install, simple to maintain, extensible by design.
Built with responsive and accessible W3C-validated HTML5.
Universal support for plain text, Markdown, and raw markup.
Blog personalization through extensions.
Theme support using templates.
User and visitor management with a rights model.


Feathers (Content Types)
Text: publish textual blog entries.
Photo: upload and display an image.
Quote: post a quotation.
Link: link out to another website.
Video: upload and display a video file.
Audio: upload and play an audio file.
Uploader: upload and manage multiple files.


Modules (Enhancements)
Cacher: cache pages to reduce server load.
Categorize: assign categories to blog entries.
Tags: apply multiple searchable tags.
Mentionable: register webmentions from other blogs.
Comments: a complete commenting system.
Likes: allow visitors to like posts.
Read More: truncate long blog entries in the feed.
Rights: set attribution and copyright for posts.
Cascade: infinite scrolling for blog entries.
Lightbox: on-page image viewer with protection.
Sitemap: generate a sitemap for search engines.
MAPTCHA: math-based spam prevention.
Highlighter: syntax highlighting for code snippets.
Easy Embed: embed external content easily.
Post Views: maintain view counts for blog entries.
MathJax: display mathematical notation cleanly.


Suggested Tech Stacks:
Frontend
Vue 3 (with Vite)
React (with Vite)
Next.js (App Router)
Angular (latest LTS)
Backend
Django REST Framework (DRF)
FastAPI
Flask (modern usage with Blueprints & async)
Database:
Relational (SQL): PostgreSQL, MySQL, MariaDB, SQLite
NoSQL: MongoDB, Firebase Firestore, DynamoDB
Other modern choices: Supabase (Postgres-based), PlanetScale (MySQL-based)

We strongly recommend choosing from the tech stacks listed above, as they are aligned with modern frameworks and carry the highest probability of better grading.
⚠️ If you choose to use a different stack, you are free to do so at your own risk — but please note that evaluators will prioritize solutions built using the suggested stacks when grading.


Deliverables
A running, deployed website that implements the above Chyrp functionality.
A link to the deployed instance must be submitted for judging.



Judging Criteria (100 + Bonus 5)
Startability (30): Ease of installation and setup.
Core Functionality Demo (35): Completeness and correctness of required Chyrp features.
Stability (10): Reliability, uptime, and lack of crashes/bugs.
Framework Idioms & Code Sampling (10): Clean, idiomatic, and maintainable code.
Docs & Reproducibility (10): Clear documentation and ability to reproduce the app.
Bonus Innovation (0–5): Creative features or extensions beyond the requirements.

⚡ In summary:
 Take the legacy Chyrp blog engine and bring it into today’s web world. Implement its features, deploy it live, and show us how you reimagined blogging for the modern age.

# Division of Work : 
Day 1:
A -> Build Backend skeleton + 2 routes(/register,/posts)
B -> Bui,d frontend pages with dummy datas
C -> Deploy both projects to cloud + GitHub

Day 2:
A -> Add authentication + /new-post
B -> Connect forms to backend APIs
C -> Wire frontend to deployed backend API 

Day 3:
A-> Add file upload
B -> Add markdown rendering + Polish UI
C -> Add Likes/Tags + finalize docs

#Checklist : 
👤 Person A → Backend (FastAPI + SQLite)

Day 1

[ ] Install FastAPI & libraries:

pip install fastapi uvicorn sqlalchemy passlib[bcrypt] python-jose

[ ] Create main.py with FastAPI "Hello World".

[ ] Setup SQLite DB with SQLAlchemy.

[ ] Make User model (id, username, password_hash).

[ ] Add POST /register route → save new user.

[ ] Add GET /posts route → return dummy posts list.

[ ] Run uvicorn main:app --reload and test /docs (Swagger).


Day 2

[ ] Add POST /login (JWT auth).

[ ] Add Post model (id, title, content, created_at, user_id).

[ ] Add POST /posts (create new post).

[ ] Test register → login → create post → fetch posts flow.

[ ] Push backend code to GitHub.


Day 3 (Half Day)

[ ] Add photo upload (store locally or base64).

[ ] Clean code (remove unused stuff).

[ ] Help Person B debug API integration if needed.



---

👤 Person B → Frontend (Next.js + Tailwind)

Day 1

[ ] Install Node.js (if not installed).

[ ] Create Next.js app:

npx create-next-app frontend
cd frontend
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p

[ ] Configure Tailwind in globals.css.

[ ] Create pages: /register, /login, /posts, /new-post.

[ ] Add forms for register/login with dummy submit.

[ ] Create a post list UI with dummy posts.


Day 2

[ ] Install Axios (npm install axios).

[ ] Connect /register form → backend API.

[ ] Connect /login form → backend API (store JWT in localStorage).

[ ] Connect /posts → backend GET /posts.

[ ] Connect /new-post → backend POST /posts.

[ ] Install & test Markdown renderer (npm install react-markdown).


Day 3 (Half Day)

[ ] Polish UI with Tailwind (mobile responsive).

[ ] Add Markdown rendering in post details.

[ ] Test full flow: register → login → new post → see post.



---

👤 Person C → Deployment + Docs + Bonus

Day 1

[ ] Create GitHub repo → add frontend/ + backend/ folders.

[ ] Deploy backend to Render (basic "Hello World").

[ ] Deploy frontend to Vercel (basic Next.js app).

[ ] Share live links with team.


Day 2

[ ] Update backend deployment with real API (from Person A).

[ ] Update frontend deployment with real API URL.

[ ] Confirm frontend can talk to backend in deployed version.

[ ] Write basic README: project description + setup instructions.


Day 3 (Half Day)

[ ] Add simple Likes API (increment counter) OR Tags support.

[ ] Add screenshots of deployed site to README.

[ ] Polish README with tech stack + demo link.

[ ] Run final checks: register/login/posts on live site.
