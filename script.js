// ضع هنا معلومات البوت الخاص بك لتصلك الرسائل
const TELEGRAM_TOKEN = 'ضع_هنا_توكن_البوت'; 
const CHAT_ID = 'ضع_هنا_ايدي_حسابك';

let currentItem = "";

function openTrade(name, price) {
    currentItem = name;
    document.getElementById('itemTitle').innerText = name;
    document.getElementById('itemPrice').innerText = "السعر: " + price + " جنيه";
    document.getElementById('paymentModal').style.display = "block";
}

function closeModal() {
    document.getElementById('paymentModal').style.display = "none";
}

function submitOrder() {
    const fileInput = document.getElementById('receiptImg');
    
    if (fileInput.files.length === 0) {
        alert("الرجاء رفع صورة الإشعار أولاً!");
        return;
    }

    // رسالة النجاح للعميل
    alert("✅ تم رفع الإشعار بنجاح! سيتم التواصل معك عبر التلجرام.");
    
    // إرسال البيانات للتلجرام تلقائياً
    sendToAdmin(fileInput.files[0]);
    
    closeModal();
}

function sendToAdmin(photo) {
    const formData = new FormData();
    formData.append('chat_id', CHAT_ID);
    formData.append('photo', photo);
    formData.append('caption', `🚨 طلب جديد: ${currentItem}\n💰 الحساب: ماي كاش`);

    fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendPhoto`, {
        method: 'POST',
        body: formData
    });
}
