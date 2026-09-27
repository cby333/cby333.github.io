#!/usr/bin/env bash
set -u
AB="agent-browser"
cd /d/portfolio-site

$AB set viewport 1920 1080 > /dev/null 2>&1
$AB open "http://127.0.0.1:5175/" > /dev/null 2>&1
$AB wait 2000 > /dev/null 2>&1
$AB eval "(()=>{const el=document.querySelector('.cs');const r=el.getBoundingClientRect();window.scrollBy(0, r.top - (window.innerHeight - r.height)/2);return 'ok';})()" > /dev/null 2>&1
$AB wait 800 > /dev/null 2>&1

# 注入静态覆盖层：只显示视频段，画面冻结 → 这样截图缓冲有延迟也无所谓
$AB eval "(()=>{
  const s=document.createElement('style');
  s.textContent='.cs__frame{opacity:0 !important;transition:none !important;transform:none !important}.cs__frame--video{opacity:1 !important}.cs__floor{opacity:0 !important;transition:none !important}';
  document.head.appendChild(s);
  const v=document.querySelector('.cs__frame--video video');
  v.pause(); v.currentTime=3.2;
  return 'forced video frame';
})()" > socks/ab-j1.txt 2>&1
$AB wait 1200 > /dev/null 2>&1
$AB screenshot shots/v6-video.png > /dev/null 2>&1
$AB wait 1500 > /dev/null 2>&1
$AB screenshot shots/v6-video-b.png > /dev/null 2>&1

echo "=== inject ==="; cat socks/ab-j1.txt
ls -la shots/v6-*.png
