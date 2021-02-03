import * as React from "react";
import { isEmpty } from 'lodash';
import useFigmaMessage from "./use-figma-message";
import {IntentNodeRecommendationType} from "../components/intent-node-recommendations";

export default function useIntentRecommendations(): {
    hasSelection: boolean,
    hasRecommendations: boolean,
    items: IntentNodeRecommendationType[];
} {
    const [intentRecommendations, setIntentRecommendations] = React.useState(null);

    const onSelectionChange = (message) => setIntentRecommendations(message.payload);
    useFigmaMessage('intentRecommendationUpdate', onSelectionChange);

    return React.useMemo(() => {
        const hasSelection = intentRecommendations?.byNodeId && !isEmpty(intentRecommendations.byNodeId);

        return {
            hasSelection,
            hasRecommendations: intentRecommendations?.hasRecommendations,
            items: Object.values(intentRecommendations?.byNodeId || {})
                .filter(item => (item as IntentNodeRecommendationType).hasRecommendations) as IntentNodeRecommendationType[],
        }
    }, [intentRecommendations]);
}
