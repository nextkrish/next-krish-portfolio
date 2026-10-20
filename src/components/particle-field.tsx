"use client";

import { useEffect, useRef, useState } from "react";
import { useMotion } from "./motion-provider";

export function ParticleField({ variant = "sheet", className = "" }: { variant?: "sheet" | "sphere" | "stack"; className?: string }) {
  const container = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const { enabled, ready: pageReady } = useMotion();
  useEffect(() => {
    const host = container.current; if (!host || !pageReady) return;
    let disposed = false, started = false, active = false;
    let teardown = () => {};
    async function initialize() {
      if (started || disposed || !host) return; started = true;
      try {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("webgl2", { alpha: true, antialias: false, powerPreference: "low-power" });
        if (!context) { host.dataset.renderMode = "fallback"; return; }
        const THREE = await import("three"); if (disposed) { context.getExtension("WEBGL_lose_context")?.loseContext(); return; }
        const coarse=matchMedia("(pointer:coarse)").matches;
        const renderer=new THREE.WebGLRenderer({canvas,context,alpha:true,antialias:false,powerPreference:"low-power"});
        const dpr=Math.min(devicePixelRatio,coarse?1:1.35);renderer.setPixelRatio(dpr);renderer.setClearColor(0x000000,0);renderer.domElement.setAttribute("aria-hidden","true");host.appendChild(renderer.domElement);
        const scene=new THREE.Scene(),camera=variant==="sphere"?new THREE.OrthographicCamera(-4,4,4,-4,.1,50):new THREE.PerspectiveCamera(42,1,.1,50);camera.position.set(0,variant==="sheet"?6:.6,12);camera.lookAt(0,0,0);
        const columns=coarse?52:85,rows=coarse?30:50,count=variant==="sphere"?(coarse?1800:3400):columns*rows;
        const positions=new Float32Array(count*3);
        for(let i=0;i<count;i++){
          if(variant==="sphere"){const y=1-i/(count-1)*2,r=Math.sqrt(1-y*y),a=Math.PI*(3-Math.sqrt(5))*i;positions.set([Math.cos(a)*r*3.1,y*3.1,Math.sin(a)*r*3.1],i*3);}
          else if(variant==="stack"){const layer=i%3,u=(Math.floor(i/3)%50)/49-.5,v=Math.floor(Math.floor(i/3)/50)/Math.ceil(count/150)-.5;positions.set([u*6+layer*.45,v*6+layer*.45,layer*.7],i*3);}
          else positions.set([(i%columns/(columns-1)-.5)*14,0,(Math.floor(i/columns)/(rows-1)-.5)*8],i*3);
        }
        const geometry=new THREE.BufferGeometry();geometry.setAttribute("position",new THREE.BufferAttribute(positions,3));
        const uniforms={uTime:{value:0},uPointer:{value:new THREE.Vector2(100,100)},uHover:{value:0},uVariant:{value:variant==="sheet"?0:variant==="sphere"?1:2},uDpr:{value:dpr},uAspect:{value:1}};
        const material=new THREE.ShaderMaterial({uniforms,transparent:true,depthWrite:false,
          vertexShader:`uniform float uTime;uniform vec2 uPointer;uniform float uHover;uniform float uVariant;uniform float uDpr;uniform float uAspect;varying float vAlpha;
          void main(){vec3 p=position;float edge=1.0;if(uVariant<.5){p.y+=sin(p.x*.65+uTime*.55)*.42+cos(p.z*.9-uTime*.4)*.35;edge=(1.0-smoothstep(5.4,7.2,abs(p.x)))*(1.0-smoothstep(3.1,4.2,abs(p.z)));}else if(uVariant<1.5){p=normalize(p)*3.1;}else{p.z+=sin(p.x*.8+uTime*.5)*.12;}
          vec4 mv=modelViewMatrix*vec4(p,1.0);vec4 projected=projectionMatrix*mv;vec2 screen=projected.xy/projected.w;vec2 delta=screen-uPointer;float influence=exp(-dot(delta,delta)*10.0)*uHover;if(uVariant>.5&&uVariant<1.5){p=normalize(p+vec3(delta*influence*.6,0.0))*3.1;mv=modelViewMatrix*vec4(p,1.0);}else{mv.xy+=normalize(delta+vec2(.001))*influence*1.35;mv.z+=influence*.9;}gl_Position=projectionMatrix*mv;gl_PointSize=clamp(25.0/-mv.z,1.0,4.0)*uDpr;vAlpha=edge*(uVariant>.5?.45+.55*(p.z+3.1)/6.2:.8);}`,
          fragmentShader:`varying float vAlpha;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;gl_FragColor=vec4(.94,.93,.89,smoothstep(.5,.12,d)*vAlpha);}`});
        const cloud=new THREE.Points(geometry,material);scene.add(cloud);
        let frame=0,time=0,last=0,targetHover=0;
        const pointer=new THREE.Vector2(100,100);
        const resize=()=>{const b=host.getBoundingClientRect();if(!b.width||!b.height)return;renderer.setSize(b.width,b.height);const aspect=b.width/b.height;uniforms.uAspect.value=aspect;if(camera instanceof THREE.OrthographicCamera){const extent=Math.max(3.8,3.6/aspect);camera.left=-extent*aspect;camera.right=extent*aspect;camera.top=extent;camera.bottom=-extent;}else camera.aspect=aspect;camera.updateProjectionMatrix();renderer.render(scene,camera);};
        const draw=(now:number)=>{if(disposed||!active||document.hidden){frame=0;return;}frame=enabled?requestAnimationFrame(draw):0;time+=Math.min((now-last)/1000,.04);last=now;uniforms.uTime.value=enabled?time:0;uniforms.uPointer.value.lerp(pointer,.14);uniforms.uHover.value+=(targetHover-uniforms.uHover.value)*.1;
          if(variant==="sphere"){cloud.rotation.y=enabled?time*.065:0;cloud.rotation.z=.08;}if(variant==="stack"){cloud.rotation.y=-.45+Math.sin(time*.18)*.12;cloud.rotation.z=-.18;cloud.rotation.x=.18;}renderer.render(scene,camera);};
        const start=()=>{if(!frame&&active&&!document.hidden){last=performance.now()-30;frame=requestAnimationFrame(draw);}};
        const move=(event:PointerEvent)=>{const b=host.getBoundingClientRect();pointer.set((event.clientX-b.left)/b.width*2-1,-((event.clientY-b.top)/b.height*2-1));targetHover=1;host.dataset.interacting="true";};
        const leave=()=>{targetHover=0;host.dataset.interacting="false";};
        const visibility=()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else start();};
        const resizer=new ResizeObserver(resize);resizer.observe(host);const activity=new IntersectionObserver(entries=>{active=entries[0].isIntersecting;if(active)start();else{cancelAnimationFrame(frame);frame=0;}});activity.observe(host);
        if(enabled){host.addEventListener("pointermove",move,{passive:true});host.addEventListener("pointerleave",leave);}document.addEventListener("visibilitychange",visibility);
        resize();setReady(true);start();
        teardown=()=>{cancelAnimationFrame(frame);activity.disconnect();resizer.disconnect();document.removeEventListener("visibilitychange",visibility);host.removeEventListener("pointermove",move);host.removeEventListener("pointerleave",leave);geometry.dispose();material.dispose();renderer.dispose();renderer.domElement.remove();};
      } catch {if(!disposed)setReady(false);}
    }
    const observer=new IntersectionObserver(entries=>{if(entries[0].isIntersecting)void initialize();},{rootMargin:"0px"});observer.observe(host);
    return()=>{disposed=true;observer.disconnect();teardown();};
  },[variant,enabled,pageReady]);
  return <div ref={container} className={`particle-field ${variant} ${ready?"ready":""} ${className}`} role="img" aria-label={`An interactive ${variant==="sheet"?"three-dimensional sheet":variant==="stack"?"sculpture of layered planes":"sphere"} of white particles`}><div className="particle-fallback" aria-hidden="true" /></div>;
}
