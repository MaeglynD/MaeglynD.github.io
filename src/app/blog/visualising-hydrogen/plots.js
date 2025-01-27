"use client";

import React, { useState, useMemo } from "react";
import data from "./hydrogendump.js";
import dynamic from "next/dynamic";
import { create, all } from "mathjs";
import Plot from "react-plotly.js";

const math = create(all, {});

function P(m, l, x) {
  let sm = math.sum(
    ...Array.from({ length: math.floor((l - m) / 2) + 1 }, (_, k) =>
      math.evaluate(`(-1)^k * ((2*l-2*k)!/(k! * (l-k)! * (l-m-2*k)!)) * x^(l-m-2*k)`, { l, m, x, k })
    )
  );

  return math.evaluate(`2^(-l) * (1-x^2)^(m/2) * sm`, { m, l, x, sm });
}

function L(alpha, n, x) {
  return math.sum(
    ...Array.from({ length: n + 1 }, (_, k) =>
      math.evaluate(`(-1)^k * (n + alpha)!/((n-k)! * (alpha+k)!) * (x^k)/k!`, { k, alpha, n, x })
    )
  );
}

function Y(m, l, theta, phi) {
  const associatedLegendre = P(m, l, math.cos(theta));

  return math.evaluate(`sqrt( ((2l+1)/4pi) * ((l-m)!/(l+m)!) ) * associatedLegendre * e^(i*m*phi)`, {
    m,
    l,
    theta,
    phi,
    associatedLegendre,
  });
}

function psi(n, l, m, r, theta, phi) {
  const a0 = 1;
  const rho = math.evaluate("2*r / (n*a0)", { a0, n, r });
  const generalisedLaguerre = L(2 * l + 1, n - l - 1, rho);
  const sphericalHarmonic = Y(m, l, theta, phi);

  return math.evaluate(
    `sqrt( (2/(n*a0))^3 * ((n-l-1)!)/(2n*((n+l)!))) * e^(-rho/2) * rho^(l) * generalisedLaguerre * sphericalHarmonic`,
    {
      a0,
      n,
      l,
      m,
      r,
      rho,
      generalisedLaguerre,
      sphericalHarmonic,
    }
  );
}

export function WavefunctionPlot({ ...props }) {
  const { grid, planes, metadata } = data;
  const { n, l, m } = metadata;
  const mx = 4 * (n + l);

  const plots = Object.entries(planes).map(([plane, values]) => {
    return (
      <React.Fragment key={plane}>
        <Plot
          data={[
            {
              z: values,
              x: grid,
              y: grid,
              type: "contour",
              colorscale: "Jet",
              opacity: 0.9,
              showscale: false,
            },
          ]}
          layout={{
            xaxis: {
              title: "",
              range: [-1.2 * mx, 1.2 * mx],
              showticklabels: false,
              ticks: "",
            },
            yaxis: {
              title: "",
              range: [-1.2 * mx, 1.2 * mx],
              showticklabels: false,
              ticks: "",
            },

            showLegend: false,
            autosize: true,
            margin: {
              l: 0,
              r: 0,
              t: 0,
              b: 0,
              pad: 0,
            },
            scene: {
              dragmode: false,
              camera: {
                projection: { type: "orthographic" },
              },
              xaxis: {
                title: "",
                range: [-1.2 * mx, 1.2 * mx],
                showticklabels: false,
              },
              yaxis: {
                title: "",
                range: [-1.2 * mx, 1.2 * mx],
                showticklabels: false,
              },
            },
          }}
          config={{
            responsive: true,
            displayModeBar: false,
            displaylogo: false,
            scrollZoom: false,
            showAxisDragHandles: false,
            showAxisRangeEntryBoxes: false,
            showAxisRangeEntryBoxes: false,
          }}
        />
        <Plot
          data={[
            {
              z: values,
              x: grid,
              y: grid,
              type: "contour",
              colorscale: "Jet",
              opacity: 0.9,
              showscale: false,
              contours: {
                coloring: "lines",
              },
            },
          ]}
          layout={{
            xaxis: {
              title: "",
              range: [-1.2 * mx, 1.2 * mx],
              showticklabels: false,
              ticks: "",
            },
            yaxis: {
              title: "",
              range: [-1.2 * mx, 1.2 * mx],
              showticklabels: false,
              ticks: "",
            },

            showLegend: false,
            autosize: true,
            margin: {
              l: 0,
              r: 0,
              t: 0,
              b: 0,
              pad: 0,
            },
            scene: {
              dragmode: false,
              camera: {
                projection: { type: "orthographic" },
              },
              xaxis: {
                title: "",
                range: [-1.2 * mx, 1.2 * mx],
                showticklabels: false,
              },
              yaxis: {
                title: "",
                range: [-1.2 * mx, 1.2 * mx],
                showticklabels: false,
              },
            },
          }}
          config={{
            responsive: true,
            displayModeBar: false,
            displaylogo: false,
            scrollZoom: false,
            showAxisDragHandles: false,
            showAxisRangeEntryBoxes: false,
            showAxisRangeEntryBoxes: false,
          }}
        />
      </React.Fragment>
    );
  });

  return <div {...props}>{plots}</div>;
}

export function LegendrePlot({ ...props }) {
  const xVals = useMemo(() => math.range(-1, 1, 0.01, true)._data, []);
  const traces = useMemo(() => {
    return Array.from({ length: 6 }, (_, m) => {
      const l = 5;
      const yVals = xVals.map(
        (x) => math.sqrt(((2 * l + 1) * math.factorial(l - m)) / (2 * math.factorial(l + m))) * P(m, l, x)
      );

      return {
        x: xVals,
        y: yVals,
        type: "scatter",
        mode: "lines",
        name: `P(${5}, ${m})`,
        line: { width: 2 },
      };
    });
  }, []);

  return (
    <div {...props}>
      <Plot
        data={traces}
        layout={{
          xaxis: {
            title: "",
            showticklabels: false,
            ticks: "",
          },
          yaxis: {
            title: "",
            showticklabels: false,
            ticks: "",
          },
          autosize: true,
          margin: {
            l: 0,
            r: 0,
            t: 0,
            b: 0,
            pad: 0,
          },
        }}
        config={{
          responsive: true,
          displayModeBar: false,
          displaylogo: false,
          scrollZoom: false,
          showAxisDragHandles: false,
          showAxisRangeEntryBoxes: false,
          showAxisRangeEntryBoxes: false,
        }}
      />
    </div>
  );
}

export function LaguerrePlot({ ...props }) {
  const xVals = math.range(-3, 11, 0.1)._data;
  let polynomials = [];

  for (let n = 0; n <= 3; n++) {
    for (let m = 0; m <= n - 1; m++) {
      polynomials.push({ n, m });
    }
  }

  const traces = polynomials.map(({ n, m }) => {
    const yVals = xVals.map((x) => L(m, n, x));
    return {
      x: xVals,
      y: yVals,
      type: "scatter",
      mode: "lines",
      name: `L(${n}, ${m})`,
      line: { width: 2 },
    };
  });

  return (
    <div {...props}>
      <Plot
        data={traces}
        layout={{
          autoSize: true,
          xaxis: {
            title: "",
            showticklabels: false,
            ticks: "",
          },
          yaxis: {
            title: "",
            showticklabels: false,
            ticks: "",
          },
          margin: {
            l: 0,
            r: 0,
            t: 0,
            b: 0,
            pad: 0,
          },
        }}
        config={{
          responsive: true,
          displayModeBar: false,
          displaylogo: false,
          scrollZoom: false,
          showAxisDragHandles: false,
          showAxisRangeEntryBoxes: false,
          showAxisRangeEntryBoxes: false,
        }}
      />
    </div>
  );
}
