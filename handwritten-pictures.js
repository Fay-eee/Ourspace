/* Generated ink assets, kept as transparent PNGs. SVG supplies responsive framing and gentle ink movement. */
(() => {
  const root=document.getElementById('ourspace-weather');if(!root)return;
  const assets=window.OurspaceHandwrittenAssets;
  const ns='http://www.w3.org/2000/svg';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const selectors={weather:'.weather-dialogue p',spaces:'[data-view="spaces"] .space-prompt',desk:'[data-view="desk"] .space-prompt',cover:'[data-view="cover"] .space-prompt',journal:'.journal-view > .space-prompt',community:'.community-center > .space-prompt',growth:'.community-growth-note'};
  for(const [key,selector]of Object.entries(selectors)){
    const element=root.querySelector(selector),asset=assets?.[key];if(!element||!asset)continue;
    const wording=element.textContent.replace(/\s+/g,' ').trim();
    const preload=new Image();preload.decoding='async';
    preload.onload=()=>{
      const svg=document.createElementNS(ns,'svg');svg.classList.add('handwritten-picture');
      svg.setAttribute('viewBox',asset.viewBox);svg.setAttribute('aria-hidden','true');
      svg.style.setProperty('--handwritten-width',asset.displayWidth+'px');
      const defs=document.createElementNS(ns,'defs'),filter=document.createElementNS(ns,'filter');
      filter.id='handwritten-distort-'+key;filter.setAttribute('x','-8%');filter.setAttribute('y','-20%');filter.setAttribute('width','116%');filter.setAttribute('height','140%');
      const noise=document.createElementNS(ns,'feTurbulence');noise.setAttribute('type','fractalNoise');noise.setAttribute('baseFrequency','.012 .02');noise.setAttribute('numOctaves','2');noise.setAttribute('seed','5');noise.setAttribute('result','inkNoise');
      const displacement=document.createElementNS(ns,'feDisplacementMap');displacement.setAttribute('in','SourceGraphic');displacement.setAttribute('in2','inkNoise');displacement.setAttribute('scale','0');displacement.setAttribute('xChannelSelector','R');displacement.setAttribute('yChannelSelector','G');
      filter.append(noise,displacement);defs.append(filter);svg.append(defs);
      const picture=document.createElementNS(ns,'image');picture.setAttribute('href',asset.src);picture.setAttribute('width',asset.width);picture.setAttribute('height',asset.height);picture.setAttribute('filter','url(#'+filter.id+')');svg.append(picture);
      const label=document.createElement('span');label.className='handwritten-accessible';label.textContent=wording;
      element.classList.add('handwritten-ready');element.dataset.handwritten=key;element.replaceChildren(svg,label);
      let target=0,amount=0,frame=0;
      function animate(time){
        frame=0;if(reduced.matches){amount=target=0;displacement.setAttribute('scale','0');return;}
        amount+=(target-amount)*.13;
        displacement.setAttribute('scale',amount.toFixed(2));
        if(target)noise.setAttribute('baseFrequency',(.012+Math.sin(time*.0015)*.0005).toFixed(5)+' '+(.02+Math.cos(time*.0012)*.0005).toFixed(5));
        if(Math.abs(target-amount)>.05||target)frame=requestAnimationFrame(animate);else displacement.setAttribute('scale','0');
      }
      function start(){if(!frame)frame=requestAnimationFrame(animate);}
      element.addEventListener('pointermove',event=>{if(event.pointerType==='touch'||reduced.matches)return;target=18;start();});
      element.addEventListener('pointerleave',()=>{target=0;start();});
      window.addEventListener('blur',()=>{target=0;start();});
    };
    // Existing readable text remains in place until the real asset has loaded.
    preload.src=asset.src;
  }
})();
