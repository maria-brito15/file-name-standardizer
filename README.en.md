# File Name Standardizer

> 🇧🇷 [Versão em português → README.md](README.md)

A lightweight, zero-dependency web utility that converts messy titles into clean, standardized file names in one click.

---

## Why this exists

If you've ever worked with academic files, code projects, or anything where the file name actually matters, you know the pain: you have a title like **"Application of Integrals and Fourier Transform in Automatic Audio to Sheet Music Transcription"** and you need to turn it into something that your OS, terminal, and Git won't complain about.

Doing it by hand is tedious — you strip the accents, swap spaces for underscores, lowercase everything, and inevitably miss something. Asking an LLM to do it gets old fast too: open a new window, type the request, copy the result... every single time, for something that should be mechanical.

The inspiration came from tools like **[Convert Case](https://convertcase.net/)** — simple, focused, no fluff. You paste text, pick a format, copy the result. No signup, no ads, no spinner. This tool follows the same philosophy, but aimed specifically at the file naming problem.

---

## Usage

No installation. Open `file_name_standardizer.html` directly in any browser.

```
Open file_name_standardizer.html → paste a title → choose a format → copy
```

---

## Output Formats

| Format | Description | Example |
|---|---|---|
| **Full** | All words, nothing omitted | `application_of_integrals_and_fourier_transform` |
| **Shortened** | Removes articles and prepositions | `application_integrals_fourier_transform` |
| **Compact** | Up to 5 keywords | `application_integrals_fourier_transform_audio` |
| **Abbreviated** | First 4 characters of each word | `appl_inte_four_tran_audi` |

---

## Extra Options

- **Timestamp** — prefix with today's date in `YYYYMMDD` format
- **Uppercase** — convert the entire output to uppercase
- **Hyphens** — use `-` instead of `_` as separator

Options can be freely combined. For example, timestamp + hyphens + compact produces:

```
20250607-application-integrals-fourier-transform-audio
```

---

## Interface Features

- **Result tab** — generated name in the selected format with a one-click copy button
- **All versions tab** — all 4 formats displayed simultaneously, each with its own copy button
- **History** — last 30 conversions saved in `localStorage`, persisting across sessions
- **Restore from history** — clicking an entry refills the title and mode in the form
- **Dark / light theme** — toggle via the fixed button in the top-right corner; preference is saved

---

## Code Architecture

The JavaScript is organized into single-responsibility modules (SOLID SRP), with no external dependencies:

```
TextNormalizer          strips accents and special characters
StopWords               manages and filters English articles and prepositions
ConversionStrategies    object holding the 4 conversion strategies (OCP)
OutputFormatter         applies separator, case, and timestamp to the output
convert()               orchestrates the pipeline without owning logic
```

Adding a new format is as simple as adding a key to `ConversionStrategies` — no other code needs to change.

---

## Tech Stack

- HTML5 · CSS3 with custom properties · Vanilla JavaScript ES6+
- Google Fonts: JetBrains Mono + Syne
- `localStorage` for history and theme preference persistence
- Zero external dependencies, zero build step

---

## Project Structure

```
file_name_standardizer.html   English application
padronizador_nomes.html       Portuguese version
README.en.md                  this file
README.md                     Portuguese documentation
```

---

## Browser Compatibility

Any modern browser with ES6+ and `localStorage` support. No server, no build step, no internet connection required after fonts load.
