import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const out='validation/first-hero-campaign';
const scenes=[
 [0,1.29,'Find Your Perfect Fit','Confidence in Every Frame'],
 [1.29,2.63,'Crafted for Clarity','Designed for Everyday Comfort'],
 [2.63,3.96,'Own the Sunshine','Bold Looks, Clear Horizons'],
 [3.96,5.17,'Discover Your Look','Find the Frame That Fits'],
 [5.17,6.5,'Timeless by Design','Confidence Never Fades'],
 [6.5,8,'Every Detail Matters','Find Your Signature Frame'],
];
const browser=await chromium.launch({headless:true,executablePath:'C:/Users/vikas/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe'});
const result={testedAt:new Date().toISOString(),views:{},errors:[]};
for(const[name,width,height]of[['ultrawide',2560,1440],['desktop-large',1920,1080],['desktop',1440,900],['laptop',1366,768],['tablet',768,1024],['mobile',390,844],['mobile-small',375,812]]){
 const page=await browser.newPage({viewport:{width,height}});
 page.on('pageerror',e=>result.errors.push({view:name,error:String(e)}));
 page.on('console',e=>{if(e.type()==='error')result.errors.push({view:name,error:e.text()});});
 page.on('response',r=>{if(r.status()>=400)result.errors.push({view:name,error:`${r.status()} ${r.url()}`});});
 await page.goto('http://127.0.0.1:5173/');
 await page.waitForFunction(()=>document.querySelector('[data-slide="0"] video')?.readyState>=2);
 await page.mouse.move(width/2,120);
 const video=page.locator('[data-slide="0"] video'),caption=page.locator('[data-slide="0"] .first-campaign-caption');
 await video.evaluate(v=>v.pause());
 const metadata=await video.evaluate(v=>({duration:v.duration,width:v.videoWidth,height:v.videoHeight,rate:v.playbackRate,volume:v.volume,muted:v.muted,loop:v.loop,playsInline:v.playsInline,fit:getComputedStyle(v).objectFit}));
 assert.equal(metadata.duration,8);assert.equal(metadata.width/metadata.height,16/9);assert.equal(metadata.rate,1);assert.equal(metadata.volume,1);assert.equal(metadata.fit,'cover');
 assert.equal(await page.title(),'candiclie — Featured Collections');
 assert.equal(await page.locator('.gkb-header__brand').textContent(),'candiclie');
 const checks=[];
 async function seek(time,expected){
  await video.evaluate(async(v,time)=>{v.currentTime=time;await new Promise(r=>v.addEventListener('seeked',r,{once:true}));},time);
  await page.waitForFunction(({expected})=>document.querySelector('[data-slide="0"] .first-campaign-caption')?.dataset.scene===String(expected),{expected:expected+1});
  assert.equal(await caption.locator('h2').textContent(),scenes[expected][2]);assert.equal(await caption.locator('p').textContent(),scenes[expected][3]);
  assert.equal(await caption.locator('h2').count(),1);assert.equal(await caption.locator('p').count(),1);
 }
 const times=[.5,1.8,3.2,4.45,5.7,7];
 for(let i=0;i<times.length;i++){
  await seek(times[i],i);await page.waitForTimeout(210);
  const geometry=await page.evaluate(()=>{
   const slide=document.querySelector('[data-slide="0"]'),cap=slide.querySelector('.first-campaign-caption'),v=slide.querySelector('video'),controls=slide.querySelector('.gkb-hero__video-controls'),pagination=document.querySelector('.gkb-hero__pagination');
   const box=e=>e.getBoundingClientRect().toJSON(),hero=box(slide),caption=box(cap),video=box(v),control=box(controls),dots=box(pagination);
   const scale=Math.max(video.width/v.videoWidth,video.height/v.videoHeight);const displayed={left:video.x+(video.width-v.videoWidth*scale)/2,top:video.y,width:v.videoWidth*scale,height:v.videoHeight*scale};
   return{hero,caption,control,dots,displayed,headline:box(cap.querySelector('h2')),tagline:box(cap.querySelector('p')),overflow:document.documentElement.scrollWidth>innerWidth,captionOverflow:cap.scrollWidth>cap.clientWidth};
  });
  assert.equal(geometry.overflow,false);assert.equal(geometry.captionOverflow,false);
  assert.ok(Math.abs(geometry.hero.x)<1&&Math.abs(geometry.hero.width-width)<1,'Hero spans the full viewport width');
  assert.ok(geometry.displayed.left<=1&&geometry.displayed.left+geometry.displayed.width>=width-1,'Video picture reaches both viewport edges without side bars');
  assert.ok(geometry.caption.x>=0&&geometry.caption.right<=width&&geometry.caption.y>=geometry.hero.y&&geometry.caption.bottom<=geometry.hero.bottom);
  const overlap=(a,b)=>a.x<b.right&&a.right>b.x&&a.y<b.bottom&&a.bottom>b.y;
  assert.equal(overlap(geometry.caption,geometry.control),false);assert.equal(overlap(geometry.caption,geometry.dots),false);
  if(width<1024)assert.ok(geometry.caption.top>=geometry.displayed.top+geometry.displayed.height+24,'Portrait captions align below the complete landscape picture');
  await page.screenshot({path:`${out}/${name}-scene-${i+1}.png`});
  checks.push({time:times[i],scene:i+1,...geometry});
 }
 for(let i=1;i<scenes.length;i++)for(const delta of[-.03,.03]){
  const time=scenes[i][0]+delta;await seek(time,delta<0?i-1:i);
 }
 await seek(4.45,3);const pausedScene=await caption.getAttribute('data-scene');await page.waitForTimeout(350);assert.equal(await caption.getAttribute('data-scene'),pausedScene);
 await seek(7.75,5);await video.evaluate(v=>{v.muted=true;return v.play();});
 await page.waitForFunction(()=>document.querySelector('[data-slide="0"] video').currentTime<1&&document.querySelector('[data-slide="0"] .first-campaign-caption').dataset.scene==='1',undefined,{timeout:4000});
 assert.equal(await caption.getAttribute('data-scene'),'1');assert.ok(await video.evaluate(v=>v.currentTime<1));
 result.views[name]={metadata,scenes:checks,boundaries:'all ten checks passed',pause:'passed',loopReset:'passed'};
 await page.close();console.log(name,'six scenes, ten boundary checks, pause and loop passed');
}
// A fresh, untouched first play must finish the campaign before carousel autoplay advances.
const page=await browser.newPage({viewport:{width:1440,height:900}});await page.goto('http://127.0.0.1:5173/');
await page.waitForFunction(()=>document.querySelector('[data-slide="0"] video')?.readyState>=2);
await page.waitForTimeout(5200);assert.equal(await page.locator('.gkb-hero__bullet[aria-current="true"]').getAttribute('aria-label'),'Go to slide 1: Ray-Ban Meta');
await page.waitForTimeout(3500);assert.equal(await page.locator('.gkb-hero__bullet[aria-current="true"]').getAttribute('aria-label'),'Go to slide 2: Festive sale');result.fullFirstPlayback='passed';
await page.close();
await browser.close();await fs.writeFile(`${out}/results.json`,JSON.stringify(result,null,2));assert.deepEqual(result.errors,[]);console.log('First-campaign checks passed.');
