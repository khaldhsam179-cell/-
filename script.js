// ==========================================================================
// ⚠️ ربط بوت التليجرام بالتوكن والـ ID الخاصين بك
// ==========================================================================
const TOKEN = '8572250361:AAEB89MDQx_QRBGQR7vTDK9v1k92_4CRxmw';
const MY_ID = '7908500383';

let selectedProductName = ""; // لتخزين اسم النسخة المختارة

// ==========================================================================
// 1. العداد التنازلي للعرض الخاص
// ==========================================================================
function startTimer(durationInSeconds, displayElement) {
    let timer = durationInSeconds;
    
    const interval = setInterval(() => {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;

        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
        const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

        displayElement.textContent = `${formattedMinutes}:${formattedSeconds}`;

        if (--timer < 0) {
            clearInterval(interval);
            displayElement.textContent = "00:00";
        }
    }, 1000);
}

// ==========================================================================
// 2. التحكم في فتح وإغلاق النوافذ المنبثقة (Modals)
// ==========================================================================
function openPaymentModal(productName) {
    selectedProductName = productName;
    const modal = document.getElementById('paymentModal');
    const titleElement = document.getElementById('modalProductName');
    
    if (titleElement) {
        titleElement.textContent = `إتمام طلب: ${productName}`;
    }
    
    modal.style.display = 'flex';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// إغلاق النافذة عند الضغط خارج المربع
window.onclick = function(event) {
    const paymentModal = document.getElementById('paymentModal');
    const successModal = document.getElementById('successModal');
    
    if (event.target === paymentModal) paymentModal.style.display = 'none';
    if (event.target === successModal) successModal.style.display = 'none';
};

// ==========================================================================
// 3. نسخ رقم الحساب بنقرة واحدة
// ==========================================================================
function copyAccount() {
    const accountInput = document.getElementById('accountNumber');
    const copyNotice = document.getElementById('copyNotice');

    if (accountInput) {
        accountInput.select();
        accountInput.setSelectionRange(0, 99999);

        navigator.clipboard.writeText(accountInput.value).then(() => {
            if (copyNotice) {
                copyNotice.style.display = 'block';
                setTimeout(() => {
                    copyNotice.style.display = 'none';
                }, 3000);
            }
        }).catch(() => {
            alert('تم النسخ: ' + accountInput.value);
        });
    }
}

// ==========================================================================
// 4. معاينة صورة الإشعار فور رفعها
// ==========================================================================
function previewReceipt(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('receiptPreview');
    const label = document.getElementById('uploadLabel');

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
            if (label) {
                label.textContent = `تم اختيار: ${file.name}`;
            }
        };
        reader.readAsDataURL(file);
    }
}

// ==========================================================================
// 5. إرسال البيانات وصورة الإشعار لبوت التليجرام
// ==========================================================================
async function handlePaymentSubmit(event) {
    event.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    const transNumber = document.getElementById('transNumber').value;
    const receiptFile = document.getElementById('receiptImg').files[0];

    if (!receiptFile) {
        alert("الرجاء إرفاق صورة الإشعار أولاً.");
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري إرسال الإشعار...';

    const captionText = `🚨 *طلب شراء جديد من المتجر!*\n\n` +
                        `📦 *المنتج:* ${selectedProductName}\n` +
                        `🔢 *رقم العملية:* \`${transNumber}\`\n` +
                        `⏰ *الوقت:* ${new Date().toLocaleString('ar-EG')}`;

    try {
        const formData = new FormData();
        formData.append("chat_id", MY_ID);
        formData.append("photo", receiptFile);
        formData.append("caption", captionText);
        formData.append("parse_mode", "Markdown");

        const response = await fetch(`https://api.telegram.org/bot${TOKEN}/sendPhoto`, {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        if (result.ok) {
            closeModal('paymentModal');
            document.getElementById('successModal').style.display = 'flex';
            document.getElementById('paymentForm').reset();
            document.getElementById('receiptPreview').style.display = 'none';
            document.getElementById('uploadLabel').textContent = 'اضغط هنا أو اسحب صورة الإشعار';
        } else {
            alert("حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى.");
        }
    } catch (error) {
        console.error("Telegram API Error:", error);
        alert("فشل الاتصال بالسيرفر، يرجى التأكد من اتصال الإنترنت.");
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> إرسال الإشعار والتأكيد';
    }
}

// ==========================================================================
// 6. تشغيل العداد عند تحميل الصفحة
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    const countdownDisplay = document.getElementById('countdown');
    if (countdownDisplay) {
        startTimer(15 * 60, countdownDisplay);
    }
});
