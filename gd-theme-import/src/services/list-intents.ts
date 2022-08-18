import { loadDocIntents } from './load-doc-intents';
import { mapLocalIntent } from './local-intents';

function checkForStyle(node){
    return ( node.fillStyleId || node.strokeStyleId || node.textStyleId );
}

export async function listIntents(isFinal = true) {

    // Creates a little box next to the selection that lists the intents in use in the selection.

    var root = figma.currentPage.selection;

    const allIntents = loadDocIntents();
    const intentMap = allIntents.intents;
    const aliasMap = allIntents.aliases;

    var allNodesWithStyles = [];
    var output = [];
    
    for (var i=0; i< root.length; i++) 
        {
            const thisNode = root[i];
            if (thisNode.type == "FRAME" || thisNode.type == "GROUP" || thisNode.type == "COMPONENT" || thisNode.type == "COMPONENT_SET" || thisNode.type == "INSTANCE"){
                allNodesWithStyles = allNodesWithStyles.concat(thisNode.findAll(checkForStyle));
            } else if (checkForStyle(thisNode)){
                allNodesWithStyles.push(thisNode);
            }
        }

    for (const node of allNodesWithStyles){
        
        var hasIntent = false;
        var addToOutput = {
            name: node.name
        };
        //Node can have fill
        if (node.type == "TEXT" ||
        node.type == "COMPONENT" || 
        node.type == "ELLIPSE"  || 
        node.type == "FRAME" || 
        node.type == "STAR" || 
        node.type == "INSTANCE" || 
        node.type == "BOOLEAN_OPERATION" || 
        node.type == "RECTANGLE" || 
        node.type == "VECTOR" || 
        node.type == "POLYGON" || 
        node.type == "COMPONENT_SET"||
        node.type == "SHAPE_WITH_TEXT") {
            // Background color
            if (node.fillStyleId){
                const id = node.fillStyleId;
                if (typeof id === "string")
                {
                    addToOutput['fillID'] = id;
                    const styleJSON = figma.getStyleById(id).description.match(/{({.*})}/);
                    if (styleJSON){
                        const styleData = JSON.parse(styleJSON[1]);
                        if (styleData.intentName){
                            node.setPluginData('color-intent',styleData.intentName);
                            addToOutput['color'] = styleData.intentName;
                            hasIntent = true;
                        } else if (styleData.aliasIntent) {
                            node.setPluginData('color-intent', styleData.aliasIntent);
                            addToOutput['color'] = styleData.aliasIntent;
                            hasIntent = true;
                        } else {
                            node.setPluginData('color-intent','');
                        }
                    }
                } else {
                    // This is probably a text node with several parts. For now, do nothing.
                }
            }
        }
        //Node can have stroke
        if (node.type == "TEXT" ||
        node.type == "COMPONENT" || 
        node.type == "ELLIPSE"  || 
        node.type == "FRAME" || 
        node.type == "STAR" || 
        node.type == "INSTANCE" || 
        node.type == "BOOLEAN_OPERATION" || 
        node.type == "RECTANGLE" || 
        node.type == "VECTOR" || 
        node.type == "POLYGON" || 
        node.type == "COMPONENT_SET" ||
        node.type == "LINE" ||
        node.type == "SHAPE_WITH_TEXT") {
            // Stroke color
            if (node.strokeStyleId){
                const id = node.strokeStyleId;
                if (typeof id === "string")
                {
                    addToOutput['strokeID'] = id;
                    const styleJSON = figma.getStyleById(id).description.match(/{({.*})}/);
                    if (styleJSON){
                        const styleData = JSON.parse(styleJSON[1]);
                        if (styleData.intentName){
                            node.setPluginData('border-intent',styleData.intentName);
                            addToOutput['border-color'] = styleData.intentName;
                            hasIntent = true;
                        } else if (styleData.aliasIntent) {
                            node.setPluginData('border-intent', styleData.aliasIntent);
                            addToOutput['border-color'] = styleData.aliasIntent;
                            hasIntent = true;
                        } else {
                            node.setPluginData('border-intent','');
                        }
                    }
                } else {
                    // This is probably a text node with several parts. For now, do nothing.
                }

            }
        }
        //Node can have textStyle
        if (node.type == "TEXT") {
            if (node.textStyleId){
                const id = node.textStyleId;
                if (typeof id === "string")
                {
                    addToOutput['textID'] = id;
                    const styleJSON = figma.getStyleById(id).description.match(/{({.*})}/);
                    if (styleJSON){
                        const styleData = JSON.parse(styleJSON[1]);
                        if (styleData.intentName){
                            node.setPluginData('text-intent',styleData.intentName);
                            addToOutput['text'] = styleData.intentName;
                            hasIntent = true;
                        } else if (styleData.aliasIntent) {
                            node.setPluginData('text-intent', styleData.aliasIntent);
                            addToOutput['text'] = styleData.aliasIntent;
                            hasIntent = true;
                        } else {
                            node.setPluginData('text-intent','');
                        }
                    }
                } else {
                    // This is probably a text node with several parts. For now, do nothing.
                }
            }
        }
        if (hasIntent){
            output.push(addToOutput);
        }
    }

    // TODO: create output box

    if (isFinal){
        figma.closePlugin();
    } else {
        return true;
    }
}