@echo off
chcp 65001 > nul
echo ==========================================
echo    KỲ ĐẠO - TRIỂN KHAI NHANH LÊN VERCEL
echo ==========================================
echo.
echo [1/2] Đang kiểm tra build...
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo [LOI] Build that bai!
    pause
    exit /b %errorlevel%
)

echo.
echo [2/2] Đang đẩy lên Vercel Production...
call vercel --prod --yes
if %errorlevel% neq 0 (
    echo.
    echo [LOI] Deploy that bai!
    pause
    exit /b %errorlevel%
)

echo.
echo ==========================================
echo [THANH CONG] Website da cap nhat tai:
echo https://co-tuong-web.vercel.app
echo ==========================================
echo.
pause
