"use client";

export const wavefunctionPy = String.raw`import matplotlib.pyplot as plt
import numpy as np
from scipy.special import sph_harm_y, factorial, assoc_laguerre

def spherical_harmonic(l,m,theta,phi):
  return sph_harm_y(l, m, theta, phi)

def radial(n,l,r):
  return np.sqrt( ((2/(n))**3) * factorial(n-l-1) / (2*n*(factorial(n+l))) ) * np.exp(-r/(n)) * (2*r/(n))**l * assoc_laguerre(2*r/(n), n-l-1, 2*l+1)

def psi(n,l,m,r,theta,phi):
  return radial(n,l,r) * spherical_harmonic(l,m,theta,phi)

def plot_planes(n=7,l=2,m=2):
  fig,(xy,xz,yz) = plt.subplots(1,3, figsize=(35,35))
  fig.tight_layout(pad=5)

  mx=4*(n+l)
  res=200
  alpha=0.65

  z=0
  x,y = np.meshgrid(np.linspace(-mx, mx, res), np.linspace(-mx, mx, res))
  data = psi(n, l, m, np.sqrt(x**2+y**2+z**2), np.arctan2(np.sqrt(x**2+y**2), z), np.arctan2(y,x))
  xy.contourf(x,y,data, 80, cmap='jet',alpha=alpha)

  y=0
  x,z = np.meshgrid(np.linspace(-mx, mx, res), np.linspace(-mx, mx, res))
  data = psi(n, l, m, np.sqrt(x**2+y**2+z**2), np.arctan2(np.sqrt(x**2+y**2), z), np.arctan2(y,x))
  xz.contourf(x,z,data, 80, cmap='jet',alpha=alpha)

  x=0
  y,z = np.meshgrid(np.linspace(-mx, mx, res), np.linspace(-mx, mx, res))
  data = psi(n, l, m, np.sqrt(x**2+y**2+z**2), np.arctan2(np.sqrt(x**2+y**2), z), np.arctan2(y,x))
  yz.contourf(y,z,data, 80, cmap='jet',alpha=alpha)


plot_planes(7,2,0)
          `;

export const sphericalHarmonicsPy = String.raw`import matplotlib.pyplot as plt
import numpy as np
from scipy.special import sph_harm_y, factorial, assoc_laguerre

l=5
m=0

def spherical_harmonic(l,m,theta,phi):
  return sph_harm_y(l,m,theta,phi).real

def plot_sph(l,m):
  res=100

  theta, phi = np.meshgrid(np.linspace(0,np.pi,res), np.linspace(0,2*np.pi,res))
  sph = spherical_harmonic(l,m,phi,theta)

  x = np.cos(theta)*np.sin(phi)*np.abs(sph)
  y = np.sin(theta)*np.sin(phi)*np.abs(sph)
  z = np.cos(phi)*np.abs(sph)

  fig = plt.figure(figsize=(15,15))
  ax = fig.add_subplot(111,projection='3d')
  ax.plot_surface(x,y,z,rcount=res,ccount=res,cmap='magma',alpha=0.7)

  ax.set_xlim(-1, 1)
  ax.set_ylim(-1, 1)
  ax.set_zlim(-1, 1)

  ax.contour(x,y,z,20,zdir='x',offset=-1,cmap='magma',alpha=0.3)
  ax.contour(x,y,z,20,zdir='y',offset=1,cmap='magma',alpha=0.3)
  ax.contour(x,y,z,20,zdir='z',offset=-1,cmap='magma',alpha=0.3)

plot_sph(l,m)`;

export const wavefunctionJs = String.raw`import Plotly from "plotly.js-dist-min";
import { create, all } from "mathjs";

const math = create(all, {});

const n = 7;
const l = 3;
const m = 0;

function P(m, l, x) {
  let sm = math.sum(
    ...Array.from({ length: math.floor((l - m) / 2) + 1 }, (_, k) =>
      math.evaluate("(-1)^k * ((2l-2k)!/(k! * (l-k)! * (l-m-2k)!)) * x^(l-m-2k)", { l, m, x, k })
    )
  );

  return math.evaluate("2^(-l) * (1-x^2)^(m/2) * sm", { m, l, x, sm });
}

function L(alpha, n, x) {
  return math.sum(
    ...Array.from({ length: n + 1 }, (_, k) =>
      math.evaluate("(-1)^k * (n + alpha)!/((n-k)! * (alpha+k)!) * (x^k)/k!", { k, alpha, n, x })
    )
  );
}

function Y(m, l, theta, phi) {
  const associatedLegendre = P(m, l, math.cos(theta));

  return math.evaluate("sqrt( ((2l+1)/4pi) * ((l-m)!/(l+m)!) ) * associatedLegendre * e^(i*m*phi)", {
    m,
    l,
    theta,
    phi,
    associatedLegendre,
  });
}

function psi(n, l, m, r, theta, phi) {
  const a = 1;
  const rho = math.evaluate("2*r / (n*a)", { a, n, r });
  const generalisedLaguerre = L(2 * l + 1, n - l - 1, rho);
  const sphericalHarmonic = Y(m, l, theta, phi);

  return math.evaluate(
    "sqrt( (2/(n*a))^3 * ((n-l-1)!)/(2n*((n+l)!))) * e^(-rho/2) * rho^(l) * generalisedLaguerre * sphericalHarmonic",
    {
      a,
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

const res = 20;
let p = [[], [], [], []];
let mx = 4 * (n + l);

math.range(-mx, mx, (2 * mx) / res, true).forEach((x) => {
  math.range(-mx, mx, (2 * mx) / res, true).forEach((y) => {
    math.range(-mx, mx, (2 * mx) / res, true).forEach((z) => {
      let r = math.sqrt(x ** 2 + y ** 2 + z ** 2);
      let theta = math.atan(z / math.sqrt(x ** 2 + y ** 2)) + math.pi / 2;
      let phi = math.atan2(y, x);
      let prob = r ** 2 * math.sin(theta) * math.abs(psi(n, l, m, r, theta, phi)) ** 2 || 0;

      p[0].push(x);
      p[1].push(y);
      p[2].push(z);
      p[3].push(prob);
    });
  });
});

const [x, y, z, value] = p;

document.getElementById("app").innerHTML = '<div id="div" style="overflow:hidden;width: 100%; display: flex ; justify-content: center; align-items: center; "></div>';

Plotly.newPlot("div", {
  data: [
    {
      x,
      y,
      z,
      value,
      type: "volume",
      opacity: 0.4,
      colorscale: [
        [0, "rgba(0,0,131,0.05)"],
        [0.125, "rgba(0,60,170,0.1)"],
        [0.25, "rgba(5,255,255,0.15)"],
        [0.375, "rgba(120,255,129,0.2)"],
        [0.5, "rgba(155,255,60,0.25)"],
        [0.625, "rgba(255,255,0,0.3)"],
        [0.75, "rgba(255,170,0,0.35)"],
        [0.875, "rgba(255,85,0,0.4)"],
        [1, "rgba(255,0,0,0.5)"],
      ],
      lighting: {
        ambient: 0.9,
        diffuse: 0.7,
        specular: 0.2,
      },
      surface: {
        show: true,
        count: 40,
      },
      caps: {
        x: { show: false },
        y: { show: false },
        z: { show: false },
      },
      showscale: false,
    },
  ],
  layout: {
    height: 300,
    showLegend: false,
    autosize: true,
        margin: {
      l: 15,
      r: 15,
      t: 15,
      b: 15,
      pad: 10,
    },
    scene: {
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
      zaxis: {
        title: "",
        range: [-1.2 * mx, 1.2 * mx],
        showticklabels: false,
      },
    },
  },
  config: {
    responsive: true,
    displayModeBar: false,
    displaylogo: false,
  },
});

`;
