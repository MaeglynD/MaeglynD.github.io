"use client";

export const _l3GBD1 = String.raw`// Palette function for dynamic gradients
vec3 palette(float t) {
    vec3 a = vec3(0.5, 0.5, 0.5); // Base color
    vec3 b = vec3(0.5, 0.5, 0.5); // Amplitude
    vec3 c = vec3(1.0, 1.0, 1.0); // Frequency
    vec3 d = vec3(0.263, 0.416, 0.557); // Phase shift
    return clamp(a + b * cos(6.28318 * (c * t + d)), 0.0, 1.0);
}

// Rotation matrix
mat2 rot(float a) {
    float c = cos(a), s = sin(a);
    return mat2(c, s, -s, c);
}

// Symmetry function
vec2 pmod(vec2 p, float r) {
    float pi = acos(-1.0);
    float pi2 = pi * 2.0;
    float a = atan(p.x, p.y) + pi / r;
    float n = pi2 / r;
    a = floor(a / n) * n;
    return p * rot(-a);
}

// Fractal box function
float box(vec3 p, vec3 b) {
    vec3 d = abs(p) - b;
    return min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0));
}

// Iterated fractal structure
float ifsBox(vec3 p, float detailFactor, float time, float speed) {
    for (int i = 0; i < 5; i++) {
        p = abs(p) - detailFactor;
        p.xy *= rot(time * 0.3 * speed);
        p.xz *= rot(time * 0.1 * speed);
    }
    p.xz *= rot(time * speed);
    return box(p, vec3(0.4, 0.8, 0.3));
}

// Mapping for raymarching
float map(vec3 p, vec3 cPos, float detailFactor, float symmetrySegments) {
    vec3 p1 = p;
    p1.x = mod(p1.x - 5.0, 10.0) - 5.0;
    p1.y = mod(p1.y - 5.0, 10.0) - 5.0;
    p1.z = mod(p1.z, 16.0) - 8.0;
    p1.xy = pmod(p1.xy, symmetrySegments); // Apply symmetry
    return ifsBox(p1, detailFactor, iTime, 1.0);
}

// Main shader function
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    // Normalize UV coordinates
    vec2 resolution = iResolution.xy;
    float time = 0.5*iTime;
    vec2 uv = (fragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

    // Animation and scaling
    uv *= 1.0 + sin(time * 0.3) * 0.2;

    vec3 cPos = vec3(0.0, 0.0, -3.0);
    vec3 cDir = normalize(vec3(0.0, 0.0, -1.0));
    vec3 cUp = vec3(sin(time), 1.0, 0.0);
    vec3 cSide = cross(cDir, cUp);
    vec3 ray = normalize(cSide * uv.x + cUp * uv.y + cDir);

    vec3 finalColor = vec3(0.0);
    float acc = 0.0; // Accumulated glow intensity
    float t = 0.0;   // Raymarching distance

    for (int i = 0; i < 50; i++) { // Limited iterations
        vec3 pos = cPos + ray * t;

        // Add soft distortion
        pos.xy += sin(pos.z * 0.2 + time) * 0.1;

        float dist = map(pos, cPos, 1.0, 6.0); // SymmetrySegments = 6, Detail = 1
        dist = max(abs(dist), 0.02);

        // Dynamic color palette
        vec3 dynamicColor = palette(time + length(pos) * 0.5);

        // Glow effect
        float glow = exp(-dist * 3.0);
        glow = min(glow, 1.0); // Cap glow contribution

        // Accumulate glow and color
        acc += glow * 0.25;
        finalColor += dynamicColor * glow * 0.25;

        t += dist * 0.5;

        // Break if the distance grows too large
        if (t > 20.0) break;
    }

    // Normalize final color
    finalColor = clamp(finalColor / (1.0 + acc), 0.0, 1.0);

    // Dynamic background
    vec3 background = palette(time * 0.1);
    finalColor = mix(background, finalColor, smoothstep(0.2, 1.0, acc));

    fragColor = vec4(finalColor, 1.0);
}`;

export const _4f3SRN = String.raw`#ifndef ANIMATION_FRACTAL
// Simulate the pitch inputs using a smoothed stairs function STEP
#define STEP1(x) ((x) - sin(x))
#define STEP(x, offset, amp) (STEP1(STEP1(offset + x * amp)) * .15)
#define is (iTime)

float pitches[9];
void genPitches() {
  pitches[0] = STEP(is, 1., 1.);
  pitches[1] = STEP(is, 2., 2.);
  pitches[2] = STEP(is, 3., 3.);
  pitches[3] = STEP(is, 4., 4.);
  pitches[4] = STEP(is, 5., 1.);
  pitches[5] = STEP(is, 6., 2.);
  pitches[6] = STEP(is, 7., 3.);
  pitches[7] = STEP(is, 8., 4.);
  pitches[8] = STEP(is, 1., 5.);
}
#define ipitch_1 pitches[0]
#define ipitch_2 pitches[1]
#define ipitch_3 pitches[2]
#define ipitch_4 pitches[3]
#define ipitch_5 pitches[4]
#define ipitch_6 pitches[5]
#define ipitch_7 pitches[6]
#define ipitch_8 pitches[7]
#define ipitch_9 pitches[8]

#define icolor (iTime*.5)
#define imoveFWD (iTime*.1)
#endif

#define PI 3.141592
#define orbs 20.

vec2 kale(vec2 uv, vec2 offset, float sides) {
  float angle = atan(uv.y, uv.x);
  angle = ((angle / PI) + 1.0) * 0.5;
  angle = mod(angle, 1.0 / sides) * sides;
  angle = -abs(2.0 * angle - 1.0) + 1.0;
  angle = angle;
  float y = length(uv);
  angle = angle * (y);
  return vec2(angle, y) - offset;
}

vec4 orb(vec2 uv, float size, vec2 position, vec3 color, float contrast) {
  return pow(vec4(size / length(uv + position) * color, 1.), vec4(contrast));
}

mat2 rotate(float angle) {
  return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

// The MIT License
// See https://iquilezles.org/articles/palettes for more information
vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}
vec3 palette ( float t ) {
 // return pal( t, vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,0.5),vec3(0.8,0.90,0.30) );
 // return pal( t, vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.0,0.10,0.20) );
 return pal( t, vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(2.0,1.0,0.0),vec3(0.5,0.20,0.25) );
}

#ifdef ANIMATION_FRACTAL
void main() {
    vec2 uv = -1. + 2*inUV;
    uv *= 42.;
    uv.y *= scene.screenRatio;
#else
void mainImage( out vec4 oColor, in vec2 fragCoord ) {
    vec2 uv = 23.09 * (2. * fragCoord - iResolution.xy) / iResolution.y;
    genPitches();
#endif
  float dist = length(uv);
  oColor = vec4(0.);
  uv *= rotate(imoveFWD);
  uv = kale(uv, vec2(6.97), 9.);
  uv *= rotate(ipitch_2 * .5);
  for (float i = 0.; i < orbs; i++) {
    uv *= rotate(ipitch_7*.01);
    uv.x += 0.57 * sin(0.3 * uv.y + ipitch_3);
    uv.y -= 0.63 * cos(0.53 * uv.x + ipitch_4);
    float t = i * PI / orbs * 2.;
    float x = 4.02 * tan(t - (ipitch_1 + ipitch_5) * .1);
    float y = 4.02 * cos(t - ipitch_6 * .5);
    vec2 position = vec2(x, y);
    vec3 color = .15 + palette(icolor + i / orbs) * .25; // vec3(0.,0.3,0.8) * 0.25 + 0.25;
    oColor += orb(uv, 1.39, position, color, 1.37);
  }
#ifdef ANIMATION_FRACTAL
    oColor = pow(oColor, vec4(1.2, .9, .9, 1.) * 3.);
#endif
}`;

export const _3dtSzN = String.raw`#define iTime .5*iTime
float hash(in vec3 p)
{
	ivec3 q = ivec3(p*5000.);
    int h = 15*q.x ^ q.y ^ q.z;
    return fract(713.*sin(float(h)));
}

float noise(in vec3 p)
{
    vec3 F = floor(p);
    vec2 o = vec2(0,1);
    vec3 f = smoothstep(0.,1.,fract(p));
    float r1 = mix(hash(F), hash(F+o.yxx), f.x);
    r1 = mix(r1,mix(hash(F+o.xyx),hash(F+o.yyx), f.x),f.y);
    float r2 = mix(hash(F+o.xxy), hash(F+o.yxy), f.x);
    r2 = mix(r2,mix(hash(F+o.xyy),hash(F+o.yyy), f.x),f.y);
    return mix(r1,r2,f.z);
}

float fbm(in vec3 p)
{
    float s = 1.;
    float a = 1.;
    float g = 2.;
    float A = 0.;
    float r = 0.;
    for(int i = 0; i<3; i++){
        r += a*noise(1.2*float(i)+p*s);
        A += a;
        a /= g;
        s *= g;
    }
    return r/A;
}

vec3 fbm3(in vec3 p)
{
    return vec3(fbm(p-10.3),fbm(p),fbm(p+10.3));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord-.5*iResolution.xy)/iResolution.x;
    
    vec3 col = vec3(0);
    float t = iTime*.1;
    
    t *= (.5+.5*smoothstep(.0,1.,length(uv)));
    
    mat2 rot = mat2(cos(t),sin(t),-sin(t),cos(t));
    
    uv *=rot;
    
    vec2 rad = vec2(atan((uv.y/uv.x)), length(uv));
    
    int rf = int(abs(floor(6.*rad.x/3.16)));
    rad.x = fract(6.*rad.x/3.16);
    if(rf%2==0) rad.x = 1.-rad.x; 
    rad.x *= 3.16/6.;
    
    vec3 p =  vec3(rad.x,16.*rad.y-1.5*iTime,.5*iTime);
    
    t = -iTime*.001;
    mat2 rot2 = mat2(cos(t),sin(t),-sin(t),cos(t));
    
    p.xy *= rot2;
    
    vec3 q = fbm3(vec3(p.xy,p.z));
    vec3 r = .5*fbm3(2.*(p+q));
    vec3 s = .2*fbm3(8.*(p+q+r));
    
    col += pow(fbm3(p+s)*fbm(r+.3*s)*3.5,vec3(.8,1.5,1.2));
    
    col *= fbm(p)*1.5;
    
    col *= 1.+smoothstep(.05,.0,rad.y);
    
    float vig = smoothstep(1.,.2,rad.y);
    col = pow(col, vec3(vig));
    col *= vig;
    
    fragColor = vec4(col,1.0);
}`;
