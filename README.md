# Leonida Trophy Guide — GTA VI

[![make.fun bounty](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/dexalot4-wq/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/dexalot4-wq/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01)

Free, offline **GTA VI trophy guide and tracker** for PlayStation 5 — built for the [make.fun bounty gta6-trophy-guide-01](https://make.fun/bounty/gta6-trophy-guide-01).

## What it is

- **All 55 official trophies** (1 platinum, 2 gold, 6 silver, 46 bronze) with their official name, description and grade.
- **Tracker**: tick trophies off as you earn them — progress is saved in your browser (localStorage), with **export and import** so you never lose it.
- **Roadmap to the platinum** in 4 phases: story first, strangers & contacts, activities & skills, collectibles & cleanup.
- **Missable flags**: the two partner trophies (Hot Together, Retail Therapy) are flagged as a story-window risk; four trophies whose trigger the official description does not pin down are flagged “watch out”.
- **A guide for every trophy**, written in our own words from the official descriptions, with its sources cited next to it (Exophase official list, PSNProfiles for the PSN progress targets).
- **Filters** by grade and kind (story, side, activities, collectibles, combat, exploration, money, missable), text search, hide-earned, and a **spoiler-safe mode** that hides story trophies until you earn them.

## Honesty note

The game released 19 Nov 2026 and no community walkthrough existed when this guide was written. Where the official description names no place or step, the guide says so instead of inventing one. Those trophies are flagged and will be updated as the community confirms the triggers.

## Run it

No build step, no network, no account. Serve the `app/` folder and open it:

```sh
node serve.ts
# open http://localhost:8080
```

Or open `app/index.html` directly from disk (the tracker fetches `app/data/trophies.json` from its own folder).

## Sources

- Names, descriptions, grades: [Exophase — official trophy list](https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/)
- Cross-check + PSN progress targets: [PSNProfiles](https://psnprofiles.com/trophies/43531-grand-theft-auto-vi)

No Rockstar logo, artwork or game screenshots are used. Not affiliated with Rockstar Games.

## License

MIT — see [LICENSE](LICENSE).
