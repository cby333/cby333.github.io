#!/usr/bin/env bash
set -u
AB="agent-browser"
cd /d/portfolio-site

$AB set viewport 1920 1080 > /dev/null 2>&1
$AB open "http://127.0.0.1:5175/" > /dev/null 2>&1
$AB wait 2400 > /dev/null 2>&1

# 冻结序列，避免截图缓冲造成画面漂移
$AB eval "(()=>{const s=document.createElement('style');s.textContent='.cs__frame{transition:none !important}';document.head.appendChild(s);return 1;})()" > /dev/null 2>&1

$AB eval "(()=>{const el=document.querySelector('#about');window.scrollBy(0, el.getBoundingClientRect().top - 40);return 'ok';})()" > /dev/null 2>&1
$AB wait 1400 > /dev/null 2>&1
$AB screenshot shots/fin-about-top.png > /dev/null 2>&1

$AB eval "(()=>{const el=document.querySelector('.about__timeline');window.scrollBy(0, el.getBoundingClientRect().top - 90);return 'ok';})()" > /dev/null 2>&1
$AB wait 1400 > /dev/null 2>&1
$AB screenshot shots/fin-about-bot.png > /dev/null 2>&1

$AB eval "(()=>{const el=document.querySelector('#work');window.scrollBy(0, el.getBoundingClientRect().top - 40);return 'ok';})()" > /dev/null 2>&1
$AB wait 1400 > /dev/null 2>&1
$AB screenshot shots/fin-work.png > /dev/null 2>&1

$AB errors > socks/ab-fin-errors.txt 2>&1
echo "=== errors ==="; cat socks/ab-fin-errors.txt
ls -la shots/fin-*.png
