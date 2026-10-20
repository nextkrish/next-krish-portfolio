import sharp from 'sharp';
import {writeFile} from 'node:fs/promises';
const {data,info}=await sharp('assets/source/portrait-warm-rim-light.png').resize({width:210}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
const points=[];
for(let y=8;y<info.height-8;y+=2)for(let x=9;x<info.width-9;x+=2){
 const u=x/info.width,v=y/info.height;
 const head=((u-.5)/.26)**2+((v-.38)/.32)**2<1,body=v>.54&&Math.abs(u-.5)<.15+(v-.54)*.94;
 if(!head&&!body)continue;
 const k=(y*info.width+x)*4,luma=data[k]*.2126+data[k+1]*.7152+data[k+2]*.0722;
 if(luma>=14)points.push([x,y,Math.min(4,Math.floor(luma/45))]);
}
await writeFile('content/portrait-points.json',JSON.stringify({width:info.width,height:info.height,points}));
console.log(`Prepared ${points.length} portrait dots; no runtime pixel readback needed.`);
