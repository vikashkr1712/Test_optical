import fs from 'node:fs/promises';
const dir='public/assets/gkb-hero/';
const manifest=JSON.parse(await fs.readFile(`${dir}manifest.json`,'utf8'));
for(const item of manifest.downloads) {
 if(item.viewport==='tablet') {
  const old=item.file;
  item.file=old.replace('-tablet.','-desktop.');
  item.viewport='desktop';item.usedAtViewports=['desktop','tablet'];
  await fs.rename(`public${old}`,`public${item.file}`);
 }
}
const inspection=JSON.parse(await fs.readFile('reference/gkb-hero/inspection.json','utf8'));
manifest.slides=inspection.views.desktop.slides.map((s,i)=>({index:i+1,name:s.image?(/alt="([^"]+)"/.exec(s.html)?.[1]):i===0?'Ray-Ban Meta':'Inspira',type:s.video?'video/mp4':s.image.endsWith('.png')?'image/png':'image/jpeg',cta:s.cta||null,href:s.link,desktop:manifest.downloads.find(a=>a.slide===i&&a.viewport==='desktop')?.file,mobile:manifest.downloads.find(a=>a.slide===i&&a.viewport==='mobile')?.file,poster:null}));
manifest.behaviour={desktopAndTablet:{delayMs:5000,transitionMs:700},mobile:{delayMs:3000,transitionMs:700},loop:false,autoplayRewinds:true,pauseOnHover:true,arrows:false,pagination:'8 clickable bars',mobileBreakpoint:768,video:{autoPlay:true,muted:true,loop:true,playsInline:true,originalPosterProvided:false}};
manifest.notes=['Original response bytes preserved; no re-encoding.','There are no GIFs or animated WebP images in the current hero.','Mobile VAVA is JPEG while desktop VAVA is PNG.','Desktop media is also used at tablet width.','No original video posters are supplied by the source.'];
await fs.writeFile(`${dir}manifest.json`,JSON.stringify(manifest,null,2));
console.log('Finalized',manifest.downloads.length,'original files');
