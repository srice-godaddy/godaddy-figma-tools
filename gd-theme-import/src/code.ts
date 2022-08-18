import { loadTheme } from './services/theme-loader';
import { aliasStyles } from './services/alias-styles';

switch(figma.command){
  case "importTheme":
    figma.showUI(__html__, {
      width: 464,
      height: 276,
    });
    figma.ui.postMessage(figma.root.getPluginData('theme'));
    break;
  case "aliasStyles":
      aliasStyles();
    break;
  default:
    break;
}


figma.ui.onmessage = async msg => {
  if (msg.type === 'create-styles') {
    await loadTheme(msg.themeData);
    await aliasStyles();
    //figma.root.setPluginData('theme', msg.themeData.ID.toString());
  }
  figma.closePlugin();
};
