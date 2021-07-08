import { loadTheme } from './services/theme-loader';

figma.showUI(__html__, {
  width: 464,
  height: 276,
});

figma.ui.postMessage(figma.root.getPluginData('theme'));

figma.ui.onmessage = async msg => {
  if (msg.type === 'create-styles') {
    await loadTheme(msg.themeData);
    //figma.root.setPluginData('theme', msg.themeData.ID.toString());
  }
  figma.closePlugin();
};
