import { useCallback, useRef } from "react";
import Visualization from "@/services/visualization";
import notification from "@/services/notification";
import useImmutableCallback from "@/lib/hooks/useImmutableCallback";

export default function useReorderVisualizations(query, onChange) {
  const handleChange = useImmutableCallback(onChange);
  const latestRequest = useRef(0);

  return useCallback(
    (orderedVisualizationIds) => {
      const previousVisualizations = query.visualizations || [];
      const reorderedVisualizations = orderedVisualizationIds.map((visualizationId, position) => ({
        ...previousVisualizations.find((visualization) => visualization.id === visualizationId),
        position,
      }));

      // Move the tabs right away, and roll back if the server rejects the new order.
      const request = (latestRequest.current += 1);
      handleChange(Object.assign(query.clone(), { visualizations: reorderedVisualizations }));

      return Visualization.reorder({ queryId: query.id, ids: orderedVisualizationIds }).catch(() => {
        notification.error("Error reordering visualizations.");
        // A later drop has already replaced this order, and its snapshot is the current one.
        if (request === latestRequest.current) {
          handleChange(Object.assign(query.clone(), { visualizations: previousVisualizations }));
        }
      });
    },
    [query, handleChange]
  );
}
