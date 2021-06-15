const transitions = {
    "Fluid": {
        duration: .200,
        easing:{
            type: "CUSTOM_CUBIC_BEZIER",
            easingFunctionCubicBezier: {
                x1:0.1,
                y1:0.25,
                x2:0.3,
                y2:1,
            }
        }
    },
}

export async function setTransitions(transition) {

    const page = figma.currentPage;
    const selection = page.selection;
    let checkTransitions = [];

    // Get our list of nodes within the selection that have transitions
    for (const node of selection){
        
        if (node.type == "GROUP" || node.type == "COMPONENT_SET" || node.type == "COMPONENT" || node.type == "FRAME" || node.type == "INSTANCE"){
            checkTransitions = node.findAll( (thisNode) => { 
                if (thisNode.type != "SLICE" && thisNode.type != "GROUP" && thisNode.type != "COMPONENT_SET"){
                    if ( thisNode.reactions.length >0 ) {
                        return true;
                    }
                }
                return false;
            });
        }
        if (node.type != "SLICE" && node.type != "GROUP" && node.type != "COMPONENT_SET"){
            if ( node.reactions.length >0 ) {
                checkTransitions.push(node);
            }
        }
    }

    // Set the transitions on every selected node -> reaction
    for (const node of checkTransitions){
        let newReactions = [];
        for (const reaction of node.reactions){
            if(reaction.action.type == "NODE"){
                let action;
                if( reaction.action.transition.type != "DISSOLVE" && reaction.action.transition.type.indexOf("ANIMATE")<0 ){
                    action = <Action>{
                        type: "NODE",
                        destinationId: reaction.action.destinationId,
                        navigation: reaction.action.navigation,
                        preserveScrollPosition: reaction.action.preserveScrollPosition,
                        transition: <DirectionalTransition>{
                            type: reaction.action.transition.type,
                            duration: transitions[transition].duration,
                            easing: transitions[transition].easing,
                            direction: reaction.action.transition.direction,
                            matchLayers: reaction.action.transition.matchLayers,
                        },
                        overlayRelativePosition: (typeof(reaction.action.overlayRelativePosition)==="undefined"?null:reaction.action.overlayRelativePosition),
                    }
                } else {
                    action = <Action>{
                        type: "NODE",
                        destinationId: reaction.action.destinationId,
                        navigation: reaction.action.navigation,
                        preserveScrollPosition: reaction.action.preserveScrollPosition,
                        transition: <SimpleTransition>{
                            type: reaction.action.transition.type,
                            duration: transitions[transition].duration,
                            easing: transitions[transition].easing,
                        },
                        overlayRelativePosition: (typeof(reaction.action.overlayRelativePosition)==="undefined"?null:reaction.action.overlayRelativePosition),
                    }
                }
                newReactions.push({action: action, trigger: reaction.trigger });
            }
        }
        node.reactions = newReactions;
    }
}
