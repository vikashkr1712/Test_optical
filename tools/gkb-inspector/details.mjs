import { chromium } from 'playwright';
import fs from 'node:fs/promises';
const browser=await chromium.launch({headless:true,executablePath:'C:/Users/vikas/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe'});
const page=await browser.newPage({viewport:{width:1440,height:900}});
await page.goto('https://www.gkboptical.com/',{waitUntil:'domcontentloaded'});
await page.waitForTimeout(6000);
await page.locator('button:has(svg.lucide-x)').click().catch(()=>{});
const result=await page.evaluate(()=>{
 const hero=[...document.querySelectorAll('.campaignSwiper')].find(x=>x.offsetWidth);hero.swiper.autoplay.stop();
 const styles=e=>Object.fromEntries([...getComputedStyle(e)].map(k=>[k,getComputedStyle(e).getPropertyValue(k)]));
 const rules=[...document.styleSheets].flatMap(s=>{try{return [...s.cssRules].map(r=>r.cssText)}catch{return[]}});
 return {image:styles(hero.querySelector('img')),slide:styles(hero.querySelector('.swiper-slide')),heroCSS:rules.filter(r=>r.includes('campaignSwiper')),fontFaces:rules.filter(r=>r.startsWith('@font-face')),pagination: [...hero.querySelectorAll('.swiper-pagination-bullet')].map(e=>({style:styles(e),before:getComputedStyle(e,'::before').cssText,html:e.outerHTML})),fixed:[...document.querySelectorAll('body *')].filter(e=>getComputedStyle(e).position==='fixed').map(e=>e.outerHTML.slice(0,10000))};
});
await fs.writeFile('reference/gkb-hero/details.json',JSON.stringify(result,null,2));
console.log(JSON.stringify({pagination:result.pagination.slice(0,3).map(p=>({width:p.style.width,height:p.style.height,background:p.style['background-color'],border:p.style.border,margin:p.style.margin})),fixed:result.fixed.map(f=>f.slice(0,500))},null,2));
await browser.close();
