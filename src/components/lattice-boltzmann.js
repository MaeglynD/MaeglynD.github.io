"use client";
import { useEffect, useRef } from "react";
import { simFragmentShaderSrc, renderFragmentShaderSrc } from "./shaders";
import "./lattice-boltzmann-styles.css";

const GRID_WIDTH = 512;
const GRID_HEIGHT = 512;
const TAU = 0.52;
const U0 = 0.1;
const STEPS_PER_FRAME = 8;
const SMOOTHING = 0.4;

export default function LatticeBoltzmann() {
  const containerRef = useRef(null);
  const mainCanvasRef = useRef(null);
  const copyCanvasRefs = [useRef(null), useRef(null)];
  // const copyCanvasRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

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

    // copyCanvasRefs.forEach((ref) => {
    //   const canvas = ref.current;
    //   canvas.width = GRID_WIDTH;
    //   canvas.height = GRID_HEIGHT;
    // });

    let mousePos = { x: canvas.width * 0.2, y: canvas.height * 0.5 };
    let obstacleCenter = { x: canvas.width * 0.2, y: canvas.height * 0.5 };

    const initData = initEquilibrium();
    const { currentState, nextState } = setupWebGLResources(gl, initData);
    const { simProgram, renderProgram, quadBuffer } = setupPrograms(gl);

    function get3DTransformedPosition(element, x, y) {
      const panel = element.closest(".panel");
      const container = element.closest(".container");
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const relX = x - centerX;
      const relY = y - centerY;

      const containerTransform = getComputedStyle(container).transform;
      const panelTransform = getComputedStyle(panel).transform;

      const containerMatrix = new DOMMatrix(containerTransform);
      const panelMatrix = new DOMMatrix(panelTransform);
      const combinedMatrix = containerMatrix.multiply(panelMatrix);
      const inverseMatrix = combinedMatrix.inverse();

      const transformedPoint = new DOMPoint(relX, relY, 0, 1).matrixTransform(inverseMatrix);

      return {
        x: transformedPoint.x + rect.width / 2,
        y: transformedPoint.y + rect.height / 2,
      };
    }

    function handleMouseMove(e) {
      const frontCanvas = document.querySelector(".pos0 canvas");
      const rect = frontCanvas.getBoundingClientRect();

      const pos = get3DTransformedPosition(frontCanvas, e.clientX, e.clientY);

      if (pos.x >= 0 && pos.x <= rect.width && pos.y >= 0 && pos.y <= rect.height) {
        const scaleX = frontCanvas.width / rect.width;
        const scaleY = frontCanvas.height / rect.height;
        mousePos.x = pos.x * scaleX;
        mousePos.y = frontCanvas.height - pos.y * scaleY;
      }
    }

    function handleMouseOut() {
      mousePos.x = canvas.width * 0.2;
      mousePos.y = canvas.height * 0.5;
    }

    function animate() {
      const isInView = window.scrollY < window.innerHeight;

      if (isInView) {
        for (let i = 0; i < STEPS_PER_FRAME; i++) {
          stepSimulation(gl, currentState, nextState, simProgram, quadBuffer, mousePos, obstacleCenter);
          [currentState.tex0, nextState.tex0] = [nextState.tex0, currentState.tex0];
          [currentState.tex1, nextState.tex1] = [nextState.tex1, currentState.tex1];
          [currentState.tex2, nextState.tex2] = [nextState.tex2, currentState.tex2];
          [currentState.fb, nextState.fb] = [nextState.fb, currentState.fb];
        }

        render(gl, currentState, renderProgram, quadBuffer);

        // copyCanvasRefs.forEach((ref) => {
        //   if (ref.current && canvas) {
        //     const ctx = ref.current.getContext("2d");
        //     if (ctx) {
        //       ctx.drawImage(canvas, 0, 0);
        //     }
        //   }
        // });
      }

      if (mainCanvasRef.current) {
        animationFrameId = requestAnimationFrame(animate);
      }
    }

    function cyclePositions() {
      const panels = document.querySelectorAll(".panel");
      panels.forEach((panel) => {
        const currentPos = parseInt(panel.className.split("pos")[1]);
        const nextPos = (currentPos + 1) % 3;
        panel.className = `panel pos${nextPos}`;
      });
    }

    // Get the pos0 panel
    const pos0Panel = document.querySelector(".pos0");
    if (pos0Panel) {
      pos0Panel.addEventListener("mousemove", handleMouseMove);
      pos0Panel.addEventListener("mouseout", handleMouseOut);
    }

    let animationFrameId;
    animate();
    // const positionInterval = setInterval(cyclePositions, 10000);

    return () => {
      cancelAnimationFrame(animationFrameId);
      // clearInterval(positionInterval);
      if (pos0Panel) {
        pos0Panel.removeEventListener("mousemove", handleMouseMove);
        pos0Panel.removeEventListener("mouseout", handleMouseOut);
      }
    };
  }, []);

  return (
    <div className="container" ref={containerRef}>
      {/* <div className="panel pos0">
        <canvas ref={copyCanvasRefs[0]} style={{ filter: "invert(1)" }} />
      </div> */}
      <div className="panel pos0">
        <canvas ref={mainCanvasRef} />
      </div>
      {/* <div className="panel pos2">
        <canvas ref={copyCanvasRefs[1]} style={{ filter: "grayscale(1)" }} />
      </div> */}
      {/* <div className="panel pos3">
        <canvas ref={copyCanvasRefs[2]} style={{ filter: "grayscale(1)" }} />
      </div>
      <div className="panel pos4">
        <canvas ref={copyCanvasRefs[3]} style={{ filter: "invert(1) grayscale(1)" }} />
      </div> */}
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
    const ux = U0,
      uy = 0.0;
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
    let internalFormat = gl.RGBA32F,
      format = gl.RGBA;
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

  return {
    currentState: { tex0: stateA_tex0, tex1: stateA_tex1, tex2: stateA_tex2, fb: fbA },
    nextState: { tex0: stateB_tex0, tex1: stateB_tex1, tex2: stateB_tex2, fb: fbB },
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

  if (!simProgram || !renderProgram) {
    throw new Error("Failed to create WebGL programs");
  }

  return { simProgram, renderProgram, quadBuffer };
}

function stepSimulation(gl, currentState, nextState, simProgram, quadBuffer, mousePos, obstacleCenter) {
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

  obstacleCenter.x += (mousePos.x - obstacleCenter.x) * SMOOTHING;
  obstacleCenter.y += (mousePos.y - obstacleCenter.y) * SMOOTHING;
  gl.uniform2f(gl.getUniformLocation(simProgram, "u_mouse"), obstacleCenter.x, obstacleCenter.y);

  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function render(gl, currentState, renderProgram, quadBuffer) {
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

  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}
