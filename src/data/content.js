export const navItems = [
  { label: "About", href: "/about" },
  { label: "Novice Hub", href: "/novice-hub" },
  { label: "Calendar", href: "/calendar" },
  { label: "Meetings", href: "/meetings" },
  { label: "History", href: "/history" },
  { label: "Trophies", href: "/trophies" },
  { label: "E-Board", href: "/eboard" },
  { label: "Contact", href: "/contact" },
];

export const defaultBudsiteEditorSectionTitles = {
  meetings: { eyebrow: "Meeting Tools", title: "Meeting notes and public announcements", count: "2 editors" },
  novice: { eyebrow: "Novice Hub Editors", title: "Beginner education and FAQ content", count: "2 editors" },
  eboard: { eyebrow: "Public People", title: "Current e-board profiles and photos", count: "1 editor" },
  trophies: { eyebrow: "Trophies / APDA", title: "Results, achievements, and standings updates", count: "1 editor" },
  home: { eyebrow: "Landing Page", title: "Homepage carousel photos and captions", count: "1 editor" },
  memberTeamLinks: { title: "BUDS Team Specific Links" },
  memberCasebook: { title: "BUDS Casebook", description: "The BUDS Casebook collects shared cases, practice shells, and examples members can study, adapt, or run in practice. Add cases with a clear case name, concise statement, useful topic tags, and a link to the full document." },
  memberPrepOuts: { title: "BUDS Prep Outs", description: "The purpose of this section is to make and collect pre-prepared LOCs for cases that come up frequently in the league. Some of the cases also have copies of the PMC or MG spikes and overview (if we have access to them) or potential ideas for MO ballots. Each of the prep outs should have a relatively standardized heading with the case name and which team wrote/runs the case. Everyone is welcome to add or request prep outs but we ask that you do your best to adhere to the headings so we have sources and clear labels for everything." },
  memberRecordings: { title: "Recorded APDA Rounds", description: "These videos are APDA outrounds from cases and motions tournaments. Case or motion statements are usually linked in comments or video descriptions; some recordings include prep time before speeches start." },
  memberResourcesHero: { eyebrow: "Members Only", title: "Private BUDS links and debate resources.", description: "Team documents, calendars, and APDA guides for the season." },
  clubResourcesHero: { eyebrow: "Members Only", title: "Club resources.", description: "Forms, reimbursements, and day-to-day BUDS logistics for members." },
  clubForms: { title: "Forms" },
  clubParadigms: { title: "Paradigms" },
  clubReimbursements: { title: "Reimbursements" },
  trophyTopStats: { title: "Top Stats" },
  trophyAccomplishments: { title: "Accomplishments List" },
  trophyMilestones: { title: "Milestone Cards" },
  trophyMembers: { title: "Current Member Achievements" },
  trophyResults: { title: "Tournament Results Timeline" },
};

export const homeCarouselSlides = [
  {
    src: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80",
    alt: "Students walking together on a college campus",
    kicker: "Team Life",
    caption: "Temporary photo: BU students finding their people between classes and practice.",
  },
  {
    src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80",
    alt: "Students seated in a classroom discussion",
    kicker: "Practice",
    caption: "Temporary photo: weekly drills, practice rounds, and fast feedback.",
  },
  {
    src: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80",
    alt: "A group working around a table with notebooks and laptops",
    kicker: "Prep",
    caption: "Temporary photo: teammates building cases, blocks, and tournament plans.",
  },
  {
    src: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1200&q=80",
    alt: "Students gathered together in conversation",
    kicker: "Community",
    caption: "Temporary photo: debate friends, tournament weekends, and a team that travels together.",
  },
];

export const defaultHomeContent = {
  carouselSlides: homeCarouselSlides.map((slide, index) => ({
    id: `home-slide-${index + 1}`,
    ...slide,
  })),
};

export const noviceResources = [
  {
    title: "APDA Online Website",
    description: "League hub for resources, club standings, the APDA forum, and other debate information.",
    tag: "Resource",
    url: "https://apda.online/",
  },
  {
    title: "APDA Novice Guide to Debate",
    description: "Beginner-friendly guide made by APDA debaters that explains the basics of parliamentary debate for newcomers.",
    tag: "Resource",
    url: "https://docs.google.com/document/d/17ST1qeuoEmJB6zcFU80zfD6pmmSQVjwoERZu8btnOlM/edit?usp=sharing",
  },
  {
    title: "APDA Dictionary",
    description: "Reference for common APDA terms and lingo used in rounds, tournaments, and team discussions.",
    tag: "Resource",
    url: "https://docs.google.com/document/d/1M2odwpanTZe5w7Q4WCOCuBzlKkg2Re4-R48iIB3JT3g/edit?usp=sharing",
  },
  {
    title: "APDA Master Guide",
    description: "More exhaustive APDA knowledge base with links, advice, notes, and advanced resources.",
    tag: "Resource",
    url: "https://docs.google.com/document/d/1hO5OMV78lV0K4KjhqEFq3SqCRDGGdWmQT3DwS9ltZvA/edit?usp=sharing",
  },
];

export const privateLinks = [
  { id: "link-buds-drive", section: "BUDS Team Specific Links", order: 1, label: "BUDS Drive", description: "Team Drive for casebook files, forms, meeting notes, and shared resources.", url: "http://tinyurl.com/budsdrive" },
  { id: "link-tournament-signups", section: "BUDS Team Specific Links", order: 2, label: "Tournament Sign-Ups", description: "Sign up for tournaments as a competitor or judge, and note partner needs.", url: "https://docs.google.com/spreadsheets/d/1HUdRoHPHAwAfzchtA406yVSuRHhgjy-MGMmQbiouGnk/edit?usp=sharing" },
  { id: "link-events-calendar", section: "BUDS Team Specific Links", order: 3, label: "Events Google Calendar", description: "Add BUDS practices, events, and tournaments to your Google Calendar.", url: "https://calendar.google.com/calendar/u/0?cid=Y18yYmU4Mjk3YTk1NjE3MjRmMjIzNDc5MmU5Y2Q2OGVkOWYyZmM1ZDZjNmJlOTEwMDU2YjVhNzI1OGQ1MDk4Y2Y3QGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20" },
  { id: "link-matter-file", section: "BUDS Team Specific Links", order: 4, label: "Matter File", description: "Shared research bank for examples, facts, blocks, and reusable debate matter.", url: "https://docs.google.com/document/d/1_IijqSt4PlTua9QAK25wADsIw1zuZBfdhr-3yJtCNp4/edit?usp=drive_link" },
  { id: "link-equity-complaint", section: "Forms", order: 5, label: "Equity Complaint Form", description: "Raise concerns about equity, safety, or team climate.", url: "https://tinyurl.com/budsequity" },
  { id: "link-big-little", section: "Forms", order: 6, label: "Big-Little Form", description: "Rank preferences for the BUDS big-little mentor pairing.", url: "https://forms.gle/KXnfMfoggy6Mv4A1A" },
  { id: "link-prep-out", section: "Forms", order: 7, label: "Prep-Out Form", description: "Request prep-outs so the team can build shared responses.", url: "http://tinyurl.com/budsprepouts" },
  { id: "link-birthday", section: "Forms", order: 8, label: "Birthday Form", description: "Share your birthday for team reminders and registration details.", url: "https://forms.gle/7zdPNeiaw4XfMmoy7" },
  { id: "link-feedback", section: "Forms", order: 9, label: "Feedback Form", description: "Send ideas or feedback about lectures, events, and the club.", url: "https://forms.gle/ZiTMaAG1YNthi4Rh7" },
  { id: "link-apda-website", section: "Debater Resources", order: 10, label: "APDA Website", description: "League hub for resources, club standings, the APDA forum, and other debate information.", url: "https://apda.online/" },
  { id: "link-apda-novice-guide", section: "Debater Resources", order: 11, label: "APDA Novice Guide to Debate", description: "Beginner-friendly guide made by APDA debaters that explains the basics of parliamentary debate for newcomers.", url: "https://docs.google.com/document/d/17ST1qeuoEmJB6zcFU80zfD6pmmSQVjwoERZu8btnOlM/edit?usp=sharing" },
  { id: "link-apda-dictionary", section: "Debater Resources", order: 12, label: "APDA Dictionary", description: "Reference for common APDA terms and lingo used in rounds, tournaments, and team discussions.", url: "https://docs.google.com/document/d/1M2odwpanTZe5w7Q4WCOCuBzlKkg2Re4-R48iIB3JT3g/edit?usp=sharing" },
  { id: "link-apda-master-guide", section: "Debater Resources", order: 13, label: "APDA Master Guide", description: "More exhaustive APDA knowledge base with links, advice, notes, and advanced resources.", url: "https://docs.google.com/document/d/1hO5OMV78lV0K4KjhqEFq3SqCRDGGdWmQT3DwS9ltZvA/edit?usp=sharing" },
  { id: "casebook-lightning-mcqueen", section: "BUDS Casebook", order: 13, label: "Lightning McQueen", topicTags: ["Sports", "Actor"], description: "This house, as Lightning McQueen, would win the race.", url: "https://docs.google.com/document/d/147pYK84wIztSzan4zTAp6QUZe-hgvahqzXZoPokQ4eM/edit?usp=drive_link" },
  { id: "casebook-nerfed-drugs-novice-1", section: "BUDS Casebook", order: 14, label: "Nerfed Drugs", topicTags: ["Education", "Development"], description: "Caveating a tradeoff, THBT international debate programs in underdeveloped circuits should allocate the majority of resources to encourage grassroots participation in debate rather than achieving success in prestigious competitions.", url: "https://docs.google.com/document/d/1TxZAGY2L6DUEvYpbK6epQCrS2qoAHwiezgrstg2oor0/edit?usp=drive_link" },
  { id: "casebook-nerfed-elle-woods", section: "BUDS Casebook", order: 15, label: "Nerfed Elle Woods", topicTags: ["Law", "Feminism"], description: "This house believes it would be in Elle Woods' best interests not to attend law school.", url: "https://docs.google.com/document/d/1GzLUhwDyUKWEU4QAghnst_34lHntfcMUt1GpFU0ZsxY/edit?usp=drive_link" },
  { id: "casebook-nerfed-daredevil", section: "BUDS Casebook", order: 16, label: "Nerfed Daredevil", topicTags: ["Parenting", "Culture"], description: "This house, as parents/guardians, opposes telling our children Santa Claus is real.", url: "https://docs.google.com/document/d/1eOd9DvMnj-w2N4oEGgXLeAbkTXWeKSifK3Y2XlVntII/edit?usp=drive_link" },
  { id: "casebook-nerfed-drugs-novice-2", section: "BUDS Casebook", order: 17, label: "Nerfed Drugs 2", topicTags: ["Drugs", "Policy"], description: "This house believes that in areas with significant amounts of illegal trade and production of drugs, it would be preferable to the status quo for the government to decriminalize, produce, and sell drugs to addicts at very low prices.", url: "https://docs.google.com/document/d/1dW7rh8awjx8HxkaqbMKgyH5qozNd4Mw-lI2pK9s3OwY/edit?usp=drive_link" },
  { id: "casebook-osaka", section: "BUDS Casebook", order: 18, label: "Osaka", topicTags: ["Sports", "Actor"], description: "THW, as Osaka, forfeit the match.", url: "https://docs.google.com/document/d/1IKhqDMMXdhs9_4HFxDzKAOj0CDbraqIefMRGV4Fo0QE/edit?usp=drive_link" },
  { id: "casebook-santa-claus", section: "BUDS Casebook", order: 19, label: "Santa Claus", topicTags: ["Parenting", "Culture"], description: "This house, as parents/guardians, opposes telling our children Santa Claus is real.", url: "https://docs.google.com/document/d/1USppUsdWJT9Iwwuj87MDmKOTr-mYRrcvrrySYUMOVpM/edit?usp=drive_link" },
  { id: "casebook-zombie-apocalypse", section: "BUDS Casebook", order: 20, label: "Zombie Apocalypse", topicTags: ["Survival", "Sci-Fi"], description: "THW choose the boat.", url: "https://docs.google.com/document/d/1QqTWbK0KAd6Up54dIOd7RFd9OlZYfEV2VBbx-UDHZSs/edit?usp=drive_link" },
  { id: "casebook-acting-gay", section: "BUDS Casebook", order: 21, label: "Acting Gay", topicTags: ["LGBTQ+", "Media"], description: "This house opposes the narrative that straight actors should not play gay characters.", url: "https://docs.google.com/document/d/1vHPZZJB9AHgxWdbcZqcQ5aOJXAcpb0XmufKXRmAyrmY/edit?usp=drive_link" },
  { id: "casebook-amish-v-mormons", section: "BUDS Casebook", order: 22, label: "Amish v Mormons", topicTags: ["Religion", "War"], description: "This house believes that the Amish would have an advantage in a war against the Mormons.", url: "https://docs.google.com/document/d/1iEiyGPaRQa_ySnch0BflH4WmHRFIChehX9QmfvpwhoU/edit?usp=drive_link" },
  { id: "casebook-andor", section: "BUDS Casebook", order: 23, label: "Andor", topicTags: ["Star Wars", "Strategy"], description: "TH, as Luthen, would choose not to inform Saw about the Imperial trap laid for Kreegyr.", url: "https://docs.google.com/document/d/1cdi8c2aNUjm8YOaZZ0Q1UdjPb-LXDloW0AzRCzI17-s/edit?usp=drive_link" },
  { id: "casebook-bountygate", section: "BUDS Casebook", order: 24, label: "Bountygate", topicTags: ["Sports", "Ethics"], description: "TH, as the trainer, would not tell the commission of this fair play violation.", url: "https://docs.google.com/document/d/1_nfsc8t1hhVMTbqEfJQ4ytfuty6cyqyd-rb7_jtkFtA/edit?usp=drive_link" },
  { id: "casebook-meat", section: "BUDS Casebook", order: 25, label: "Meat", topicTags: ["Sex Work", "Law"], description: "This house would legalize sex work.", url: "https://docs.google.com/document/d/1mdjmXkb7T0hjguhCOBKMQCDcDfD-LhaHH_xV4FtBrNI/edit?usp=drive_link" },
  { id: "casebook-cyberpunk", section: "BUDS Casebook", order: 26, label: "Cyberpunk", topicTags: ["Environment", "Food"], description: "This house, as a modern American environmental advocacy organization, would rather advocate for locally sourced meat and dairy products as opposed to advocating for veganism.", url: "https://docs.google.com/document/d/1pB2uphV0T6Gsgu01McvpL8YYzPR-aNDWeaKXeFgOGko/edit?usp=drive_link" },
  { id: "casebook-daredevil-2", section: "BUDS Casebook", order: 27, label: "Daredevil 2.0", topicTags: ["Law", "Superheroes"], description: "This house, as Daredevil, would choose to pursue a career as a criminal prosecutor rather than pursue a career as a criminal defense attorney.", url: "https://docs.google.com/document/d/1tQ1wYQwXXlZryGK1pOjSVyl6cc-yL4y6Ok3hjNTdd2E/edit?usp=drive_link" },
  { id: "casebook-drugs", section: "BUDS Casebook", order: 28, label: "Drugs", topicTags: ["Drugs", "Policy"], description: "This house believes that in areas with significant amounts of illegal trade and production of drugs, it would be preferable to the status quo for the government to decriminalize, produce, and sell drugs to addicts at very low prices.", url: "https://docs.google.com/document/d/16ETyqUed_EMpNU9nQ_A40D1W749DLOEV6IBkmd8A_eA/edit?usp=drive_link" },
  { id: "casebook-infant-annihilator", section: "BUDS Casebook", order: 29, label: "Infant Annihilator", topicTags: ["Music", "Politics"], description: "This house, as the band currently named Infant Annihilator, would change your band name.", url: "https://docs.google.com/document/d/1iQYxcvadPxD11djFiGhowXZlT_5nUeTi2aBBsNGMVc8/edit?usp=drive_link" },
  { id: "casebook-lateralus", section: "BUDS Casebook", order: 30, label: "Lateralus 1.0", topicTags: ["Music", "Philosophy"], description: "This house interprets the meaning of the song Lateralus by Tool to be about the pursuit of knowledge.", url: "https://docs.google.com/document/d/1M7FGiS6nlbYgts5PwqRnZAutwddgz8U9XRfw0Fnbeqs/edit?usp=drive_link" },
  { id: "casebook-legally-blonde", section: "BUDS Casebook", order: 31, label: "Legally Blonde", topicTags: ["Film", "Law"], description: "This house believes it would be in Elle Woods' best interests not to attend law school.", url: "https://docs.google.com/document/d/1eeiAjEsE1DYbx8zO_ebxrZDx9qRbk5j9tAz_O7Yc3zg/edit?usp=drive_link" },
  { id: "casebook-logic-and-emotion", section: "BUDS Casebook", order: 32, label: "Logic and Emotion", topicTags: ["Philosophy", "Culture"], description: "This house opposes the conception that logic and emotion are distinct opposites.", url: "https://docs.google.com/document/d/1xvlVYjWgtLATj6_o5gRHiZeUYFB7RYnniU8Cn-ytb_U/edit?usp=drive_link" },
  { id: "casebook-meat-3", section: "BUDS Casebook", order: 33, label: "Meat 3.0", topicTags: ["Environment", "Food"], description: "This house, as a modern American environmental advocacy organization, would rather advocate for locally sourced meat and dairy products as opposed to advocating for veganism.", url: "https://docs.google.com/document/d/1HbHu_xTUkNH-Yor9NrsuW4qYgiOiz0eMc6EjJ_sJeAg/edit?usp=drive_link" },
  { id: "casebook-mr-meeseeks", section: "BUDS Casebook", order: 34, label: "Mr. Meeseeks", topicTags: ["TV", "Ethics"], description: "This house believes the Meeseeks Box is immoral.", url: "https://docs.google.com/document/d/1G7qs2GDox4_z7_xCaeeGSf2p_BrKAiyarxV9_JPwqAQ/edit?usp=drive_link" },
  { id: "casebook-r-v-brown", section: "BUDS Casebook", order: 35, label: "R v Brown", topicTags: ["Law", "Autonomy"], description: "This house believes the House of Lords should rule in favor of the appellants.", url: "https://docs.google.com/document/d/1ePGT7S7ct8lYIFLD07AYPrb7UBetZkYAfj8tyWEeZHs/edit?usp=drive_link" },
  { id: "casebook-seahawks", section: "BUDS Casebook", order: 36, label: "Seahawks", topicTags: ["Sports", "Strategy"], description: "TH, as the Seahawks, would run the ball.", url: "https://docs.google.com/document/d/1LUiU1c9HghWkKkr0Jtyh5Mivg56R3FnUW1zp6FG9qQM/edit?usp=drive_link" },
  { id: "casebook-the-matrix", section: "BUDS Casebook", order: 37, label: "The Matrix", topicTags: ["Sci-Fi", "Philosophy"], description: "This house, as this actor, would rather take the blue pill than the red pill.", url: "https://docs.google.com/document/d/1O3Bt3DURv1i4Zv-Pf733OrulLr5TQeijmiG6DpU3n1o/edit?usp=drive_link" },
  { id: "casebook-trolley-problem-2", section: "BUDS Casebook", order: 38, label: "Trolley Problem^2", topicTags: ["LGBTQ+", "Media"], description: "This house opposes the narrative that straight actors should not play gay characters.", url: "https://docs.google.com/document/d/1PhvK0FunIJhDhqXIZ1Sh-iqwYW0zzfSLLQy1YFSGRpo/edit?usp=sharing" },
  { id: "casebook-trolley-problem-3", section: "BUDS Casebook", order: 39, label: "Trolley Problem^3", topicTags: ["Ethics", "Hypothetical"], description: "Given two choices for things to find living in your attic, this house would rather find one full-grown man than 1,000 cockroaches.", url: "https://docs.google.com/document/d/19nR32lCIlvttyCR7ofLPtaOph2p_7HkfIAMu3MfzYhE/edit?usp=drive_link" },
  { id: "prepout-believe-in-god", section: "BUDS Prep Outs", order: 40, label: "Believe in God", topicTags: ["Harvard"], description: "THW believe in God.", url: "https://docs.google.com/document/d/1zqppYN-EYP21tOK6dQMqegbJ09kmSLtnVyeyO2KulYY/edit?usp=drive_link" },
  { id: "prepout-ccp-manufacturing", section: "BUDS Prep Outs", order: 41, label: "CCP Manufacturing", topicTags: ["Rutgers"], description: "As the Chinese Communist Party, don't significantly downsize China's manufacturing sector.", url: "https://docs.google.com/document/d/1ujtO-VQQXDficrQLjnwPye3DjnOE8qz1IxI7XdYWrG4/edit?usp=sharing" },
  { id: "prepout-extraction", section: "BUDS Prep Outs", order: 42, label: "Extraction", topicTags: ["Bates"], description: "THBT it is in the best interests of Hiroshi Yomiuri to stay at Maas and not take the offer.", url: "https://docs.google.com/document/d/1CxBvxTezJttc8FLVbqM5Tv917u1nico6gFhuWy4gOw8/edit?usp=drive_link" },
  { id: "prepout-immigration", section: "BUDS Prep Outs", order: 43, label: "Immigration", topicTags: ["Harvard"], description: "Preferable to the status quo, the US should drastically increase immigration to reach 1 billion people in the next several decades.", url: "https://docs.google.com/document/d/1JMNWfse_AL7lxtCZZamInIapAFIytwl-8wr6kcglUTw/edit?usp=drive_link" },
  { id: "prepout-international-debate-programs", section: "BUDS Prep Outs", order: 44, label: "International Debate Programs", topicTags: ["UChicago"], description: "THBT international debate programs in underdeveloped circuits should prioritize grassroots participation over success in prestigious competitions.", url: "https://docs.google.com/document/d/1QfaflFLfNJk-sWdo9XXYFt7M4U6n0OiiyRk8HuTmCbs/edit?usp=drive_link" },
  { id: "prepout-invading-taiwan", section: "BUDS Prep Outs", order: 45, label: "Invading Taiwan", topicTags: ["Dartmouth"], description: "THBT it is in the interest of Xi Jinping to invade Taiwan.", url: "https://docs.google.com/document/d/1erg603Ff5N9frhX29FuHjiV42iFKjmBb7DtXKwqUySk/edit?usp=drive_link" },
  { id: "prepout-qualia", section: "BUDS Prep Outs", order: 46, label: "Qualia", topicTags: ["George Washington"], description: "THB qualia, per the definition above, does not exist.", url: "https://docs.google.com/document/d/15Fl3tZzA5lMGgb36FPv5IvXYimjQosnge0yUyofL2LM/edit?usp=drive_link" },
  { id: "prepout-trade-unions", section: "BUDS Prep Outs", order: 47, label: "Trade Unions", topicTags: ["Northeastern"], description: "In the United States, THBT we should defer to trade unions over direct government intervention in labor practices.", url: "https://docs.google.com/document/d/1JIIKK52XaMtIgzuzcu5ogNGa0on5b78D6Xp9rDWoMY0/edit?usp=drive_link" },
  { id: "prepout-van-gogh", section: "BUDS Prep Outs", order: 48, label: "Van Gogh", topicTags: ["Institution TBD"], description: "We say, don't bring Van Gogh to the present.", url: "https://docs.google.com/document/d/1UPnlgyNgmeWe4Ody9f7iphhE0ZsagBZLfYyY-31vEuQ/edit?usp=drive_link" },
  { id: "recording-2024-au-semis", section: "Recorded APDA Rounds", order: 49, label: "2024 AU Semis", topicTags: ["Cases"], description: "It would be preferable to the status quo to restrict RBI in Anguilla to a $150k gift to the CDF.", url: "https://www.youtube.com/watch?v=yMrB88_WLQE" },
  { id: "recording-tufts-quarters-2024", section: "Recorded APDA Rounds", order: 50, label: "Tufts Quarters 2024", topicTags: ["Cases"], description: "Outround recording from a cases tournament.", url: "https://www.youtube.com/watch?v=EwrFHEEAS4c" },
  { id: "recording-williams-finals-2023", section: "Recorded APDA Rounds", order: 51, label: "Williams Finals 2023", topicTags: ["Cases"], description: "THP a satisfied life over a striving life.", url: "https://www.youtube.com/watch?v=9m_24Zo-O_k" },
  { id: "recording-williams-2024-semis", section: "Recorded APDA Rounds", order: 52, label: "Williams 2024 Semis", topicTags: ["Cases"], description: "Preferable to the status quo, THBT the ECB should remove zero-risk weighting status for bonds.", url: "https://www.youtube.com/watch?v=WzsSQQjzozQ4" },
  { id: "recording-williams-24-varsity-semifinals", section: "Recorded APDA Rounds", order: 53, label: "Williams 24 Varsity Semifinals", topicTags: ["Cases"], description: "THB it is in Jonas Savimbi's best interests to accept the 1992 election results and demobilize UNITA.", url: "https://www.youtube.com/watch?v=1YMccv-5zAs" },
  { id: "recording-2025-amherst-finals", section: "Recorded APDA Rounds", order: 54, label: "2025 Amherst Finals", topicTags: ["Cases"], description: "This house regrets The Prime Directive.", url: "https://www.youtube.com/watch?v=zAEm_cJ8xYo" },
  { id: "recording-brown-wesleyan-semis-2023", section: "Recorded APDA Rounds", order: 55, label: "Brown/Wesleyan Semis 2023", topicTags: ["Cases"], description: "Caveating success, TH, as Radical Republicans post-Civil War, would repeal the 10th Amendment.", url: "https://www.youtube.com/watch?v=SBqGcaITDqI" },
  { id: "recording-nats-2024-quarters", section: "Recorded APDA Rounds", order: 56, label: "Nats 2024 Quarters", topicTags: ["Cases"], description: "THBT it is in the best interests of Hiroshi Yomiuri to stay at Maas and not take the offer.", url: "https://www.youtube.com/watch?v=VYI3GnWKRaM" },
  { id: "recording-2025-nats-semis", section: "Recorded APDA Rounds", order: 57, label: "2025 Nats Semis", topicTags: ["Cases"], description: "Time-spaced to August 1990, THBT it is not in Saddam Hussein's regime's interests for Iraq to invade Kuwait.", url: "https://www.youtube.com/watch?v=F4QZTK0mUPs" },
  { id: "recording-2025-rutgers-finals", section: "Recorded APDA Rounds", order: 58, label: "2025 Rutgers Finals", topicTags: ["Motions"], description: "Assuming equal religious merit, THBT a devout Hindu community should follow Advaita Vedanta rather than Dvaita Vedanta.", url: "https://www.youtube.com/watch?v=8D4IA3rqOXc" },
  { id: "recording-2025-drexel-finals", section: "Recorded APDA Rounds", order: 59, label: "2025 Drexel Finals", topicTags: ["Motions"], description: "THS a presidential coup by the military in Venezuela.", url: "https://www.youtube.com/watch?v=WqHEw5ZvNGc" },
  { id: "recording-2025-chicago-finals", section: "Recorded APDA Rounds", order: 60, label: "2025 Chicago Finals", topicTags: ["Motions"], description: "THW adopt feline philosophy.", url: "https://www.youtube.com/watch?v=FyLsJwZPtYU" },
  { id: "recording-princeton-finals-2025", section: "Recorded APDA Rounds", order: 61, label: "Princeton Finals 2025", topicTags: ["Motions"], description: "THBT the existence of billionaires is immoral.", url: "https://youtu.be/n1Lw0WPGyr4" },
  { id: "recording-princeton-octofinals-2025", section: "Recorded APDA Rounds", order: 62, label: "Princeton Octofinals 2025", topicTags: ["Motions"], description: "THBT cities are on balance feminist spaces.", url: "https://www.youtube.com/watch?v=aWlGvtTApkg" },
  { id: "recording-2025-rutgers-semis", section: "Recorded APDA Rounds", order: 63, label: "2025 Rutgers Semis", topicTags: ["Motions"], description: "THS the rise of Pink Feminism in China.", url: "https://www.youtube.com/watch?v=Kg3c1hS0fRY" },
  { id: "recording-2025-apda-summer-open-quarters", section: "Recorded APDA Rounds", order: 64, label: "2025 APDA Summer Open Quarters", topicTags: ["Motions"], description: "TH, as prominent Black abolitionists in the antebellum North, would interpret the Constitution as anti-slavery rather than pro-slavery.", url: "https://www.youtube.com/watch?v=LvQxBExwMic" },
];

export const privateLinkDefaultsById = Object.fromEntries(privateLinks.map((link) => [link.id, link]));
export const privateFormLinkIds = ["link-equity-complaint", "link-big-little", "link-prep-out", "link-birthday", "link-feedback"];
export const privateLinkSections = ["BUDS Team Specific Links", "Forms", "Debater Resources", "BUDS Casebook", "BUDS Prep Outs", "Recorded APDA Rounds"];

export function getPrivateLinkSection(link) {
  if (privateFormLinkIds.includes(link.id)) return "Forms";
  if (link.id?.startsWith("casebook-")) return "BUDS Casebook";
  if (link.id?.startsWith("prepout-")) return "BUDS Prep Outs";
  if (link.id?.startsWith("recording-")) return "Recorded APDA Rounds";
  return link.section;
}

export const agendaItems = [
  { id: "agenda-1", text: "Tournament registration and travel", owner: "President", due: "Add date" },
  { id: "agenda-2", text: "Novice curriculum updates", owner: "Co-Vice Presidents", due: "Add date" },
  { id: "agenda-3", text: "Practice attendance and pairings", owner: "Secretary", due: "Add date" },
  { id: "agenda-4", text: "Funding, reimbursements, and budget approvals", owner: "Treasurer", due: "Add date" },
  { id: "agenda-5", text: "Outreach, alumni, and recruitment", owner: "Membership Coordinator", due: "Add date" },
];

export const initialBudgetRows = [
  { id: "budget-1", category: "Tournament fees", allocated: 1500, spent: 0, status: "On Hold" },
  { id: "budget-2", category: "Travel", allocated: 3000, spent: 0, status: "On Hold" },
  { id: "budget-3", category: "Team events", allocated: 500, spent: 0, status: "On Hold" },
  { id: "budget-4", category: "Merch and supplies", allocated: 750, spent: 0, status: "On Hold" },
];

export const initialBudgetRevenueRows = [];

export const accomplishments = [
  "100+ members on Terrier Central",
  "2025-26 COTY: #4 nationally, 218.5 points",
  "2024-25 COTY: #6 nationally, 156.5 points",
  "2025-26 COTY contributors: 11 BU debaters",
];

export const timeline = [
  {
    year: "2004-05",
    title: "Digital APDA records begin tracking BU.",
    copy: "APDA Results lists BU-hosted tournaments and school standings from the 2004-05 season onward.",
  },
  {
    year: "2008-09",
    title: "BU reaches #3 in COTY.",
    copy: "Boston University posts 298.5 COTY points, the strongest APDA Results finish currently listed for the school.",
  },
  {
    year: "2025-26",
    title: "The current team climbs to #4 nationally.",
    copy: "The current APDA Results season lists Boston University at #4 in COTY with 218.5 points.",
  },
];

export const apdaHistoryStats = [
  { value: "#4", label: "2025-26 COTY rank", detail: "218.5 points" },
  { value: "100+", label: "Current members", detail: "Members on Terrier Central" },
  { value: "11", label: "COTY contributors", detail: "Debaters with 2025-26 COTY points" },
  { value: "#6", label: "2024-25 COTY rank", detail: "156.5 points" },
];

export const apdaSourceUrl = "https://results.apda.online/core/schools/6?season=2025";

export const apdaChronologicalResults = [
  {
    date: "2025-09-19",
    tournament: "Bates",
    highlights: [
      "Boston University SL (Yash Shetty and Josh Lyons) are Varsity Champions.",
      "Boston University NL (Clemente Nicado Yelmene and Ryan Lin) reaches Varsity Quarter-Finals.",
      "Yash Shetty earns 7th Varsity Speaker.",
    ],
  },
  {
    date: "2025-09-26",
    tournament: "Tufts",
    highlights: ["Vishaal Arunprasad earns 7th Novice Speaker."],
  },
  {
    date: "2025-10-10",
    tournament: "Harvard",
    highlights: ["Boston University LC (Janice Lee and Oscar Cloutier Potter) reaches Varsity Octo-Finals."],
  },
  {
    date: "2025-10-17",
    tournament: "Williams",
    highlights: ["Yash Shetty earns 8th Varsity Speaker."],
  },
  {
    date: "2025-10-24",
    tournament: "Brown",
    highlights: [
      "Boston University SL (Yash Shetty and Josh Lyons) reaches Varsity Octo-Finals.",
      "Lucia Bronfman earns 6th Novice Speaker.",
    ],
  },
  {
    date: "2025-10-31",
    tournament: "Brandeis",
    highlights: [
      "Amherst / Boston University GK (Jonah Gatoff and Nathan Khoury) are Novice Champions.",
      "Janice Lee earns 3rd Novice Speaker; Jonah Gatoff earns 6th Novice Speaker.",
    ],
  },
  {
    date: "2025-11-07",
    tournament: "Northeastern ProAms",
    highlights: ["Boston University FL (Cassandra Fitts and Janice Lee) reaches Varsity Octo-Finals."],
  },
  {
    date: "2025-11-14",
    tournament: "Wesleyan",
    highlights: [
      "Boston University PC (Mimi Plawner and Oscar Cloutier Potter) places 2nd in Varsity Team.",
      "Boston University / Wellesley FC (Cassandra Fitts and Emma Chi) and Boston University LB (Janice Lee and Lucia Bronfman) reach Varsity Quarter-Finals.",
      "Lucia Bronfman earns 3rd Novice Speaker; Cassandra Fitts earns 8th Varsity Speaker; Oscar Cloutier Potter earns 10th Varsity Speaker.",
    ],
  },
  {
    date: "2025-11-21",
    tournament: "Fordham",
    highlights: [
      "Boston University SL (Yash Shetty and Josh Lyons) reaches Varsity Semi-Finals.",
      "Boston University HB (Allegra Hoddie and Lucia Bronfman) are Novice Champions.",
      "Josh Lyons earns 1st Varsity Speaker; Yash Shetty earns 6th Varsity Speaker; Lucia Bronfman earns 3rd Novice Speaker.",
    ],
  },
  {
    date: "2025-12-05",
    tournament: "Wellesley",
    highlights: [
      "Boston University FP (Cassandra Fitts and Mimi Plawner) reaches Varsity Semi-Finals.",
      "Boston University LB (Janice Lee and Lucia Bronfman) are Novice Champions.",
      "Lucia Bronfman earns 2nd Novice Speaker and 5th Varsity Speaker; Janice Lee earns 3rd Novice Speaker and 7th Varsity Speaker; Cassandra Fitts earns 6th Varsity Speaker; Mimi Plawner earns 8th Varsity Speaker; Flo Arnado earns 10th Novice Speaker.",
    ],
  },
  {
    date: "2026-01-02",
    tournament: "University of Delaware",
    highlights: [
      "Boston University LB (Josh Lyons and Lucia Bronfman) places 2nd in Varsity Team.",
      "Boston University PC (Mimi Plawner and Oscar Cloutier Potter) reaches Varsity Semi-Finals.",
      "Yash Shetty earns 1st Varsity Speaker; Janice Lee earns 1st Novice Speaker.",
    ],
  },
  {
    date: "2026-01-09",
    tournament: "Drexel II",
    highlights: [
      "Boston University FL (Cassandra Fitts and Janice Lee) reaches Varsity Semi-Finals.",
      "Boston University BC (Lucia Bronfman and Oscar Cloutier Potter) reaches Varsity Quarter-Finals.",
      "Lucia Bronfman earns 1st Novice Speaker and 7th Varsity Speaker.",
    ],
  },
  {
    date: "2026-01-23",
    tournament: "University of Chicago",
    highlights: ["Boston University SL (Yash Shetty and Josh Lyons) reaches Varsity Quarter-Finals."],
  },
  {
    date: "2026-02-06",
    tournament: "Rutgers",
    highlights: [
      "Boston University BA (Lucia Bronfman and Vishaal Arunprasad) places 2nd in Novice Team.",
      "Lucia Bronfman earns 7th Novice Speaker.",
    ],
  },
  {
    date: "2026-02-13",
    tournament: "Columbia",
    highlights: [
      "Boston University HL (Allegra Hoddie and Janice Lee) are Novice Champions.",
      "Allegra Hoddie earns 5th Novice Speaker; Janice Lee earns 6th Novice Speaker.",
    ],
  },
  {
    date: "2026-02-20",
    tournament: "Amherst ProAms",
    highlights: [
      "Boston University LB (Josh Lyons and Lucia Bronfman) are Varsity Champions.",
      "Boston University LS (Janice Lee and Yash Shetty) reaches Varsity Semi-Finals.",
      "Boston University CA (Oscar Cloutier Potter and Vishaal Arunprasad) reaches Varsity Quarter-Finals.",
      "Yash Shetty earns 4th Varsity Speaker; Oscar Cloutier Potter earns 6th Varsity Speaker; Josh Lyons earns 10th Varsity Speaker; Lucia Bronfman earns 4th Novice Speaker.",
    ],
  },
  {
    date: "2026-02-27",
    tournament: "Brandeis II",
    highlights: [
      "Boston University / University of Chicago BS (Lucia Bronfman and Rohan Sachdev) are Varsity Champions.",
      "Boston University SL (Yash Shetty and Josh Lyons) reaches Varsity Quarter-Finals.",
      "Lucia Bronfman earns 1st Novice Speaker and 9th Varsity Speaker.",
    ],
  },
  {
    date: "2026-03-06",
    tournament: "Brown II",
    highlights: [
      "Boston University SL (Yash Shetty and Josh Lyons) reaches Varsity Quarter-Finals.",
      "Lucia Bronfman earns 7th Novice Speaker; Vishaal Arunprasad earns 8th Novice Speaker.",
    ],
  },
  {
    date: "2026-03-13",
    tournament: "American II",
    highlights: ["Lucia Bronfman earns 7th Novice Speaker; Janice Lee earns 8th Novice Speaker."],
  },
  {
    date: "2026-03-27",
    tournament: "Northeastern",
    highlights: [
      "Boston University HB (Allegra Hoddie and Lucia Bronfman) are Novice Champions.",
      "Boston University FS (Cassandra Fitts and Yash Shetty) reaches Varsity Quarter-Finals.",
      "Lucia Bronfman earns 4th Novice Speaker; Campbell Haire earns 10th Novice Speaker.",
    ],
  },
  {
    date: "2026-04-03",
    tournament: "Yale",
    highlights: ["Lucia Bronfman earns 3rd Novice Speaker; Vishaal Arunprasad earns 9th Novice Speaker."],
  },
  {
    date: "2026-04-10",
    tournament: "Princeton",
    highlights: ["Boston University / Brandeis BK (Lucia Bronfman and Wil Kozlowski) reaches Novice Semi-Finals."],
  },
  {
    date: "2026-04-17",
    tournament: "University of Massachusetts",
    highlights: [
      "Boston University SL (Yash Shetty and Josh Lyons) reaches Varsity Semi-Finals.",
      "Boston University LB (Janice Lee and Lucia Bronfman) and Boston University HA (Max Hurowitz and Vishaal Arunprasad) reach Varsity Quarter-Finals.",
      "Lucia Bronfman earns 3rd Novice Speaker; Janice Lee earns 6th Novice Speaker; Oscar Cloutier Potter earns 4th Varsity Speaker; Josh Lyons earns 5th Varsity Speaker.",
    ],
  },
  {
    date: "2026-04-24",
    tournament: "Johns Hopkins Nationals",
    highlights: [
      "Boston University SL (Yash Shetty and Josh Lyons) reaches Varsity Quarter-Finals.",
      "Janice Lee earns 6th Novice Speaker; Josh Lyons earns 16th Varsity Speaker.",
    ],
  },
];

export const currentMemberAchievements = [
  { name: "Allegra Hoddie", meta: "1st year, Varsity", achievements: ["Fordham: Novice Champion", "Columbia: Novice Champion and 5th Novice Speaker", "Northeastern: Novice Champion"] },
  { name: "Anza Rizvi", meta: "1st year, Varsity", achievements: ["No 2025-26 APDA awards listed yet."] },
  { name: "Ashvin Baker", meta: "1st year, Varsity", achievements: ["No 2025-26 APDA awards listed yet."] },
  { name: "Bryan Machado", meta: "1st year, Varsity", achievements: ["No 2025-26 APDA awards listed yet."] },
  { name: "Campbell Haire", meta: "1st year, Novice", achievements: ["Northeastern: 10th Novice Speaker"] },
  { name: "Cassandra Fitts", meta: "2nd year, Varsity", achievements: ["#48 TOTY with Janice Lee", "#57 TOTY with Yash Shetty", "Northeastern ProAms: Varsity Octo-Finalist", "Wellesley and Drexel II: Varsity Semi-Finalist"] },
  { name: "Clemente Nicado Yelmene", meta: "4th year, Varsity", achievements: ["#92 TOTY with Ryan Lin", "Bates: Varsity Quarter-Finalist"] },
  { name: "Coco Greene", meta: "2nd year, Varsity", achievements: ["No 2025-26 APDA awards listed yet."] },
  { name: "Diya Aneesh", meta: "1st year, Novice", achievements: ["No 2025-26 APDA awards listed yet."] },
  { name: "Enrique Abud Evereteze", meta: "1st year, Varsity", achievements: ["No 2025-26 APDA awards listed yet."] },
  { name: "Eva Rivera", meta: "2nd year, Varsity", achievements: ["No 2025-26 APDA awards listed yet."] },
  { name: "Ezzah Tariq", meta: "1st year, Varsity", achievements: ["No 2025-26 APDA awards listed yet."] },
  { name: "Flo Arnado", meta: "1st year, Varsity", achievements: ["Wellesley: 10th Novice Speaker"] },
  { name: "Gabe Gucanac", meta: "1st year, Varsity", achievements: ["No 2025-26 APDA awards listed yet."] },
  { name: "Gabriel Burr", meta: "1st year, Varsity", achievements: ["No 2025-26 APDA awards listed yet."] },
  { name: "Janice Lee", meta: "1st year, Varsity", achievements: ["#48 TOTY with Cassandra Fitts", "#63 TOTY with Oscar Cloutier Potter", "#77 TOTY with Lucia Bronfman", "Columbia: Novice Champion with Allegra Hoddie"] },
  { name: "Jiya Mahapatra", meta: "1st year, Varsity", achievements: ["No 2025-26 APDA awards listed yet."] },
  { name: "John Yule", meta: "1st year, Novice", achievements: ["No 2025-26 APDA awards listed yet."] },
  { name: "Jonah Gatoff", meta: "1st year, Varsity", achievements: ["Brandeis: Novice Champion", "Brandeis: 6th Novice Speaker"] },
  { name: "Joseph Sherma", meta: "1st year, Novice", achievements: ["No 2025-26 APDA awards listed yet."] },
  { name: "Josh Lyons", meta: "2nd year, Varsity", achievements: ["#8 TOTY with Yash Shetty", "#44 TOTY with Lucia Bronfman", "#19 SOTY", "Bates and Amherst ProAms: Varsity Champion"] },
  { name: "Kanchan Pothireddy", meta: "1st year, Novice", achievements: ["No 2025-26 APDA awards listed yet."] },
  { name: "Ling Lu", meta: "1st year, Varsity", achievements: ["No 2025-26 APDA awards listed yet."] },
  { name: "Lucia Bronfman", meta: "1st year, Novice", achievements: ["#44, #77, and #92 TOTY entries", "Fordham, Wellesley, Northeastern: Novice Champion", "Brandeis II: Varsity Champion", "Speaker awards include 1st Novice Speaker at Drexel II and Brandeis II, 5th Varsity Speaker at Wellesley, and 9th Varsity Speaker at Brandeis II"] },
  { name: "Max Hurowitz", meta: "2nd year, Varsity", achievements: ["#92 TOTY with Vishaal Arunprasad", "University of Massachusetts: Varsity Quarter-Finalist"] },
  { name: "Mimi Plawner", meta: "2nd year, Varsity", achievements: ["#27 TOTY with Oscar Cloutier Potter", "Wesleyan: 2nd Varsity Team", "Wellesley and University of Delaware: Varsity Semi-Finalist"] },
  { name: "Mollie Micinilio", meta: "1st year, Novice", achievements: ["No 2025-26 APDA awards listed yet."] },
  { name: "Myra Niang", meta: "1st year, Varsity", achievements: ["No 2025-26 APDA awards listed yet."] },
  { name: "Nicole Asuamah", meta: "1st year, Varsity", achievements: ["No 2025-26 APDA awards listed yet."] },
  { name: "Nicole Dwaah", meta: "1st year, Novice", achievements: ["No 2025-26 APDA awards listed yet."] },
  { name: "Nikhil Saxena", meta: "1st year, Varsity", achievements: ["No 2025-26 APDA awards listed yet."] },
  { name: "Oscar Cloutier Potter", meta: "3rd year, Varsity", achievements: ["#27, #63, and #92 TOTY entries", "#35 SOTY", "Wesleyan: 2nd Varsity Team", "University of Delaware: Varsity Semi-Finalist"] },
  { name: "Rachel Leone", meta: "2nd year, Varsity", achievements: ["No 2025-26 APDA awards listed yet."] },
  { name: "Rahul Yehiya", meta: "1st year, Novice", achievements: ["No 2025-26 APDA awards listed yet."] },
  { name: "Rita Mayevskaya", meta: "2nd year, Varsity", achievements: ["No 2025-26 APDA awards listed yet."] },
  { name: "Ryan Lin", meta: "4th year, Varsity", achievements: ["#92 TOTY with Clemente Nicado Yelmene", "Bates: Varsity Quarter-Finalist"] },
  { name: "Sandro D'Aveta", meta: "1st year, Novice", achievements: ["No 2025-26 APDA awards listed yet."] },
  { name: "Sara Chun", meta: "1st year, Novice", achievements: ["No 2025-26 APDA awards listed yet."] },
  { name: "Sarah Rooney", meta: "1st year, Novice", achievements: ["No 2025-26 APDA awards listed yet."] },
  { name: "Sonia Teodorescu", meta: "1st year, Varsity", achievements: ["No 2025-26 APDA awards listed yet."] },
  { name: "Sophie Xu", meta: "1st year, Varsity", achievements: ["No 2025-26 APDA awards listed yet."] },
  { name: "Srishti Nautiyal", meta: "2nd year, Varsity", achievements: ["No 2025-26 APDA awards listed yet."] },
  { name: "Stanley Kuo", meta: "1st year, Novice", achievements: ["No 2025-26 APDA awards listed yet."] },
  { name: "Tahalia Nira", meta: "2nd year, Varsity", achievements: ["No 2025-26 APDA awards listed yet."] },
  { name: "Thomas Sargent", meta: "1st year, Novice", achievements: ["No 2025-26 APDA awards listed yet."] },
  { name: "Thomas Suchowolec", meta: "1st year, Novice", achievements: ["No 2025-26 APDA awards listed yet."] },
  { name: "Vishaal Arunprasad", meta: "1st year, Novice", achievements: ["#92 TOTY with Max Hurowitz", "Rutgers: 2nd Novice Team", "Amherst ProAms and University of Massachusetts: Varsity Quarter-Finalist", "Novice Speaker awards include 6th at Brandeis II, 7th at Tufts, 8th at Brown II, and 9th at Yale"] },
  { name: "Vivaan Pagariya", meta: "1st year, Novice", achievements: ["No 2025-26 APDA awards listed yet."] },
  { name: "Yash Shetty", meta: "2nd year, Varsity", achievements: ["#8 TOTY with Josh Lyons", "#20 SOTY", "Bates: Varsity Champion", "Varsity Speaker awards include 1st at University of Delaware, 4th at Amherst ProAms, 6th at Fordham, 7th at Bates, and 8th at Williams"] },
  { name: "Zahi Wali Aadit", meta: "1st year, Varsity", achievements: ["No 2025-26 APDA awards listed yet."] },
  { name: "Zimo-Tracy Ge", meta: "2nd year, Varsity", achievements: ["No 2025-26 APDA awards listed yet."] },
];

export const defaultTrophiesContent = {
  sourceUrl: apdaSourceUrl,
  stats: apdaHistoryStats,
  milestones: timeline,
  accomplishments,
  resultSeasons: [
    { id: "2026-2027", label: "2026-2027 Results Timeline", results: [] },
    { id: "2025-2026", label: "2025-26 Results Timeline", results: apdaChronologicalResults },
  ],
  results: apdaChronologicalResults,
  members: currentMemberAchievements,
};

export const defaultMeetingsContent = {
  announcementTitle: "Announcements",
  announcementBody: "Add a short public update for upcoming meetings, deadlines, travel reminders, or tournament logistics.",
  announcementUpdatedAt: "",
};

export const defaultNoviceContent = {
  speechSteps: [
    {
      id: "speech-case-statement",
      order: 1,
      side: "gov",
      title: "Reading of Case Statement",
      time: "10 sec - 1 min",
      icon: "file",
      copy: "The Prime Minister reads the case title, a short setup, and what the judge is being asked to vote for.",
      note: "",
    },
    {
      id: "speech-pocs",
      order: 2,
      side: "opp",
      title: "Points of Clarification",
      time: "Up to 15 min",
      icon: "help",
      copy: "Both teams ask questions to clarify the case. Government answers, but no arguments are made yet.",
      note: "",
    },
    {
      id: "speech-pmc",
      order: 3,
      side: "gov",
      title: "Prime Minister Constructive",
      time: "7 min, 30 sec grace",
      icon: "mic",
      copy: "Government defines terms, explains the plan, and gives the main reasons the case should win.",
      note: "",
    },
    {
      id: "speech-loc",
      order: 4,
      side: "opp",
      title: "Leader of Opposition Constructive",
      time: "8 min, 30 sec grace",
      icon: "mic",
      copy: "Opposition responds to the case, challenges framing, and gives independent reasons to reject it.",
      note: "",
    },
    {
      id: "speech-mg",
      order: 5,
      side: "gov",
      title: "Member of Government",
      time: "8 min, 30 sec grace",
      icon: "mic",
      copy: "Government extends the case with new material, answers opposition arguments, and weighs the debate.",
      note: "",
    },
    {
      id: "speech-mo",
      order: 6,
      side: "opp",
      title: "Member of Opposition",
      time: "8 min, 30 sec grace",
      icon: "mic",
      copy: "Opposition adds new offense, rebuilds earlier points, and explains why government has not met its burden.",
      note: "",
    },
    {
      id: "speech-lor",
      order: 7,
      side: "opp",
      title: "Leader of Opposition Rebuttal",
      time: "4 min, 30 sec grace",
      icon: "scroll",
      copy: "Opposition summarizes the round and compares the strongest reasons to vote against the case.",
      note: "Rebuttals cannot introduce new arguments.",
    },
    {
      id: "speech-pmr",
      order: 8,
      side: "gov",
      title: "Prime Minister Rebuttal",
      time: "5 min, 30 sec grace",
      icon: "scroll",
      copy: "Government gets the final word: rebuild, answer the last opposition points, and explain why the case wins.",
      note: "Rebuttals cannot introduce new arguments.",
    },
  ],
  faqs: [
    {
      id: "faq-tight-call",
      question: "What is a tight call?",
      answer: "A tight call is an APDA theory argument that the government case is so one-sided that opposition does not have a real path to win. The novice guide recommends using it only when the case is genuinely unfair, not just because arguments are hard to find. Opposition should make the call very early, and government can answer by showing a clear path to victory for opposition.",
    },
    {
      id: "faq-partner",
      question: "How can I get a partner to start debating?",
      answer: "Come to practice, tell an e-board member you want to debate, and add yourself to the tournament sign-up sheet. You can mark that you are looking for a partner, ask in team channels, or get paired with another novice or experienced member for your first tournament.",
    },
    {
      id: "faq-first-tournament",
      question: "What happens at my first tournament?",
      answer: "Most APDA tournaments run Friday to Saturday with five in-rounds before any elimination rounds. Before each round, a draw tells you your side, opponent, judge, and room. Dress is casual, and after the round the judge gives a decision and feedback called an RFD.",
    },
    {
      id: "faq-pocs-pois",
      question: "What are POCs and POIs?",
      answer: "Points of Clarification happen before the main speeches in APDA cases and help opposition understand the government case. Points of Information are short questions or comments offered during constructive speeches after the first minute and before the last minute.",
    },
    {
      id: "faq-case-prep",
      question: "How do I write a simple case?",
      answer: "Pick a topic, phrase the case statement clearly, write a short background, and prepare two to four arguments for why the judge should vote for government. It also helps to brainstorm likely opposition arguments and responses before running the case.",
    },
  ],
};

export const board = [
  {
    name: "Josh Lyons",
    role: "President",
    bio: "Calls, presides over, and adjourns BUDS meetings while guiding voting procedures for the team. He also serves as BUDS's liaison to APDA, registers tournament teams, allocates the free seed, and represents BU at APDA meetings.",
  },
  {
    name: "Janice Lee",
    role: "Co-Vice President",
    bio: "Helps lead BUDS when the President is unavailable and serves as a primary contact between team members and e-board. She also supports novice training by helping craft instructional meetings, presentations, drills, and exercises.",
  },
  {
    name: "Cassie Fitts",
    role: "Co-Vice President",
    bio: "Shares responsibility for stepping in when the President cannot attend and keeping communication clear between members and e-board. She helps lead novice education, including training presentations, practice exercises, and instructional team meetings.",
  },
  {
    name: "Nikhil Saxena",
    role: "Treasurer",
    bio: "Manages financial matters for BUDS and keeps the team organized around budgets, paperwork, and funding. As treasurer, he authorizes Student Activities paperwork and acts as the signatory for organization funds.",
  },
  {
    name: "Lucia Bronfman",
    role: "Secretary",
    bio: "Keeps members informed about meetings, events, and general team information while managing publicity and organizational correspondence. She also tracks membership status, maintains contact information, and preserves team records as BUDS historian.",
  },
  {
    name: "Flo Arnado",
    role: "Membership Coordinator",
    bio: "Focuses on growing and retaining team membership throughout the school year. She maintains BUDS social media, organizes team social events, and oversees the mentor and mentee program.",
  },
  {
    name: "John Yule",
    role: "Equity Officer",
    bio: "Upholds BUDS equity procedures and helps communicate policies to the team in line with BU and APDA best practices. He serves as a resource for equity concerns, supports complaint processes, and helps coordinate inclusive team norms and bonding.",
  },
  {
    name: "Vishaal Arunprasad",
    role: "Special Events Coordinator",
    bio: "Helps plan and facilitate BUDS tournaments by coordinating logistics such as judges, housing, meals, tab materials, awards, registration, and invitations. He works with team members on tournament themes and helps protect tab integrity while serving as a contact for attending teams.",
  },
  {
    name: "Ezzah Tariq",
    role: "Special Events Coordinator",
    bio: "Helps plan and facilitate BUDS tournaments, including tournament logistics, hospitality, registration, tab policy, trophies, and communications with attending teams. She supports theme planning, complaint handling, and the behind-the-scenes work needed for a smooth tournament weekend.",
  },
];

export const defaultEboardContent = {
  members: board.map((member, index) => ({
    id: `eboard-${index}-${member.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`,
    ...member,
    photo: "",
  })),
};

export const alumni = [
  {
    name: "Alumni Spotlight",
    detail: "Add a short profile on a former BUDS member, including their favorite memory and post-grad path.",
  },
  {
    name: "Mentor Network",
    detail: "Create a directory of alumni who are open to judging, coaching, career chats, or tournament support.",
  },
];
