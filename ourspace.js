/* Ourspace's original continuation. The opening renderer and its audio stay alive. */
(() => {
  const cloud = 'M20 62 C7 63 6 46 19 43 C14 29 27 22 38 29 C38 11 60 10 66 29 C80 20 94 33 87 45 C103 45 103 64 87 65 C73 72 65 63 58 66 C45 73 38 64 31 67 C25 69 19 67 20 62';
  const sun = '<circle cx="54" cy="44" r="18" class="sun-fill"/><path class="sun-rays" d="M54 16 L55 5 M76 23 L84 14 M84 44 L97 43 M76 65 L85 74 M54 74 L54 86 M31 65 L23 73 M24 44 L11 45 M32 23 L24 15"/>';
  const options = [
    ['snowy', 'Snowy', `<path d="${cloud}"/><path d="M33 80 l-2 4 m2-4 l3 2 M53 83 l-1 5 m-2-3 l5 1 M72 78 l-1 5 m-2-3 l5 1"/>`],
    ['sunny', 'Sunny', sun],
    ['partly-cloudy', 'Partly cloudy', `<g transform="translate(25 -2) scale(.77)">${sun}</g><path d="${cloud}"/>`],
    ['cloudy', 'Cloudy', `<path d="${cloud}"/>`],
    ['rainy', 'Rainy', `<path d="${cloud}"/><path class="rain" d="M35 78 l-2 11 M55 79 l-1 9 M74 77 l3 12"/>`],
    ['stormy', 'Stormy', `<path d="${cloud}"/><path class="lightning" d="M53 70 l-9 12 15 8 -10 15 23-18 -17-8 5-9"/>`]
  ];
  const section = document.createElement('section');
  section.id = 'ourspace-weather'; section.hidden = true;
  section.setAttribute('aria-label', 'Today’s weather');
  section.innerHTML = `<div class="weather-content"><div class="weather-options" role="group" aria-label="Choose your weather">${options.map(([id,label,art],i)=>`<button type="button" class="weather-choice" data-weather="${id}" aria-label="${label}" aria-pressed="false"><svg viewBox="0 0 112 112" aria-hidden="true"><defs><filter id="pencil-${i}" x="-30%" y="-30%" width="160%" height="160%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="${i+3}" result="grain"/><feDisplacementMap in="SourceGraphic" in2="grain" scale=".7" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g class="weather-ink" filter="url(#pencil-${i})">${art}</g></svg><span>${label}</span></button>`).join('')}</div><div class="weather-dialogue" aria-live="polite"><p>What’s the weather like<br class="weather-mobile-break"> where you are today?</p></div></div><div class="weather-next" hidden><svg class="chosen-weather" viewBox="0 0 112 112" aria-hidden="true"></svg><p class="next-copy">Every sky has a place here.<br>And so do you.</p></div>`;
  document.body.append(section);
  let active = false, settling = false, timer;
  function openWeather() {
    if(active) return;
    active = true;
    document.body.classList.add('ourspace-continuation');
    document.querySelectorAll('#main, .ui-buttons-container, #instructions-arrow-container').forEach(node => { node.inert = true; node.setAttribute('aria-hidden', 'true'); });
    section.hidden = false;
    window.BrainstreamOpening.state = 'weather';
    document.body.dataset.state = 'weather';
    requestAnimationFrame(()=>{section.classList.add('is-visible');window.OurspaceTransitions.enter(section.querySelector('.weather-content'));});
    setTimeout(()=>section.querySelector('button').focus({preventScroll:true}),450);
  }
  // The renderer advances on pointer-down, before a DOM click can be intercepted.
  // Its headphones boundary now hands off here and never enters the old narrative.
  window.addEventListener('ourspace:open-weather', openWeather);
  window.addEventListener('brainstream:state', ({detail}) => {
    if(detail.index >= 2 && !active) openWeather();
  });
  // Keep keyboard-generated clicks on the Continue button working too.
  window.addEventListener('click', e => {
    if (!active && window.BrainstreamOpening.state === 'headphones' && e.target.closest('#instructions-arrow')) {
      e.preventDefault(); e.stopImmediatePropagation(); openWeather();
    }
  }, true);
  // Keep the original canvas's global pointer handlers away from the new UI.
  for(const event of ['pointerdown','pointerup','mousedown','mouseup','touchstart','touchend','click']) {
    section.addEventListener(event,e=>e.stopPropagation());
  }
  const content = section.querySelector('.weather-content'), next = section.querySelector('.weather-next');
  section.querySelectorAll('.weather-choice').forEach((button,i)=>{
    const ink = button.querySelector('.weather-ink'), displacement=button.querySelector('feDisplacementMap');
    let x=0,y=0,tx=0,ty=0,energy=0,kick=0;
    button.addEventListener('pointermove', e=>{
      const rect=button.getBoundingClientRect();tx=(e.clientX-rect.left-rect.width/2)*.11;ty=(e.clientY-rect.top-rect.height/2)*.11;energy=1;
    });
    button.addEventListener('pointerleave',()=>{tx=0;ty=0;energy=0;});
    button.addEventListener('focus',()=>{energy=1;});button.addEventListener('blur',()=>{energy=0;});
    function animate(t){
      if(active && !section.hidden && !content.hidden){
        x+=(tx-x)*.12;y+=(ty-y)*.12;kick*=.93;
        const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
        displacement.setAttribute('scale',reduced?'.5':String(.7+energy*2.2+kick*Math.sin(t*.02)));
        ink.style.transform=`translate(${reduced?0:x}px, ${reduced?0:y}px) rotate(${reduced?0:x*.2}deg)`;
      }
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
    button.addEventListener('click',()=>{
      if(settling)return;
      settling=true;kick=12;button.setAttribute('aria-pressed','true');section.dataset.weather=options[i][0];
      window.Ourspace.weather=options[i][0];
      section.classList.add('has-selection');
      timer=setTimeout(async()=>{
        await window.OurspaceTransitions.swap({from:content,to:next,commit:()=>{
          content.hidden=true;next.hidden=false;
          section.querySelector('.chosen-weather').innerHTML=options[i][2];
          document.body.dataset.state='reflection';window.BrainstreamOpening.state='reflection';
        }});
        next.querySelector('button')?.focus({preventScroll:true});
      },450);
    });
  });
  window.Ourspace={weather:null};
})();
