import * as React from 'react';
import { isEmpty } from 'lodash';
import useFigmaMessage from './use-figma-message';
import { IntentNodeRecommendationType } from '../components/intent-node-recommendations';
import { IntentNodeFixesType } from '../components/intent-node-fixes';

export default function useIntentRecommendations(): {
    hasSelection: boolean;
    hasRecommendations: boolean;
    hasFixes: boolean;
    selectionCount: number;
    recommendations: IntentNodeRecommendationType[];
    fixes: IntentNodeFixesType[];
} {
    const [intentRecommendations, setIntentRecommendations] = React.useState(
        null
    );

    const onSelectionChange = (message) =>
        setIntentRecommendations(message.payload);
    useFigmaMessage('intentRecommendationUpdate', onSelectionChange);

    return React.useMemo(() => {
        const hasSelection =
            intentRecommendations?.recommendations?.byNodeId &&
            !isEmpty(intentRecommendations.recommendations.byNodeId);

        return {
            hasSelection,
            hasRecommendations:
                intentRecommendations?.recommendations?.hasRecommendations,
            hasFixes: intentRecommendations?.fixes?.hasFixes,
            selectionCount: Object.keys(
                intentRecommendations?.recommendations?.byNodeId || {}
            ).length,
            recommendations: Object.values(
                intentRecommendations?.recommendations?.byNodeId || {}
            ).filter(
                (item) =>
                    (item as IntentNodeRecommendationType).hasRecommendations
            ) as IntentNodeRecommendationType[],
            fixes: Object.values(intentRecommendations?.fixes?.byNodeId || {}),
        };
    }, [intentRecommendations]);
}
