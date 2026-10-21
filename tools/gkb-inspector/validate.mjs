import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const out='validation/gkb-hero';
const target=process.env.GKB_APP_URL || 'http://127.0.0.1:5173/';
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'C:/Users/vikas/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe'});
const results={testedAt:new Date().toISOString(),views:{},errors:[],comparisonScope:'Hero crops only; existing header is outside the requested scope. Natural video screenshots are not pixel-diffed because video clocks differ.'};
function compare(a,b){const x=PNG.sync.read(a),y=PNG.sync.read(b);assert.equal(x.width,y.width);assert.equal(x.height,y.height);let delta=0,different=0;const diff=new PNG({width:x.width,height:x.height});for(let i=0;i<x.data.length;i+=4){let max=0;for(let c=0;c<3;c++){const d=Math.abs(x.data[i+c]-y.data[i+c]);delta+=d;max=Math.max(max,d);diff.data[i+c]=d*4;}diff.data[i+3]=255;if(max>10)different++;}return{metrics:{meanAbsoluteChannelDifference:delta/(x.width*x.height*3),pixelsDifferentOver10: different,percentDifferentOver10:different/(x.width*x.height)*100},diff:PNG.sync.write(diff)};}
for(const[name,width,height]of[['desktop',1440,900],['tablet',768,1024],['mobile',390,844]]){
 const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,hasTouch:name==='mobile'});
 const page=await context.newPage();
 await page.addInitScript(()=>{
  window.heroIndexEvents=[];
  document.addEventListener('playing',event=>{
   if(!window.heroFirstPlayback&&event.target.matches('[data-slide="0"][data-campaign="first"] video'))window.heroFirstPlayback={at:performance.now(),time:event.target.currentTime};
  },true);
  let last='';
  new MutationObserver(()=>{
   const label=document.querySelector('.gkb-hero__slide[aria-hidden="false"]')?.getAttribute('aria-label');
   if(label&&label!==last){window.heroIndexEvents.push({label,at:performance.now()});last=label;}
  }).observe(document,{childList:true,subtree:true,attributes:true,attributeFilter:['aria-hidden']});
 });
 page.on('pageerror',e=>results.errors.push({view:name,error:String(e)}));
 page.on('console',m=>{if(m.type()==='error')results.errors.push({view:name,error:m.text(),location:m.location()});});
 page.on('response',r=>{if(r.status()>=400)results.errors.push({view:name,status:r.status(),url:r.url()});});
 await page.goto(target);
 await page.waitForSelector('.gkb-hero');
 await page.waitForFunction(()=>document.querySelector('video')?.readyState>=2);
 await page.screenshot({path:`${out}/${name}-initial.png`});
 await page.waitForTimeout(6000);
 await page.screenshot({path:`${out}/${name}-after-6s.png`});
 const active=()=>page.locator('.gkb-hero__slide[aria-hidden="false"]');
 const observation=await active().getAttribute('aria-label');
 const firstCampaign=await page.locator('[data-slide="0"][data-campaign="first"]').count();
 const expectedDelay=firstCampaign?8000:name==='mobile'?3000:5000;
 if(firstCampaign)await page.waitForFunction(()=>window.heroIndexEvents.length>=2,{},{timeout:15000}); // Wait for actual native playback, including initial decoding.
 const timing=await page.evaluate(()=>window.heroIndexEvents);
 assert.ok(timing.length>=2,'Autoplay advances after mount');
 const firstDelay=timing[1].at-timing[0].at;
 const firstPlayback=await page.evaluate(()=>window.heroFirstPlayback);
 const playbackDelay=firstCampaign?timing[1].at-firstPlayback.at+firstPlayback.time*1000:firstDelay;
 assert.ok(Math.abs(playbackDelay-expectedDelay)<800,`Unexpected first-playback duration: ${playbackDelay}ms (mount-to-advance ${firstDelay}ms)`);
 // Freeze autoplay with the observed hover behaviour while checking each slide.
 await page.mouse.move(width/2,120);
 const view={autoplayAfter6s:observation,firstAutoplayDelayMs:firstDelay,firstPlaybackDurationMs:playbackDelay,autoplayEvents:timing,rect:await page.locator('.gkb-hero').boundingBox(),slides:[],videos:[]};
 results.views[name]=view;
 for(let i=0;i<8;i++){
  await page.locator('.gkb-hero__bullet').nth(i).evaluate(b=>b.click());
  await page.waitForTimeout(850);
  await active().locator('img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode())));
  const n=String(i+1).padStart(2,'0');
  await page.screenshot({path:`${out}/${name}-slide-${n}.png`});
  const shot=await page.locator('.gkb-hero').screenshot({path:`${out}/${name}-hero-${n}.png`});
  const detail=await active().evaluate(s=>({label:s.ariaLabel,link:s.querySelector('a')?.href,image:s.querySelector('img')?{src:s.querySelector('img').currentSrc,w:s.querySelector('img').naturalWidth,h:s.querySelector('img').naturalHeight}:null,cta:s.querySelector('.gkb-hero__cta')?.getBoundingClientRect().toJSON(),overflow:document.documentElement.scrollWidth>innerWidth}));
  assert.equal(detail.overflow,false,'No horizontal page scrolling');
  if(i!==0&&i!==2){const ref=await fs.readFile(`reference/gkb-hero/${name}-hero-${n}.png`);const {metrics,diff}=compare(ref,shot);detail.comparison=metrics;await fs.writeFile(`${out}/${name}-diff-${n}.png`,diff);}
  else {
   const video=active().locator('video');
   await video.evaluate(async v=>{v.muted=true;v.currentTime=1;await v.play();});
   await page.waitForTimeout(250);
   const before=await video.evaluate(v=>({time:v.currentTime,frames:v.getVideoPlaybackQuality().totalVideoFrames,paused:v.paused,w:v.videoWidth,h:v.videoHeight,duration:v.duration,muted:v.muted,loop:v.loop,playsInline:v.playsInline}));
   const frameA=await video.screenshot();
   await page.waitForTimeout(1100);
   const after=await video.evaluate(v=>({time:v.currentTime,frames:v.getVideoPlaybackQuality().totalVideoFrames}));
   const frameB=await video.screenshot();
   const changing=crypto.createHash('sha256').update(frameA).digest('hex')!==crypto.createHash('sha256').update(frameB).digest('hex');
   console.log('Video',name,i+1,JSON.stringify({before,after,changing}));
   assert.ok(after.time>before.time&&after.frames>before.frames&&changing,'Video must decode and display changing frames');
   view.videos.push({slide:i+1,before,after,changingFrames:changing});
   await fs.writeFile(`${out}/${name}-video-${n}-frame-a.png`,frameA);await fs.writeFile(`${out}/${name}-video-${n}-frame-b.png`,frameB);
   await active().getByRole('button',{name:'Pause video',exact:true}).click();
   assert.equal(await video.evaluate(v=>v.paused),true);
   await active().getByRole('button',{name:'Play video',exact:true}).click();
   await active().getByRole('button',{name:'Unmute video',exact:true}).click();
   assert.equal(await video.evaluate(v=>v.muted),false);
   await active().getByRole('button',{name:'Mute video',exact:true}).click();
  }
  view.slides.push(detail);
 }
 // Hover holds the current slide through the full interval.
 const hoverBefore=await active().getAttribute('aria-label');await page.waitForTimeout(name==='mobile'?3900:5900);assert.equal(await active().getAttribute('aria-label'),hoverBefore);view.hoverPause=true;
 await page.locator('.gkb-hero__bullet').nth(1).evaluate(b=>b.click());await page.waitForTimeout(750);
 await page.keyboard.press('ArrowRight');await page.waitForTimeout(750);assert.match(await active().getAttribute('aria-label'),/^3 of 8/);view.keyboardNavigation=true;
 if(name==='mobile'){
  const cdp=await context.newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:320,y:400}]});
  for(let x=300;x>=70;x-=46){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:400}]});await page.waitForTimeout(15);}
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await page.waitForTimeout(850);assert.match(await active().getAttribute('aria-label'),/^4 of 8/);view.touchSwipe=true;
 }
 await context.close();console.log(name,JSON.stringify(view.slides.filter(s=>s.comparison).map(s=>({label:s.label,...s.comparison}))));
}
const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});const page=await context.newPage();await page.goto(target);await page.waitForSelector('video');await page.waitForTimeout(4100);assert.equal(await page.locator('video').first().evaluate(v=>v.paused),true);assert.match(await page.locator('.gkb-hero__slide[aria-hidden="false"]').getAttribute('aria-label'),/^1 of 8/);results.reducedMotion={autoplayDisabled:true,videosPaused:true};
await context.close();
await fs.writeFile(`${out}/results.json`,JSON.stringify(results,null,2));
await browser.close();assert.equal(results.errors.length,0,JSON.stringify(results.errors));console.log('Validation passed.');
