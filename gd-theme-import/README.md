# GoDaddy Theme Importer

This Figma plugin will allow you to import themes from the GoDaddy theme repository.

## Building this plugin

Run the following commands:

```(bash)
npm install
npx webpack
```

## Prerequisites for running this plugin (probably temporary)

You'll need to install a cors proxy because figma runs plugins in an iframe, and we're not letting that traffic through. 
1. Go to a fresh directory somewhere (maybe your repos directory?
2. `git clone git@github.com:Rob--W/cors-anywhere.git`
3. `cd cors-anywhere`
4. `npm install`
5. `node server.js`

Log into the VPN, and run the plugin (See below)
Be sure to kill the proxy (`ctrl+c`) when you're done running the plugin.

## Running the plugin in Figma:

1. In Figma, Select Plugins > Development > New Plugin...
2. Select "Link Existing Plugin"
3. Choose the manifest.json file at the root of this project.
4. Build if you haven't already
5. Run the plugin from the PLugins > Development menu.
