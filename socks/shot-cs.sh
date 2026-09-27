#!/usr/bin/env bash
set -u
AB="agent-browser"
cd /d/portfolio-site

$AB open "http://127.0.0.1:5175/" > socks/ab-open.txt 2>&1
$AB set viewport 1920 1080 > socks/ab-vp.txt 2>&1
$AB wait 2500 > /dev/null 2>&1

# 滚到角色舞台，居中
$AB eval "(()=>{const el=document.querySelector('.cs');if(!el)return 'NO .cs';const r=el.getBoundingClientRect();window.scrollBy(0, r.top - (window.innerHeight - r.height)/2);return 'scrolled h='+Math.round(r.height)+' w='+Math.round(r.width);})()" > socks/ab-scroll.txt 2>&1
$AB wait 1600 > /dev/null 2>&1
$AB screenshot shots/cs-01-still.png > socks/ab-shot1.txt 2>&1

$AB wait 3400 > /dev/null 2>&1
$AB screenshot shots/cs-02-motion.png > socks/ab-shot2.txt 2>&1

$AB wait 5200 > /dev/null 2>&1
$AB screenshot shots/cs-03-invite.png > socks/ab-shot3.txt 2>&1

$AB wait 3100 > /dev/null 2>&1
$AB screenshot shots/cs-04-present.png > socks/ab-shot4.txt 2>&1

$AB eval "(()=>{const b=document.querySelector('.cs__tab.is-on');return b?b.innerText.replace(/\n/g,'/'):'NONE';})()" > socks/ab-active.txt 2>&1
$AB errors > socks/ab-errors.txt 2>&1

echo "=== scroll ==="; cat socks/ab-scroll.txt
echo "=== active tab after loop ==="; cat socks/ab-active.txt
echo "=== errors ==="; cat socks/ab-errors.txt
echo "=== shots ==="; ls -la shots/cs-0*.png
