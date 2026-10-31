/* A small, local journal inside Ourspace. No account or remote storage. */
(() => {
  const root=document.getElementById('ourspace-weather');
  const arrow='<svg viewBox="0 0 64 24" aria-hidden="true"><path d="M4 12 Q29 11 57 12 M45 3 L58 12 45 21"/></svg>';
  const back=(target,label='Back')=>`<button class="space-back" data-go="${target}" aria-label="Back to ${label}"><svg viewBox="0 0 50 24" aria-hidden="true"><path d="M45 12 Q25 11 5 12 M16 3 L4 12 16 21"/></svg></button>`;
  const prompt=text=>`<div class="space-prompt">${text}</div>`;
  const hub=document.createElement('div');hub.className='space-chapters';root.append(hub);
  hub.innerHTML=`
  <section class="space-view" data-view="spaces" hidden aria-label="Choose a space">
    ${back('reflection','Today’s sky')}
    <div class="space-center"><div class="space-doors">
      <button class="space-door" data-go="desk"><img src="assets/ourspace/home.svg" alt="Hand-drawn small house"><span>My Space</span><small>A moment for yourself</small></button>
      <button class="space-door" data-go="community"><img src="assets/ourspace/community.svg" alt="Hand-drawn community building"><span>Our Space</span><small>A place to come together</small></button>
    </div>${prompt('Where would you like to be?')}</div>
  </section>
  <section class="space-view" data-view="desk" hidden aria-label="My Space desk">
    ${back('spaces','Spaces')}<div class="space-center"> <div class="desk-scene"><img src="assets/ourspace/desk.svg" alt="Your hand-drawn desk with a chair, notebook and a cup"><button class="notebook-hotspot" data-go="cover" aria-label="Open the notebook"><span>Click here to write</span><svg viewBox="0 0 50 55" aria-hidden="true"><path d="M8 3 Q43 15 21 46 M14 33 L21 47 33 40"/></svg></button></div>${prompt('Take a seat. This moment is yours.')}</div>
  </section>
  <section class="space-view" data-view="cover" hidden aria-label="Your notebook">
    ${back('desk','My desk')}<div class="space-center notebook-intro">${prompt('Click the notebook to open it.')}<button class="notebook-cover" data-go="journal" aria-label="Open My Growth notebook"><img src="assets/ourspace/notebook.svg?v=3" alt="Hand-drawn My Growth notebook, a coffee cup and a curled arrow"></button></div>
  </section>
  <section class="space-view journal-view" data-view="journal" hidden aria-label="My thoughts journal">
    <header class="journal-nav">${back('desk','My desk')}<span class="journal-date"></span><span class="journal-save" role="status">Only on this device</span></header>
    <div class="journal-book"><div class="journal-rings" aria-hidden="true">${'<i></i>'.repeat(11)}</div>
      <section class="journal-left" aria-label="Feelings page"><div class="mood-heading"><h1>How are you feeling?</h1><span>Place yourself.</span><button class="mood-toggle" aria-label="Open Mood Meter">+</button></div>
      <div class="mood-map" tabindex="0" role="slider" aria-label="Mood map. Left to right: difficult to pleasant. Down to up: quiet to energized. Use arrow keys to move." aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" aria-valuetext="Centered">
      <svg viewBox="0 0 440 280" aria-hidden="true"><g fill="none" stroke="#91887a" stroke-width="1.3"><path d="M220 25 Q224 142 220 254 M50 141 Q221 139 391 141 M215 34 L220 25 226 34 M215 245 L220 254 226 245 M60 136 L50 141 60 146 M381 136 L391 141 381 146"/></g>
      <g font-family="Chalkboard SE,Comic Sans MS,cursive" font-size="15"><g fill="#b27b8c"><text x="77" y="64">Frustrated</text><text x="133" y="105">Anxious</text></g><g fill="#b0a262"><text x="285" y="59">Excited</text><text x="252" y="102">Happy</text></g><g fill="#8299b7"><text x="88" y="193">Sad</text><text x="119" y="230">Tired</text></g><g fill="#7d9d8a"><text x="265" y="188">Calm</text><text x="282" y="229">Content</text></g></g></svg>
      <span class="mood-dot" style="left:50%;top:50%"></span><span class="mood-word" style="left:50%;top:50%"></span></div>
      <p class="mood-summary" aria-live="polite">Somewhere in between is okay.</p>
      <label class="feeling-label" for="daily-feeling">A little about today</label><textarea id="daily-feeling" maxlength="6000" placeholder="Today, I feel…" spellcheck="true"></textarea></section>
      <section class="journal-right" aria-label="Thoughts page"><label for="daily-thoughts">What’s on your mind?</label><div class="thought-surface"><textarea id="daily-thoughts" maxlength="30000" placeholder="Let your thoughts wander here…" spellcheck="true"></textarea><svg class="journal-drawing" viewBox="0 0 500 600" preserveAspectRatio="none" aria-label="Your doodles"></svg><div class="journal-stickers"></div></div>
      <div class="journal-toolbox"><div class="journal-tools" id="journal-tools" hidden><p>Make it yours</p><div class="tool-modes"><button data-tool="write" aria-pressed="true">Aa · Write</button><button data-tool="draw" aria-pressed="false">✎ · Draw</button></div><div class="ink-colors" role="group" aria-label="Pen color">${['#75685e','#b5798c','#81a18b','#839cbd','#bfaa65'].map((c,i)=>`<button class="ink-swatch" data-color="${c}" style="--ink:${c}" aria-label="${['Pencil','Rose','Sage','Blue','Gold'][i]}" aria-pressed="${i===0}"></button>`).join('')}</div><div class="sticker-picker" role="group" aria-label="Stickers"><span>Little stickers</span><button data-sticker="✿" aria-label="Add flower sticker">✿</button><button data-sticker="☆" aria-label="Add star sticker">☆</button><button data-sticker="♡" aria-label="Add heart sticker">♡</button></div><button class="undo-mark">Undo last mark</button></div><button class="tools-toggle" aria-expanded="false" aria-controls="journal-tools" aria-label="Open journal tools">+</button></div></section>
    </div>${prompt('No perfect words needed.')}
  </section>
  <section class="space-view" data-view="community" hidden aria-label="Our Space community room">${back('spaces','Spaces')}<div class="space-center community-center">${prompt('Every seat holds a little story.')}<div class="community-room">
    <div class="community-room-stage"><svg class="community-room-art" viewBox="350 140 930 640" role="img" aria-label="A hand-drawn shared living room with a rose sofa, sage armchair, golden chair and a table of flowers"><image href="assets/ourspace/community-room-reference.png" width="1658" height="949"/></svg>
    <button class="story-seat seat-sofa" data-story="0" aria-label="Read the rose sofa story: Finding my voice" aria-pressed="false"><span>Finding my voice</span></button>
    <button class="story-seat seat-armchair" data-story="1" aria-label="Read the sage armchair story: A little room" aria-pressed="false"><span>A little room</span></button>
    <button class="story-seat seat-chair" data-story="2" aria-label="Read the golden chair story: My own pace" aria-pressed="false"><span>My own pace</span></button>
    </div><article class="community-story" hidden aria-live="polite" aria-atomic="true"><button class="story-close" aria-label="Close story">×</button><span class="story-mood"></span><h2 class="story-title"></h2><p class="story-copy"></p><small class="story-credit">An imagined voice · demo story</small></article>
  </div><div class="space-prompt community-growth-note">Each story adds a seat and more room to share and listen.</div></div></section>`;
  const next=root.querySelector('.weather-next');
  const continueButton=document.createElement('button');continueButton.className='space-arrow';continueButton.setAttribute('aria-label','Continue to My Space and Our Space');continueButton.innerHTML=arrow;next.append(continueButton);
  const screens=[...hub.querySelectorAll('[data-view]')];
  async function go(view){
    if(window.OurspaceTransitions.busy)return;
    const from=next.hidden?screens.find(screen=>!screen.hidden):next;
    const visible=view==='reflection'?next:screens.find(s=>s.dataset.view===view);
    if(!visible||from===visible)return;
    if(from?.dataset.view==='journal'){
      finish();tools.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.textContent='+';setMode('write');
    }
    const changed=await window.OurspaceTransitions.swap({from,to:visible,kind:view==='journal'?'notebook':'soft',commit:()=>{
      root.querySelector('.weather-content').hidden=true;next.hidden=view!=='reflection';
      screens.forEach(screen=>screen.hidden=screen.dataset.view!==view);
      root.scrollTop=0;document.body.dataset.state=view;window.BrainstreamOpening.state=view;
      root.classList.toggle('show-journal',view==='journal');
    }});
    if(!changed)return;
    const focus=visible.querySelector('h1,button,label');if(focus){if(!focus.matches('button'))focus.setAttribute('tabindex','-1');focus.focus({preventScroll:true});}
  }
  continueButton.addEventListener('click',()=>go('spaces'));
  hub.addEventListener('click',e=>{const button=e.target.closest('[data-go]');if(button)go(button.dataset.go);});
  for(const type of ['keydown','keyup','keypress'])root.addEventListener(type,e=>e.stopPropagation());
  const community=hub.querySelector('[data-view="community"]');
  const stories=[
    {title:'Finding my voice',mood:'Nervous, but proud',color:'#995f6e',copy:'I said “I disagree” in class today. My voice shook. I kept going anyway. I’m trying to stop making myself smaller.'},
    {title:'A little room',mood:'Quietly relieved',color:'#55765f',copy:'I told my flatmate I needed an evening alone. I nearly added “sorry.” Then I didn’t. I made tea and left my phone in the other room.'},
    {title:'My own pace',mood:'Hopeful',color:'#88713a',copy:'Someone asked when I’m settling down. I didn’t have an answer ready. I like the life I’m building, even while I’m still figuring it out.'}
  ];
  const storyCard=community.querySelector('.community-story');
  const seats=[...community.querySelectorAll('[data-story]')];
  let pinned=null,shown=null;
  function showStory(index){
    if(shown===index&&!storyCard.hidden)return;
    shown=index;const story=stories[index];
    storyCard.style.setProperty('--story-ink',story.color);
    storyCard.querySelector('.story-mood').textContent=story.mood;
    storyCard.querySelector('.story-title').textContent=story.title;
    storyCard.querySelector('.story-copy').textContent=story.copy;
    storyCard.hidden=false;
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&storyCard.animate)storyCard.animate([{opacity:0,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:240,easing:'ease-out'});
    seats.forEach((seat,i)=>{seat.classList.toggle('is-reading',i===index);seat.setAttribute('aria-pressed',String(pinned===i));});
  }
  function closeStory(){pinned=null;shown=null;storyCard.hidden=true;seats.forEach(seat=>{seat.classList.remove('is-reading');seat.setAttribute('aria-pressed','false');});}
  seats.forEach((seat,index)=>{
    seat.addEventListener('pointerenter',()=>{if(pinned===null)showStory(index);});
    seat.addEventListener('focus',()=>{if(pinned===null)showStory(index);});
    seat.addEventListener('click',()=>{pinned=index;showStory(index);seats.forEach((s,i)=>s.setAttribute('aria-pressed',String(i===index)));});
  });
  community.querySelector('.story-close').addEventListener('click',closeStory);
  community.addEventListener('keydown',e=>{if(e.key==='Escape')closeStory();});
  // Drafts are local to this browser and calendar day.
  const now=new Date(), day=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
  const sitePath=new URL('.',location.href).pathname;
  const storageKey='ourspace:journal:'+(sitePath==='/'?'':encodeURIComponent(sitePath)+':')+day;
  let draft={feeling:'',thoughts:'',mood:null,marks:[]},available=true;
  let savedText=null;
  try{savedText=localStorage.getItem(storageKey);}catch{available=false;}
  if(savedText){
    try{
      const saved=JSON.parse(savedText);
      if(saved&&typeof saved==='object')draft={...draft,...saved,marks:Array.isArray(saved.marks)?saved.marks.filter(mark=>mark&&(
        (mark.kind==='path'&&typeof mark.d==='string')||
        (mark.kind==='sticker'&&['✿','☆','♡'].includes(mark.text)&&Number.isFinite(mark.x)&&Number.isFinite(mark.y))
      )):[]};
    }catch{ /* A damaged draft must not stop the journal or disable future saves. */ }
  }
  const feeling=hub.querySelector('#daily-feeling'),thoughts=hub.querySelector('#daily-thoughts'),status=hub.querySelector('.journal-save');
  feeling.value=typeof draft.feeling==='string'?draft.feeling:'';thoughts.value=typeof draft.thoughts==='string'?draft.thoughts:'';
  hub.querySelector('.journal-date').textContent=now.toLocaleDateString('en-US',{month:'long',day:'numeric'});
  let saveTimer;
  function save(){
    clearTimeout(saveTimer);status.textContent='Saving…';saveTimer=setTimeout(()=>{
      draft.feeling=feeling.value;draft.thoughts=thoughts.value;
      try{if(!available)throw Error();localStorage.setItem(storageKey,JSON.stringify(draft));status.textContent='Saved on this device';}catch{status.textContent='Draft stays in this tab';}
    },300);
  }
  if(!available)status.textContent='Draft stays in this tab';
  feeling.addEventListener('input',save);thoughts.addEventListener('input',save);
  const map=hub.querySelector('.mood-map'),dot=hub.querySelector('.mood-dot'),summary=hub.querySelector('.mood-summary');
  function mood(x,y,store=true,word=null){
    x=Math.max(12,Math.min(88,x));y=Math.max(10,Math.min(90,y));
    dot.style.left=x+'%';dot.style.top=y+'%';
    const label=Math.abs(x-50)<10&&Math.abs(y-50)<10?'Somewhere in between':x<50?(y<50?'A little restless':'Feeling low'):(y<50?'Feeling bright':'Feeling at ease');
    summary.textContent=label+'. Every feeling belongs.';map.setAttribute('aria-valuenow',Math.round(x));map.setAttribute('aria-valuetext',label);
    draft.mood={x,y,label:word};const wordTag=hub.querySelector('.mood-word');wordTag.textContent=word||'';wordTag.style.left=x+'%';wordTag.style.top=y+'%';if(word){summary.textContent=word+'. Every feeling belongs.';map.setAttribute('aria-valuetext',word);}if(store)save();
  }
  let moving=false;
  function pointerMood(e){const r=map.getBoundingClientRect();mood((e.clientX-r.left)/r.width*100,(e.clientY-r.top)/r.height*100,true,draft.mood?.label??null);}
  map.addEventListener('pointerdown',e=>{moving=true;map.setPointerCapture(e.pointerId);pointerMood(e);});
  map.addEventListener('pointermove',e=>{if(moving)pointerMood(e);});map.addEventListener('pointerup',()=>moving=false);map.addEventListener('pointercancel',()=>moving=false);
  map.addEventListener('keydown',e=>{const d={ArrowLeft:[-4,0],ArrowRight:[4,0],ArrowUp:[0,-4],ArrowDown:[0,4]}[e.key];if(!d)return;e.preventDefault();mood((draft.mood?.x??50)+d[0],(draft.mood?.y??50)+d[1],true,draft.mood?.label??null);});
  if(draft.mood&&Number.isFinite(draft.mood.x)&&Number.isFinite(draft.mood.y))mood(draft.mood.x,draft.mood.y,false,draft.mood.label);
  const toggle=hub.querySelector('.tools-toggle'),tools=hub.querySelector('.journal-tools'),drawing=hub.querySelector('.journal-drawing'),stickers=hub.querySelector('.journal-stickers');
  let ink='#75685e',mode='write',currentPath=null;
  toggle.addEventListener('click',()=>{tools.hidden=!tools.hidden;toggle.setAttribute('aria-expanded',String(!tools.hidden));toggle.textContent=tools.hidden?'+':'−';});
  function setMode(value){mode=value;drawing.classList.toggle('is-drawing',mode==='draw');hub.querySelectorAll('[data-tool]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.tool===mode)));}
  function renderMarks(){
    drawing.replaceChildren();stickers.replaceChildren();
    for(const mark of draft.marks){
      if(mark.kind==='path'&&typeof mark.d==='string'){
        const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',mark.d);path.setAttribute('stroke',/^#[0-9a-f]{6}$/i.test(mark.color)?mark.color:'#75685e');drawing.append(path);
      }else if(mark.kind==='sticker'&&['✿','☆','♡'].includes(mark.text)){
        const s=document.createElement('span');s.textContent=mark.text;s.style.left=mark.x+'%';s.style.top=mark.y+'%';s.style.color=mark.color;stickers.append(s);
      }
    }
  }
  hub.querySelectorAll('[data-tool]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.tool)));
  hub.querySelectorAll('[data-color]').forEach(b=>b.addEventListener('click',()=>{ink=b.dataset.color;hub.querySelectorAll('[data-color]').forEach(c=>c.setAttribute('aria-pressed',String(c===b)));}));
  hub.querySelectorAll('[data-sticker]').forEach(b=>b.addEventListener('click',()=>{draft.marks.push({kind:'sticker',text:b.dataset.sticker,color:ink,x:68+(draft.marks.length%3)*7,y:65+(draft.marks.length%4)*6});renderMarks();save();}));
  hub.querySelector('.undo-mark').addEventListener('click',()=>{draft.marks.pop();renderMarks();save();});
  function point(e){const r=drawing.getBoundingClientRect();return `${((e.clientX-r.left)/r.width*500).toFixed(1)} ${((e.clientY-r.top)/r.height*600).toFixed(1)}`;}
  drawing.addEventListener('pointerdown',e=>{if(mode!=='draw')return;e.preventDefault();drawing.setPointerCapture(e.pointerId);const mark={kind:'path',d:'M'+point(e),color:ink};draft.marks.push(mark);renderMarks();currentPath=drawing.lastElementChild;});
  drawing.addEventListener('pointermove',e=>{if(!currentPath)return;const mark=draft.marks.at(-1);mark.d+=' L'+point(e);currentPath.setAttribute('d',mark.d);});
  function finish(){if(currentPath){currentPath=null;save();}}drawing.addEventListener('pointerup',finish);drawing.addEventListener('pointercancel',finish);
  const meter=document.createElement('dialog');meter.className='mood-dialog';meter.setAttribute('aria-label','Mood Meter');
  const quadrants=[
    ['red','High energy · Difficult',['Furious','Stressed','Anxious','Worried','Angry','Frustrated','Nervous','Tense']],
    ['yellow','High energy · Pleasant',['Energized','Inspired','Excited','Enthusiastic','Confident','Hopeful','Focused','Joyful']],
    ['blue','Low energy · Difficult',['Down','Discouraged','Hurt','Lonely','Sad','Bored','Tired','Hopeless']],
    ['green','Low energy · Pleasant',['Comfortable','Connected','Grateful','Safe','Satisfied','Relaxed','Peaceful','Serene']]
  ];
  meter.innerHTML='<button class="mood-dialog-close" aria-label="Close Mood Meter">×</button><h2>Mood Meter</h2><p>Pick a word. Give it a place.</p><span class="meter-energy">↑ High energy</span><div class="meter-grid">'+quadrants.map(([color,title,words],q)=>'<section class="meter-quadrant meter-'+color+'"><strong>'+title+'</strong><div class="meter-words">'+words.map((word,i)=>'<button data-mood="'+word+'" data-x="'+((q%2?60:18)+(i%2)*18)+'" data-y="'+((q<2?15:60)+Math.floor(i/2)*7)+'">'+word+'</button>').join('')+'</div></section>').join('')+'</div><span class="meter-energy">↓ Low energy</span>';
  root.append(meter);
  hub.querySelector('.mood-toggle').addEventListener('click',()=>meter.showModal());
  meter.querySelector('.mood-dialog-close').addEventListener('click',()=>meter.close());
  meter.addEventListener('click',e=>{const b=e.target.closest('[data-mood]');if(b){mood(Number(b.dataset.x),Number(b.dataset.y),true,b.dataset.mood);meter.close();map.focus();}});
  renderMarks();
  window.addEventListener('pagehide',()=>{if(available){try{draft.feeling=feeling.value;draft.thoughts=thoughts.value;localStorage.setItem(storageKey,JSON.stringify(draft));}catch{}}});
})();
