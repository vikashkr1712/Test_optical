import { createServer, build } from 'vite';
import path from 'node:path';
const config={
  configFile:false,
  root:path.resolve('.'),
  resolve:{alias:{react:path.resolve('tools/gkb-inspector/node_modules/react'), 'react-dom':path.resolve('tools/gkb-inspector/node_modules/react-dom')}},
  esbuild:{jsx:'automatic'},
  server:{host:'127.0.0.1',port:5173,strictPort:true},
  build:{outDir:'tools/gkb-inspector/dist',emptyOutDir:true,rollupOptions:{input:path.resolve('tools/gkb-inspector/preview.html')}},
};
if(process.argv.includes('--build')) await build(config);
else { const server=await createServer(config);await server.listen();console.log('Hero preview: http://127.0.0.1:5173/tools/gkb-inspector/preview.html'); }
