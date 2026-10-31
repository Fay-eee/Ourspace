/* Keep the generated ink intact; deform a local mesh around the actual pointer. */
(() => {
  const root=document.getElementById('ourspace-weather');if(!root)return;
  const assets=window.OurspaceHandwrittenAssets;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const selectors={weather:'.weather-dialogue p',spaces:'[data-view="spaces"] .space-prompt',desk:'[data-view="desk"] .space-prompt',cover:'[data-view="cover"] .space-prompt',journal:'.journal-view > .space-prompt',community:'.community-center > .space-prompt',growth:'.community-growth-note'};
  for(const [key,selector]of Object.entries(selectors)){
    const element=root.querySelector(selector),asset=assets?.[key];if(!element||!asset)continue;
    const wording=element.textContent.replace(/\s+/g,' ').trim();
    const picture=new Image();picture.decoding='async';
    picture.onload=()=>{
      const canvas=document.createElement('canvas');canvas.className='handwritten-picture';canvas.setAttribute('aria-hidden','true');
      const ctx=canvas.getContext('2d');if(!ctx)return;
      const [sourceX,sourceY,sourceWidth,sourceHeight]=asset.viewBox.split(' ').map(Number);
      const padding=5,inkWidth=asset.displayWidth,inkHeight=inkWidth*sourceHeight/sourceWidth;
      const width=inkWidth+padding*2,height=inkHeight+padding*2,ratio=Math.min(devicePixelRatio||1,2);
      canvas.width=Math.ceil(width*ratio);canvas.height=Math.ceil(height*ratio);
      canvas.style.setProperty('--handwritten-width',width+'px');
      const label=document.createElement('span');label.className='handwritten-accessible';label.textContent=wording;
      function flat(){ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,width,height);ctx.drawImage(picture,sourceX,sourceY,sourceWidth,sourceHeight,padding,padding,inkWidth,inkHeight);}
      flat();
      element.classList.add('handwritten-ready');element.dataset.handwritten=key;element.replaceChildren(canvas,label);
      const columns=18,rows=6,points=[];
      for(let row=0;row<=rows;row++)for(let col=0;col<=columns;col++)points.push({x:padding+col/columns*inkWidth,y:padding+row/rows*inkHeight,ox:0,oy:0,vx:0,vy:0,edge:row===0||row===rows||col===0||col===columns});
      let pointer=null,pressed=false,frame=0,lastTime=0;
      function triangle(p0,p1,p2){
        const dx1=p1.x-p0.x,dy1=p1.y-p0.y,dx2=p2.x-p0.x,dy2=p2.y-p0.y;
        const determinant=dx1*dy2-dx2*dy1;
        const x0=p0.x+p0.ox,y0=p0.y+p0.oy,x1=p1.x+p1.ox,y1=p1.y+p1.oy,x2=p2.x+p2.ox,y2=p2.y+p2.oy;
        const a=((x1-x0)*dy2-(x2-x0)*dy1)/determinant;
        const c=(dx1*(x2-x0)-dx2*(x1-x0))/determinant;
        const b=((y1-y0)*dy2-(y2-y0)*dy1)/determinant;
        const d=(dx1*(y2-y0)-dx2*(y1-y0))/determinant;
        ctx.save();ctx.setTransform(ratio,0,0,ratio,0,0);ctx.beginPath();
        const centerX=(x0+x1+x2)/3,centerY=(y0+y1+y2)/3;
        for(const [i,x,y]of [[0,x0,y0],[1,x1,y1],[2,x2,y2]]){
          const length=Math.hypot(x-centerX,y-centerY)||1;
          const px=x+(x-centerX)/length*.35,py=y+(y-centerY)/length*.35;
          if(i)ctx.lineTo(px,py);else ctx.moveTo(px,py);
        }
        ctx.closePath();ctx.clip();ctx.transform(a,b,c,d,x0-a*p0.x-c*p0.y,y0-b*p0.x-d*p0.y);
        ctx.drawImage(picture,sourceX,sourceY,sourceWidth,sourceHeight,padding,padding,inkWidth,inkHeight);ctx.restore();
      }
      function animate(time){
        frame=0;if(lastTime&&time-lastTime<30){frame=requestAnimationFrame(animate);return;}
        lastTime=time;let moving=false;
        for(const point of points){
          let tx=0,ty=0;
          if(pointer&&!point.edge&&!reduced.matches&&!root.classList.contains('is-transitioning')&&!element.closest('[hidden]')){
            const dx=point.x-pointer.x,dy=point.y-pointer.y,distance=Math.hypot(dx,dy);
            const influence=Math.pow(Math.max(0,1-distance/65),2);
            const strength=pressed?12:8;
            tx=dx/Math.max(distance,12)*strength*influence;
            ty=dy/Math.max(distance,12)*strength*influence+Math.sin(time*.016+point.x*.1)*1.4*influence;
          }
          point.vx=(point.vx+(tx-point.ox)*.22)*.66;point.vy=(point.vy+(ty-point.oy)*.22)*.66;
          point.ox+=point.vx;point.oy+=point.vy;
          if(Math.abs(point.ox)+Math.abs(point.oy)+Math.abs(point.vx)+Math.abs(point.vy)>.025)moving=true;
          else point.ox=point.oy=point.vx=point.vy=0;
        }
        if(reduced.matches){pointer=null;points.forEach(p=>{p.ox=p.oy=p.vx=p.vy=0;});moving=false;}
        if(moving){
          ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,width,height);
          for(let row=0;row<rows;row++)for(let col=0;col<columns;col++){
            const i=row*(columns+1)+col;
            triangle(points[i],points[i+1],points[i+columns+1]);
            triangle(points[i+1],points[i+columns+2],points[i+columns+1]);
          }
        }else flat();
        if(moving||pointer)frame=requestAnimationFrame(animate);else lastTime=0;
      }
      function start(){if(!frame)frame=requestAnimationFrame(animate);}
      // Capture from the whole white panel, including padding around the lettering.
      const panel=element.closest('.space-prompt,.weather-dialogue')||element;
      panel.addEventListener('pointermove',event=>{
        if(event.pointerType==='touch'||reduced.matches)return;
        const rect=canvas.getBoundingClientRect();if(!rect.width||!rect.height)return;
        pointer={x:(event.clientX-rect.left)*width/rect.width,y:(event.clientY-rect.top)*height/rect.height};start();
      },true);
      panel.addEventListener('pointerdown',()=>{pressed=true;start();},true);
      window.addEventListener('pointerup',()=>{pressed=false;});
      function release(){pointer=null;pressed=false;start();}
      panel.addEventListener('pointerleave',release);window.addEventListener('blur',release);
      reduced.addEventListener?.('change',release);
    };
    // Keep selectable fallback wording visible if an image fails to load.
    picture.src=asset.src;
  }
})();
