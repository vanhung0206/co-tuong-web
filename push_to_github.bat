@echo off
title Sync Co Tuong Web to GitHub
cd /d "%~dp0"
echo ==============================================
echo   DANG DONG BO CODE LEN GITHUB: co-tuong-web
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
