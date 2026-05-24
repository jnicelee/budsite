# Source Map

This app is organized so common website edits do not require digging through the main route file.

- `App.jsx`: page components and top-level routing.
- `data/content.js`: public copy, nav links, board bios, private-link defaults, agenda defaults, and other editable site content.
- `data/config.js`: storage keys, role names, status options, reserved account emails, and member-manager settings.
- `components/ui.jsx`: shared layout primitives such as `Page`, `Card`, buttons, labels, and routed links.
- `components/PhotoCarousel.jsx`: home-page carousel behavior and markup.
- `lib/storage.js`: local-storage fallback helpers and normalization.
- `lib/supabaseData.js`: Supabase table reads and writes for agenda, budget, notes, requests, member profiles, and private links. Passwords are handled separately by Supabase Auth.
- `lib/formatters.js`: display helpers for currency, dates, meeting sorting, and member-link titles.
- `lib/navigation.js`: the small client-side navigation helper used by links.
