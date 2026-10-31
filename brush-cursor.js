/* Reuse the original WebGL cursor, its input controllers, timing and SVG sequences. */
(() => {
  const fine=matchMedia('(hover: hover) and (pointer: fine)');
  let canvas=null,active=false;
  function lift(){
    if(!canvas)return;
    if(typeof canvas.showPopover==='function'){
      try{if(canvas.matches(':popover-open'))canvas.hidePopover();if(active)canvas.showPopover();}catch{canvas.removeAttribute('popover');document.body.append(canvas);}
    }else{
      const dialog=[...document.querySelectorAll('dialog[open]')].at(-1);
      (dialog||document.body).append(canvas);
    }
  }
  function activate(){
    if(active||!fine.matches||!document.body.classList.contains('ourspace-continuation'))return;
    const renderer=window.renderer,sequenceRenderer=window.SequenceRenderer;
    if(!renderer?.domElement||!sequenceRenderer?.cursorScene||!window.jQuery)return;
    canvas=renderer.domElement;
    canvas.id='ourspace-brush';canvas.setAttribute('aria-hidden','true');
    document.body.append(canvas);
    if(typeof canvas.showPopover==='function')canvas.setAttribute('popover','manual');
    canvas.addEventListener('webglcontextlost',()=>{
      canvas.hidden=true;document.body.classList.remove('ourspace-brush-ready');
      window.OurspaceNativeCursorReady=false;
    });
    canvas.addEventListener('webglcontextrestored',()=>{canvas.hidden=false;lift();});
    active=true;window.OurspaceNativeCursorActive=true;
    lift();
  }
  // Deliver the same native mouse data to the two original #main input handlers.
  // triggerHandler invokes those handlers only; it never redispatches a click or bubbles.
  for(const type of ['mousemove','mousedown','mouseup'])window.addEventListener(type,event=>{
    if(!active||!fine.matches)return;
    const $=window.jQuery;
    const forwarded=$.Event(type,{pageX:event.clientX,pageY:event.clientY,originalEvent:event});
    if(type==='mouseup')$(window).triggerHandler(forwarded);
    else {window.SequenceRenderer.isOverOtherDiv=false;$('#main').triggerHandler(forwarded);}
  },true);
  window.addEventListener('blur',()=>{
    if(active){const $=window.jQuery;$(window).triggerHandler($.Event('mouseup'));}
  });
  new MutationObserver(records=>{
    if(records.some(r=>r.target===document.body))activate();
    if(records.some(r=>r.attributeName==='open'))lift();
  }).observe(document.body,{attributes:true,attributeFilter:['class','open'],subtree:true});
  fine.addEventListener?.('change',()=>{
    if(!fine.matches&&active){window.OurspaceNativeCursorActive=false;document.body.classList.remove('ourspace-brush-ready');canvas.hidden=true;}
    else if(fine.matches&&active){canvas.hidden=false;window.OurspaceNativeCursorActive=true;if(window.OurspaceNativeCursorReady)document.body.classList.add('ourspace-brush-ready');lift();}
    else activate();
  });
  window.addEventListener('ourspace:cursor-ready',()=>{
    if(active&&fine.matches)document.body.classList.add('ourspace-brush-ready');
  });
  activate();
})();
