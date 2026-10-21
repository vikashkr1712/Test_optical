import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import slides from '../../src/components/GKBHero.slides.js';

const suppliedFile='C:/Users/vikas/Downloads/Eyewear_campaign_video_sequence_20261021162004.mp4';
const original='public/assets/gkb-hero/Eyewear_campaign_video_sequence_20261021162004.mp4';
const local=`public${slides[0].desktop}`;
const source=await fs.readFile(original),bytes=await fs.readFile(local);
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
assert.equal(hash(source),'b24219282551c185d641b64ecee7752de09d1a97c6594534c3fdb3c5ed310e2a','Original supplied video must remain untouched');

function inspect(bytes){
 function boxes(start,end){const result=[];for(let p=start;p+8<=end;){let length=bytes.readUInt32BE(p),header=8;if(length===1){length=Number(bytes.readBigUInt64BE(p+8));header=16;}if(length===0)length=end-p;if(length<header||p+length>end)break;result.push({type:bytes.toString('ascii',p+4,p+8),start:p+header,end:p+length});p+=length;}return result;}
 const children=box=>boxes(box.start,box.end);
 const find=(box,type)=>children(box).find(b=>b.type===type);
 const moov=find({start:0,end:bytes.length},'moov'),mvhd=find(moov,'mvhd');
 assert.equal(bytes[mvhd.start],0);
 const durationSeconds=bytes.readUInt32BE(mvhd.start+16)/bytes.readUInt32BE(mvhd.start+12);
 let audio;
 const tracks=children(moov).filter(b=>b.type==='trak').map(trak=>{
  const mdia=find(trak,'mdia'),hdlr=find(mdia,'hdlr'),mdhd=find(mdia,'mdhd'),stbl=find(find(mdia,'minf'),'stbl'),stsd=find(stbl,'stsd');
  assert.equal(bytes[mdhd.start],0);
  const kind=bytes.toString('ascii',hdlr.start+8,hdlr.start+12),entry=stsd.start+8;
  const info={kind,codec:bytes.toString('ascii',entry+4,entry+8),timescale:bytes.readUInt32BE(mdhd.start+12),durationTicks:bytes.readUInt32BE(mdhd.start+16)};
  info.durationSeconds=info.durationTicks/info.timescale;
  const stsz=find(stbl,'stsz');
  info.samples=bytes.readUInt32BE(stsz.start+8);
  if(kind==='vide'){const tkhd=find(trak,'tkhd');info.width=bytes.readUInt32BE(tkhd.end-8)/65536;info.height=bytes.readUInt32BE(tkhd.end-4)/65536;}
  if(kind==='soun'){
   info.channels=bytes.readUInt16BE(entry+24);info.sampleRate=bytes.readUInt32BE(entry+32)>>>16;
   // Hash encoded AAC sample payloads in playback order, independent of MP4 interleaving.
   const stsc=find(stbl,'stsc'),offsets=find(stbl,'stco')??find(stbl,'co64');
   const runs=Array.from({length:bytes.readUInt32BE(stsc.start+4)},(_,i)=>({first:bytes.readUInt32BE(stsc.start+8+i*12),count:bytes.readUInt32BE(stsc.start+12+i*12)}));
   const sampleSize=bytes.readUInt32BE(stsz.start+4),digest=crypto.createHash('sha256');
   let sample=0,run=0,totalBytes=0;
   for(let chunk=1;chunk<=bytes.readUInt32BE(offsets.start+4);chunk++){
    while(run+1<runs.length&&runs[run+1].first<=chunk)run++;
    let offset=offsets.type==='stco'?bytes.readUInt32BE(offsets.start+8+(chunk-1)*4):Number(bytes.readBigUInt64BE(offsets.start+8+(chunk-1)*8));
    for(let i=0;i<runs[run].count;i++){
     const size=sampleSize||bytes.readUInt32BE(stsz.start+12+sample*4);
     digest.update(bytes.subarray(offset,offset+size));offset+=size;totalBytes+=size;sample++;
    }
   }
   assert.equal(sample,info.samples);
   audio={sha256:digest.digest('hex'),samples:sample,bytes:totalBytes,codec:info.codec,channels:info.channels,sampleRate:info.sampleRate};
  }
  return info;
 });
 return {durationSeconds,tracks,audio};
}
const sourceInfo=inspect(source),outputInfo=inspect(bytes);
assert.ok(sourceInfo.audio&&outputInfo.audio,'Both files must contain original audio');
assert.deepEqual(outputInfo.audio,sourceInfo.audio,'Encoded audio samples must be copied unchanged');
assert.equal(outputInfo.durationSeconds,8);
assert.deepEqual(outputInfo.tracks.find(t=>t.kind==='vide'),sourceInfo.tracks.find(t=>t.kind==='vide'),'Frame count, frame timing and dimensions must be preserved');
const cleanup={filter:'delogo',region:{x:1132,y:572,width:56,height:56},videoEncoder:'libx264',crf:16,preset:'slow',audio:'stream copy',cropping:false};
const result={original,local,bytes:bytes.length,sha256:hash(bytes),originalSha256:hash(source),originalCopyUnchanged:true,identicalToSuppliedFile:hash(source)===hash(bytes),videoReencodedForLogoCleanup:true,audioPreservedWithoutReencoding:true,encodedAudio:outputInfo.audio,cleanup,...outputInfo};
await fs.writeFile('validation/first-hero-campaign/media-verification.json',JSON.stringify(result,null,2));
await fs.writeFile('public/assets/gkb-hero/first-campaign-manifest.json',JSON.stringify({file:slides[0].desktop,suppliedFile,originalFile:`/${original.replace(/^public\//,'')}`,originalSha256:hash(source),bytes:bytes.length,sha256:hash(bytes),durationSeconds:8,dimensions:{width:1280,height:720},videoReencodedForLogoCleanup:true,audioPreservedWithoutReencoding:true,encodedAudio:outputInfo.audio,cleanup,tracks:outputInfo.tracks},null,2));
console.log(JSON.stringify(result,null,2));
