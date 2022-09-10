import {BarLegendProps, ComputedBarDatumWithValue, ComputedDatum} from "@nivo/bar";
import {Box} from "@nivo/core";
import {ScaleSpec, ScaleBandSpec} from "@nivo/scales/dist/types/types";
import {InheritedColorConfig, OrdinalColorScaleConfig} from "@nivo/colors/dist/types";
import {AxisProps} from "@nivo/axes/dist/types/types";

export const legend : BarLegendProps[] =  [
    {
      "dataFrom": "keys",
      "anchor": "bottom-right",
      "direction": "column",
      "justify": false,
      "translateX": 120,
      "translateY": 0,
      "itemsSpacing": 2,
      "itemWidth": 100,
      "itemHeight": 20,
      "itemDirection": "left-to-right",
      "itemOpacity": 0.85,
      "symbolSize": 20,
      "effects": [
        {
          "on": "hover",
          "style": {
            "itemOpacity": 1
          }
        }
      ]
    }
  ]

export const colors:  OrdinalColorScaleConfig<ComputedDatum<never>> = { scheme: 'nivo' }
export const valueScale: ScaleSpec = { type: 'linear' }

export const  axisLeft: AxisProps = {
    "tickSize": 5,
    "tickPadding": 5,
    "tickRotation": 0,
    "legend": "Revenue (Millions USD)",
    "legendPosition": "middle",
    "legendOffset": -40
  }

export const axisBottom: AxisProps = {
    "tickSize": 5,
    "tickPadding": 5,
    "tickRotation": 0,
    "legend": "Year",
    "legendPosition": "middle",
    "legendOffset": 32
  }

export const borderColor: InheritedColorConfig<ComputedBarDatumWithValue<never>> = {
    "from": "color",
    "modifiers": [
      [
        "darker",
        1.6
      ]
    ]
  }

export const labelTextColor:  InheritedColorConfig<ComputedBarDatumWithValue<never>> = {
    "from": "color",
    "modifiers": [
      [
        "darker",
        1.6
      ]
    ]
  }

export const  fill = [
    {
      "match": {
        "id": "Agriculture"
      },
      "id": "dots"
    },
    {
      "match": {
        "id": "Finance"
      },
      "id": "lines"
    }
  ]

export const margin : Box = {
    "top": 50,
    "right": 130,
    "bottom": 50,
    "left": 60
  }

export const indexScale: ScaleBandSpec = {"type": "band", "round": true}

export const decorationPatterns  = [
    {
      "id": "dots",
      "type": "patternDots",
      "background": "inherit",
      "color": "#38bcb2",
      "size": 4,
      "padding": 1,
      "stagger": true
    },
    {
      "id": "lines",
      "type": "patternLines",
      "background": "inherit",
      "color": "#eed312",
      "rotation": -45,
      "lineWidth": 6,
      "spacing": 10
    }
  ]
