# DECEMBER EXAM MISSION 2026 🎯

> **Mission Target:** Complete 100% Semester Syllabus + Complete Subject Revision by **30 November 2026**!  
> **Tagline:** *One Day. Two Targets. One Step Closer to Success.*

A modern, minimalist, animated study planner and live calendar dashboard designed for an intensive **21-Day Mission (10 November – 30 November 2026)**.

---

## 🚀 Live Access

Production site: [https://iso123.netlify.app](https://iso123.netlify.app).

For local development, run `npm ci` followed by `npm run dev`, then open
[http://localhost:5173/](http://localhost:5173/).

### Netlify deployment

Netlify runs `npm ci --include=dev` to install dependencies from `package-lock.json`, then runs `npm run build`,
and publishes `dist`. The repository's `netlify.toml` sets these options and
Node.js 22 explicitly. Push changes to the connected `main` branch to trigger
deployment. Generated dependencies and build output are excluded from version
control so Netlify installs packages for its Linux environment.

The current app needs no API keys or backend configuration. Study progress is
stored in the current browser and does not sync between devices.

---

## 🌟 Key Updates Implemented

### 1. 🎯 Complete Syllabus + Revision Finished by 30 November (21 Days)
- **Phase 1: 10 Nov – 24 Nov (15 Days):**
  - Exactly 2 unit targets per day = **30 units total**.
  - All 5 units of COA, Maths-4, Cyber Security, DSTL, DSA (sem), and Human Values are 100% completed by 24 Nov!
- **Phase 2: 25 Nov – 30 Nov (6 Days):**
  - Fast-track complete subject revision sprint (1 dedicated subject per day covering Units 1 to 5 + PYQs and formulas):
    - **25 Nov:** COA (Units 1-5 + diagrams & Booth algorithm numericals)
    - **26 Nov:** Maths-4 (Units 1-5 + PDE, stats & hypothesis formulas)
    - **27 Nov:** Cyber Security (Units 1-5 + RSA encryption, attack vectors & IT Act)
    - **28 Nov:** DSTL (Units 1-5 + group theory, logic normal forms & graphs)
    - **29 Nov:** DSA (sem) (Units 1-5 + trees, graphs, sorting & queues)
    - **30 Nov:** Human Values (Units 1-5) + Final Grand Mock / PYQ Paper Simulation!
  - **100% prepared and revised by 30 November night!**

### 2. 🧹 Cleaner, Unified Header
- Removed the "Shifted" tab switcher button as requested.
- Clean and seamless 21-day timeline with live Indian Standard Time clock (`Asia/Kolkata`).

### 3. ✍️ Personalized Daily DSA Practice Log (Self-Tracked)
- Removed all static hardcoded roadmaps from the DSA tab.
- Replaced with an interactive **Daily DSA Practice Log** where you write down what you actually solved each day:
  - **Date selector** (defaults to today)
  - **Topic / Problem title** (e.g. *Merge Sort implementation + 3 LeetCode Easy problems on Arrays*)
  - **Number of questions solved**
  - **Platform tag** (*LeetCode, Striver A2Z, GeeksforGeeks, Codeforces, College Sem Lab, Self Practice*)
  - **Code intuition / notes** (time-space complexity, dry-run takeaways)
  - Permanent storage in `localStorage` with checkboxes, edit, and delete options!
