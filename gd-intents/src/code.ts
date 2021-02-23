import { loadTheme, deleteAllStyles } from './services/theme-loader';

figma.showUI(__html__, {
  width: 480,
  height: 200,
});

figma.ui.onmessage = async msg => {
  if (msg.type === 'create-styles') {
    await loadTheme(msg.themeData);
  }

  if (msg.type === 'delete-all-styles') {
    deleteAllStyles();
  }

  figma.closePlugin();
};
