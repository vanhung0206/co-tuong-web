# Quick One-Click Deploy Script for Co Tuong Web
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   KỲ ĐẠO - TRIỂN KHAI NHANH LÊN VERCEL   " -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Cyan

Write-Host "`n[1/2] 🔨 Đang kiểm tra bản build..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Build thất bại! Vui lòng sửa lỗi trước khi deploy." -ForegroundColor Red
    exit 1
}

Write-Host "`n[2/2] 🚀 Đang đẩy lên Vercel Production..." -ForegroundColor Cyan
vercel --prod --yes

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ ĐÃ TRIỂN KHAI THÀNH CÔNG!" -ForegroundColor Green
    Write-Host "👉 Truy cập trang web: https://co-tuong-web.vercel.app" -ForegroundColor Yellow
} else {
    Write-Host "`n❌ Có lỗi xảy ra trong quá trình deploy." -ForegroundColor Red
}
