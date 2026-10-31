/* An independent startup indicator: visible even while the original engine loads. */
(() => {
  const screen=document.getElementById('startup-loading');
  if(!screen)return;
  const status=screen.querySelector('[role="status"]');
  const retry=screen.querySelector('.startup-retry');
  retry.addEventListener('click',event=>{event.preventDefault();location.reload();});
  let finished=false,poll,slow,verySlow;
  function dismiss(){
    if(finished)return;finished=true;
    clearInterval(poll);clearTimeout(slow);clearTimeout(verySlow);
    screen.classList.add('startup-done');screen.setAttribute('aria-hidden','true');
    screen.inert=true;
    setTimeout(()=>screen.remove(),420);
  }
  function ready(){
    const app=window.AppStatus,canvas=window.renderer?.domElement;
    return app?.mainSceneReady===true&&!app.mainLoaderShown&&canvas?.width>0&&canvas?.height>0&&performance.now()>=(app.mainSceneReadyTime||0);
  }
  function check(){
    if(ready())requestAnimationFrame(()=>{if(ready())requestAnimationFrame(dismiss);});
    // Let the original unsupported-browser message show instead of masking it.
    const error=document.getElementById('error');
    if(error&&error.getClientRects().length&&getComputedStyle(error).display!=='none')dismiss();
  }
  slow=setTimeout(()=>{if(!finished){status.textContent='Still loading. Thank you for waiting.';retry.hidden=false;}},12000);
  verySlow=setTimeout(()=>{if(!finished){status.textContent='Taking longer than expected. Check your connection or try again.';retry.hidden=false;}},30000);
  window.addEventListener('error',event=>{
    if(finished)return;
    const source=event.target?.src||event.filename||'';
    if(source.includes('brainstream-engine.js')){
      status.textContent='Ourspace couldn’t load. Please try again.';retry.hidden=false;
    }
  },true);
  poll=setInterval(check,100);check();
})();
