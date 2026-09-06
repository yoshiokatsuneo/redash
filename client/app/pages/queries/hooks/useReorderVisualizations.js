import { extend, find, map } from "lodash";
import { useCallback } from "react";
import Visualization from "@/services/visualization";
import notification from "@/services/notification";
import useImmutableCallback from "@/lib/hooks/useImmutableCallback";

export default function useReorderVisualizations(query, onChange) {
  const handleChange = useImmutableCallback(onChange);

  return useCallback(
    (orderedVisualizationIds) => {
      const previousVisualizations = query.visualizations;
      const reorderedVisualizations = map(orderedVisualizationIds, (visualizationId, position) =>
        extend({}, find(previousVisualizations, { id: visualizationId }), { position })
      );

      // Move the tabs right away, and roll back if the server rejects the new order.
      handleChange(extend(query.clone(), { visualizations: reorderedVisualizations }));

      return Visualization.reorder({ queryId: query.id, ids: orderedVisualizationIds }).catch(() => {
        notification.error("Error reordering visualizations.");
        handleChange(extend(query.clone(), { visualizations: previousVisualizations }));
      });
    },
    [query, handleChange]
  );
}
