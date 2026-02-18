// بيانات البوت الخاصة بك
const TOKEN = '8572250361:AAEB89MDQx_QRBGQR7vTDK9v1k92_4CRxmw';
const MY_ID = '7908500383';

let currentProduct = "";

// فتح نافذة الدفع
function openPay(title, price) {
    currentProduct = title;
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalPrice').innerText = "السعر: " + price + " جنيه";
    document.getElementById('payModal').style.display = "block";
    document.getElementById('successArea').style.display = "none";
    document.getElementById('uploadBtn').style.display = "block";
    document.getElementById('uploadBtn').innerText = "رفع صورة الإشعار";
}

// إغلاق نافذة الدفع
function closeModal() {
    document.getElementById('payModal').style.display = "none";
}

// معالجة الرفع والإرسال للتلجرام
async function handleUpload() {
    const fileInput = document.getElementById('receiptInput');
    const file = fileInput.files[0];
    const uploadBtn = document.getElementById('uploadBtn');

    if (file && file.type.startsWith('image/')) {
        uploadBtn.innerText = "جاري الإرسال... انتظر";
        uploadBtn.disabled = true;

        const formData = new FormData();
        formData.append('chat_id', MY_ID);
        formData.append('photo', file);
        formData.append('caption', `🚨 طلب جديد من: سايكو VIP\n📦 الخدمة: ${currentProduct}\n💰 الحساب: ماي كاش`);

        try {
            const response = await fetch(`https://api.telegram.org/bot${TOKEN}/sendPhoto`, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                alert("✅ تم رفع الإشعار بنجاح!");
                uploadBtn.style.display = "none";
                document.getElementById('successArea').style.display = "block";
            } else {
                alert("❌ خطأ في الإرسال. تأكد من تشغيل البوت.");
                uploadBtn.disabled = false;
                uploadBtn.innerText = "حاول مرة أخرى";
            }
        } catch (error) {
            alert("🌐 خطأ في الاتصال بالإنترنت.");
            uploadBtn.disabled = false;
        }
    } else {
        alert("⚠️ يرجى اختيار صورة إشعار حقيقية.");
    }
}

// إغلاق عند الضغط خارج النافذة
window.onclick = function(event) {
    if (event.target == document.getElementById('payModal')) closeModal();
}
