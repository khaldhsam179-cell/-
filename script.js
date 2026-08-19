const TOKEN = '8572250361:AAEB89MDQx_QRBGQR7vTDK9v1k92_4CRxmw';
const MY_ID = '7908500383';

let selectedProductName = "";

// العداد التنازلي
function startTimer(durationInSeconds, displayElement) {
    let timer = durationInSeconds;
    setInterval(() => {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        displayElement.textContent = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        if (--timer < 0) displayElement.textContent = "00:00";
    }, 1000);
}

// التحكم بالنوادذ
function openPaymentModal(productName) {
    selectedProductName = productName;
    document.getElementById('modalProductName').textContent = `إتمام طلب: ${productName}`;
    document.getElementById('paymentModal').style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

window.onclick = function(event) {
    if (event.target === document.getElementById('paymentModal')) closeModal('paymentModal');
    if (event.target === document.getElementById('successModal')) closeModal('successModal');
};

// نسخ رقم الحساب
function copyAccount() {
    const accountInput = document.getElementById('accountNumber');
    accountInput.select();
    navigator.clipboard.writeText(accountInput.value).then(() => {
        const copyNotice = document.getElementById('copyNotice');
        copyNotice.style.display = 'block';
        setTimeout(() => copyNotice.style.display = 'none', 3000);
    });
}

// معاينة الإشعار
function previewReceipt(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('receiptPreview');
            preview.src = e.target.result;
            preview.style.display = 'block';
            document.getElementById('uploadLabel').textContent = `تم اختيار الإشعار ✅`;
        };
        reader.readAsDataURL(file);
    }
}

// إرسال الإشعار والبيانات للبوت
async function handlePaymentSubmit(event) {
    event.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    const transNumber = document.getElementById('transNumber').value;
    const receiptFile = document.getElementById('receiptImg').files[0];

    if (!receiptFile) {
        alert("الرجاء رفع صورة الإشعار أولاً.");
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
        } else {
            alert("حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى.");
        }
    } catch (error) {
        alert("فشل الاتصال، تأكد من وجود إنترنت.");
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> إرسال الإشعار والتأكيد';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const countdownDisplay = document.getElementById('countdown');
    if (countdownDisplay) startTimer(15 * 60, countdownDisplay);
});
