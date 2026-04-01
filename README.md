# Chukka Score

Scorer and team management app for the [Chukka](https://github.com/chukka-wp/chukka) water polo platform. Provides both an admin mode for match setup and a live scoring mode for poolside use.

## Features

- Live scoring: goals, fouls, exclusions, timeouts, substitutions, period control
- Team and player management with roster building
- Match setup with rule set configuration
- Offline-capable event queue with batch sync
- Designed for poolside use — high contrast, large touch targets
- Communicates with chukka-cloud via REST API only

## Tech Stack

Laravel 13 / React 19 / Inertia 3 / TypeScript / Tailwind CSS 4

## Setup

```bash
composer setup    # install deps, generate key, migrate, build assets
composer dev      # start all services
```

## Development

```bash
composer test          # lint + test suite
npm run types:check    # TypeScript check
composer ci:check      # full CI pipeline
```

## License

[Elastic License 2.0 (ELv2)](https://www.elastic.co/licensing/elastic-license)
