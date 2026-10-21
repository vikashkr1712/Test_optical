import { chromium } from 'playwright';
import fs from 'node:fs/promises';
const browser=await chromium.launch({headless:true,executablePath:'C:/Users/vikas/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe'});
const page=await browser.newPage({viewport:{width:1200,height:800}});
await page.goto('http://127.0.0.1:5173/');
await page.setContent('<body style="margin:0;background:#111"><video id="campaign" muted preload="auto" style="display:none"></video><canvas id="sheet"></canvas></body>');
const info=await page.evaluate(async()=>{
 const v=document.getElementById('campaign');v.src='/assets/gkb-hero/Eyewear_campaign_video_sequence_20261021162004.mp4';
 await new Promise((r,j)=>{v.onloadedmetadata=r;v.onerror=()=>j(new Error(v.error?.message));});
 const canvas=document.getElementById('sheet');canvas.width=1200;canvas.height=740;const ctx=canvas.getContext('2d');ctx.fillStyle='#111';ctx.fillRect(0,0,1200,740);
 const times=[.5,1.8,3.2,4.45,5.7,7];
 for(let i=0;i<times.length;i++){
  v.currentTime=times[i];await new Promise(r=>v.addEventListener('seeked',r,{once:true}));
  const x=(i%3)*400,y=Math.floor(i/3)*370;ctx.drawImage(v,x,y+30,400,225);ctx.fillStyle='#fff';ctx.font='20px sans-serif';ctx.fillText(`Scene ${i+1}: ${times[i]}s`,x+10,y+24);
 }
 return {duration:v.duration,width:v.videoWidth,height:v.videoHeight,playbackRate:v.playbackRate};
});
await page.locator('canvas').screenshot({path:'validation/first-hero-campaign/source-scenes.png'});
await fs.writeFile('validation/first-hero-campaign/video-metadata.json',JSON.stringify(info,null,2));console.log(info);
await browser.close();
