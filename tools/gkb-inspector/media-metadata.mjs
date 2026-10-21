import { chromium } from 'playwright';
import fs from 'node:fs/promises';
const manifest=JSON.parse(await fs.readFile('public/assets/gkb-hero/manifest.json','utf8'));
const browser=await chromium.launch({headless:true,executablePath:'C:/Users/vikas/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe'});
const page=await browser.newPage();
await page.goto('http://127.0.0.1:5173/tools/gkb-inspector/preview.html');
for(const asset of manifest.downloads){
 if(asset.kind==='font')continue;
 const info=await page.evaluate(async a=>{
  if(a.kind==='video'){
   const video=document.createElement('video');video.src=a.file;video.preload='metadata';video.muted=true;
   await new Promise((resolve,reject)=>{video.onloadedmetadata=resolve;video.onerror=reject;});
   const info={width:video.videoWidth,height:video.videoHeight,durationSeconds:video.duration,animated:true};video.removeAttribute('src');video.load();return info;
  }
  const img=new Image();img.src=a.file;await img.decode();
  const info={width:img.naturalWidth,height:img.naturalHeight};
  try{
   const response=await fetch(a.file);const decoder=new ImageDecoder({data:await response.arrayBuffer(),type:a.contentType});await decoder.tracks.ready;
   info.frameCount=decoder.tracks.selectedTrack.frameCount;info.animated=decoder.tracks.selectedTrack.animated;decoder.close();
  }catch(e){info.animationMetadataError=String(e);}
  return info;
 },asset);
 Object.assign(asset,info);
 console.log(asset.file,JSON.stringify(info));
}
await fs.writeFile('public/assets/gkb-hero/manifest.json',JSON.stringify(manifest,null,2)+'\n');
await browser.close();
