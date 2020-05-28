import React from "react";
import { waitFor, fireEvent } from "@testing-library/react";
import { Map } from "mapbox-gl";
import CasesVis from "./CasesVis";
import renderWithRedux from "../../../utils/testingUtils";

jest.mock("../../../api/cases");

describe("CasesVis", () => {
  it("should render a loading spinner then the title, map, filter slider, and play and pause buttons", async () => {
    // render the CasesVis component with a preloaded state. This allows us to get
    const {
      getByText,
      getByLabelText,
      getByTestId,
      container,
    } = renderWithRedux(<CasesVis />, {
      initialState: {
        casesReducer: {
          dates: ["01-22-20", "01-23-20", "01-24-20", "01-25-20", "01-26-20"],
          cases: {
            features: [
              {
                geometry: {
                  coordinates: [-121.83, 47.49],
                  type: "Point",
                },
                properties: {
                  cases: 1,
                  date: "2020-01-22",
                },
                type: "Feature",
              },
              {
                geometry: {
                  coordinates: [-121.83, 47.49],
                  type: "Point",
                },
                properties: {
                  cases: 1,
                  date: "2020-01-23",
                },
                type: "Feature",
              },
              {
                geometry: {
                  coordinates: [-121.83, 47.49],
                  type: "Point",
                },
                properties: {
                  cases: 3,
                  date: "2020-01-24",
                },
                type: "Feature",
              },
              {
                geometry: {
                  coordinates: [-121.83, 47.49],
                  type: "Point",
                },
                properties: {
                  cases: 1,
                  date: "2020-01-25",
                },
                type: "Feature",
              },
              {
                geometry: {
                  coordinates: [-121.83, 47.49],
                  type: "Point",
                },
                properties: {
                  cases: 3,
                  date: "2020-01-26",
                },
                type: "Feature",
              },
            ],
            type: "FeatureCollection",
          },
        },
      },
    });

    // Once loaded, the title appears
    await waitFor(() => getByText(/explore/i));

    // Material-UI does not expose the slider value through their API so we need to manually get it
    // through the dom
    const sliderValue = container.getElementsByTagName("input")[0];

    expect(getByTestId("map")).toBeInTheDocument();
    expect(getByLabelText(/filter/i)).toBeInTheDocument();
    expect(getByLabelText("play")).toBeInTheDocument();
    expect(getByLabelText("pause")).toBeInTheDocument();

    // Data filter starts at 1 day prior to the current day. This is because current day's data is incomplete.
    expect(sliderValue.value).toBe("3");
    // We need to set the slider to the first day of the dataset so we can slide it to a future date.
    fireEvent.change(sliderValue, { target: { value: "0" } });
    expect(sliderValue.value).toBe("0");
    fireEvent.click(getByLabelText("play"));
    await waitFor(() => expect(sliderValue.value).toBe("3"));
    fireEvent.click(getByLabelText("pause"));
    expect(sliderValue.value).toBe("3");

    // Instantiate a mocked map
    const map = new Map();
    map.on.mockResolvedValueOnce();

    // Check that map.on was called with "load" to see that the map actually loaded on the screen
    expect(map.on).toHaveBeenCalled();
  });
});
