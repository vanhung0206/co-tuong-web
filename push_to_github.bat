@echo off
title Sync Co Tuong Web to GitHub
cd /d "C:\Users\vhung\.gemini\antigravity\scratch\co-tuong-web"
echo ==============================================
echo   DANG DONG BO CODE LEN GITHUB: vanhung0206/co-tuong-web
echo ==============================================
git push -u origin main
if %ERRORLEVEL% EQU 0 (
    echo.
    echo [THANH CONG] Source code da duoc day len GitHub thanh cong!
) else (
    echo.
    echo [LUU Y] Neu chua dang nhap GitHub tren may, vui long chon 'Sign in with your browser' trong cua so vua hien len.
)
pause
