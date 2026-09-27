#!/usr/bin/env bash
set -u
AB="agent-browser"
cd /d/portfolio-site

$AB set viewport 1920 1080 > /dev/null 2>&1
$AB open "http://127.0.0.1:5175/" > /dev/null 2>&1
$AB wait 2000 > /dev/null 2>&1
$AB eval "(()=>{const el=document.querySelector('.cs');const r=el.getBoundingClientRect();window.scrollBy(0, r.top - (window.innerHeight - r.height)/2);return 'ok';})()" > /dev/null 2>&1

# 轮询等它自然走到"02 动画"，视频段有 5.1s，够截图
for i in $(seq 1 40); do
  C=$($AB eval "document.querySelector('.cs__corner').textContent.trim()" 2>/dev/null | tr -d '"')
  if [ "$C" = "02 / 04" ]; then
    $AB screenshot shots/v5-video.png > /dev/null 2>&1
    echo "hit at poll $i corner=$C"
    break
  fi
done
echo "final corner: $($AB eval "document.querySelector('.cs__corner').textContent.trim()" 2>/dev/null)"
ls -la shots/v5-video.png 2>/dev/null || echo "MISS"
