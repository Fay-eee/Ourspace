/* Local letter motion. Real text remains selectable and accessible; panel shapes stay still. */
(() => {
  const root=document.getElementById('ourspace-weather');if(!root)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const targets='.space-prompt,.weather-dialogue p,.next-copy,.community-story h2,.community-story p,.community-story .story-mood,.community-story .story-credit,.journal-tools p,.journal-tools [data-tool],.journal-tools .undo-mark,.sticker-picker > span,.mood-dialog h2,.mood-dialog > p,.mood-dialog .meter-energy,.mood-dialog strong,.meter-words button';
  const panels='.space-prompt,.weather-dialogue,.weather-next,.community-story,.journal-tools,.mood-dialog';
  let hovered=null,letters=[],lastPointer=null,raf=0,lastTime=0;
  const states=new WeakMap();
  function prepare(element){
    if(element.classList.contains('handwritten-ready'))return;
    const walker=document.createTreeWalker(element,NodeFilter.SHOW_TEXT);
    const nodes=[];let text;
    while(text=walker.nextNode())if(text.textContent.trim()&&!text.parentElement.closest('.ink-letter'))nodes.push(text);
    for(const text of nodes){
      const fragment=document.createDocumentFragment();
      // Preserve whitespace and line breaks; keep words together when lines wrap.
      for(const word of text.textContent.split(/(\s+)/u)){
        if(!word.trim()){fragment.append(document.createTextNode(word));continue;}
        const wrap=document.createElement('span');wrap.className='ink-word';
        for(const char of Array.from(word)){
          const span=document.createElement('span');span.className='ink-letter';span.textContent=char;wrap.append(span);
        }
        fragment.append(wrap);
      }
      text.replaceWith(fragment);
    }
  }
  function prepareAll(){for(const el of root.querySelectorAll(targets))prepare(el);}
  prepareAll();
  // Story changes replace text nodes; restore the effect for the newly selected voice.
  const observer=new MutationObserver(()=>{
    observer.disconnect();prepareAll();observer.observe(root,{subtree:true,childList:true});
    if(hovered)measure(hovered);
  });
  observer.observe(root,{subtree:true,childList:true});
  function measure(panel){
    for(const letter of letters){letter.element.style.transform='';}
    letters=[...panel.querySelectorAll('.ink-letter')].map(element=>{
      const r=element.getBoundingClientRect();
      let state=states.get(element);if(!state){state={x:0,y:0,vx:0,vy:0};states.set(element,state);}
      return {element,cx:r.left+r.width/2,cy:r.top+r.height/2,state};
    });
  }
  function start(){if(!raf)raf=requestAnimationFrame(animate);}
  function leave(){hovered=null;lastPointer=null;start();}
  root.addEventListener('pointermove',e=>{
    if(e.pointerType==='touch'||reduced.matches)return;
    const panel=e.target.closest(panels);
    if(!panel){if(hovered)leave();return;}
    if(panel!==hovered){
      for(const letter of letters)letter.element.style.transform='';
      hovered=panel;measure(panel);
    }
    lastPointer={x:e.clientX,y:e.clientY};start();
  },true);
  root.addEventListener('pointerleave',leave);
  root.addEventListener('scroll',()=>{if(hovered)measure(hovered);},true);
  window.addEventListener('resize',leave);window.addEventListener('blur',leave);
  document.fonts?.ready.then(()=>{if(hovered)measure(hovered);});
  function animate(time){
    raf=0;const dt=Math.min((time-(lastTime||time))/16.67||1,2);lastTime=time;let moving=false;
    if(reduced.matches){for(const letter of letters)letter.element.style.transform='';return;}
    for(const letter of letters){
      const s=letter.state;let tx=0,ty=0,influence=0;
      if(lastPointer&&hovered&&!hovered.closest('[hidden]')&&!root.classList.contains('is-transitioning')){
        const dx=letter.cx-lastPointer.x,dy=letter.cy-lastPointer.y;
        const distance=Math.hypot(dx,dy);influence=Math.pow(Math.max(0,1-distance/95),2);
        tx=(dx/Math.max(distance,15))*6*influence;
        ty=(dy/Math.max(distance,15))*5*influence+Math.sin(time*.008+letter.cx*.06)*1.2*influence;
      }
      const damping=Math.pow(.7,dt);
      s.vx=(s.vx+(tx-s.x)*.16*dt)*damping;s.vy=(s.vy+(ty-s.y)*.16*dt)*damping;
      s.x+=s.vx*dt;s.y+=s.vy*dt;
      if(Math.abs(s.x)+Math.abs(s.y)+Math.abs(s.vx)+Math.abs(s.vy)>.025||influence>.001){
        moving=true;letter.element.style.transform=`translate(${s.x.toFixed(2)}px,${s.y.toFixed(2)}px) rotate(${(s.x*.65).toFixed(2)}deg) skewX(${(s.y*.55).toFixed(2)}deg)`;
      }else{letter.element.style.transform='';s.x=s.y=s.vx=s.vy=0;}
    }
    if(moving)start();else lastTime=0;
  }
})();
