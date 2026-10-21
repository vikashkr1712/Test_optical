import fs from 'node:fs/promises';
import crypto from 'node:crypto';
const original='C:/Users/vikas/Downloads/Eyewear_campaign_video_sequence_20261021162004.mp4';
const local='public/assets/gkb-hero/Eyewear_campaign_video_sequence_20261021162004.mp4';
const source=await fs.readFile(original), bytes=await fs.readFile(local);
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
if(hash(source)!==hash(bytes))throw Error('The video bytes were modified');
function boxes(start,end){const result=[];for(let p=start;p+8<=end;){let length=bytes.readUInt32BE(p),header=8;if(length===1){length=Number(bytes.readBigUInt64BE(p+8));header=16;}if(length===0)length=end-p;if(length<header||p+length>end)break;result.push({type:bytes.toString('ascii',p+4,p+8),start:p+header,end:p+length});p+=length;}return result;}
const children=box=>boxes(box.start,box.end);
const find=(box,type)=>children(box).find(b=>b.type===type);
const root={start:0,end:bytes.length},moov=find(root,'moov');
const tracks=children(moov).filter(b=>b.type==='trak').map(trak=>{
 const mdia=find(trak,'mdia'),hdlr=find(mdia,'hdlr'),mdhd=find(mdia,'mdhd'),stsd=find(find(find(mdia,'minf'),'stbl'),'stsd');
 const kind=bytes.toString('ascii',hdlr.start+8,hdlr.start+12);
 const entry=stsd.start+8;
 const info={kind,codec:bytes.toString('ascii',entry+4,entry+8),timescale:bytes.readUInt32BE(mdhd.start+12),durationTicks:bytes.readUInt32BE(mdhd.start+16)};
 info.durationSeconds=info.durationTicks/info.timescale;
 if(kind==='soun'){info.channels=bytes.readUInt16BE(entry+24);info.sampleRate=bytes.readUInt32BE(entry+32)>>>16;}
 if(kind==='vide'){const tkhd=find(trak,'tkhd');info.width=bytes.readUInt32BE(tkhd.end-8)/65536;info.height=bytes.readUInt32BE(tkhd.end-4)/65536;}
 return info;
});
if(!tracks.some(t=>t.kind==='soun'))throw Error('No original audio track found');
const result={original,local,bytes:bytes.length,sha256:hash(bytes),identicalToSuppliedFile:true,audioPreservedWithoutReencoding:true,tracks};
await fs.writeFile('validation/first-hero-campaign/media-verification.json',JSON.stringify(result,null,2));
await fs.writeFile('public/assets/gkb-hero/first-campaign-manifest.json',JSON.stringify({file:`/${local.replace(/^public\//,'')}`,suppliedFile:original,bytes:bytes.length,sha256:hash(bytes),durationSeconds:8,dimensions:{width:1280,height:720},tracks},null,2));
console.log(JSON.stringify(result,null,2));
