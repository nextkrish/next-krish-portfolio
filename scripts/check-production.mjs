import assert from 'node:assert/strict';
const base=process.env.QA_BASE_URL||'http://127.0.0.1:3000';
const routes=['/','/about','/services','/contact','/work','/work/relayup','/work/nextdm','/work/velvet-touch-salon','/work/agra-iron-gym'];
for(const path of routes){
 const response=await fetch(base+path);assert.equal(response.status,200,path);
 const html=await response.text();assert.equal((html.match(/<h1[ >]/g)||[]).length,1,`${path} has one h1`);
 assert.ok(/<meta name="description" content="[^"]+"/.test(html),`${path} description`);
 assert.ok(html.includes('application/ld+json'),`${path} structured data`);
 assert.equal(response.headers.get('x-content-type-options'),'nosniff');
 assert.ok(!html.includes('/icon.svg'),`${path} no old icon`);
 console.log('PASS',path);
}
for(const path of ['/favicon.ico','/icon.png','/apple-icon.png','/Krish-Kumar-Resume.pdf','/robots.txt','/sitemap.xml','/opengraph-image'])assert.equal((await fetch(base+path)).status,200,path);
console.log('PASS icons, resume, crawler and social assets');
const missing=await fetch(base+'/not-a-real-page');assert.equal(missing.status,404);console.log('PASS custom 404');
