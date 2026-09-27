#!/usr/bin/env bash
set -u
AB="agent-browser"
cd /d/portfolio-site

$AB set viewport 1920 1080 > /dev/null 2>&1
$AB open "http://127.0.0.1:5175/" > /dev/null 2>&1
$AB wait 2600 > /dev/null 2>&1

# 冻掉自动推进的定时器（2000~6000ms 的 setTimeout 一律忽略），这样点哪段就停在哪段
$AB eval "(()=>{window.__ost=window.setTimeout;window.setTimeout=function(fn,d){if(d>=2000&&d<=6000){return 0;}return window.__ost.apply(this,arguments);};return 'timers frozen';})()" > socks/ab-f1.txt 2>&1

$AB eval "(()=>{const el=document.querySelector('.cs');const r=el.getBoundingClientRect();window.scrollBy(0, r.top - (window.innerHeight - r.height)/2);return 'ok';})()" > /dev/null 2>&1
$AB wait 900 > /dev/null 2>&1

# 01 立绘
$AB eval "document.querySelectorAll('.cs__tab')[0].click()" > /dev/null 2>&1
$AB wait 2000 > /dev/null 2>&1
$AB screenshot shots/v3-still.png > /dev/null 2>&1

# 02 视频（点完等它播到中段，再暂停）
$AB eval "document.querySelectorAll('.cs__tab')[1].click()" > /dev/null 2>&1
$AB wait 2400 > /dev/null 2>&1
$AB eval "(()=>{const v=document.querySelector('.cs__frame--video video');v.pause();return 'paused@'+v.currentTime.toFixed(2);})()" > socks/ab-f2.txt 2>&1
$AB wait 900 > /dev/null 2>&1
$AB screenshot shots/v3-video.png > /dev/null 2>&1
$AB eval "document.querySelector('.cs__tab.is-on').innerText.replace(/\n/g,'/')" > socks/ab-f3.txt 2>&1

echo "=== freeze timers ==="; cat socks/ab-f1.txt
echo "=== video ==="; cat socks/ab-f2.txt
echo "=== active now ==="; cat socks/ab-f3.txt
ls -la shots/v3-*.png 2>/dev/null
