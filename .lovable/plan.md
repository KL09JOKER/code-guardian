

# BackDoorScanner Enhancement Plan

This plan covers 4 features: Dashboard Analytics, PDF Report Export, File Upload Support, and a Theme System with a new "Dark Tech" theme.

---

## Feature 1: Dashboard Analytics Page

A new `/dashboard` route showing scan statistics and charts using Recharts (already installed).

**What you'll see:**
- A navigation link in the header to switch between Scanner and Dashboard
- Total scans count, average risk score, total vulnerabilities found
- A bar chart showing risk scores over recent scans
- A pie chart showing vulnerability severity distribution (low/medium/high/critical)
- A bar chart showing most common vulnerability types

**Files to create/modify:**
- Create `src/pages/Dashboard.tsx` -- main dashboard page
- Create `src/components/dashboard/StatsCards.tsx` -- summary cards
- Create `src/components/dashboard/RiskChart.tsx` -- risk score trend chart
- Create `src/components/dashboard/SeverityPieChart.tsx` -- severity breakdown
- Create `src/components/dashboard/VulnTypeChart.tsx` -- vulnerability type frequency
- Modify `src/App.tsx` -- add `/dashboard` route
- Modify `src/components/scanner/Header.tsx` -- add Dashboard nav link

Data will be fetched from the existing `scan_history` table.

---

## Feature 2: PDF Report Export

Replace the current JSON download with a proper PDF report generated in the browser.

**What you'll see:**
- Clicking "Download Report" generates a styled PDF with:
  - Report title, date, language scanned
  - Risk score summary
  - Table of all vulnerabilities with severity, type, line numbers, description, and recommendation
  - Formatted for printing/sharing

**Approach:** Use `jspdf` and `jspdf-autotable` libraries to generate the PDF client-side (no server needed).

**Files to create/modify:**
- Install `jspdf` and `jspdf-autotable` packages
- Create `src/lib/generateReport.ts` -- PDF generation logic
- Modify `src/components/scanner/ResultsScreen.tsx` -- wire up the new PDF download

---

## Feature 3: File Upload Support

Add drag-and-drop file upload alongside the existing paste-code editor.

**What you'll see:**
- A drag-and-drop zone above the code editor
- Supports common code file extensions (`.js`, `.ts`, `.py`, `.php`, `.java`, `.cs`, `.go`, `.rb`)
- Dropping or selecting a file reads its contents and populates the code editor
- Auto-detects language from file extension

**Files to create/modify:**
- Create `src/components/scanner/FileUploadZone.tsx` -- drag-and-drop component
- Modify `src/components/scanner/UploadScreen.tsx` -- integrate the file upload zone above the editor

---

## Feature 4: Theme System with "Dark Tech" Theme

A theme switcher in the header with multiple theme options. The default will be the new **Dark Tech** theme.

**Themes available:**
- **Dark Tech** (default) -- Vibrant gradients with electric blue/purple/pink accents, modern dark background with colorful neon highlights
- **Cyber Green** -- The current green/cyan hacker aesthetic
- **Midnight Purple** -- Deep purple tones with violet accents

**What you'll see:**
- A theme toggle dropdown in the header (palette icon)
- Switching themes instantly changes the color scheme
- Theme preference saved to localStorage so it persists

**Approach:** Use CSS custom properties. Each theme defines its own set of CSS variables. A React context manages the active theme and applies a class to the root element.

**Files to create/modify:**
- Create `src/contexts/ThemeContext.tsx` -- theme state management with localStorage persistence
- Modify `src/index.css` -- add `.theme-dark-tech`, `.theme-cyber-green`, `.theme-midnight-purple` variable sets
- Modify `src/components/scanner/Header.tsx` -- add theme switcher dropdown
- Modify `src/App.tsx` -- wrap app with ThemeProvider
- Modify `src/main.tsx` or root -- ensure default theme class is applied

**Dark Tech color palette:**
- Background: Deep navy/charcoal (#0a0e1a)
- Primary: Electric blue (#3b82f6) with purple highlights
- Accent: Vivid pink/magenta (#ec4899)
- Success: Bright emerald (#10b981)
- Warning: Amber (#f59e0b)
- Critical: Rose red (#ef4444)
- Cards: Slightly lighter dark with subtle gradient borders
- Glow effects with blue/purple tones

---

## Technical Details

### New Dependencies
- `jspdf` -- PDF generation
- `jspdf-autotable` -- Table formatting in PDFs

### File Change Summary

| Action | File |
|--------|------|
| Create | `src/pages/Dashboard.tsx` |
| Create | `src/components/dashboard/StatsCards.tsx` |
| Create | `src/components/dashboard/RiskChart.tsx` |
| Create | `src/components/dashboard/SeverityPieChart.tsx` |
| Create | `src/components/dashboard/VulnTypeChart.tsx` |
| Create | `src/lib/generateReport.ts` |
| Create | `src/components/scanner/FileUploadZone.tsx` |
| Create | `src/contexts/ThemeContext.tsx` |
| Modify | `src/App.tsx` |
| Modify | `src/index.css` |
| Modify | `src/components/scanner/Header.tsx` |
| Modify | `src/components/scanner/UploadScreen.tsx` |
| Modify | `src/components/scanner/ResultsScreen.tsx` |

### No database changes needed
All features use the existing `scan_history` table.

