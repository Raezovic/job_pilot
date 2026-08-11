# UI Registry

Living document. Updated after every component is built. Read this before building any new component — match existing patterns exactly before inventing new ones.

---

## How to Use

Before building any component:

1. Check if a similar component already exists here
2. If yes — match its exact classes
3. If no — build it following ui-rules.md and ui-tokens.md, then add it here

After building any component — update this file with the component name, file path, and exact classes used.

---

## Components

### Layout

#### Navbar
- **File:** [Navbar.tsx](file:///c:/Users/ADMIN/OneDrive/Desktop/job_pilot/components/layout/Navbar.tsx)
- **Key Classes:** `sticky top-0 z-50 h-16 w-full border-b border-border bg-surface px-6`, `flex items-center gap-2`, `bg-linear-to-tr from-accent to-accent-dark`, `text-[19px] font-bold text-text-darkest`, `text-sm font-medium text-text-dark hover:text-accent`, `bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent-dark shadow-sm`

#### Footer
- **File:** [Footer.tsx](file:///c:/Users/ADMIN/OneDrive/Desktop/job_pilot/components/layout/Footer.tsx)
- **Key Classes:** `w-full border-t border-border bg-surface py-8 px-6 mt-auto`, `flex flex-wrap items-center gap-6 text-sm font-medium text-text-secondary`

### Homepage

#### Hero
- **File:** [Hero.tsx](file:///c:/Users/ADMIN/OneDrive/Desktop/job_pilot/components/homepage/Hero.tsx)
- **Key Classes:** `relative overflow-hidden bg-background pt-16 pb-20 px-6`, `bg-radial from-accent-light/40 to-transparent blur-3xl`, `text-4xl sm:text-6xl font-extrabold text-text-primary`, `bg-overlay-dark px-6 py-3.5 text-sm font-semibold text-accent-foreground hover:bg-opacity-95`, `bg-surface border border-border px-6 py-3.5 text-sm font-semibold text-text-primary hover:bg-surface-secondary`

#### Features
- **File:** [Features.tsx](file:///c:/Users/ADMIN/OneDrive/Desktop/job_pilot/components/homepage/Features.tsx)
- **Key Classes:** `bg-surface-secondary py-20 px-6`, `grid grid-cols-1 lg:grid-cols-12 gap-12 items-center`, `border-l-2 border-accent pl-6 py-1`, `border-l border-border-muted pl-6 py-1`, `rounded-2xl border border-border bg-surface shadow-lg overflow-hidden`

#### Testimonial
- **File:** [Testimonial.tsx](file:///c:/Users/ADMIN/OneDrive/Desktop/job_pilot/components/homepage/Testimonial.tsx)
- **Key Classes:** `bg-surface py-20 px-6 sm:px-8 border-t border-b border-border`, `text-xs font-semibold uppercase tracking-widest text-accent`, `text-xl sm:text-2xl font-medium leading-relaxed text-text-primary italic`

#### CallToAction
- **File:** [CallToAction.tsx](file:///c:/Users/ADMIN/OneDrive/Desktop/job_pilot/components/homepage/CallToAction.tsx)
- **Key Classes:** `relative overflow-hidden bg-background py-20 px-6 border-b border-border`, `bg-radial from-accent-light/40 to-transparent blur-3xl`

### Auth

#### LoginCard
File: [LoginCard.tsx](file:///c:/Users/ADMIN/OneDrive/Desktop/job_pilot/components/homepage/LoginCard.tsx)
Last updated: 2026-07-27

| Property         | Class           |
| ---------------- | --------------- |
| Background       | `bg-surface`    |
| Border           | `border border-border` |
| Border radius    | `rounded-2xl`   |
| Text — primary   | `text-text-primary` |
| Text — secondary | `text-text-secondary` |
| Spacing          | `p-8`, `gap-3`, `mb-4`, `mb-8`, `mt-8` |
| Hover state      | `hover:bg-surface-secondary hover:translate-y-[-1px] transition-all duration-300` |
| Shadow           | `shadow-sm hover:shadow-md` |
| Accent usage     | `bg-linear-to-tr from-accent to-accent-dark` |

**Pattern notes:**
Standard card layout for authorization blocks, containing form elements and provider actions.

#### LoginPage
File: [page.tsx](file:///c:/Users/ADMIN/OneDrive/Desktop/job_pilot/app/(auth)/login/page.tsx)
Last updated: 2026-07-27

| Property         | Class           |
| ---------------- | --------------- |
| Background       | `bg-background` |
| Border           | `none`          |
| Border radius    | `none`          |
| Text — primary   | `none`          |
| Text — secondary | `none`          |
| Spacing          | `px-4`          |
| Hover state      | `none`          |
| Shadow           | `none`          |
| Accent usage     | `none`          |

**Pattern notes:**
Full-screen login wrapper aligning the LoginCard centrally.

### Navbar (Updated)
File: [Navbar.tsx](file:///c:/Users/ADMIN/OneDrive/Desktop/job_pilot/components/layout/Navbar.tsx)
Last updated: 2026-07-27

| Property         | Class           |
| ---------------- | --------------- |
| Background       | `bg-surface`    |
| Border           | `border-b border-border` |
| Border radius    | `none`          |
| Text — primary   | `text-text-primary` |
| Text — secondary | `text-text-dark` |
| Spacing          | `h-16 px-6`, `gap-8` |
| Hover state      | `hover:text-accent` |
| Shadow           | `shadow-sm`     |
| Accent usage     | `text-accent` (active route) |

**Pattern notes:**
Header component displaying links to Dashboard, Find Jobs, and Profile if user is logged in, along with dynamic CTAs.

