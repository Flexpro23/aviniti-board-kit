---
# ─── MACHINE-READABLE CONFIG ──────────────────────────────────────────
# Agents parse this frontmatter first. If any value here conflicts with
# the PROJECT block in the HTML board file, THIS FILE WINS — regen the JS.

project:         "ClientName"            # short internal key, matches folder name
clientName:      "Full Client Company"   # legal/brand name
productName:     "Product Name"          # public product name (EN)
productNameAr:   "اسم المنتج"             # public product name (AR) — empty string if none
tagline:         "One sentence describing what the product does"
vertical:        "logistics"             # logistics | fintech | wellness | food | healthcare | edtech | retail | marketplace | other
stage:           "scoping"               # scoping | in-progress | client-review | approved | live | archived
currentVersion:  "v1.0"

# Language & direction
language:        "bilingual"             # arabic-first | english-first | bilingual
rtl:             true

# Theme & palette
theme:           "GOLD_NOIR"          # GOLD_NOIR | GOLD_IVORY | VIOLET_GLASS | VIOLET_NIGHT | CUSTOM
palette:
  primary:       "#C8A951"
  primaryLight:  "#DCBE6A"
  primaryDim:    "rgba(200,169,81,0.12)"
  # Add custom tokens if theme = CUSTOM

# Geography & money
city:            "Amman, Jordan"
mapCenter:       [31.9539, 35.9297]
mapZoom:         14
currency:        "JOD"                   # JOD | SAR | AED | USD | EUR

# Links
crmPage:         ""                      # optional — link to your CRM / client notes
githubBranch:    "client/ClientName"
vercelUrl:       ""                      # filled in after Step 10
figmaFile:       ""                      # if client provided one

# Personas & boards
personas:
  - key:         "user"
    name:        "User App"
    nameAr:      "تطبيق المستخدم"
    boardFile:   "ClientName_User_UI_Board.html"
    frame:       "mobile"                # mobile | dashboard | tablet | watch
    status:      "in-progress"           # not-started | in-progress | ready-for-qa | approved
    flowsCount:  3
  # - key: "admin"
  #   name: "Admin Dashboard"
  #   ...

# Stakeholders — who approves what
stakeholders:
  avinitiLead:   "<owner>"
  clientPM:      ""
  clientCEO:     ""
  clientDesign:  ""

# Delivery
kickoff:         ""                       # ISO date YYYY-MM-DD
deadline:        ""
---

# ClientName — Project Context

> This file is the **single source of truth** for Claude agents working on this client's boards.
> Any flow, screen, decision, or asset must be reflected here. When a board file's `PROJECT`
> block conflicts with the frontmatter above, this file wins — regenerate the JS block.

---

## 1. What We're Building

One-paragraph description of the product. Who uses it, what problem it solves, where it fits in the client's business. Include the Arabic-first elevator pitch if the client is MENA-facing.

**Aviniti deliverables in scope for this engagement:**
- [ ] UI board(s) — see personas below
- [ ] Interactive HTML prototype deployed to Vercel
- [ ] Remotion walkthrough video (optional)
- [ ] PDF export for proposal deck

---

## 2. Personas & Boards

| Persona | Frame | Board File | Status | Purpose |
|---|---|---|---|---|
| User | mobile | `ClientName_User_UI_Board.html` | in-progress | Primary consumer journey |
| Admin | dashboard | (planned) | not-started | Ops team back-office |

---

## 3. Flows

Flows are the narrative units presented to the client. Tag each with priority:
- **P0** — must ship in v1.0 (initial client review)
- **P1** — next iteration after initial sign-off
- **P2** — backlog, nice-to-have, future phase

**Each flow must have a `narrative:` block written before screens are built** (Step 2.8).
The three fields map directly to the `<ChapterBand>` props:
- `title` — client-facing chapter headline. One sentence, reads like a decision. *"Scan before signup."*
- `lede`  — one-sentence product story for the client. Verb + outcome.
- `lane`  — designer rationale. Why this chapter is structured this way. Not for clients.

### 3.1 User App

- [x] **P0 · F1 — Onboarding** / التسجيل
  - Screens: S1 (Welcome), S2 (Sign up), S3 (Verify phone)
  - Notes: Arabic-first flow; verify phone via SMS (sms.to integration assumed)
  - narrative:
    - title: "Your city. Your way."
    - lede:  "Three screens to the first live order — no friction, no dead ends."
    - lane:  "Phone-first auth because most users share devices. OTP is familiar in MENA. Apple/Google as secondary."

- [ ] **P0 · F2 — Home & discovery** / الاستكشاف
  - Screens: S4 (Home), S5 (Category list), S6 (Detail page)
  - Notes: Map-first UX; bottom sheet reveals results
  - narrative:
    - title: "Everything near you, now."
    - lede:  "Map first, categories second — the user knows where she is before she decides what she wants."
    - lane:  "Bottom sheet pattern keeps the map visible. Category scroll is horizontal, above the fold."

- [ ] **P1 · F3 — Checkout** / الدفع
  - Screens: S7 (Cart), S8 (Payment), S9 (Success)
  - narrative:
    - title: ""
    - lede:  ""
    - lane:  ""

- [ ] **P2 · F4 — Profile & history** / الملف الشخصي
  - narrative:
    - title: ""
    - lede:  ""
    - lane:  ""

### 3.2 Admin Dashboard

- [ ] **P1 · F5 — Operations control** / التحكم
  - Screens: S10 (Overview), S11 (User mgmt), S12 (Reports)
  - narrative:
    - title: ""
    - lede:  ""
    - lane:  ""

---

## 4. Screens Inventory

| # | Flow | Screen name (EN) | Screen name (AR) | State | Notes |
|---|---|---|---|---|---|
| S1 | F1 | Welcome | الترحيب | ✅ built | Full-bleed hero, brand moment |
| S2 | F1 | Sign up | التسجيل | ✅ built | Phone-first, no email required |
| S3 | F1 | Verify | التحقق | 🟡 draft | OTP input, 6 digits |
| S4 | F2 | Home | الرئيسية | ⬜ planned | Map + categories + live dot |
| … |

State legend: ⬜ planned · 🟡 draft · 🔵 in review · ✅ built · ❌ cut

---

## 5. Design Decisions

Document *why*, not just *what*. Future-you and future-agents will re-open this to understand choices.

- **Theme choice:** GOLD_NOIR — client is a B2B logistics ops platform; dark premium conveys authority & reduces glare in warehouse/driver environments.
- **Primary color:** `#C8A951` (gold) — extracted from client logo; preserves brand recognition.
- **Language priority:** Arabic-first (RTL default) — 80% of users are Jordan-based; English as toggle.
- **Map provider:** CartoDB dark tiles — matches theme, reliable coverage across MENA.
- **Typography:** IBM Plex Sans Arabic + Inter — proper bilingual rendering; no system-ui fallback.
- **Motion budget:** 1 Lottie accent on highlight card; no full-screen loaders (feels slow on ops dashboards).
- **Image strategy:** Picsum seeded for driver avatars; Unsplash curated IDs for hero cards.

---

## 6. References

Link to `./REFERENCES.md` if this client triggered the reference-scraping step (see `_template/REFERENCE_SCRAPER.md`).

- `./REFERENCES.md` — compiled references
- Client-shared mood boards: [paste links]
- Competitor apps to study: [list]

---

## 7. Client-Specific Vocabulary

Product-specific terms that extend the global `SEED` pool. Agents should use these for realistic seed data instead of generic names.

### Product entities
| EN | AR | Context |
|---|---|---|
| Order | طلب | Used throughout |
| Driver | سائق | Always masculine in this product's copy |
| Vendor | بائع | Plural: بائعون |

### Status vocabulary
| EN | AR | When |
|---|---|---|
| Picked up | تم الاستلام | Order entered driver's custody |
| Out for delivery | قيد التوصيل | In transit |
| Delivered | تم التوصيل | Completed |

### Client's actual product names (if any)
- Example menu item / service name 1 (EN/AR)
- …

---

## 8. Stakeholders & Approvals

| Role | Name | Approves | Contact |
|---|---|---|---|
| Aviniti lead | <owner> | All deliveries | Slack/WA |
| Client PM | TBD | Flow structure, copy | |
| Client CEO | TBD | Final sign-off, brand direction | |
| Client design lead | TBD | Visual details, palette tuning | |

**Review cadence:** [weekly / per-milestone / on-demand]

---

## 9. Assumptions & Open Questions

Things we assumed without written confirmation. Flag any of these that need client sign-off before Step 10 (Vercel deploy to share).

- [ ] Assumption: payment methods are cash + card + Apple Pay (confirm with client)
- [ ] Assumption: city coverage = Amman only for v1 (confirm)
- [ ] Open: does the client want a web portal in addition to mobile? (affects scope)
- [ ] Risk: logo contrast against dark theme fails WCAG AA for small text — propose warm-white variant

---

## 10. Technical Config

Mirrored from frontmatter for human reading; if you change anything here, change it in frontmatter too.

```yaml
rtl:         true
mapCenter:   [31.9539, 35.9297]  # Amman
currency:    JOD
theme:       GOLD_NOIR
primary:     "#C8A951"
```

**Board JS PROJECT block must match** the frontmatter above. When updating:
1. Edit frontmatter + this section
2. Open `ClientName_*_UI_Board.html`
3. Sync the `const PROJECT = {…}` at the top

---

## 11. Changelog

Newest first. Mirror key git commits. Every version bump of any board in this folder adds an entry.

### v1.0 — YYYY-MM-DD (initial)
- Created User board with F1 (Onboarding), F2 (Home) — 6 screens
- Theme: GOLD_NOIR
- Pending: F3 Checkout, Admin board

### v0.9 — YYYY-MM-DD (scoping)
- Intake complete
- Theme chosen
- Personas defined

---

## 12. Links

- **CRM / client notes:** [TBD] (optional)
- **GitHub branch:** `client/ClientName`
- **Vercel:** [TBD after Step 10]
- **Latest QA report:** `./QA_screenshots/<latest>/QA_report.md`
- **References:** `./REFERENCES.md`
- **Walkthrough video:** `./walkthrough.mp4` (if generated)

---

*Update this file whenever a screen, flow, decision, or stakeholder changes. Out-of-date context costs us hours. — Aviniti*
