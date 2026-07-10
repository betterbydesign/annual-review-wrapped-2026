import { PNG } from 'pngjs';
import fs from 'fs';
const files = ['chat-compile','doc-storyboard','chat-revision','gpt-images','doc-buildspec','claude-design'];
// Fixed insets (fraction) — window content bounds measured across all assets,
// nudged ~0.6% inward to drop the drop-shadow / rounded-corner matte.
const INS = { L:0.078, T:0.093, R:0.078, B:0.076 };
for (const name of files){
  const src = PNG.sync.read(fs.readFileSync(`public/${name}.png`));
  const {width:W, height:H} = src;
  const x0 = Math.round(W*INS.L), y0 = Math.round(H*INS.T);
  const x1 = W - Math.round(W*INS.R), y1 = H - Math.round(H*INS.B);
  const cw = x1-x0, ch = y1-y0;
  const out = new PNG({width:cw, height:ch});
  for (let y=0;y<ch;y++){
    for (let x=0;x<cw;x++){
      const si = (((y+y0)*W)+(x+x0))*4;
      const di = ((y*cw)+x)*4;
      out.data[di]=src.data[si]; out.data[di+1]=src.data[si+1];
      out.data[di+2]=src.data[si+2]; out.data[di+3]=src.data[si+3];
    }
  }
  fs.writeFileSync(`public/${name}-crop.png`, PNG.sync.write(out));
  console.log(`${name}-crop.png`, `${cw}x${ch}`, 'ratio', (cw/ch).toFixed(3));
}
