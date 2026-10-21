import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
const root=path.resolve('.');
const out=path.join(root,'reference/gkb-hero');
const assets=path.join(root,'public/assets/gkb-hero');
await fs.mkdir(assets,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'C:/Users/vikas/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe'});
const evidence={capturedAt:new Date().toISOString(),source:'https://www.gkboptical.com/',views:{},downloads:[],errors:[]};
if(process.argv.includes('--screenshots-only')) {
 const prior=JSON.parse(await fs.readFile(path.join(assets,'manifest.json'),'utf8'));
 evidence.downloads=prior.downloads;evidence.errors=prior.errors;
}
const urls=new Map();
for(const [name,width,height] of [['desktop',1440,900],['tablet',768,1024],['mobile',390,844]]) {
 const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
 const network=[];
 page.on('response',r=>{if(['media','image','font'].includes(r.request().resourceType()))network.push({url:r.url(),status:r.status(),type:r.request().resourceType(),contentType:r.headers()['content-type']});});
 await page.goto(evidence.source,{waitUntil:'domcontentloaded'});
 await page.waitForSelector('.campaignSwiper',{state:'attached'});
 await page.waitForFunction(()=>[...document.querySelectorAll('.campaignSwiper')].some(x=>x.getBoundingClientRect().width>0&&x.swiper));
 // Dismiss the separate signup overlay to inspect the requested hero.
 const close=page.locator('button').filter({has:page.locator('svg.lucide-x')});
 await close.waitFor({state:'visible',timeout:8000}).catch(()=>{});
 if(await close.isVisible().catch(()=>false)) await close.click();
 await page.waitForTimeout(2000);
 // The floating third-party chat is outside the hero; hide it in comparison captures.
 await page.addStyleTag({content:'.df-btn { visibility: hidden !important; }'});
 const view=await page.evaluate(()=>{
  const el=[...document.querySelectorAll('.campaignSwiper')].find(x=>x.getBoundingClientRect().width>0);window.hero=el;
  const sw=el.swiper;window.heroEvents=[];sw.on('slideChange',()=>window.heroEvents.push({at:performance.now(),index:sw.realIndex}));
  const styles=e=>{const s=getComputedStyle(e);return Object.fromEntries(['width','height','position','top','bottom','left','right','display','fontFamily','fontSize','fontWeight','lineHeight','padding','border','borderRadius','backgroundColor','color','gap','opacity','margin','objectFit','objectPosition','transitionDuration','transitionTimingFunction','transform','zIndex'].map(k=>[k,s[k]]));};
  return {rect:el.getBoundingClientRect().toJSON(),parent:el.parentElement.parentElement.outerHTML.slice(0,500),params:{speed:sw.params.speed,autoplay:sw.params.autoplay,loop:sw.params.loop,allowTouchMove:sw.params.allowTouchMove,threshold:sw.params.threshold,longSwipesMs:sw.params.longSwipesMs,longSwipesRatio:sw.params.longSwipesRatio,shortSwipes:sw.params.shortSwipes,navigation:sw.params.navigation,pagination:{clickable:sw.params.pagination.clickable}},wrapper:styles(el.querySelector('.swiper-wrapper')),slides:[...el.querySelectorAll(':scope > .swiper-wrapper > .swiper-slide')].map((s,i)=>({index:i,html:s.outerHTML,rect:s.getBoundingClientRect().toJSON(),image:s.querySelector('img')?.src,video:s.querySelector('video')?.src,poster:s.querySelector('video')?.poster,link:s.querySelector('a')?.href,cta:s.querySelector('button:not([aria-label])')?.textContent.trim(),styles:styles(s.firstElementChild),button:s.querySelector('button:not([aria-label])')?styles([...s.querySelectorAll('button:not([aria-label])')].find(b=>b.getBoundingClientRect().width>0)||s.querySelector('button')):null,controls:[...s.querySelectorAll('button[aria-label]')].map(b=>({label:b.ariaLabel,html:b.outerHTML,style:styles(b),parent:styles(b.parentElement)}))})),pagination:{html:el.querySelector('.swiper-pagination').outerHTML,style:styles(el.querySelector('.swiper-pagination')),bullet:styles(el.querySelector('.swiper-pagination-bullet')),active:styles(el.querySelector('.swiper-pagination-bullet-active'))},font:styles(el)};
 });
 evidence.views[name]=view;
 console.log(name,JSON.stringify({rect:view.rect,params:view.params,slides:view.slides.map(s=>({index:s.index,image:s.image,video:s.video,cta:s.cta,link:s.link}))}));
 // Natural first frame and +6 seconds, preserving autoplay.
 await page.evaluate(()=>window.hero.swiper.slideTo(0,0));
 await page.waitForTimeout(200);
 await page.screenshot({path:path.join(out,`${name}-initial.png`)});
 await page.waitForTimeout(6000);
 await page.screenshot({path:path.join(out,`${name}-after-6s.png`)});
 view.autoplayObservation=await page.evaluate(()=>({events:window.heroEvents,active:window.hero.swiper.realIndex,videos:[...window.hero.querySelectorAll('video')].map(v=>({src:v.currentSrc,time:v.currentTime,paused:v.paused,duration:v.duration,width:v.videoWidth,height:v.videoHeight}))}));
 await page.evaluate(()=>window.hero.swiper.autoplay.stop());
 for(const s of view.slides) {
  if(s.image&&!urls.has(s.image))urls.set(s.image,{slide:s.index,viewport:name,kind:'image'});
  if(s.video&&!urls.has(s.video))urls.set(s.video,{slide:s.index,viewport:name,kind:'video'});
  await page.evaluate(i=>window.hero.swiper.slideTo(i,0),s.index);
  await page.waitForTimeout(500);
  await page.locator('.campaignSwiper:visible .swiper-slide-active img:visible').evaluateAll(imgs=>Promise.race([Promise.all(imgs.map(i=>i.decode().catch(()=>{}))),new Promise(r=>setTimeout(r,5000))]));
  await page.screenshot({path:path.join(out,`${name}-slide-${String(s.index+1).padStart(2,'0')}.png`)});
  const box=await page.evaluate(()=>window.hero.getBoundingClientRect().toJSON());
  await page.screenshot({path:path.join(out,`${name}-hero-${String(s.index+1).padStart(2,'0')}.png`),clip:{x:box.x,y:box.y,width:box.width,height:box.height}});
 }
 view.network=network.filter(n=>urls.has(n.url)||n.type==='font');
 await fs.writeFile(path.join(out,'inspection.json'),JSON.stringify(evidence,null,2));
 await page.close();
}
// Only the exact media referenced by hero slides, plus the font used by hero CTAs.
const font='https://www.gkboptical.com/_next/static/media/Avenir_Regular-s.p.0ap_1jemjx0wf.woff2';
urls.set(font,{kind:'font'});
const context=await browser.newContext();
for(const [url,meta] of urls) {
 const ext=path.extname(new URL(url).pathname);
 const name=meta.kind==='font'?'avenir-regular.woff2':`slide-${String(meta.slide+1).padStart(2,'0')}-${meta.viewport}${ext}`;
 try{
  if(process.argv.includes('--screenshots-only')) continue;
  const r=await context.request.get(url,{timeout:120000});
  if(!r.ok())throw new Error(`HTTP ${r.status()}`);
  const buf=await r.body();await fs.writeFile(path.join(assets,name),buf);
  evidence.downloads.push({...meta,file:`/assets/gkb-hero/${name}`,sourceURL:url,contentType:r.headers()['content-type'],bytes:buf.length,sha256:crypto.createHash('sha256').update(buf).digest('hex')});
  console.log('Downloaded',name,buf.length);
 }catch(e){evidence.errors.push({url,error:String(e)});console.log('FAILED',url,String(e));}
}
await fs.writeFile(path.join(out,'inspection.json'),JSON.stringify(evidence,null,2));
if(!process.argv.includes('--screenshots-only')) await fs.writeFile(path.join(assets,'manifest.json'),JSON.stringify({source:evidence.source,capturedAt:evidence.capturedAt,downloads:evidence.downloads,errors:evidence.errors},null,2));
await browser.close();
