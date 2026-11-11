# LearnSphere Academy

A premium, fully responsive 15-page educational website built with **plain HTML5, CSS3 and vanilla JavaScript** — no frameworks, no build step, no dependencies.

> **This is a frontend demonstration project.** Every course, instructor, review, testimonial, statistic and enrolment is **sample data** created for this demo. There is no backend, no database and no real organisation behind it. Nothing you submit is sent anywhere — it is stored only in your own browser's local storage. Do not enter a real password, real payment details or real personal information.

---

## Table of contents

1. [Quick start](#quick-start)
2. [Pages](#pages)
3. [Features](#features)
4. [Project structure](#project-structure)
5. [How to edit](#how-to-edit)
6. [How the demo data works](#how-the-demo-data-works)
7. [Accessibility & responsive behaviour](#accessibility--responsive-behaviour)
8. [Browser support](#browser-support)
9. [Known demo limitations](#known-demo-limitations)

---

## Quick start

No installation, package manager or build step is required. The site is static files.

**Option A — double-click `index.html`**

Open `index.html` directly in a modern browser. Everything works, including the demo accounts, dashboard, filters and forms, because all code uses classic scripts and `localStorage` (never `fetch` for local templates).

**Option B — local server (recommended)**

Run any static server from the project root:

```bash
# Python 3
python -m http.server 8000

# or Node, if you prefer
npx serve .
```

Then visit `http://localhost:8000`. Opening the site over `http://` also enables the Web Crypto API, which the demo login uses to hash passwords (see [How the demo data works](#how-the-demo-data-works)).

**Option C — VS Code Live Server**

Right-click `index.html` → *Open with Live Server*.

---

## Pages

| # | Page | File |
|---|------|------|
| 1 | Home | `index.html` |
| 2 | About | `pages/about.html` |
| 3 | Courses (catalogue) | `pages/courses.html` |
| 4 | Course details (dynamic, per course) | `pages/course-details.html?slug=<slug>` |
| 5 | Instructors | `pages/instructors.html` |
| 6 | Learning experience | `pages/experience.html` |
| 7 | Reviews | `pages/reviews.html` |
| 8 | Contact | `pages/contact.html` |
| 9 | Log in | `pages/login.html` |
| 10 | Sign up | `pages/signup.html` |
| 11 | Forgot password | `pages/forgot-password.html` |
| 12 | Student dashboard | `pages/dashboard.html` |
| 13 | Privacy Policy | `pages/privacy-policy.html` |
| 14 | Terms & Conditions | `pages/terms.html` |
| 15 | Custom 404 | `pages/404.html` |

Course slugs: `web-development`, `python-programming`, `c-programming`, `cpp-programming`, `dsa`, `dbms`, `artificial-intelligence`, `machine-learning`, `data-analytics`, `graphic-design`, `video-editing`, `computer-fundamentals`.

---

## Features

### Presentation
- **"Study Desk" visual direction** — warm paper neutrals with quiet ink text and a single violet accent used like a tutor's pen (progress, selection, links and key figures). Flat ink panels, no gradients, glows, glassmorphism or decorative blobs. Completed lessons carry the signature violet tick.
- Light **and** dark themes; the choice is remembered in `localStorage` and follows the OS preference until you override it (a pre-paint script prevents theme flash). Dark theme builds depth from layered surfaces and hairline borders instead of shadows.
- Typography is **Plus Jakarta Sans only** (weights 400/500/600), sentence case throughout, tabular numerals on figures, and one easing curve with three durations (150/250/400 ms).
- Two small neutral shadow levels (light theme only) and an 8/14/20 px radius scale for controls, cards and panels.
- Fully responsive from 320 px phones to wide desktops: CSS Grid and Flexbox layouts, a slide-in mobile navigation drawer with focus trapping, and no horizontal overflow or element overlap at any tested width (320 / 375 / 414 / 640 / 700 / 768 / 900 / 1200 / 1440).
- `prefers-reduced-motion: reduce` disables all animation, both in CSS and JS.

### Performance & high-refresh displays (90–120 Hz)

The motion layer is built to stay smooth on high-refresh phones, tablets and desktops:

- Every animation and transition only touches **compositor-friendly properties** (`transform`, `opacity`); there are no `transition: all` rules anywhere — each transition lists its exact properties so nothing accidentally animates layout or paint.
- Scroll reveals, counters and the testimonial slider are driven by `requestAnimationFrame` with timestamp-based easing, so they scale to the display's native refresh rate (60, 90 or 120 Hz) instead of assuming 60 fps.
- `will-change` is applied only while a reveal is pending and released once the element is visible, so GPU layers are not retained for the lifetime of the page.
- Hover transforms are suppressed on touch devices (`@media (hover: none)`) so icons don't stay "stuck" nudged after a tap.
- `touch-action: manipulation` on links and controls removes the double-tap-zoom delay for snappier taps.
- Comfortable touch targets: compact icon buttons (theme toggle, menu toggle, card bookmark) keep their visual size but extend their tappable area to 44 px+ via pseudo-element hit rings; testimonial pagination dots are 26 px targets with a small visual dot.

### Behaviour (vanilla JS, ES6+)
- **Course catalogue** — live search, category / level / price filters, sorting (price, popularity, rating, newest), grid/list view toggle, thumbnail images with gradient+icon fallback, quick-view modal, and an empty state with reset.
- **Course details** — dynamic rendering per `?slug=`, module accordion with lesson checklists, progress tracking ("8 of 12 lessons · 67%"), enrolment, save (bookmark) and favourite (heart) actions, related courses, and a friendly not-found state for bad slugs.
- **Demo authentication** — sign-up with password strength meter, login with "Keep me signed in", forgot-password demo flow, and logout. Passwords are never stored as plain text.
- **Dashboard** — works in guest mode or signed in; overview stats, "continue where you left off", my-courses progress list, saved & favourite lists, activity feed, profile editing, and a reset button that restores the seeded sample data.
- **Reviews page** — rating summary with distribution bars, course filter, and a validated review form whose submissions are stored locally and clearly labelled as demo entries.
- **Contact page** — fully validated form; messages are kept in local storage only.
- **Misc** — testimonial slider, animated stat counters, FAQ accordion, toast notifications, loading states, scroll-to-top button, newsletter demo form, and a custom 404 page.

---

## Project structure

```
LearnSphere-Academy/
├── index.html                  # Home page (data-root="./")
├── pages/                      # The other 14 pages (data-root="../")
│   ├── about.html
│   ├── courses.html
│   ├── course-details.html     # Shell; content rendered by JS per ?slug=
│   ├── instructors.html
│   ├── experience.html
│   ├── reviews.html
│   ├── contact.html
│   ├── login.html
│   ├── signup.html
│   ├── forgot-password.html
│   ├── dashboard.html          # Shell; rendered by js/dashboard.js
│   ├── privacy-policy.html
│   ├── terms.html
│   └── 404.html
├── css/
│   ├── variables.css           # Colours, fonts, spacing, radii, shadows
│   ├── style.css              # Base layout & page sections
│   ├── components.css          # Cards, forms, buttons, modal, toasts…
│   ├── animations.css          # Keyframes, reveals, reduced-motion rules
│   ├── responsive.css          # Media queries (mobile → desktop)
│   └── dashboard.css           # Dashboard layout
├── js/
│   ├── icons.js                # Inline SVG sprite (no icon CDN)
│   ├── storage.js              # localStorage helpers + LS.util
│   ├── data.js                 # ALL sample content (courses, instructors…)
│   ├── theme.js                # Light/dark theme + persistence
│   ├── components.js           # Injected header/footer/nav, toast API
│   ├── navigation.js           # Mobile drawer, scroll, back-to-top
│   ├── animations.js           # IntersectionObserver reveals, counters
│   ├── courses.js              # Catalogue, filters, modal, save/enrol
│   ├── instructors.js          # Instructor cards & filters
│   ├── course-details.js       # Detail rendering & progress
│   ├── reviews.js              # Review summary & form
│   ├── forms.js                # Validation + demo auth
│   ├── dashboard.js            # Student dashboard
│   └── main.js                 # Bootstrapping
└── assets/
    ├── images/                 # Local WebP imagery (incl. course-<slug>.webp thumbnails)
    └── icons/favicon.svg

make-thumbnails.py              # Course thumbnail utility (see README section above)
```

**Script order matters** (already wired in every page):
`icons.js → storage.js → data.js → theme.js → components.js → navigation.js → animations.js → <page script> → forms.js → main.js`.

---

## How to edit

| I want to change… | Edit |
|---|---|
| Any course, instructor, review, testimonial, FAQ or price | `js/data.js` |
| Colours, fonts, spacing, radii, shadows | `css/variables.css` (both themes use the same tokens) |
| Page copy & section structure | the HTML files in `/` and `/pages` |
| Header, footer or mobile nav | the template strings in `js/components.js` |
| Validation rules or demo auth behaviour | `js/forms.js` |
| Which courses the dashboard seeds | the `seeds` array in `js/dashboard.js` |
| Favicons or images | `assets/` |
| Course thumbnail images | `assets/images/course-<slug>.webp` (see below) |

### Course thumbnails

Every course can define an `image` field in `js/data.js` (e.g. `image: "course-web-development.webp"`). When present, the thumbnail is shown in the course cards, quick-view modal, course detail banner and all dashboard course spots. When absent, the tone gradient + icon placeholder is used instead — so you can mix both.

To replace the current placeholder artwork with your own images, put the files in a folder and run:

```bash
python make-thumbnails.py path/to/your/images
```

Name each file after the course slug (`web-development.jpg`, `python.png`, …). The script centre-crops to 16:9, exports `assets/images/course-<slug>.webp` (800×450 WebP) and leaves the code untouched — just refresh the page. Run it without arguments to (re)generate tone-matched placeholders for any course that has no image.

Every page sets `data-root` on `<body>` (`./` for home, `../` for the rest) so the injected header/footer resolve links correctly from either folder depth. If you add a page, place it in `pages/`, copy `data-root="../"`, and keep the standard script order above.

---

## How the demo data works

- **All content is sample data.** Courses, instructors, reviews, ratings, student counts and testimonials are invented for demonstration and labelled as such in the UI and footer.
- **Storage** — the demo stores everything under the `learnsphere.*` key prefix in `localStorage` (or `sessionStorage` for a non-"remember me" login). Nothing leaves the browser.
- **Accounts** — creating an account stores a record with a `passwordHash` field. Over `http(s)`, that hash is a real SHA-256 digest produced by the browser's Web Crypto API; when the site is opened via `file://`, where Web Crypto is unavailable, a non-crypto digest is used as a fallback. Either way **plaintext passwords are never stored** — but this is still not real security: there is no server, no rate limiting and no transport. Never use a real password.
- **Dashboard seeding** — the first visit seeds three sample enrolments with partial progress so the dashboard has something to show. *Reset demo data* clears your own progress and restores those samples.
- **Prices** are in Indian Rupees (₹) and formatting uses `en-IN`.
- **Contact details** on the site (`hello@learnsphere.example`, `+91 00000 00000`, the Bengaluru address) are intentionally fake placeholders.
- **Clearing everything** — use your browser's "clear site data" for the origin, or run `localStorage.clear()` in the console.

---

## Accessibility & responsive behaviour

- Semantic landmarks (`header`, `nav`, `main`, `footer`), a "Skip to content" link, and one `h1` per page.
- All form fields have labels; errors use `aria-invalid` + `aria-describedby`; live regions announce form success and toasts.
- The mobile drawer traps focus, closes on <kbd>Escape</kbd> or backdrop click, and restores focus to the toggle.
- Icon-only buttons carry `aria-label`; decorative images use empty `alt` text.
- Full keyboard support for the modal, accordion, slider and star rating.
- Icon-only controls meet or exceed the WCAG 2.5.8 minimum target size (24 px), with header and card icon buttons reaching 44 px+ effective tap areas.
- Verified at 320 / 375 / 414 / 640 / 700 / 768 / 900 / 1200 / 1440 px with zero horizontal overflow, zero element overlaps, plus `prefers-reduced-motion` support in CSS and JS.

## Browser support

Latest Chrome, Edge, Firefox and Safari. The site uses CSS custom properties, Grid, Flexbox, `IntersectionObserver`, `dialog`-style modals with fallbacks and ES6+ JavaScript.

## Known demo limitations

- Enrolment, checkout and payments are **simulated** — the "enrol" button simply marks a course as enrolled locally. No payment is ever taken or processed.
- "Log in", "sign up" and "forgot password" are demonstrations of form behaviour, not a secure auth system.
- The newsletter and contact forms store submissions locally; nothing is delivered.
- Reviews you submit are labelled "demo review" in the list and only exist in your browser.

## Design credit

The visual direction of this demo follows the "unslop" anti-slop design guidelines by **Damir Sokolovsky** ([@heydamir](https://x.com/heydamir)), licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
