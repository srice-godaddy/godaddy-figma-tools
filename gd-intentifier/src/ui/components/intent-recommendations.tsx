import * as React from "react";
import IntentNodeRecommendations, {IntentNodeRecommendationType} from "./intent-node-recommendations";

interface IIntentRecommendationsProps {
    items: IntentNodeRecommendationType[];
}
export default function IntentRecommendations({items}: IIntentRecommendationsProps) {
    return (
        <div className='ui-intent-recommendations'>
            {items.map((nodeItem) =>
                <IntentNodeRecommendations
                    key={nodeItem.nodeId}
                    {...nodeItem}
                />
            )}
        </div>
    )
}
