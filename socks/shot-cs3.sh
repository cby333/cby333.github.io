#!/usr/bin/env bash
set -u
AB="agent-browser"
cd /d/portfolio-site

$AB set viewport 1920 1080 > /dev/null 2>&1
$AB open "http://127.0.0.1:5175/" > /dev/null 2>&1
$AB wait 2600 > /dev/null 2>&1
$AB eval "(()=>{const el=document.querySelector('.cs');const r=el.getBoundingClientRect();window.scrollBy(0, r.top - (window.innerHeight - r.height)/2);return 'ok';})()" > socks/ab-s3-scroll.txt 2>&1
$AB wait 1300 > /dev/null 2>&1

# 01 立绘
$AB eval "(()=>{document.querySelectorAll('.cs__tab')[0].click();return document.querySelector('.cs__tab.is-on').innerText.replace(/\n/g,'/');})()" > socks/ab-s3-t1.txt 2>&1
$AB wait 1600 > /dev/null 2>&1
$AB screenshot shots/v2-still.png > /dev/null 2>&1
$AB eval "document.querySelector('.cs__tab.is-on').innerText.replace(/\n/g,'/')" > socks/ab-s3-t1b.txt 2>&1

# 02 视频：进去之后手动冻结画面再截
$AB eval "(()=>{document.querySelectorAll('.cs__tab')[1].click();return document.querySelector('.cs__tab.is-on').innerText.replace(/\n/g,'/');})()" > socks/ab-s3-t2.txt 2>&1
$AB wait 2600 > /dev/null 2>&1
$AB eval "(()=>{const v=document.querySelector('.cs__frame--video video');v.pause();return JSON.stringify({paused:v.paused,ct:+v.currentTime.toFixed(2)});})()" > socks/ab-s3-freeze.txt 2>&1
$AB wait 300 > /dev/null 2>&1
$AB screenshot shots/v2-video.png > /dev/null 2>&1

echo "=== click1 -> ==="; cat socks/ab-s3-t1.txt
echo "=== after shot1 ==="; cat socks/ab-s3-t1b.txt
echo "=== click2 -> ==="; cat socks/ab-s3-t2.txt
echo "=== freeze ==="; cat socks/ab-s3-freeze.txt
ls -la shots/v2-*.png
