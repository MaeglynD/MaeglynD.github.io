"use client";

import Image from "next/image";
import s from "../blog.module.css";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import SyntaxHighlighter from "react-syntax-highlighter";
import githubGist from "react-syntax-highlighter/dist/esm/styles/hljs/github-gist";
import { Suspense } from "react";

export default function FluidDynamics() {
  return (
    <div className={s.articleContainer}>
      <div className={s.articleInner}>
        <div className={s.articleTitle}>Checking in with the fluid dynamicists (and some light GRMHD)</div>
        {/* <div className={`${s.articleSection} ${s.fluidDynamics}`}>
          <Suspense></Suspense>
        </div> */}

        <canvas></canvas>

        <div className={s.articleSection}></div>
        <div className={s.articleSection}></div>
        <div className={s.articleSection}></div>
        <div className={s.articleSection}></div>
        <div className={s.articleSection}></div>

        <Latex>{String.raw`$  $`}</Latex>
        <Latex>{String.raw`$  $`}</Latex>
        <Latex>{String.raw`$  $`}</Latex>
        <Latex>{String.raw`$  $`}</Latex>
        <Latex>{String.raw`$  $`}</Latex>
        <Latex>{String.raw`$  $`}</Latex>
        <Latex>{String.raw`$  $`}</Latex>
        <Latex>{String.raw`$  $`}</Latex>
        <Latex>{String.raw`$  $`}</Latex>
        <Latex>{String.raw`$  $`}</Latex>
        <Latex>{String.raw`$  $`}</Latex>
      </div>
    </div>
  );
}

import React, { useEffect, useRef } from "react";

const FluidSimulation = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, prevX: 0, prevY: 0 });

  // Shader source code
  const commonShader = `
    #define PI2 6.283185
    
    vec2 scuv(vec2 uv, float mouseZ) {
      float zoom = 1.0 - mouseZ / 1000.0;
      return (uv - 0.5) * 1.2 * zoom + 0.5;
    }

    vec2 uvSmooth(vec2 uv, vec2 res) {
      vec2 f = fract(uv * res);
      return (uv * res + 0.5 - f + 3.0 * f * f - 2.0 * f * f * f) / res;
    }
  `;

  const bufferAShader = `
    precision highp float;
    uniform sampler2D uPreviousFrame;
    uniform sampler2D uNoiseTex;
    uniform vec2 uResolution;
    uniform vec2 uMouse;
    uniform vec2 uPrevMouse;
    uniform float uTime;
    
    #define RotNum 5
    #define PI2 6.283185
    
    const float ang = PI2/float(RotNum);
    mat2 m = mat2(cos(ang),sin(ang),-sin(ang),cos(ang));
    mat2 mh = mat2(cos(ang*0.5),sin(ang*0.5),-sin(ang*0.5),cos(ang*0.5));
    
    float getRot(vec2 pos, vec2 b, sampler2D tex, vec2 res) {
      float l = log2(dot(b,b)) * sqrt(0.125) * 0.0;
      vec2 p = b;
      float rot = 0.0;
      
      for(int i=0; i<RotNum; i++) {
        rot += dot(texture2D(tex, ((pos+p)/res)).xy - vec2(0.5), p.yx*vec2(1.0,-1.0));
        p = m * p;
      }
      return rot/float(RotNum)/dot(b,b);
    }
    
    void main() {
      vec2 pos = gl_FragCoord.xy;
      vec2 b = cos(uTime * 0.3 - vec2(0.0, 1.57));
      vec2 v = vec2(0.0);
      float bbMax = 0.5 * uResolution.y;
      bbMax *= bbMax;
      
      for(int l=0; l<20; l++) {
        if(dot(b,b) > bbMax) break;
        vec2 p = b;
        for(int i=0; i<RotNum; i++) {
          v += p.yx * getRot(pos+p, -mh*b, uPreviousFrame, uResolution);
          p = m * p;
        }
        b *= 2.0;
      }
      
      vec4 prevColor = texture2D(uPreviousFrame, fract(pos/uResolution));
      vec4 color = texture2D(uPreviousFrame, 
        fract((pos-v*vec2(-1.0,1.0)*5.0*sqrt(uResolution.x/600.0))/uResolution));
      
      color.xy = mix(color.xy, v*vec2(-1.0,1.0)*sqrt(0.125)*0.9, 0.025);
      
      vec2 mousePos = uMouse;
      vec2 scrPos = fract((gl_FragCoord.xy - mousePos)/uResolution.x + 0.5) - 0.5;
      
      // Add mouse influence
      vec2 mouseDelta = uMouse - uPrevMouse;
      color.xy += 0.0003 * mouseDelta/(dot(scrPos,scrPos)/0.05+0.05);
      
      // Add noise
      vec4 noise = texture2D(uNoiseTex, gl_FragCoord.xy/uResolution * 0.35);
      color.zw += (noise.zw - 0.5) * 0.002;
      
      gl_FragColor = color;
    }
  `;

  const finalShader = `
    precision highp float;
    uniform sampler2D uMainTex;
    uniform sampler2D uEnvMap;
    uniform vec2 uResolution;
    
    vec3 getGrad(vec2 uv, float delta, sampler2D tex) {
      vec2 d = vec2(delta, 0.0);
      float val1 = length(texture2D(tex, uv + d.xy).xyz);
      float val2 = length(texture2D(tex, uv - d.xy).xyz);
      float val3 = length(texture2D(tex, uv + d.yx).xyz);
      float val4 = length(texture2D(tex, uv - d.yx).xyz);
      return vec3(-(val1 - val2), -(val3 - val4), 1.0);
    }
    
    void main() {
      vec2 uv = gl_FragCoord.xy / uResolution;
      
      vec3 n = getGrad(uv, 1.4/uResolution.x, uMainTex);
      n = normalize(n);
      
      vec2 sc = (gl_FragCoord.xy - uResolution * 0.5) / uResolution.x;
      vec3 dir = normalize(vec3(sc, -1.0));
      vec3 R = reflect(dir, n);
      
      vec4 col = texture2D(uMainTex, uv) + 0.5;
      col = mix(vec4(1.0), col, 0.35);
      col.xyz *= 0.95 + -0.05 * n;
      
      vec3 refl = texture2D(uEnvMap, R.xy * 0.5 + 0.5).xyz;
      
      gl_FragColor = vec4(col.xyz * refl, 1.0);
    }
  `;

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    // Initialize WebGL context and create shader programs
    const createShader = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const createProgram = (vertexShader, fragmentShader) => {
      const program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
      }
      return program;
    };

    // Basic vertex shader for full-screen quad
    const vertexShaderSource = `
      attribute vec2 aPosition;
      void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    // Create framebuffers and textures
    const createFramebuffer = (width, height) => {
      const framebuffer = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.FLOAT, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      return { framebuffer, texture };
    };

    // Initialize programs and buffers
    const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const bufferAProgram = createProgram(vertexShader, createShader(gl.FRAGMENT_SHADER, bufferAShader));
    const finalProgram = createProgram(vertexShader, createShader(gl.FRAGMENT_SHADER, finalShader));

    // Create vertex buffer for full-screen quad
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Create framebuffers
    const { framebuffer: bufferA1, texture: textureA1 } = createFramebuffer(canvas.width, canvas.height);
    const { framebuffer: bufferA2, texture: textureA2 } = createFramebuffer(canvas.width, canvas.height);

    // Create noise texture
    const noiseTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, noiseTexture);
    const noiseData = new Uint8Array(canvas.width * canvas.height * 4);
    for (let i = 0; i < noiseData.length; i++) {
      noiseData[i] = Math.random() * 255;
    }
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvas.width, canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, noiseData);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // Animation loop
    let currentBuffer = 0;
    const animate = (time) => {
      const sourceTexture = currentBuffer === 0 ? textureA1 : textureA2;
      const targetFramebuffer = currentBuffer === 0 ? bufferA2 : bufferA1;

      // Update buffer A
      gl.bindFramebuffer(gl.FRAMEBUFFER, targetFramebuffer);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(bufferAProgram);

      // Set uniforms
      gl.uniform2f(gl.getUniformLocation(bufferAProgram, "uResolution"), canvas.width, canvas.height);
      gl.uniform2f(gl.getUniformLocation(bufferAProgram, "uMouse"), mouseRef.current.x, mouseRef.current.y);
      gl.uniform2f(gl.getUniformLocation(bufferAProgram, "uPrevMouse"), mouseRef.current.prevX, mouseRef.current.prevY);
      gl.uniform1f(gl.getUniformLocation(bufferAProgram, "uTime"), time * 0.001);

      // Draw
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      // Final render to screen
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.useProgram(finalProgram);
      gl.uniform2f(gl.getUniformLocation(finalProgram, "uResolution"), canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      currentBuffer = 1 - currentBuffer;
      mouseRef.current.prevX = mouseRef.current.x;
      mouseRef.current.prevY = mouseRef.current.y;

      requestAnimationFrame(animate);
    };

    // Start animation
    requestAnimationFrame(animate);

    // Handle mouse events
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = canvas.height - (e.clientY - rect.top);
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" width={800} height={600} />;
};
