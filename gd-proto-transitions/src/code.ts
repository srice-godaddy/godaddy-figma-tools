import { setTransitions } from './services/apply-transitions';

figma.showUI(__html__, {
  width: 464,
  height: 276,
});

figma.ui.onmessage = async msg => {
  if (msg.type === 'create-transitions') {
    await setTransitions(msg.value);
    //figma.root.setPluginData('theme', msg.themeData.ID.toString());
  }
  figma.closePlugin();
};
