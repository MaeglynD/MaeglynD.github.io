// GPU D2Q9 lattice-Boltzmann shaders for a flow-past-a-cylinder visual
// (a Karman vortex street). The obstacle follows the cursor.
//
// - Regularised BGK collision (Latt & Chopard, 2006) + a low-Mach velocity
//   clamp, so it stays sharp at high Reynolds number and can never blow up.
// - A passive dye is injected as bands at the inlet and advected, drawing the
//   streaklines that wrap around the shed vortices.

// Shared helper: reconstruct macroscopic velocity from the populations.
const velocityGLSL = `
vec2 velAt(vec2 p) {
  vec4 a = texture(u_tex0, p);   // f0,f1,f2,f3
  vec4 b = texture(u_tex1, p);   // f4,f5,f6,f7
  float f8 = texture(u_tex2, p).r;
  float rho = a.r + a.g + a.b + a.a + b.r + b.g + b.b + b.a + f8;
  rho = max(rho, 1.0e-3);
  return vec2(a.g - a.a + b.g - b.b - b.a + f8,
              a.b - b.r + b.g + b.b - b.a - f8) / rho;
}
`;

export const simFragmentShaderSrc = `#version 300 es
precision highp float;
uniform sampler2D u_tex0;
uniform sampler2D u_tex1;
uniform sampler2D u_tex2;
uniform vec2 u_resolution;
uniform float u_tau;
uniform vec2 u_mouse;
const float inletU = 0.1;
in vec2 v_texCoord;
layout(location = 0) out vec4 out0;
layout(location = 1) out vec4 out1;
layout(location = 2) out vec4 out2;

void main() {
  vec2 dx = 1.0 / u_resolution;
  vec2 pos = gl_FragCoord.xy;
  bool isWall = (pos.y < 2.0 || pos.y > u_resolution.y - 2.0);
  bool isInlet = (pos.x < 2.0);
  float obstacleRadius = u_resolution.x * 0.04;
  bool isObstacle = (distance(pos, u_mouse) < obstacleRadius);

  float f0, f1, f2, f3, f4, f5, f6, f7, f8;

  if (isWall || isObstacle) {
    // No-slip boundary: reset to rest equilibrium.
    float rho = 1.0;
    out0 = vec4((4.0/9.0) * rho, (1.0/9.0) * rho, (1.0/9.0) * rho, (1.0/9.0) * rho);
    out1 = vec4((1.0/9.0) * rho, (1.0/36.0) * rho, (1.0/36.0) * rho, (1.0/36.0) * rho);
    out2 = vec4((1.0/36.0) * rho, 0.0, 0.0, 0.0);
  } else if (isInlet) {
    // Inlet: equilibrium with u = (inletU, 0).
    float rho = 1.0;
    float uSqr = inletU * inletU;
    f0 = (4.0/9.0) * rho * (1.0 - 1.5 * uSqr);
    float eu = 3.0 * inletU;
    f1 = (1.0/9.0) * rho * (1.0 + eu + 0.5 * eu * eu - 1.5 * uSqr);
    f2 = (1.0/9.0) * rho * (1.0 - 1.5 * uSqr);
    f3 = (1.0/9.0) * rho * (1.0 - eu + 0.5 * eu * eu - 1.5 * uSqr);
    f4 = (1.0/9.0) * rho * (1.0 - 1.5 * uSqr);
    f5 = (1.0/36.0) * rho * (1.0 + eu + 0.5 * eu * eu - 1.5 * uSqr);
    f6 = (1.0/36.0) * rho * (1.0 - eu + 0.5 * eu * eu - 1.5 * uSqr);
    f7 = f6;
    f8 = f5;
    out0 = vec4(f0, f1, f2, f3);
    out1 = vec4(f4, f5, f6, f7);
    out2 = vec4(f8, 0.0, 0.0, 0.0);
  } else {
    // Streaming (pull from neighbours).
    vec2 p = v_texCoord;
    f0 = texture(u_tex0, p).r;
    f1 = texture(u_tex0, p - vec2(dx.x, 0.0)).g;
    f2 = texture(u_tex0, p - vec2(0.0, dx.y)).b;
    f3 = texture(u_tex0, p + vec2(dx.x, 0.0)).a;
    f4 = texture(u_tex1, p + vec2(0.0, dx.y)).r;
    f5 = texture(u_tex1, p - vec2(dx.x, dx.y)).g;
    f6 = texture(u_tex1, p + vec2(dx.x, -dx.y)).b;
    f7 = texture(u_tex1, p + vec2(dx.x, dx.y)).a;
    f8 = texture(u_tex2, p - vec2(dx.x, -dx.y)).r;

    float rho = f0 + f1 + f2 + f3 + f4 + f5 + f6 + f7 + f8;
    rho = max(rho, 1.0e-3);
    vec2 u = vec2(f1 - f3 + f5 - f6 - f7 + f8, f2 - f4 + f5 + f6 - f7 - f8) / rho;

    float speed = length(u);
    const float uMax = 0.35;
    if (speed > uMax) u *= uMax / speed;
    float uSqr = dot(u, u);
    float omega = 1.0 / u_tau;

    // Equilibrium distribution
    float feq0 = (4.0/9.0) * rho * (1.0 - 1.5 * uSqr);
    float eu;
    eu = 3.0 * u.x;          float feq1 = (1.0/9.0)  * rho * (1.0 + eu + 0.5*eu*eu - 1.5*uSqr);
    eu = 3.0 * u.y;          float feq2 = (1.0/9.0)  * rho * (1.0 + eu + 0.5*eu*eu - 1.5*uSqr);
    eu = -3.0 * u.x;         float feq3 = (1.0/9.0)  * rho * (1.0 + eu + 0.5*eu*eu - 1.5*uSqr);
    eu = -3.0 * u.y;         float feq4 = (1.0/9.0)  * rho * (1.0 + eu + 0.5*eu*eu - 1.5*uSqr);
    eu = 3.0 * (u.x + u.y);  float feq5 = (1.0/36.0) * rho * (1.0 + eu + 0.5*eu*eu - 1.5*uSqr);
    eu = 3.0 * (-u.x + u.y); float feq6 = (1.0/36.0) * rho * (1.0 + eu + 0.5*eu*eu - 1.5*uSqr);
    eu = 3.0 * (-u.x - u.y); float feq7 = (1.0/36.0) * rho * (1.0 + eu + 0.5*eu*eu - 1.5*uSqr);
    eu = 3.0 * (u.x - u.y);  float feq8 = (1.0/36.0) * rho * (1.0 + eu + 0.5*eu*eu - 1.5*uSqr);

    // Regularised non-equilibrium part (discard the unstable ghost modes).
    float n1 = f1 - feq1; float n2 = f2 - feq2; float n3 = f3 - feq3;
    float n4 = f4 - feq4; float n5 = f5 - feq5; float n6 = f6 - feq6;
    float n7 = f7 - feq7; float n8 = f8 - feq8;
    float Pxx = n1 + n3 + n5 + n6 + n7 + n8;
    float Pyy = n2 + n4 + n5 + n6 + n7 + n8;
    float Pxy = n5 - n6 + n7 - n8;

    const float cs2 = 1.0/3.0;
    float fr0 = 2.0   * ((    -cs2)*Pxx + (    -cs2)*Pyy);
    float fr1 = 0.5   * ((1.0 -cs2)*Pxx + (    -cs2)*Pyy);
    float fr2 = 0.5   * ((    -cs2)*Pxx + (1.0 -cs2)*Pyy);
    float fr3 = 0.5   * ((1.0 -cs2)*Pxx + (    -cs2)*Pyy);
    float fr4 = 0.5   * ((    -cs2)*Pxx + (1.0 -cs2)*Pyy);
    float fr5 = 0.125 * ((1.0 -cs2)*Pxx + (1.0 -cs2)*Pyy + 2.0*Pxy);
    float fr6 = 0.125 * ((1.0 -cs2)*Pxx + (1.0 -cs2)*Pyy - 2.0*Pxy);
    float fr7 = 0.125 * ((1.0 -cs2)*Pxx + (1.0 -cs2)*Pyy + 2.0*Pxy);
    float fr8 = 0.125 * ((1.0 -cs2)*Pxx + (1.0 -cs2)*Pyy - 2.0*Pxy);
    float r = 1.0 - omega;

    out0 = vec4(feq0 + r*fr0, feq1 + r*fr1, feq2 + r*fr2, feq3 + r*fr3);
    out1 = vec4(feq4 + r*fr4, feq5 + r*fr5, feq6 + r*fr6, feq7 + r*fr7);
    out2 = vec4(feq8 + r*fr8, 0.0, 0.0, 0.0);
  }
}
`;

// Inject soft alternating dye bands at the inlet and advect them downstream
// (semi-Lagrangian). These are the streaklines wrapping the vortices.
export const advectDyeFragmentShaderSrc = `#version 300 es
precision highp float;
uniform sampler2D u_tex0;
uniform sampler2D u_tex1;
uniform sampler2D u_tex2;
uniform sampler2D u_dye;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_dt;
in vec2 v_texCoord;
out vec4 fragColor;
${velocityGLSL}
void main() {
  vec2 px = 1.0 / u_resolution;
  vec2 pos = gl_FragCoord.xy;

  float obstacleRadius = u_resolution.x * 0.04;
  bool isObstacle = distance(pos, u_mouse) < obstacleRadius;
  bool isWall = (pos.y < 2.0 || pos.y > u_resolution.y - 2.0);
  if (isObstacle || isWall) { fragColor = vec4(0.0, 0.0, 0.0, 1.0); return; }

  if (pos.x < 3.0) {
    float bands = 0.5 + 0.5 * sin(pos.y * 6.2831853 / 34.0);
    fragColor = vec4(smoothstep(0.35, 0.7, bands), 0.0, 0.0, 1.0);
    return;
  }

  vec2 u = velAt(v_texCoord);
  vec2 back = v_texCoord - u * u_dt * px;
  float d = texture(u_dye, back).r * 0.997;   // gentle dissipation
  fragColor = vec4(clamp(d, 0.0, 1.5), 0.0, 0.0, 1.0);
}
`;

export const renderFragmentShaderSrc = `#version 300 es
precision highp float;
uniform sampler2D u_tex0;
uniform sampler2D u_tex1;
uniform sampler2D u_tex2;
uniform sampler2D u_dye;
uniform vec2 u_resolution;
in vec2 v_texCoord;
out vec4 fragColor;
${velocityGLSL}

// Original "jet" colormap: blue (slow) → cyan → green → yellow → red (fast).
vec3 jetColor(float v) {
  float r = clamp(1.5 - abs(4.0 * v - 3.0), 0.0, 1.0);
  float g = clamp(1.5 - abs(4.0 * v - 2.0), 0.0, 1.0);
  float b = clamp(1.5 - abs(4.0 * v - 1.0), 0.0, 1.0);
  return vec3(r, g, b);
}

void main() {
  vec2 u = velAt(v_texCoord);
  float speed = length(u);
  float normSpeed = clamp(speed * 5.0, 0.0, 1.0);
  vec3 color = jetColor(normSpeed);

  // Dye streaklines layered on top as faint luminous rays.
  float dye = texture(u_dye, v_texCoord).r;
  color += vec3(dye) * 0.05;

  fragColor = vec4(color, 1.0);
}
`;
