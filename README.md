# Freelancer OS

Freelancer OS is a streamlined, data-driven command center built for independent professionals to manage the entire lifecycle of their business—from project inception to final billing. By unifying time tracking, project management, and invoice generation in a single interface, it eliminates context switching and provides real-time visibility into business performance.

## Key Features

* **Executive Overview:** A high-level business command center visualizing outstanding revenue, active projects, and lifetime billable hours.
* **Precision Time Tracking:** A high-fidelity live timer that logs precise fractional hours, ensuring accurate billing without unnecessary rounding.
* **Project Management:** A structured directory to track engagement status and client history.
* **End-to-End Invoicing:** Generate, manage, and track invoices with status-driven automation.
* **Analytics-Ready:** Built-in tracking integration to monitor business performance.

## Tech Stack

* **Framework:** [Next.js](https://nextjs.org/) (App Router)
* **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL & Row Level Security)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
* **Testing:** [Playwright](https://playwright.dev/) (E2E)
* **Analytics:** [PostHog](https://posthog.com/)
* **Deployment:** [Vercel](https://vercel.com/)

## Getting Started

### Prerequisites

* Node.js 18.x or higher
* Supabase Account
* PostHog Project Key

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/your-username/freelancer-os.git
cd freelancer-os

```



```

2. **Install dependencies:**
   ```bash
   npm install

```

3. **Environment Setup:**
Copy the example environment file and populate your credentials:
```bash
cp .env.example .env.local

```



```
   *Required variables:*
   * `NEXT_PUBLIC_SUPABASE_URL`
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   * `NEXT_PUBLIC_POSTHOG_KEY`

4. **Run the development server:**
   ```bash
   npm run dev

```

## Testing & Quality Assurance

Freelancer OS employs an automated CI/CD pipeline using **Playwright** to ensure that critical paths (authentication and database connectivity) remain operational.

* **Run E2E tests:**
```bash

```



npx playwright test

```
*   **UI Test Mode:**
    ```bash
npx playwright test --ui

```

## Project Structure

```text
freelancer-os/
├── app/                  # Application routes and layouts
│   ├── dashboard/        # Main application workspace
│   ├── login/            # Authentication logic
│   └── api/              # Backend server actions
├── components/           # Reusable UI components (Shadcn)
├── lib/                  # Utility functions and project logic
├── supabase/             # Database migrations and schema
├── e2e/                  # Playwright end-to-end tests
└── utils/                # Supabase server/middleware utilities

```

## Roadmap & Maintenance

* [x] **Core Workflow:** Projects, Time, Invoices integrated.
* [x] **UX/UI:** Split-pane design system implemented.
* [x] **CI/CD:** Automated testing environment stabilized.
* [ ] **Feature:** Multi-currency invoice support.
* [ ] **Feature:** Client portal integration.

---

*Created by Htoo Tay Za.*