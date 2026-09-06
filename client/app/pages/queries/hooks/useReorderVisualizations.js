import { useCallback } from "react";
import Visualization from "@/services/visualization";
import notification from "@/services/notification";
import useImmutableCallback from "@/lib/hooks/useImmutableCallback";

export default function useReorderVisualizations(query, onChange) {
  const handleChange = useImmutableCallback(onChange);

  return useCallback(
    (orderedVisualizationIds) => {
      const previousVisualizations = query.visualizations || [];
      const reorderedVisualizations = orderedVisualizationIds.map((visualizationId, position) => ({
        ...previousVisualizations.find((visualization) => visualization.id === visualizationId),
        position,
      }));

      // Move the tabs right away, and roll back if the server rejects the new order.
      // Object.assign rather than a spread: the clone is a Query instance, and its methods
      // only survive on a target that keeps the prototype.
      handleChange(Object.assign(query.clone(), { visualizations: reorderedVisualizations }));

      return Visualization.reorder({ queryId: query.id, ids: orderedVisualizationIds }).catch(() => {
        notification.error("Error reordering visualizations.");
        handleChange(Object.assign(query.clone(), { visualizations: previousVisualizations }));
      });
    },
    [query, handleChange]
  );
}
