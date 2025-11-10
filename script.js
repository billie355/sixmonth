
(function(){
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('in-view'); });
  }, { threshold: 0.15 });
  revealEls.forEach(el=>io.observe(el));

  // Flip cards
  document.querySelectorAll('.card-inner').forEach(inner=>{
    inner.addEventListener('click', ()=> inner.classList.toggle('is-flipped'));
    inner.addEventListener('keypress', (e)=>{
      const k = e.key||e.code; if(k==='Enter'||k===' '){ e.preventDefault(); inner.classList.toggle('is-flipped'); }
    });
  });

  // Audio (flip-to-play)
  const audio = document.getElementById('bgm');
  const btn = document.getElementById('playPause');
  const label = btn.querySelector('.label');
  const trackName = document.querySelector('.track-name');
  function updateButton(){ if(audio.paused){ btn.setAttribute('aria-label','Play Music'); label.textContent='Play Music'; btn.textContent='▶️ '; btn.appendChild(label);} else { btn.setAttribute('aria-label','Pause Music'); label.textContent='Pause Music'; btn.textContent='⏸️ '; btn.appendChild(label);} }

  let musicStarted = false;
  function startMusicOnFlip(){ if (musicStarted) return; musicStarted = true; audio.play().then(updateButton).catch(()=>{}); }
  document.querySelectorAll('.card-inner').forEach(inner=>{
    inner.addEventListener('click', startMusicOnFlip, { once: true });
    inner.addEventListener('keypress', (e)=>{ const k=e.key||e.code; if(k==='Enter'||k===' '){ startMusicOnFlip(); } }, { once: true });
  });

  btn.addEventListener('click', async ()=>{ try{ if(audio.paused){ await audio.play(); } else { audio.pause(); } }catch{} updateButton(); });
  audio.addEventListener('error', ()=>{ if (trackName) trackName.textContent='Audio error'; });

  // Parallax bubbles in hero
  const heroCanvas = document.getElementById('heroParallax');
  if (heroCanvas && heroCanvas.getContext && !prefersReduced){
    const ctx = heroCanvas.getContext('2d'); let w,h; function resize(){ w=heroCanvas.width=heroCanvas.offsetWidth; h=heroCanvas.height=heroCanvas.offsetHeight; draw(0);} window.addEventListener('resize', resize); resize();
    function draw(scrollY){ ctx.clearRect(0,0,w,h); const n=10; for(let i=0;i<n;i++){ const x=(w/n)*(i+0.5); const y=h*0.2 + Math.sin((scrollY*0.002)+i)*10; ctx.fillStyle='rgba(233,30,99,0.12)'; ctx.beginPath(); ctx.arc(x,y,14,0,Math.PI*2); ctx.fill(); } }
    let ticking=false; window.addEventListener('scroll', ()=>{ if(!ticking){ requestAnimationFrame(()=>{ draw(window.scrollY); ticking=false; }); ticking=true; } });
  }

  // Confetti hearts when letter is visible
  const confettiCanvas = document.getElementById('confetti');
  function heartsBurst(){ if(!confettiCanvas||prefersReduced) return; const ctx=confettiCanvas.getContext('2d'); let w,h; function resize(){ w=confettiCanvas.width=confettiCanvas.offsetWidth; h=confettiCanvas.height=confettiCanvas.offsetHeight;} resize(); const p=Array.from({length:25}).map(()=>({x:Math.random()*w,y:-10,vy:1+Math.random()*2,vx:(Math.random()-0.5)*0.6,s:6+Math.random()*8,a:1})); function heart(x,y,s){ ctx.save(); ctx.translate(x,y); ctx.rotate((Math.random()*0.4-0.2)); ctx.fillStyle='rgba(233,30,99,0.9)'; ctx.beginPath(); ctx.moveTo(0,0); ctx.bezierCurveTo(-s,-s,-s*1.5,s*0.5,0,s); ctx.bezierCurveTo(s*1.5,s*0.5,s,-s,0,0); ctx.fill(); ctx.restore(); } function frame(){ ctx.clearRect(0,0,w,h); p.forEach(o=>{ o.x+=o.vx; o.y+=o.vy; o.vy+=0.01; o.a-=0.005; ctx.globalAlpha=Math.max(o.a,0); heart(o.x,o.y,o.s); ctx.globalAlpha=1; }); if(p.some(o=>o.a>0 && o.y<h+20)) requestAnimationFrame(frame);} requestAnimationFrame(frame); }
  const letter = document.querySelector('#letter .letter');
  const letterIO = new IntersectionObserver((entries)=>{ entries.forEach(e=>{ if(e.isIntersecting) heartsBurst(); }); }, { threshold: 0.8 });
  if (letter) letterIO.observe(letter);

  // Cursor hearts (desktop only)
  (function(){ const isTouch = matchMedia('(hover: none)').matches || 'ontouchstart' in window; if (prefersReduced || isTouch) return; const container=document.getElementById('cursorHearts'); if(!container) return; let last=0; const throttle=90; const MAX=40; window.addEventListener('mousemove', (e)=>{ const now=Date.now(); if(now-last<throttle) return; last=now; if(container.childElementCount>MAX) container.firstChild.remove(); const span=document.createElement('span'); span.className='cursor-heart'; span.textContent='❤'; span.style.left=(e.clientX+(Math.random()*6-3))+'px'; span.style.top=(e.clientY+(Math.random()*6-3))+'px'; span.style.transform=`rotate(${(Math.random()*20-10)}deg)`; span.style.opacity='0.9'; container.appendChild(span); setTimeout(()=>span.remove(), 1000); }); })();
})();
