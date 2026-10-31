/* Keep the light and paper still continuous while ink gently leaves and returns. */
(() => {
  let busy = false;
  const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const animations = new Set();
  function motion(node, frames, options) {
    if (!node || reduced() || typeof node.animate !== 'function') return Promise.resolve();
    const animation = node.animate(frames, {fill:'both', ...options});
    animations.add(animation);
    return animation.finished.catch(() => {}).finally(() => {
      animation.cancel();
      animations.delete(animation);
    });
  }
  async function arrive(node, kind) {
    const notebook = kind === 'notebook';
    const entrance = motion(node, [
      {opacity:0, filter:'blur(4px)', transform:notebook ? 'perspective(1200px) rotateY(7deg) scale(.97)' : 'translateY(9px) scale(.975)'},
      {opacity:.75, filter:'blur(1px)', offset:.48},
      {opacity:1, filter:'blur(0px)', transform:'translateY(0px) scale(1)'}
    ], {duration:notebook?820:680, easing:'cubic-bezier(.16,1,.3,1)'});
    const prompts = [...node.querySelectorAll('.space-prompt,.weather-dialogue,.next-copy,.space-arrow')];
    await Promise.all([entrance, ...prompts.map((element,i) => motion(element,[
      {opacity:0,transform:'translateY(5px)'}, {opacity:1,transform:'translateY(0px)'}
    ],{delay:110+i*45,duration:420,easing:'ease-out'}))]);
  }
  window.OurspaceTransitions = {
    get busy() { return busy; },
    enter: arrive,
    async swap({from,to,commit,kind='soft'}) {
      if(busy) return false;
      busy=true;
      const root=document.getElementById('ourspace-weather');
      const previousInert=from?.inert ?? false;
      root?.setAttribute('aria-busy','true');
      root?.classList.add('is-transitioning');
      if(from)from.inert=true;
      try {
        await motion(from,[
          {opacity:1,filter:'blur(0px)',transform:'translateY(0px) scale(1)'},
          {opacity:0,filter:'blur(3px)',transform:kind==='notebook'?'perspective(1200px) rotateY(-12deg) scale(1.04)':'translateY(-5px) scale(1.025)'}
        ],{duration:kind==='notebook'?420:320,easing:'cubic-bezier(.4,0,.8,.4)'});
        commit();
        if(to)to.inert=true;
        await arrive(to,kind);
        return true;
      } finally {
        if(from)from.inert=previousInert;
        if(to)to.inert=false;
        root?.removeAttribute('aria-busy');
        root?.classList.remove('is-transitioning');
        busy=false;
      }
    }
  };
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden) for(const animation of animations)animation.finish();
  });
})();
