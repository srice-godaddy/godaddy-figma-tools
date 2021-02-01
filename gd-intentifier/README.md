# GD Intentifier 

Plugin for advising on intents usage based on user selection in a Figma project.

The main plugin code is in `src/code.ts`. The HTML for the UI is in
`src/ui.html`, while the embedded JavaScript is in `src/ui.tsx`.

These are compiled to files in `dist/`, which are what Figma will use to run
your plugin.

To build:

```
npm install
npx webpack
```
