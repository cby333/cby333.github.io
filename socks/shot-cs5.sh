#!/usr/bin/env bash
set -u
AB="agent-browser"
cd /d/portfolio-site

$AB set viewport 1920 1080 > /dev/null 2>&1
$AB open "http://127.0.0.1:5175/" > /dev/null 2>&1
$AB wait 2600 > /dev/null 2>&1

# 冻掉 2~6s 的自动定时器
$AB eval "(()=>{window.__ost=window.setTimeout;window.setTimeout=function(fn,d){if(d>=2000&&d<=6000){return 0;}return window.__ost.apply(this,arguments);};return 'frozen';})()" > /dev/null 2>&1
$AB eval "(()=>{const el=document.querySelector('.cs');const r=el.getBoundingClientRect();window.scrollBy(0, r.top - (window.innerHeight - r.height)/2);return 'ok';})()" > /dev/null 2>&1
$AB wait 700 > /dev/null 2>&1

# 切到视频段，立刻暂停并 seek 到 3.2s（微笑点赞那一帧）
$AB eval "document.querySelectorAll('.cs__tab')[1].click()" > /dev/null 2>&1
$AB wait 700 > /dev/null 2>&1
$AB eval "(()=>{const v=document.querySelector('.cs__frame--video video');v.pause();v.currentTime=3.2;return JSON.stringify({paused:v.paused,ct:v.currentTime,on:document.querySelector('.cs__tab.is-on').innerText.replace(/\n/g,'/')});})()" > socks/ab-g1.txt 2>&1
$AB wait 1600 > /dev/null 2>&1
$AB eval "(()=>{const v=document.querySelector('.cs__frame--video video');return JSON.stringify({paused:v.paused,ct:+v.currentTime.toFixed(2),on:document.querySelector('.cs__tab.is-on').innerText.replace(/\n/g,'/')});})()" > socks/ab-g2.txt 2>&1
$AB screenshot shots/v4-video.png > /dev/null 2>&1

echo "=== seek ==="; cat socks/ab-g1.txt
echo "=== before shot ==="; cat socks/ab-g2.txt
ls -la shots/v4-video.png
