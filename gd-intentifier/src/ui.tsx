import * as React from 'react'
import * as ReactDOM from 'react-dom'
import './ui.css'
import BlankState from "./ui/components/blank-state";
import useIntentRecommendations from "./ui/hooks/use-intent-recommendations";
import IntentRecommendations from "./ui/components/intent-recommendations";
import IntentNodeFixes from "./ui/components/intent-node-fixes";

declare function require(path: string): any

function App() {
    const response = useIntentRecommendations();
    const { hasSelection, hasRecommendations, recommendations, fixes, hasFixes } = response;

    console.log(response);
    // const { hasSelection, hasRecommendations, recommendations, fixes, hasFixes } = useIntentRecommendations();

    if (recommendations.length > 1) {
        return (
            <BlankState>
                Only a single element selection is allowed at this point.
            </BlankState>
        )
    }

    if (!hasFixes && !hasSelection) {
        return (
            <BlankState>
                Select an element to receive intent recommendations.
            </BlankState>
        )
    }

    if (!hasFixes && !hasRecommendations) {
        return (
            <BlankState>
                ✅ There are no intent recommendations for selected element.
            </BlankState>
        )
    }

    return (
        <div>
            <IntentNodeFixes items={fixes} />

            {hasRecommendations && (
                <IntentRecommendations items={recommendations} />
            )}
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById('react-app'))
