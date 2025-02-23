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

  if(isWall || isObstacle) {
    // No-slip boundary: bounce-back
    float rho = 1.0;
    out0 = vec4((4.0/9.0) * rho, (1.0/9.0) * rho, (1.0/9.0) * rho, (1.0/9.0) * rho);
    out1 = vec4((1.0/9.0) * rho, (1.0/36.0) * rho, (1.0/36.0) * rho, (1.0/36.0) * rho);
    out2 = vec4((1.0/36.0) * rho, 0.0, 0.0, 0.0);
  } else if(isInlet) {
    // Inlet: equilibrium with u = (inletU, 0)
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
    // Streaming and collision
    vec2 pos = v_texCoord;
    f0 = texture(u_tex0, pos).r;
    f1 = texture(u_tex0, pos - vec2(dx.x, 0.0)).g;
    f2 = texture(u_tex0, pos - vec2(0.0, dx.y)).b;
    f3 = texture(u_tex0, pos + vec2(dx.x, 0.0)).a;
    f4 = texture(u_tex1, pos + vec2(0.0, dx.y)).r;
    f5 = texture(u_tex1, pos - vec2(dx.x, dx.y)).g;
    f6 = texture(u_tex1, pos + vec2(dx.x, -dx.y)).b;
    f7 = texture(u_tex1, pos + vec2(dx.x, dx.y)).a;
    f8 = texture(u_tex2, pos - vec2(dx.x, -dx.y)).r;

    float rho = f0 + f1 + f2 + f3 + f4 + f5 + f6 + f7 + f8;
    vec2 u = (vec2(f1 - f3 + f5 - f6 - f7 + f8, f2 - f4 + f5 + f6 - f7 - f8)) / rho;
    float uSqr = dot(u, u);
    
    // Collision
    float omega = 1.0 / u_tau;
    float feq0 = (4.0/9.0) * rho * (1.0 - 1.5 * uSqr);
    float eu;
    eu = 3.0 * u.x;
    float feq1 = (1.0/9.0) * rho * (1.0 + eu + 0.5 * eu * eu - 1.5 * uSqr);
    eu = 3.0 * u.y;
    float feq2 = (1.0/9.0) * rho * (1.0 + eu + 0.5 * eu * eu - 1.5 * uSqr);
    eu = -3.0 * u.x;
    float feq3 = (1.0/9.0) * rho * (1.0 + eu + 0.5 * eu * eu - 1.5 * uSqr);
    eu = -3.0 * u.y;
    float feq4 = (1.0/9.0) * rho * (1.0 + eu + 0.5 * eu * eu - 1.5 * uSqr);
    eu = 3.0 * (u.x + u.y);
    float feq5 = (1.0/36.0) * rho * (1.0 + eu + 0.5 * eu * eu - 1.5 * uSqr);
    eu = 3.0 * (-u.x + u.y);
    float feq6 = (1.0/36.0) * rho * (1.0 + eu + 0.5 * eu * eu - 1.5 * uSqr);
    eu = 3.0 * (-u.x - u.y);
    float feq7 = (1.0/36.0) * rho * (1.0 + eu + 0.5 * eu * eu - 1.5 * uSqr);
    eu = 3.0 * (u.x - u.y);
    float feq8 = (1.0/36.0) * rho * (1.0 + eu + 0.5 * eu * eu - 1.5 * uSqr);

    f0 = f0 * (1.0 - omega) + omega * feq0;
    f1 = f1 * (1.0 - omega) + omega * feq1;
    f2 = f2 * (1.0 - omega) + omega * feq2;
    f3 = f3 * (1.0 - omega) + omega * feq3;
    f4 = f4 * (1.0 - omega) + omega * feq4;
    f5 = f5 * (1.0 - omega) + omega * feq5;
    f6 = f6 * (1.0 - omega) + omega * feq6;
    f7 = f7 * (1.0 - omega) + omega * feq7;
    f8 = f8 * (1.0 - omega) + omega * feq8;

    out0 = vec4(f0, f1, f2, f3);
    out1 = vec4(f4, f5, f6, f7);
    out2 = vec4(f8, 0.0, 0.0, 0.0);
  }
}
`;

export const renderFragmentShaderSrc = `#version 300 es
precision highp float;
uniform sampler2D u_tex0;
uniform sampler2D u_tex1;
uniform sampler2D u_tex2;
in vec2 v_texCoord;
out vec4 fragColor;

vec3 jetColor(float v) {
  float r = clamp(1.5 - abs(4.0*v - 3.0), 0.0, 1.0);
  float g = clamp(1.5 - abs(4.0*v - 2.0), 0.0, 1.0);
  float b = clamp(1.5 - abs(4.0*v - 1.0), 0.0, 1.0);
  return vec3(r, g, b);
}

void main() {
  float f0 = texture(u_tex0, v_texCoord).r;
  float f1 = texture(u_tex0, v_texCoord).g;
  float f2 = texture(u_tex0, v_texCoord).b;
  float f3 = texture(u_tex0, v_texCoord).a;
  float f4 = texture(u_tex1, v_texCoord).r;
  float f5 = texture(u_tex1, v_texCoord).g;
  float f6 = texture(u_tex1, v_texCoord).b;
  float f7 = texture(u_tex1, v_texCoord).a;
  float f8 = texture(u_tex2, v_texCoord).r;

  float rho = f0 + f1 + f2 + f3 + f4 + f5 + f6 + f7 + f8;
  vec2 u = (vec2(f1 - f3 + f5 - f6 - f7 + f8, 
                 f2 - f4 + f5 + f6 - f7 - f8)) / rho;
  float speed = length(u);
  float normSpeed = clamp(speed * 5.0, 0.0, 1.0);
  vec3 color = jetColor(normSpeed);
  fragColor = vec4(color, 1.0);
}
`;
