import * as React from 'react'
import * as ReactDOM from 'react-dom'
import './ui.css'
import BlankState from "./ui/components/blank-state";
import useIntentRecommendations from "./ui/hooks/use-intent-recommendations";
import IntentRecommendations from "./ui/components/intent-recommendations";

declare function require(path: string): any

function App() {
    const { hasSelection, hasRecommendations, items } = useIntentRecommendations();

    if (!hasSelection) {
        return (
            <BlankState>
                Select an element to receive intent recommendations.
            </BlankState>
        )
    }

    if (!hasRecommendations) {
        return (
            <BlankState>
                There are no intent recommendations for selected elements.
            </BlankState>
        )
    }

    return (
        <div>
            <IntentRecommendations items={items} />
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById('react-app'))
