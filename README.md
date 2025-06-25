# Just a small WebApp which should allow party guests to see the playing Spotify queue and add new tracks to the queue

# 🎧 Don't Annoy the DJ

> A touch-friendly, Spotify-powered **party queue web app** that lets guests search and add songs to the queue — without hijacking the party vibe or annoying the host.

---

## 🚀 Overview

**Don’t Annoy the DJ** is a Spotify-connected web application designed to make it easy for **party guests** to search for songs and queue them **without disturbing the host** who is running the playlist.

### Key Features:

- View the **currently playing track** and **what’s next** in the `Now Playing` area.
- **Search** for songs using a responsive input field.
- **Virtual keyboard support** for touch screens (optional via environment variable).
  - Initially designed to run on a Raspberry Pi connected with a (not mobile native) touch screen.
- Prevents adding the same track multiple times to the queue.
- Built for accessibility of non-technical aversed guests: cannot skip, override, or accidentally stop songs.
- Uses Spotify’s **Authorization Code Flow** to securely access the user’s Spotify account.

---

## 💡 Use Case

The app was originally designed to be a **party-friendly interface** running on a Raspberry Pi with a (not mobile native) touchscreen, enabling guests to interact with the Spotify queue **without mobile devices or host intervention.**

The idea came to my mind to have a small side project with a kind of useful scope for my wifes' 30th birthday surprise party.
(Side fact: The party was a "Harry Potter" themed party, that's why I created a custom "gryffindor" theme which can be chosen within the header when running the app ⚡🧙‍♂️)

It’s the perfect **contact point** at a party:  
Guests can browse, search, and queue songs – but they can’t disrupt the flow.

---

## ⚙️ Requirements

- Spotify Developer Account
- Spotify **Client ID**  
  You can get this by:
  1. Visiting [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/applications).
  2. Creating a new app.
  3. Configure a valid redirect uri for authorization.
  4. Copying your `Client ID` into your environment file.

---

## 📦 Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

- configure `.env` based on `.env.example`

### 3. Start App

```bash
npm run dev -- --open
```
