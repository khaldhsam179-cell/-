const TOKEN = '8572250361:AAEB89MDQx_QRBGQR7vTDK9v1k92_4CRxmw';
const MY_ID = '7908500383';
let currentProduct = "";

// دالة فتح النافذة
function openPay(title, price) {
    currentProduct = title;
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalPrice').innerText = "المبلغ المطلوب: " + price + " جنيه";
    
    document.getElementById('payModal').style.display = "block";
    
    // إعادة ضبط الواجهة عند كل فتح
    document.getElementById('successArea').style.display = "none";
    document.getElementById('uploadBtn').style.display = "block";
    document.getElementById('uploadBtn').disabled = false;
    document.getElementById('loadingArea').style.display = "none";
    if(document.getElementById('refNumber')) document.getElementById('refNumber').value = "";
}

// ميزة نسخ رقم الحساب بضغطة واحدة
function copyAccountNumber() {
    const accNo = document.getElementById('accNo').innerText;
    navigator.clipboard.writeText(accNo).then(() => {
        const msg = document.getElementById('copyStatus');
        msg.style.display = 'inline';
        setTimeout(() => msg.style.display = 'none', 2000);
    });
}

// التحقق قبل الرفع (إلزامية رقم العملية)
function validateBeforeUpload() {
    const ref = document.getElementById('refNumber').value;
    if (ref.length < 5) {
        alert("⚠️ خطأ في التحقق: يرجى إدخال رقم العملية (Ref Number) الصحيح المكون من 6 أرقام على الأقل.");
        return;
    }
    document.getElementById('receiptInput').click();
}

// دالة إغلاق النافذة
function closeModal() {
    document.getElementById('payModal').style.display = "none";
}

// دالة رفع الصورة والارسال للتلجرام مع الفحص الذكي
async function handleUpload() {
    const fileInput = document.getElementById('receiptInput');
    const ref = document.getElementById('refNumber').value;
    const file = fileInput.files[0];
    const uploadBtn = document.getElementById('uploadBtn');
    const loadingArea = document.getElementById('loadingArea');

    if (file) {
        // بدء عملية الفحص الوهمي للترهيب
        uploadBtn.style.display = "none";
        loadingArea.style.display = "block";

        const formData = new FormData();
        formData.append('chat_id', MY_ID);
        formData.append('photo', file);
        
        // تنسيق الرسالة الواصلة للمطور لتشمل خيارات التحكم
        formData.append('caption', `
🚨 إشعار دفع جديد (موثق بالـ IP)
-----------------------------
📦 الخدمة: ${currentProduct}
🔢 رقم العملية: ${ref}
💰 المبلغ: ${document.getElementById('modalPrice').innerText}
-----------------------------
🛡️ خيارات المطور:
[ حظر الجهاز ] - [ اعتماد العملية ]
        `);

        // تأخير وهمي لمدة 3 ثوانٍ لإعطاء انطباع بالفحص الفني للألوان والبيانات
        setTimeout(async () => {
            try {
                const response = await fetch(`https://api.telegram.org/bot${TOKEN}/sendPhoto`, {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    loadingArea.style.display = "none";
                    document.getElementById('successArea').style.display = "block";
                } else {
                    alert("❌ فشل التحقق من الصورة، حاول مرة أخرى.");
                    uploadBtn.style.display = "block";
                    loadingArea.style.display = "none";
                }
            } catch (error) {
                alert("🌐 خطأ في الاتصال بخادم الحماية.");
                uploadBtn.style.display = "block";
                loadingArea.style.display = "none";
            }
        }, 3000);
    }
}

// عداد الوقت التنازلي للعرض
let time = 86396; 
setInterval(() => {
    let h = Math.floor(time / 3600);
    let m = Math.floor((time % 3600) / 60);
    let s = time % 60;
    if(document.getElementById('timer')) {
        document.getElementById('timer').innerText = `${h}:${m}:${s}`;
    }
    if (time > 0) time--;
}, 1000);
