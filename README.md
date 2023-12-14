# Atomic Tracker

A self-hosted habit tracking web application with a personal dashboard and optional integrations to external data providers.

### Why?

I personally find it useful to have a graphical overview of the things I'm working on, the progress I've made, my agenda for the upcoming days and so on.

**Why Atomic?** the term comes from the _#1 New York Times bestseller_ [Atomic Habits](https://jamesclear.com/atomic-habits) by James Clear. The dashboard makes the habits and their consistency visible, helps you break them into small actions that are easy to do. There is also a gamification aspect, _small and easy_ actions yield less points than _big_ actions. These points are tracked against your weekly (or any other periodical) targets.

## Installation

Clone the repository and build the container:

```sh
docker build -t atomic-tracker .
```

Run locally:

```sh
docker run --rm --name my-atomic-tracker -p 8080:8080 -v ./config:/config atomic-tracker:latest
```

Open `http://localhost:8080/` in a browser and create your user account. (Only one supported for now.)

## Integrations

- **Nextcloud Tasks:** Todos block can read from a Nextcloud instance
- **Google Calendar:** Agenda block can fetch events from Google Calendar
- **Redmine:** Projects block can read issues in progress from a Redmine instance

## Environment Variables

- `CONFIG_DIR`: where to put database file (SQLite)
- `LISTENING_PORT`: web server listens on this port (`8080` by default)
- `BYPASS_LOGIN`: debug option to treat client as user #1 without logging in (useful when backend is restarted on each code change)
- `USE_DUMMY_DATA`: debug option to output dummy data instead of fetching from integrations (useful for screenshots)

## Development

Both the backend and the frontend have development server setups. Run the following commands in 2 separate shells:

```sh
(cd backend/ && BYPASS_LOGIN=1 npm run dev)
```

```sh
(cd frontend/ && npm run dev)
```

### DB seeding

Once the database is created, it can be populated via the seeders:

```sh
(cd backend/ && npm run seed)
```

This creates an `admin` account with empty password.

![](doc/dashboard.png)
