import React from "react";
import { mount } from "enzyme";
import { Query } from "@/services/query";
import Visualization from "@/services/visualization";
import useReorderVisualizations from "./useReorderVisualizations";

jest.mock("@/services/visualization", () => ({ reorder: jest.fn() }));
jest.mock("@/services/notification", () => ({ error: jest.fn(), success: jest.fn() }));

let reorderVisualizations;
function Harness({ query, onChange }) {
  reorderVisualizations = useReorderVisualizations(query, onChange);
  return null;
}

const visualization = (id, position) => ({ id, name: `V${id}`, position, type: "TABLE", options: {} });

function setup() {
  let query = new Query({ id: 1, options: {}, visualizations: [1, 2, 3].map((id) => visualization(id, id - 1)) });
  const onChange = (updated) => {
    query = updated;
  };
  mount(<Harness query={query} onChange={onChange} />);
  return { ids: () => query.visualizations.map((v) => v.id) };
}

describe("useReorderVisualizations", () => {
  beforeEach(() => Visualization.reorder.mockReset());

  test("moves the tabs before the request resolves", () => {
    const { ids } = setup();
    Visualization.reorder.mockReturnValueOnce(new Promise(() => {}));
    reorderVisualizations([3, 1, 2]);
    expect(ids()).toEqual([3, 1, 2]);
  });

  test("rolls back when its own request fails", async () => {
    const { ids } = setup();
    Visualization.reorder.mockReturnValueOnce(Promise.reject(new Error("nope")));
    await reorderVisualizations([3, 1, 2]);
    expect(ids()).toEqual([1, 2, 3]);
  });
});
