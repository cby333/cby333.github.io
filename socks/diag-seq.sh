#!/usr/bin/env bash
set -u
AB="agent-browser"
cd /d/portfolio-site

$AB set viewport 1920 1080 > /dev/null 2>&1
$AB open "http://127.0.0.1:5175/" > /dev/null 2>&1
$AB wait 2200 > /dev/null 2>&1

$AB eval "(()=>{const el=document.querySelector('.cs');const r=el.getBoundingClientRect();window.scrollBy(0, r.top - (window.innerHeight - r.height)/2);return 'ok';})()" > /dev/null 2>&1
$AB wait 500 > /dev/null 2>&1

$AB eval "(()=>{
  window.__log=[];
  const t0=performance.now();
  const stamp=()=>Math.round(performance.now()-t0);
  const corner=document.querySelector('.cs__corner');
  const push=(m)=>window.__log.push(stamp()+'ms '+m);
  push('START corner='+corner.textContent.trim());
  new MutationObserver(()=>{push('IDX -> '+corner.textContent.trim());})
    .observe(corner,{childList:true,subtree:true,characterData:true});
  const v=document.querySelector('.cs__frame--video video');
  ['play','pause','ended','seeking','seeked','stalled','waiting','playing','error','loadeddata'].forEach(ev=>{
    v.addEventListener(ev,()=>push('VIDEO '+ev+' @'+v.currentTime.toFixed(2)+' dur='+(v.duration||0).toFixed(2)));
  });
  return 'observing';
})()" > socks/ab-h0.txt 2>&1

$AB wait 24000 > /dev/null 2>&1
$AB eval "JSON.stringify(window.__log)" > socks/ab-h1.txt 2>&1

echo "=== install ==="; cat socks/ab-h0.txt
echo "=== timeline ==="; cat socks/ab-h1.txt | tr ',' '\n'
