import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const result={testedAt:new Date().toISOString(),policies:{},errors:[]};
for(const[policy,flag]of[['blocked','document-user-activation-required'],['allowed','no-user-gesture-required']]){
 const browser=await chromium.launch({headless:true,executablePath:'C:/Users/vikas/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe',args:[`--autoplay-policy=${flag}`]});
 const page=await browser.newPage({viewport:{width:390,height:844}});
 page.on('pageerror',e=>result.errors.push(String(e)));
 page.on('console',m=>{if(m.type()==='error')result.errors.push(m.text());});
 await page.goto('http://127.0.0.1:5173/');
 await page.waitForFunction(()=>{const v=document.querySelector('[data-slide="0"] video');return v?.readyState>=2&&!v.paused;});
 await page.mouse.move(200,150);
 const player=page.locator('[data-slide="0"] video');
 const initial=await player.evaluate(v=>({muted:v.muted,paused:v.paused,volume:v.volume,rate:v.playbackRate,decodedAudioBytes:v.webkitAudioDecodedByteCount}));
 assert.equal(initial.muted,policy==='blocked');assert.equal(initial.volume,1);assert.equal(initial.rate,1);
 if(policy==='blocked'){
  await page.locator('[data-slide="0"]').getByRole('button',{name:'Unmute video',exact:true}).click();assert.equal(await player.evaluate(v=>v.muted),false);
  await page.locator('[data-slide="0"]').getByRole('button',{name:'Mute video',exact:true}).click();assert.equal(await player.evaluate(v=>v.muted),true);
  await page.locator('.gkb-hero__bullet').nth(7).evaluate(b=>b.click());await page.waitForTimeout(750);await page.mouse.move(0,0);await page.waitForTimeout(4000);
  assert.equal(await page.locator('.gkb-hero__bullet[aria-current="true"]').getAttribute('aria-label'),'Go to slide 1: Ray-Ban Meta');
  assert.equal(await player.evaluate(v=>v.muted),true,'Explicit mute survives the carousel loop buffer');
 }
 await page.locator('.gkb-hero__bullet').nth(2).evaluate(b=>b.click());
 await page.waitForFunction(()=>{const v=document.querySelector('[data-slide="2"] video');return v?.readyState>=2&&!v.paused;});
 assert.equal(await page.locator('[data-slide="2"] video').evaluate(v=>v.muted),true,'Other video retains its original muted behaviour');
 result.policies[policy]={initial,manualUnmute:policy==='blocked'?'passed':'not needed',muteAcrossCarouselLoop:policy==='blocked'?'passed':'not needed',otherVideoAudioUnchanged:true};
 await browser.close();console.log(policy,JSON.stringify(result.policies[policy]));
}
// No frame-callback API: verify seek synchronization through native events.
const browser=await chromium.launch({headless:true,executablePath:'C:/Users/vikas/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe'});
const page=await browser.newPage({viewport:{width:1440,height:900}});
await page.addInitScript(()=>{HTMLVideoElement.prototype.requestVideoFrameCallback=undefined;HTMLVideoElement.prototype.cancelVideoFrameCallback=undefined;});
await page.goto('http://127.0.0.1:5173/');await page.waitForFunction(()=>document.querySelector('[data-slide="0"] video')?.readyState>=2);await page.mouse.move(300,150);
const player=page.locator('[data-slide="0"] video');await player.evaluate(v=>v.pause());
for(const[time,scene]of[[.5,1],[1.8,2],[3.2,3],[4.45,4],[5.7,5],[7,6],[.1,1]]){
 await player.evaluate(async(v,time)=>{v.currentTime=time;await new Promise(r=>v.addEventListener('seeked',r,{once:true}));},time);
 await page.waitForFunction(scene=>document.querySelector('[data-slide="0"] .first-campaign-caption')?.dataset.scene===String(scene),scene);
}
result.nativeEventFallback='passed';await browser.close();
await fs.writeFile('validation/first-hero-campaign/audio-policy-results.json',JSON.stringify(result,null,2));assert.deepEqual(result.errors,[]);console.log('Audio policies and native-event fallback passed.');
