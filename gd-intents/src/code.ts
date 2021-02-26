import { loadTheme, deleteAllStyles } from './services/theme-loader';

figma.showUI(__html__, {
  width: 480,
  height: 200,
});

figma.ui.postMessage(figma.root.getPluginData('theme'));

figma.ui.onmessage = async msg => {
  if (msg.type === 'create-styles') {
    await loadTheme(msg.themeData);
    figma.root.setPluginData('theme', msg.themeData.ID.toString());
  }

  if (msg.type === 'delete-all-styles') {
    deleteAllStyles();
  }

  figma.closePlugin();
};
