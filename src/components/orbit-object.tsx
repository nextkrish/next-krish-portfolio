"use client";

import { useEffect, useRef, useState } from "react";
import { useMotion } from "./motion-provider";

export function OrbitObject({ shape }: { shape: "planet" | "tile" }) {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const { enabled, ready: pageReady } = useMotion();
  useEffect(() => {
    const node = host.current; if (!node || !pageReady) return;
    let disposed = false, active = false, frame = 0;
    let cleanup = () => {};
    async function init() {
      if (!node || disposed) return;
      try {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("webgl2", { alpha: true, antialias: true, powerPreference: "low-power" });
        if (!context) { node.dataset.renderMode = "fallback"; return; }
        const T = await import("three"); if (disposed || !node) { context.getExtension("WEBGL_lose_context")?.loseContext(); return; }
        const renderer = new T.WebGLRenderer({ canvas, context, alpha: true, antialias: true, powerPreference: "low-power" });
        renderer.setPixelRatio(Math.min(devicePixelRatio, 1.4)); renderer.setClearColor(0, 0); renderer.domElement.setAttribute("aria-hidden", "true"); node.appendChild(renderer.domElement);
        const scene = new T.Scene(), camera = new T.PerspectiveCamera(38, 1, .1, 40); camera.position.set(0, .35, 13); camera.lookAt(0, 0, 0);
        scene.add(new T.HemisphereLight(0xf4edda, 0x353442, 2.2));
        const key = new T.DirectionalLight(0xffeed0, 4.2); key.position.set(-3, 5, 6); scene.add(key);
        const rim = new T.DirectionalLight(0x979bc5, 3); rim.position.set(5, -1, -2); scene.add(rim);
        const group = new T.Group(); scene.add(group);
        const material = new T.MeshStandardMaterial({ color: shape === "planet" ? 0xbeb29b : 0xf2e8d4, metalness: shape === "planet" ? .58 : .3, roughness: .29 });
        let geometry: InstanceType<typeof T.SphereGeometry> | InstanceType<typeof T.ExtrudeGeometry>;
        if (shape === "planet") geometry = new T.SphereGeometry(2.15, 64, 40);
        else {
          const outline = new T.Shape(), s = 1.55, r = .35;
          outline.moveTo(-s+r,-s); outline.lineTo(s-r,-s); outline.quadraticCurveTo(s,-s,s,-s+r); outline.lineTo(s,s-r); outline.quadraticCurveTo(s,s,s-r,s); outline.lineTo(-s+r,s); outline.quadraticCurveTo(-s,s,-s,s-r); outline.lineTo(-s,-s+r); outline.quadraticCurveTo(-s,-s,-s+r,-s);
          geometry = new T.ExtrudeGeometry(outline,{depth:.14,bevelEnabled:true,bevelSegments:4,steps:1,bevelSize:.1,bevelThickness:.08,curveSegments:12}); geometry.center();
        }
        const object = new T.Mesh(geometry, material); group.add(object);
        const rings = new T.Group(); rings.rotation.set(1.13, .12, -.3); group.add(rings);
        const ringGeometry = new T.TorusGeometry(shape === "planet" ? 3.15 : 3.05, shape === "planet" ? .012 : .023, 6, 160, shape === "planet" ? Math.PI*2 : Math.PI*1.7);
        const ringMaterial = new T.MeshBasicMaterial({color:0xb9af95,transparent:true,opacity:.7}); const ring = new T.Mesh(ringGeometry,ringMaterial); rings.add(ring);
        let secondGeometry: InstanceType<typeof T.TorusGeometry> | undefined, secondMaterial: InstanceType<typeof T.MeshBasicMaterial> | undefined;
        if(shape === "tile") {secondGeometry=new T.TorusGeometry(3.4,.021,6,150,Math.PI*1.55);secondMaterial=new T.MeshBasicMaterial({color:0x777195,transparent:true,opacity:.8});const second=new T.Mesh(secondGeometry,secondMaterial);second.rotation.z=Math.PI*.9;second.rotation.x=.13;rings.add(second);}
        const dotGeometry=new T.SphereGeometry(.065,12,10),dotMaterial=new T.MeshBasicMaterial({color:0xeee4cc});const dot=new T.Mesh(dotGeometry,dotMaterial);rings.add(dot);
        let time=0,last=0,px=0,py=0,targetX=0,targetY=0;
        const resize=()=>{const b=node.getBoundingClientRect();if(!b.width||!b.height)return;renderer.setSize(b.width,b.height);camera.aspect=b.width/b.height;camera.position.z=Math.max(13,11.2/camera.aspect);camera.lookAt(0,0,0);camera.updateProjectionMatrix();renderer.render(scene,camera);};
        const draw=(now:number)=>{if(disposed||!active||document.hidden){frame=0;return;}frame=enabled?requestAnimationFrame(draw):0;const dt=Math.min(.04,(now-last)/1000);last=now;time+=dt;px+=(targetX-px)*.08;py+=(targetY-py)*.08;
          group.rotation.y=px*.12;group.rotation.x=py*.08;group.position.y=enabled?Math.sin(time*.7)*.12:0;
          if(shape==="tile"){object.rotation.set(.12+py*.22,enabled?Math.sin(time*.6)*.45+px*.28:.3,Math.PI/4+(enabled?Math.sin(time*.35)*.08:0));rings.rotation.z=-.3+(enabled?time*.07:0);} else object.rotation.y=enabled?time*.08:0;
          const a=enabled?time*.4:0;dot.position.set(Math.cos(a)*3.15,Math.sin(a)*3.15,0);renderer.render(scene,camera);};
        const start=()=>{if(!frame&&active&&!document.hidden){last=performance.now();frame=requestAnimationFrame(draw);}};
        const move=(event:PointerEvent)=>{const b=node.getBoundingClientRect();targetX=(event.clientX-b.left)/b.width*2-1;targetY=(event.clientY-b.top)/b.height*2-1;node.dataset.interacting="true";};
        const leave=()=>{targetX=targetY=0;node.dataset.interacting="false";};
        const visibility=()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else start();};
        const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(node);const observer=new IntersectionObserver(entries=>{active=entries[0].isIntersecting;if(active)start();else{cancelAnimationFrame(frame);frame=0;}});observer.observe(node);
        if(enabled){node.addEventListener('pointermove',move,{passive:true});node.addEventListener('pointerleave',leave);}document.addEventListener('visibilitychange',visibility);resize();setReady(true);
        cleanup=()=>{cancelAnimationFrame(frame);observer.disconnect();resizeObserver.disconnect();document.removeEventListener('visibilitychange',visibility);node.removeEventListener('pointermove',move);node.removeEventListener('pointerleave',leave);geometry.dispose();material.dispose();ringGeometry.dispose();ringMaterial.dispose();secondGeometry?.dispose();secondMaterial?.dispose();dotGeometry.dispose();dotMaterial.dispose();renderer.dispose();renderer.domElement.remove();};
      } catch {if(!disposed)setReady(false);}
    }
    void init(); return()=>{disposed=true;cleanup();};
  },[shape,enabled,pageReady]);
  return <div ref={host} className={`orbit-object orbit-${shape} ${ready?"ready":""}`} role="img" aria-label={shape==="planet"?"A perfect metallic sphere with a thin Saturn ring":"A rotating rounded square with thin orbital arcs"}><div className="orbit-fallback" aria-hidden="true" /></div>;
}
