"use client";

import { useEffect, useRef } from "react";
import { useMotion } from "./motion-provider";

type Dot={x:number;y:number;tone:number;dx:number;dy:number;px:number;py:number;vx:number;vy:number};

export function PortraitParticles() {
  const canvas=useRef<HTMLCanvasElement>(null);
  const {enabled,ready}=useMotion();
  useEffect(()=>{
    const element=canvas.current,hero=element?.parentElement;
    if(!element||!hero||!enabled||!ready)return;
    const context=element.getContext('2d');if(!context)return;
    let disposed=false,active=true,frame=0,width=0,height=0,docTop=0,left=0,scatter=0,target=0,last=0;
    let imageBox={x:0,y:0,w:0,h:0};
    const pointer={x:-2000,y:-2000};const dots:Dot[]=[];
    // Coordinates are prepared from the source portrait at build time.
    // Reuse only this image's dimensions; never read pixels on the browser CPU.
    const source=hero.querySelector<HTMLImageElement>('.hero-portrait');if(!source)return;
    const colors=['rgba(172,169,163,.32)','rgba(190,185,174,.38)','rgba(209,199,181,.43)','rgba(230,218,196,.46)','rgba(245,235,215,.5)'];
    const seed=(i:number)=>{const v=Math.sin(i*127.1)*43758.5453;return v-Math.floor(v);};
    const resize=()=>{
      const b=hero.getBoundingClientRect(),p=hero.querySelector('.portrait-stage')!.getBoundingClientRect();width=b.width;height=b.height;docTop=b.top+scrollY;left=b.left;const stage={x:p.left-b.left,y:p.top-b.top};
      const fit=Math.min(p.width/(source.naturalWidth||1280),p.height/(source.naturalHeight||1212));imageBox={x:stage.x+(p.width-(source.naturalWidth||1280)*fit)/2,y:stage.y,w:(source.naturalWidth||1280)*fit,h:(source.naturalHeight||1212)*fit};
      const dpr=Math.min(devicePixelRatio,1.3);element.width=width*dpr;element.height=height*dpr;context.setTransform(dpr,0,0,dpr,0,0);
    };
    const draw=(now:number)=>{
      if(disposed||!active||document.hidden){frame=0;return;}
      const step=Math.min(2,Math.max(.5,(now-last)/16.67||1));last=now;scatter+=(target-scatter)*Math.min(.2,.12*step);context.clearRect(0,0,width,height);
      let energy=Math.abs(target-scatter);
      for(const dot of dots){
        const x=imageBox.x+dot.x*imageBox.w+dot.dx*width*scatter*.65,y=imageBox.y+dot.y*imageBox.h+dot.dy*height*scatter*.55;
        const dx=x+dot.px-pointer.x,dy=y+dot.py-pointer.y,dist=Math.hypot(dx,dy),force=Math.max(0,1-dist/95);
        dot.vx+=(dx/(dist||1)*force*8-dot.px*.045)*step;dot.vy+=(dy/(dist||1)*force*8-dot.py*.045)*step;dot.vx*=Math.pow(.82,step);dot.vy*=Math.pow(.82,step);dot.px+=dot.vx*step;dot.py+=dot.vy*step;
        energy+=Math.abs(dot.vx)+Math.abs(dot.vy);
        context.fillStyle=colors[dot.tone];const size=dot.y<.63?1.1:1.25;context.fillRect(x+dot.px,y+dot.py,size,size);
      }
      hero.style.setProperty('--portrait-alpha',String(1-scatter*.82));element.dataset.scatter=scatter.toFixed(2);
      frame=energy>.018?requestAnimationFrame(draw):0;
    };
    const start=()=>{if(!frame&&active&&!document.hidden){last=performance.now();frame=requestAnimationFrame(draw);}};
    const scroll=()=>{target=Math.min(1,Math.max(0,(scrollY-docTop)/Math.min(innerHeight*.75,height*.7)));start();};
    const move=(event:PointerEvent)=>{pointer.x=event.clientX-left;pointer.y=event.clientY-docTop+scrollY;element.dataset.interacting='true';start();};
    const leave=()=>{pointer.x=pointer.y=-2000;element.dataset.interacting='false';start();};
    const visibility=()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else start();};
    const observer=new IntersectionObserver(entries=>{active=entries[0].isIntersecting;if(active)start();else{cancelAnimationFrame(frame);frame=0;}});observer.observe(hero);
    const resizer=new ResizeObserver(()=>{resize();start();});resizer.observe(hero);
    void import("../../content/portrait-points.json").then(({ default: field }) => {
      if (disposed) return;
      for (const [x,y,tone] of field.points) {
        const i=dots.length;
        dots.push({x:x/field.width,y:y/field.height,tone,dx:(seed(i+1)-.5)*1.7,dy:(seed(i+2000)-.5)*1.7,px:0,py:0,vx:0,vy:0});
      }
      element.dataset.points=String(dots.length);hero.classList.add('portrait-live');resize();scroll();start();
    }).catch(() => { /* The portrait remains visible if the optional point data fails. */ });
    resize();hero.addEventListener('pointermove',move,{passive:true});hero.addEventListener('pointerleave',leave);window.addEventListener('scroll',scroll,{passive:true});document.addEventListener('visibilitychange',visibility);
    return()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();resizer.disconnect();hero.classList.remove('portrait-live');['--portrait-alpha'].forEach(p=>hero.style.removeProperty(p));hero.removeEventListener('pointermove',move);hero.removeEventListener('pointerleave',leave);window.removeEventListener('scroll',scroll);document.removeEventListener('visibilitychange',visibility);context.clearRect(0,0,width,height);};
  },[enabled,ready]);
  return <canvas ref={canvas} className="portrait-dots" aria-hidden="true" />;
}
