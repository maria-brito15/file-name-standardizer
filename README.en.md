<div align="center">

# 🌸 File Name Standardizer

**turn messy titles into clean file names — instantly.**

*no installs · no accounts · no fluff · just paste and copy*

[🇧🇷 ler em português](README.md) · [open the app →](https://maria-brito15.github.io/file-name-standardizer/index.en.html)

</div>

---

## ✨ why this exists

you know that moment when you have a perfectly good title like:

> *"Application of Integrals and Fourier Transform in Automatic Audio to Sheet Music Transcription"*

and you need it to become a file name your OS, terminal, and Git won't throw a fit about?

doing it by hand is **tedious** — strip the accents, swap spaces for underscores, lowercase everything, inevitably miss something. asking an LLM every single time gets old fast too — open a new tab, type the request, copy the result... for something that should just *be a button*.

tools like **[Convert Case](https://convertcase.net/)** nail this philosophy: paste, pick, copy, done. no spinner, no signup, no nonsense. this tool does the same thing, but built specifically for file naming.

---

## 🚀 usage

**online** — no install needed, just open the link:

> 🔗 [maria-brito15.github.io/file-name-standardizer/index.en.html](https://maria-brito15.github.io/file-name-standardizer/index.en.html)

**locally** — clone the repo and open the file directly in any browser:

```bash
git clone https://github.com/maria-brito15/file-name-standardizer.git
# then open index.en.html in your browser
```

```
paste a title  →  pick a format  →  copy  →  done
```

---

## 🗂️ output formats

| format | what it does | example output |
| --- | --- | --- |
| **full** | every word, nothing left out | `application_of_integrals_and_fourier_transform` |
| **shortened** | drops articles & prepositions | `application_integrals_fourier_transform` |
| **compact** | top 5 keywords only | `application_integrals_fourier_transform_audio` |
| **abbreviated** | first 4 chars of each word | `appl_inte_four_tran_audi` |

---

## 🎛️ extra options

mix and match freely:

- 🗓️ **timestamp** — prepend today as `YYYYMMDD`
- 🔠 **uppercase** — shout it if you want
- **-** **hyphens** — prefer dashes over underscores

example with all three on compact mode:

```
20250607-application-integrals-fourier-transform-audio
```

---

## 💅 interface features

- **result tab** — your output, ready to copy in one click
- **all versions tab** — all 4 formats side by side, each copyable
- **history** — last 30 conversions live in `localStorage` between sessions
- **restore from history** — click any past entry to bring it back
- **dark / light theme** — toggle top-right, preference remembered

---

## 🏗️ code architecture

vanilla JS, zero dependencies, SOLID principles throughout:

```
TextNormalizer          strips accents + special characters
StopWords               filters articles and prepositions (English)
ConversionStrategies    the 4 strategies as an open/closed object (OCP)
OutputFormatter         handles separator, case, and timestamp
convert()               wires the pipeline together, owns no logic
```

adding a new format = adding one key to `ConversionStrategies`. nothing else changes.

---

## 🛠️ tech stack

```
HTML5  ·  CSS3 custom properties  ·  vanilla JS ES6+
JetBrains Mono + Syne  ·  localStorage  ·  zero build step
```

---

## 📁 project structure

```
index.en.html     ← you are here (EN)
index.html          portuguese version
interface.png       app screenshot
README.en.md        this file
README.md           portuguese docs
```

---

## 🖼️ interface

![app interface](interface.png)

---

<div align="center">

made with 💙 · runs in any browser · no internet needed after first load

</div>
