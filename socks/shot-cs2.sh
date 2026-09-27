#!/usr/bin/env bash
set -u
AB="agent-browser"
cd /d/portfolio-site

$AB set viewport 1920 1080 > /dev/null 2>&1
$AB open "http://127.0.0.1:5175/" > /dev/null 2>&1
$AB wait 2600 > /dev/null 2>&1
$AB eval "(()=>{const el=document.querySelector('.cs');const r=el.getBoundingClientRect();window.scrollBy(0, r.top - (window.innerHeight - r.height)/2);return 'ok';})()" > /dev/null 2>&1
$AB wait 1200 > /dev/null 2>&1

# 01 立绘
$AB eval "document.querySelectorAll('.cs__tab')[0].click()" > /dev/null 2>&1
$AB wait 1500 > /dev/null 2>&1
$AB screenshot shots/cs-still.png > /dev/null 2>&1

# 02 视频（等它进到动画中段）
$AB eval "document.querySelectorAll('.cs__tab')[1].click()" > /dev/null 2>&1
$AB wait 2200 > /dev/null 2>&1
$AB screenshot shots/cs-video.png > /dev/null 2>&1

$AB eval "(()=>{const v=document.querySelector('.cs__frame--video video');return JSON.stringify({paused:v.paused,ct:+v.currentTime.toFixed(2),dur:+(v.duration||0).toFixed(2),w:v.videoWidth,h:v.videoHeight});})()" > socks/ab-video.txt 2>&1

# 往下看文案区
$AB eval "(()=>{const el=document.querySelector('.about__grid');const r=el.getBoundingClientRect();window.scrollBy(0, r.top - 120);return 'ok';})()" > /dev/null 2>&1
$AB wait 1400 > /dev/null 2>&1
$AB screenshot shots/cs-copy.png > /dev/null 2>&1

# 舞台盒子尺寸（用于校验比例）
$AB eval "(()=>{const s=document.querySelector('.cs__stage').getBoundingClientRect();const f=document.querySelector('.cs').getBoundingClientRect();const t=document.querySelector('.cs__tabs').getBoundingClientRect();return JSON.stringify({stage:[Math.round(s.width),Math.round(s.height)],fig:[Math.round(f.width),Math.round(f.height)],tabs:[Math.round(t.width),Math.round(t.height)]});})()" > socks/ab-box.txt 2>&1

$AB errors > socks/ab-errors2.txt 2>&1

echo "=== video ==="; cat socks/ab-video.txt
echo "=== box ==="; cat socks/ab-box.txt
echo "=== errors ==="; cat socks/ab-errors2.txt
ls -la shots/cs-still.png shots/cs-video.png shots/cs-copy.png
