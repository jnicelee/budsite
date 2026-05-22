# BUDS Website

Website for the Boston University Debate Society. The site is built with React and Vite, styled with Tailwind utility classes, and connected to Supabase for shared team data.

## Main Website Functions

The public website is organized into separate pages instead of one long scrolling page.

- **Home**: introduces BUDS, highlights the team ranking, explains that debate is open to beginners, and includes a photo carousel with captions.
- **About**: explains what BUDS does, who the team is best for, why students should join, and links into the team history section.
- **Novice Hub**: gives new debaters quick access to APDA resources, guides, and learning links.
- **Calendar**: embeds the team calendar for practices, tournaments, and events.
- **Meetings**: displays secretary meeting notes as public blog-style posts, newest first.
- **History**: provides a growing timeline of BUDS history, accomplishments, and alumni information.
- **E-Board**: lists current e-board members and role descriptions.
- **Contact**: shows practice information, email, Instagram, LinkedIn, and a request-to-join link.
- **Join**: lets prospective members submit a membership request with name, email, password, and an optional note.
- **Hub/Login**: provides private access for accepted members and e-board members.

## Member Side

Accepted members can log in through the **Hub/Login** page. The member side is meant to collect private team resources in one place.

Member resources include cards for links such as:

- Master document
- Tournament sign-up sheet
- Practice sign-up sheet
- Matter file
- APDA resources
- Other team documents and forms

Administrators can edit the titles, descriptions, and URLs for these resource cards directly from the private hub.

## Join Requests

Prospective members use the **Join** page to submit a membership request.

The request form collects:

- Name
- BU email
- Chosen password
- Optional reason for joining

Administrators can review requests, accept or deny them, leave a reason, and delete old requests. Accepted users become member accounts that can log into the private hub with the password they chose.

## E-Board Side

E-board users log in through the **E-Board Login** option. E-board accounts open the private hub with the e-board workspace available.

The e-board workspace includes these modules:

### Agenda + Accountability

Use this section to track meeting agenda items and accountability tasks.

- Add a task with a title, owner, and due date.
- New tasks appear at the top.
- Checking off a task greys it out instead of deleting it immediately.
- Completed tasks can be unchecked for up to two weeks.
- Completed tasks older than two weeks are automatically removed.
- A trash icon appears on hover for manual deletion.
- The undo button restores the last manually deleted agenda item.

### Budget Tracker

Use this section to track club spending and revenue.

- The base budget appears at the top.
- Budget rows include category, allocated amount, spent amount, and status.
- Status options are **On Hold**, **Approved**, and **Denied**.
- Rows marked **On Hold** do not affect budget totals.
- Rows marked **Approved** affect allocated/spent totals.
- Rows marked **Denied** are removed.
- Revenue additions can be logged separately for money earned from events such as hosting tournaments.
- Revenue increases the effective total budget.

### Secretary Meeting Notes

Use this section to publish meeting notes to the public **Meetings** page.

Required fields:

- Meeting date
- Brief title
- Notes body

When notes are saved, they become meeting posts in the Meetings tab. Posts are ordered by date, newest first. E-board members can delete meeting posts.

### Budsite Editor Drafts and Restoring Revisions

The **Budsite Editor** uses a safe draft workflow for public page edits.

- Edit public content in the Budsite Editor.
- Use **Preview Draft** to review the draft version.
- Use **Publish** only when the draft should replace the live public page.
- Publishing saves the previous live version into **Revision History**.

To restore an older version:

- Go to **Hub** > **Budsite Editor**.
- In the **Editing Guide** dashboard, find the page to restore.
- Under **Revision History**, click the restore option for the date you want.
- The old version is restored into the draft, not the live website.
- Click **Preview Draft** to check it.
- Click **Publish** if the restored draft should become the live page.

Safe restore flow: **Restore revision** > **Preview Draft** > **Publish**.

### Trophies Page APDA Updater

The **Update from APDA** button in the Trophies Page Editor has two stages: **preview** and **apply**. It does not change the website when first clicked.

When clicked, the updater looks for:

- The currently selected Trophies editor season. For example, `2025-2026` becomes APDA season `2025`.
- Boston University's APDA school page, school ID `6`.
- Current roster members from `season_summary.members`, including each debater's name, APDA status, and years on team.
- Each current member's APDA detail page, used to collect tournament-level awards for that season.
- BU's COTY history and current season COTY breakdown.
- Tournament team awards where at least one debater is from Boston University.
- Speaker awards where the speaker is from Boston University.

The updater ignores:

- Non-placed placeholder rows.
- Awards with no real APDA placement.
- Non-BU speaker awards.
- Non-BU team results unless the team includes a BU debater.

After the preview is reviewed and **Apply Reviewed Changes** is clicked, the updater changes:

- **Top Stats**: replaces APDA-managed stats such as current COTY rank, current members, COTY contributors, and previous COTY rank.
- **Accomplishments**: replaces APDA-managed lines involving Terrier Central members, COTY rank/points, and COTY contributors.
- **Selected Season Results Timeline**: replaces that APDA season's timeline with the newly pulled tournament results.
- **Current Member Achievement Cards**: replaces the member achievement list with the current APDA roster and each member's APDA-listed awards.

The updater does not change:

- Milestone cards.
- Manually added non-APDA stats.
- Manually added non-APDA accomplishments.
- Other seasons besides the APDA season being applied.
- Secretary notes, budget tracker, member accounts, or any other module.

Generated tournament wording uses the public Trophies page style:

- `are Varsity Champions`
- `are Novice Champions`
- `places 2nd in Varsity/Novice Team`
- `reaches Varsity/Novice Semi-Finals`
- `earns 1st/2nd/etc. Varsity/Novice Speaker`

Within each tournament, generated highlights are ordered by prestige: team awards first, then speaker awards; Varsity before Novice; higher placements before lower placements.

### Members List

Administrators and approved member managers can view member accounts.

Depending on permission level, this area can be used to:

- View accepted members.
- Change a member role between member and e-board.
- Revoke or unrevoke access.
- Delete a member account after confirmation.

## Admin Notes

The administrator account has extra editing permissions. Editable fields, request review tools, member management, budget edits, and private link edits are intended to be controlled from the administrator/e-board side of the private hub.

Important security note: this project currently uses a prototype-style login flow. Password handling should be migrated to Supabase Auth before storing sensitive documents, real budgets, or private team records.

## Data Storage

The app can use Supabase for shared data and falls back to browser local storage when Supabase is not configured.

Supabase-backed areas include:

- E-board agenda
- Budget rows and revenue additions
- Secretary notes
- Private member links
- Membership requests
- Member accounts

Local storage is used as a backup for development and for cases where the Supabase environment variables are missing.

## Local Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run lint checks:

```bash
npm run lint
```

## Environment Variables

Supabase configuration is read from Vite environment variables:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Use `.env.local` for local development and configure the same variables in Vercel for deployment.
