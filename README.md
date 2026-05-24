# BUDS Website Instruction Manual

This website is the public site and private operating hub for the Boston University Debate Society. It is meant to be simple enough for new members to use on day one, while still giving e-board and admins the tools they need to keep the club organized.

## Project Goals

- **Present BUDS clearly to the public**
  - Show prospective members what the team does.
  - Make joining the team easy and visible.
  - Keep public pages like the e-board page, trophies page, novice hub, and meeting information current.

- **Make novice onboarding easier**
  - Collect beginner education materials in one place.
  - Explain APDA basics, speech order, common terms, FAQs, and useful resources.
  - Give new debaters a smoother path from their first meeting to their first round.

- **Centralize member resources**
  - Keep team links, forms, casebook materials, prep-outs, recordings, and club resources in one private hub.
  - Make resources searchable, compact, and easy to scan.
  - Let authorized users add and maintain useful debate resources without needing to edit code.

- **Support e-board operations**
  - Provide tools for agenda planning, meeting notes, budget tracking, trophies updates, and member management.
  - Reduce scattered documents and make club administration easier to hand off.

- **Protect important editing powers**
  - Let regular members view what they need.
  - Let e-board members edit practical resource collections.
  - Reserve larger page title and hub structure editing for admins.

- **Keep data shared across devices**
  - Save club content and private hub data through Supabase when connected.
  - Fall back to local browser storage when the database is unavailable.

## Quick Role Guide

### Public Visitors

- Can view public pages without logging in.
- Can learn about BUDS, novice debate, achievements, and current e-board members.
- Can submit a join request if they want member access.

### Members

- Can log into the private hub after their account is approved.
- Can view member resources, club resources, novice resources, and private links.
- Do not see the database connection block in the private hub header.
- Do not see edit URL controls or resource editing tools unless they have edit permissions.

### E-Board Members

- Can access e-board workspace tools.
- Can use **Edit Mode** to manage selected member resource content.
- Can edit resource entries, descriptions, and ordering where permitted.
- Cannot edit higher-level site titles and hub section titles unless they are also admins.

### Admins

- Can use all member and e-board tools.
- Can edit section titles, dropdown titles, hub titles, page content, and higher-level site structure.
- Can manage members and join requests.
- Can publish Budsite Editor drafts to the public site.

## Public Website

### Home Page

- Use this as the main public landing page for BUDS.
- It introduces the organization and points visitors toward the rest of the site.
- Admins can update editable home page content through the Budsite Editor.

### Join and Prospective Member Flow

- Prospective members should use the site join form to request access.
- Submitted requests appear for admins or member managers to review.
- Once approved, the person can log into the private hub with the approved account.

### Novice Hub

- The Novice Hub is designed for beginners and should be the first stop for new debaters.
- It includes:
  - Beginner education content.
  - Frequently asked questions.
  - APDA basics.
  - APDA speech order.
  - Common APDA terms glossary.
  - Helpful documents and links.
- The FAQ appears above the APDA basics infographic so new members see common beginner questions earlier.

### Trophies Page

- The trophies page shows public achievements and team accomplishments.
- It can be updated manually through the Trophies Page Editor.
- It also includes an APDA updater workflow for importing or refreshing standings-related data.

### E-Board Page

- The public e-board page lists current e-board members.
- Each tile can include:
  - Name.
  - Role.
  - Short role description.
  - Email address.
  - Photo or visual profile content, if configured.
- The page description currently tells visitors to contact an e-board member by email or Messenger.

## Logging In and Using the Private Hub

### Logging In

- Use the login screen with your approved account email.
- After logging in, you will land in the private hub.
- The private hub header shows your name and email.
- The **Log Out** button is in the upper right and uses a more button-like style with depth.

### Private Hub Header

- Members see a clean header without the database connection block.
- E-board and admin users may see status and editing controls depending on their permissions.
- The red bottom border visually separates the account area from the hub navigation.

### Hub Navigation

- The main hub buttons are spaced away from surrounding content so they read clearly as navigation buttons.
- Use these buttons to move between private sections such as:
  - Member Resources.
  - Club Resources.
  - E-Board Workspace.
  - Budsite Editor.
  - Members.

## Member Resources

The Member Resources area is the main private resource hub for the team.

### BUDS Team Specific Links

- This section contains important team links such as:
  - BUDS Drive.
  - Tournament Sign-Ups.
  - Events Google Calendar.
  - Matter File.
- The Matter File tile links to the shared Google Doc for examples, mechanisms, research, and recurring case areas.
- Link tiles are compact and designed to show the full short description without awkward scrollbars.

### Club Resources

- Club Resources holds non-competitive or administrative resources.
- Current examples include:
  - Reimbursement guide.
  - Forms.
  - Paradigms.
- Forms that used to live under Member Resources were moved here so the resource structure is cleaner.
- The reimbursement guide includes the updated sixth step contact email: `njsaxena@bu.edu`.

### BUDS Casebook

- The BUDS Casebook section contains compact grid-style case tiles.
- Each case tile should include:
  - Case title.
  - Case statement as the description.
  - Up to two topic tags, such as economics, sports, feminism, law, education, or technology.
  - Link to the case document.
- Cases are organized alphabetically by default.
- Use the search bar to find cases quickly.
- The open button is intentionally small so the grid stays easy to scan.

### BUDS Prep-Outs

- The Prep-Outs section collects pre-prepared LOCs for cases that come up often in the league.
- It includes a note explaining that prep-outs should use standardized headings with the case name and the team that wrote or runs the case.
- Members can use **REQUEST A PREP-OUT** to access the request form.
- Authorized editors can use **ADD A PREP-OUT** to open a popup and add a new prep-out.

### Recorded APDA Rounds

- This section collects useful recorded APDA rounds.
- Each entry should include:
  - Round name.
  - Whether the round is a case or motion.
  - Link to the video.
  - Description, preferably the case statement if it appears in the video description.
- Authorized editors can add and delete recorded rounds.

## Editing Member Resource Content

### Edit Mode

- E-board members and admins have an **Edit Mode** switch.
- When Edit Mode is off:
  - Resource pages appear closer to the normal member view.
  - Edit URL fields are hidden.
  - The Casebook appears in member-facing mode instead of editor mode.
- When Edit Mode is on:
  - Authorized users can edit resource content.
  - Admins can edit broader titles and section/dropdown names.
  - E-board users can edit approved resource areas but cannot edit admin-only titles.

### What E-Board Edit Mode Allows

- Edit member resource links:
  - BUDS Team Specific Links.
  - Club Resources Forms.
  - Casebook entries.
  - Prep-Out entries.
  - Recorded APDA Round entries.
- Drag and reorder member resource tiles.
- Edit descriptions for:
  - BUDS Casebook.
  - BUDS Prep-Outs.
  - Recorded APDA Rounds.
- Delete casebook, prep-out, and recorded round entries using the small trash icon on each tile.
- Confirm deletions through an "are you sure" popup.

### What Admin Edit Mode Adds

- Edit major section titles such as:
  - Club Resources.
  - Private BUDS Links.
  - Debate Resources.
  - Budsite Editor dropdown titles.
- Edit all section and dropdown titles in the hub.
- Manage higher-level public page and hub structure.

### Adding Resource Entries

- Use the add buttons inside each resource section.
- Fill out the popup fields carefully.
- For casebook entries:
  - Use the real case title.
  - Use the case statement as the description.
  - Choose up to two accurate topic tags.
  - Add the document link.
- For prep-outs:
  - Add the case or prep-out title.
  - Include the relevant link.
  - Use clear descriptions so members know what they are opening.
- For recorded rounds:
  - Enter the round name.
  - Choose **Case** or **Motion** from the dropdown.
  - Add the video link.
  - Add the case statement or motion description where available.

### Deleting Resource Entries

- Only e-board members and admins should see the small trash can icon.
- The icon appears in the bottom right of casebook, prep-out, and recorded round tiles.
- Selecting it opens a confirmation popup before deletion.
- Confirmation messages fade out and use the same rounded style as other messages.

## Budsite Editor

The Budsite Editor is where admins and authorized editors update site content without editing code.

### Editor Layout

- Major editor areas are organized as dropdowns to reduce scrolling and visual clutter.
- Opening a dropdown should smoothly scroll to a useful position.
- Editors are slightly narrower than their containing dropdowns to make the page easier to read.
- Editing modules inside editors are narrower than their module titles where appropriate.

### Drafts and Publishing

- Some Budsite Editor content uses drafts.
- Draft changes are not always public immediately.
- To make draft content visible on the public site, use the publish workflow.
- Revision history allows admins to restore previous versions if needed.

### Confirmation Messages

- Save and delete confirmations fade out instead of disappearing instantly.
- Confirmation messages use rounded boxes for consistency with the rest of the interface.

### Beginner Education and FAQ Content

- This area controls novice-facing educational content.
- It includes:
  - FAQ content.
  - APDA basics resources.
  - Common APDA Terms Glossary manager.
- In the Novice FAQ editor:
  - Reorder arrows sit next to the trash can instead of taking up a full line.
  - The dropdown scroll behavior should take the user to the section title, such as **Common First-Round Questions**.

### APDA Glossary Manager

- The APDA Glossary Manager is its own dropdown under Beginner Education and FAQ Content.
- It includes:
  - A search bar.
  - A plain list of terms without tile styling.
  - A selected-term editor.
  - A default message when no term is selected so no one accidentally edits or deletes a term.
- The public glossary shows:
  - A narrower search-and-list module.
  - A selected definition box.
  - Helpful resource links formatted like smaller bullet points.
- Some terms link to relevant resources, such as:
  - APDA Speaker Scale.
  - APDA standings for COTY, SOTY, TOTY, and related standings terms.

### APDA Speech Order Infographic

- The speech order block preserves a timeline-style left/right visual motif.
- Government and opposition colors are kept visually consistent.
- The module is sized to sit beside the APDA Glossary in the Novice Hub.

### E-Board Page Editor

- Use this editor to update current e-board tiles.
- Each member tile can include:
  - Name.
  - Role.
  - Role description.
  - Email.
- The email should appear below the role description, red, and slightly larger than before while still being less prominent than the name and role.

### Trophies Page Editor

- The main achievements editor is controlled by buttons instead of a dropdown.
- Available editor areas include:
  - Top Stats.
  - Accomplishments.
  - Milestones.
  - Individual Achievements.
  - Seasons / Results.
  - APDA Update.
- The editor module is centered and sized so fields do not get cut off.
- Individual Achievements includes a search bar to find a current member.
- Each editor includes small, clear titles separating add sections from existing achievements.

## E-Board Workspace

### Agenda

- The agenda section is used for planning e-board work.
- The title should simply say **Agenda**.
- The agenda module is intentionally narrower than the Budget Tracker so the page feels balanced.

### Budget Tracker

- The Budget Tracker tracks club budget information.
- Base budget uses dollar-sign formatting.
- Large numbers automatically show commas while typing.
- If the base budget field is empty, it should default to `$0.00`.
- Revenue additions can be negative to indicate debt.
- Negative values are color coded so debt is visually distinct from positive revenue.

### Secretary Meeting Notes

- Use this area to draft and manage internal meeting notes.
- Meeting notes can be restored or reviewed through the editor workflow when revision support is available.

## Members and Join Requests

### Members List

- Admins and member managers can view and manage approved members.
- Members can be assigned roles and permissions depending on club needs.

### Join Requests

- Submitted join requests appear for review.
- Admins or member managers can approve or reject requests.
- Approved members gain access to the private hub.

## Permissions Summary

### Regular Members

- Can view public pages.
- Can log into the private hub after approval.
- Can view member resources and club resources.
- Cannot edit resource links, titles, or site content.

### E-Board Members

- Can access e-board tools.
- Can use Edit Mode for practical resource management.
- Can add, edit, reorder, and delete approved resource entries.
- Can edit descriptions for Casebook, Prep-Outs, and Recorded APDA Rounds.
- Cannot edit admin-only page titles, hub titles, or dropdown titles.

### Admins

- Can do everything e-board members can do.
- Can edit titles and dropdown names.
- Can edit broader public page content.
- Can publish Budsite Editor drafts.
- Can manage member access.

### Member Managers

- Can help manage membership workflows.
- May be allowed to approve or manage join requests depending on the configured permissions.
- Do not automatically receive every admin-only site editing power.

## Data Storage

### Supabase

- Supabase is the shared database used by the live website.
- When Supabase is connected, updates should appear across devices.
- This is important for:
  - Budsite Editor content.
  - Member resources.
  - Casebook entries.
  - Prep-outs.
  - Recorded rounds.
  - Budget and agenda data.
  - Member records.

### Local Fallback

- If Supabase is unavailable, the site may fall back to local browser storage.
- Local fallback is useful for preventing data loss while editing.
- Local fallback data may not appear on other devices.

## Local Development

### Install Dependencies

```bash
npm install
```

### Start the Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Run Linting

```bash
npm run lint
```

## Environment Variables

Create a local environment file when working with Supabase:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

- Keep real credentials out of public commits.
- Use `.env.local` for local development secrets.
- Use the production deployment provider's environment variable settings for the live site.

## Updating the Live Website

### Before Editing

- Pull the latest changes from the repository.
- Check that the working tree is clean or understand what files are already modified.
- Confirm whether the change belongs in code, Supabase data, or the Budsite Editor.

### After Editing Code

- Run linting or a production build when relevant.
- Review the changed files.
- Commit the changes with a clear message.
- Push to the live branch when the user wants the website updated.

### After Editing Website Content

- If editing through the Budsite Editor, make sure draft content is published when it should appear publicly.
- If editing private hub resources, confirm that the data saves through Supabase so it appears on other devices.
- Use another device or browser session to verify shared updates when changing permissions, titles, or resource collections.

## Maintenance Checklist

- Keep public page text current.
- Keep novice resources beginner-friendly and easy to scan.
- Remove duplicate links when a resource already appears elsewhere.
- Keep casebook descriptions limited to case statements.
- Use accurate topic tags for casebook entries.
- Keep prep-out entries labeled by case and team when possible.
- Keep recorded round descriptions useful for members deciding what to watch.
- Check that Edit Mode hides editing controls when turned off.
- Confirm that e-board users have the editing powers they need without receiving admin-only title controls.
- Push code changes after meaningful updates so the live website reflects the current version.
