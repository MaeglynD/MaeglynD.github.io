"use client";
import { useEffect, useRef } from "react";
import { simFragmentShaderSrc, renderFragmentShaderSrc, advectDyeFragmentShaderSrc } from "./shaders";
import "./lattice-boltzmann-styles.css";

const GRID_WIDTH = 512;
const GRID_HEIGHT = 512;
const TAU = 0.52;
const U0 = 0.1;
const STEPS_PER_FRAME = 8;
const SMOOTHING = 0.25;

export default function LatticeBoltzmann() {
  const containerRef = useRef(null);
  const mainCanvasRef = useRef(null);

  useEffect(() => {
    const canvas = mainCanvasRef.current;
    canvas.width = GRID_WIDTH;
    canvas.height = GRID_HEIGHT;
    const gl = canvas.getContext("webgl2");
    if (!gl) {
      console.error("WebGL2 not supported");
      return;
    }
    gl.getExtension("EXT_color_buffer_float");

    // The obstacle rests left-of-centre and eases toward the cursor.
    const defaultPos = { x: canvas.width * 0.2, y: canvas.height * 0.5 };
    const target = { x: defaultPos.x, y: defaultPos.y };
    const obstacleCenter = { x: defaultPos.x, y: defaultPos.y };

    // Only run while the canvas is on screen.
    let isVisible = true;
    const visibilityObserver = new IntersectionObserver(([entry]) => (isVisible = entry.isIntersecting), { threshold: 0.01 });
    visibilityObserver.observe(canvas);

    const initData = initEquilibrium();
    const { currentState, nextState, dye } = setupWebGLResources(gl, initData);
    const { simProgram, renderProgram, dyeProgram, quadBuffer } = setupPrograms(gl);

    function handleMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      const xr = (e.clientX - rect.left) / rect.width;
      const yr = (e.clientY - rect.top) / rect.height;
      target.x = xr * GRID_WIDTH;
      target.y = (1.0 - yr) * GRID_HEIGHT; // flip Y: DOM grows down, grid grows up
    }
    function handleMouseLeave() {
      target.x = defaultPos.x;
      target.y = defaultPos.y;
    }

    const interactionEl = containerRef.current;
    if (interactionEl) {
      interactionEl.addEventListener("mousemove", handleMouseMove);
      interactionEl.addEventListener("mouseleave", handleMouseLeave);
    }

    let animationFrameId;

    function animate() {
      if (isVisible) {
        obstacleCenter.x += (target.x - obstacleCenter.x) * SMOOTHING;
        obstacleCenter.y += (target.y - obstacleCenter.y) * SMOOTHING;

        for (let i = 0; i < STEPS_PER_FRAME; i++) {
          stepSimulation(gl, currentState, nextState, simProgram, quadBuffer, obstacleCenter);
          [currentState.tex0, nextState.tex0] = [nextState.tex0, currentState.tex0];
          [currentState.tex1, nextState.tex1] = [nextState.tex1, currentState.tex1];
          [currentState.tex2, nextState.tex2] = [nextState.tex2, currentState.tex2];
          [currentState.fb, nextState.fb] = [nextState.fb, currentState.fb];
        }

        advectDye(gl, currentState, dye.read.tex, dye.write.fb, dyeProgram, quadBuffer, obstacleCenter);
        [dye.read, dye.write] = [dye.write, dye.read];

        render(gl, currentState, dye.read.tex, renderProgram, quadBuffer);
      }

      if (mainCanvasRef.current) {
        animationFrameId = requestAnimationFrame(animate);
      }
    }

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      visibilityObserver.disconnect();
      if (interactionEl) {
        interactionEl.removeEventListener("mousemove", handleMouseMove);
        interactionEl.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <div
      className="container"
      ref={containerRef}
    >
      <div className="panel pos0">
        <canvas ref={mainCanvasRef} />
      </div>
    </div>
  );
}

function initEquilibrium() {
  const size = GRID_WIDTH * GRID_HEIGHT;
  const data0 = new Float32Array(size * 4);
  const data1 = new Float32Array(size * 4);
  const data2 = new Float32Array(size);

  for (let i = 0; i < size; i++) {
    const rho = 1.0;
    const ux = U0;
    const uy = 0.0;
    const uSqr = ux * ux + uy * uy;

    const f0 = (4 / 9) * rho * (1 - 1.5 * uSqr);
    const eu1 = 3 * ux;
    const f1 = (1 / 9) * rho * (1 + eu1 + 0.5 * eu1 * eu1 - 1.5 * uSqr);
    const eu2 = 3 * uy;
    const f2 = (1 / 9) * rho * (1 + eu2 + 0.5 * eu2 * eu2 - 1.5 * uSqr);
    const eu3 = -3 * ux;
    const f3 = (1 / 9) * rho * (1 + eu3 + 0.5 * eu3 * eu3 - 1.5 * uSqr);
    const eu4 = -3 * uy;
    const f4 = (1 / 9) * rho * (1 + eu4 + 0.5 * eu4 * eu4 - 1.5 * uSqr);
    const eu5 = 3 * (ux + uy);
    const f5 = (1 / 36) * rho * (1 + eu5 + 0.5 * eu5 * eu5 - 1.5 * uSqr);
    const eu6 = 3 * (-ux + uy);
    const f6 = (1 / 36) * rho * (1 + eu6 + 0.5 * eu6 * eu6 - 1.5 * uSqr);
    const eu7 = 3 * (-ux - uy);
    const f7 = (1 / 36) * rho * (1 + eu7 + 0.5 * eu7 * eu7 - 1.5 * uSqr);
    const eu8 = 3 * (ux - uy);
    const f8 = (1 / 36) * rho * (1 + eu8 + 0.5 * eu8 * eu8 - 1.5 * uSqr);

    data0[i * 4 + 0] = f0;
    data0[i * 4 + 1] = f1;
    data0[i * 4 + 2] = f2;
    data0[i * 4 + 3] = f3;
    data1[i * 4 + 0] = f4;
    data1[i * 4 + 1] = f5;
    data1[i * 4 + 2] = f6;
    data1[i * 4 + 3] = f7;
    data2[i] = f8;
  }
  return { data0, data1, data2 };
}

function setupWebGLResources(gl, initData) {
  function createTexture(width, height, data, channels = 4) {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    let internalFormat = gl.RGBA32F;
    let format = gl.RGBA;
    if (channels === 1) {
      internalFormat = gl.R32F;
      format = gl.RED;
    }
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, width, height, 0, format, gl.FLOAT, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return tex;
  }

  function createFramebuffer(tex0, tex1, tex2) {
    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex0, 0);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, tex1, 0);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT2, gl.TEXTURE_2D, tex2, 0);
    gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1, gl.COLOR_ATTACHMENT2]);

    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (status !== gl.FRAMEBUFFER_COMPLETE) {
      console.error("Framebuffer is not complete:", status);
      return null;
    }
    return fb;
  }

  const stateA_tex0 = createTexture(GRID_WIDTH, GRID_HEIGHT, initData.data0, 4);
  const stateA_tex1 = createTexture(GRID_WIDTH, GRID_HEIGHT, initData.data1, 4);
  const stateA_tex2 = createTexture(GRID_WIDTH, GRID_HEIGHT, initData.data2, 1);
  const stateB_tex0 = createTexture(GRID_WIDTH, GRID_HEIGHT, null, 4);
  const stateB_tex1 = createTexture(GRID_WIDTH, GRID_HEIGHT, null, 4);
  const stateB_tex2 = createTexture(GRID_WIDTH, GRID_HEIGHT, null, 1);

  const fbA = createFramebuffer(stateA_tex0, stateA_tex1, stateA_tex2);
  const fbB = createFramebuffer(stateB_tex0, stateB_tex1, stateB_tex2);

  // Dye field: single-channel, linearly filtered, ping-ponged half-float pair
  // (the LBM textures stay NEAREST for exact streaming).
  function createDyeTexture() {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R16F, GRID_WIDTH, GRID_HEIGHT, 0, gl.RED, gl.HALF_FLOAT, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return tex;
  }

  function createDyeFramebuffer(tex) {
    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.drawBuffers([gl.COLOR_ATTACHMENT0]);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return fb;
  }

  const dyeTexA = createDyeTexture();
  const dyeTexB = createDyeTexture();
  const dyeFbA = createDyeFramebuffer(dyeTexA);
  const dyeFbB = createDyeFramebuffer(dyeTexB);

  return {
    currentState: { tex0: stateA_tex0, tex1: stateA_tex1, tex2: stateA_tex2, fb: fbA },
    nextState: { tex0: stateB_tex0, tex1: stateB_tex1, tex2: stateB_tex2, fb: fbB },
    dye: { read: { tex: dyeTexA, fb: dyeFbA }, write: { tex: dyeTexB, fb: dyeFbB } },
  };
}

function setupPrograms(gl) {
  function compileShader(src, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Shader compile error:", gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  }

  function createProgram(vsSrc, fsSrc) {
    const vs = compileShader(vsSrc, gl.VERTEX_SHADER);
    const fs = compileShader(fsSrc, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return null;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.bindAttribLocation(program, 0, "a_position");
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return null;
    }
    return program;
  }

  const vertexShaderSrc = `#version 300 es
    in vec2 a_position;
    out vec2 v_texCoord;
    void main() {
      v_texCoord = a_position * 0.5 + 0.5;
      gl_Position = vec4(a_position, 0, 1);
    }
  `;

  const quadBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

  const simProgram = createProgram(vertexShaderSrc, simFragmentShaderSrc);
  const renderProgram = createProgram(vertexShaderSrc, renderFragmentShaderSrc);
  const dyeProgram = createProgram(vertexShaderSrc, advectDyeFragmentShaderSrc);

  if (!simProgram || !renderProgram || !dyeProgram) {
    throw new Error("Failed to create WebGL programs");
  }

  return { simProgram, renderProgram, dyeProgram, quadBuffer };
}

function drawQuad(gl, quadBuffer) {
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function stepSimulation(gl, currentState, nextState, simProgram, quadBuffer, obstacleCenter) {
  gl.useProgram(simProgram);
  gl.bindFramebuffer(gl.FRAMEBUFFER, nextState.fb);
  gl.viewport(0, 0, GRID_WIDTH, GRID_HEIGHT);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, currentState.tex0);
  gl.uniform1i(gl.getUniformLocation(simProgram, "u_tex0"), 0);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, currentState.tex1);
  gl.uniform1i(gl.getUniformLocation(simProgram, "u_tex1"), 1);
  gl.activeTexture(gl.TEXTURE2);
  gl.bindTexture(gl.TEXTURE_2D, currentState.tex2);
  gl.uniform1i(gl.getUniformLocation(simProgram, "u_tex2"), 2);

  gl.uniform2f(gl.getUniformLocation(simProgram, "u_resolution"), GRID_WIDTH, GRID_HEIGHT);
  gl.uniform1f(gl.getUniformLocation(simProgram, "u_tau"), TAU);
  gl.uniform2f(gl.getUniformLocation(simProgram, "u_mouse"), obstacleCenter.x, obstacleCenter.y);

  drawQuad(gl, quadBuffer);
}

function advectDye(gl, lbmState, dyeSrcTex, dstFb, dyeProgram, quadBuffer, obstacleCenter) {
  gl.useProgram(dyeProgram);
  gl.bindFramebuffer(gl.FRAMEBUFFER, dstFb);
  gl.viewport(0, 0, GRID_WIDTH, GRID_HEIGHT);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, lbmState.tex0);
  gl.uniform1i(gl.getUniformLocation(dyeProgram, "u_tex0"), 0);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, lbmState.tex1);
  gl.uniform1i(gl.getUniformLocation(dyeProgram, "u_tex1"), 1);
  gl.activeTexture(gl.TEXTURE2);
  gl.bindTexture(gl.TEXTURE_2D, lbmState.tex2);
  gl.uniform1i(gl.getUniformLocation(dyeProgram, "u_tex2"), 2);
  gl.activeTexture(gl.TEXTURE3);
  gl.bindTexture(gl.TEXTURE_2D, dyeSrcTex);
  gl.uniform1i(gl.getUniformLocation(dyeProgram, "u_dye"), 3);

  gl.uniform2f(gl.getUniformLocation(dyeProgram, "u_resolution"), GRID_WIDTH, GRID_HEIGHT);
  gl.uniform2f(gl.getUniformLocation(dyeProgram, "u_mouse"), obstacleCenter.x, obstacleCenter.y);
  gl.uniform1f(gl.getUniformLocation(dyeProgram, "u_dt"), STEPS_PER_FRAME);

  drawQuad(gl, quadBuffer);
}

function render(gl, currentState, dyeTex, renderProgram, quadBuffer) {
  gl.useProgram(renderProgram);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, GRID_WIDTH, GRID_HEIGHT);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, currentState.tex0);
  gl.uniform1i(gl.getUniformLocation(renderProgram, "u_tex0"), 0);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, currentState.tex1);
  gl.uniform1i(gl.getUniformLocation(renderProgram, "u_tex1"), 1);
  gl.activeTexture(gl.TEXTURE2);
  gl.bindTexture(gl.TEXTURE_2D, currentState.tex2);
  gl.uniform1i(gl.getUniformLocation(renderProgram, "u_tex2"), 2);
  gl.activeTexture(gl.TEXTURE3);
  gl.bindTexture(gl.TEXTURE_2D, dyeTex);
  gl.uniform1i(gl.getUniformLocation(renderProgram, "u_dye"), 3);

  gl.uniform2f(gl.getUniformLocation(renderProgram, "u_resolution"), GRID_WIDTH, GRID_HEIGHT);

  drawQuad(gl, quadBuffer);
}
