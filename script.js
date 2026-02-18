const TOKEN = '8572250361:AAEB89MDQx_QRBGQR7vTDK9v1k92_4CRxmw';
const MY_ID = '7908500383';
let currentProduct = "";

// هذه الدالة هي التي تفتح النافذة
function openPay(title, price) {
    console.log("Opening modal for: " + title); // للتأكد في المتصفح
    currentProduct = title;
    
    // ربط النصوص داخل النافذة
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalPrice').innerText = "المبلغ المطلوب: " + price + " جنيه";
    
    // إظهار النافذة
    document.getElementById('payModal').style.display = "block";
    
    // إعادة ضبط الواجهة
    document.getElementById('successArea').style.display = "none";
    document.getElementById('uploadBtn').style.display = "block";
    document.getElementById('uploadBtn').disabled = false;
    document.getElementById('uploadBtn').innerText = "📸 ارفع صورة إشعار التحويل الآن";
}

// دالة إغلاق النافذة
function closeModal() {
    document.getElementById('payModal').style.display = "none";
}

// دالة رفع الصورة والارسال للتلجرام
async function handleUpload() {
    const fileInput = document.getElementById('receiptInput');
    const file = fileInput.files[0];
    const uploadBtn = document.getElementById('uploadBtn');

    if (file) {
        uploadBtn.innerText = "⏳ جاري الإرسال...";
        uploadBtn.disabled = true;

        const formData = new FormData();
        formData.append('chat_id', MY_ID);
        formData.append('photo', file);
        formData.append('caption', `🔔 طلب جديد!\n📦 الخدمة: ${currentProduct}\n💰 المبلغ: ${document.getElementById('modalPrice').innerText}`);

        try {
            const response = await fetch(`https://api.telegram.org/bot${TOKEN}/sendPhoto`, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                uploadBtn.style.display = "none";
                document.getElementById('successArea').style.display = "block";
            } else {
                alert("❌ فشل الإرسال، تأكد من اتصال الإنترنت.");
                uploadBtn.disabled = false;
            }
        } catch (error) {
            alert("🌐 خطأ في الاتصال بالخادم.");
            uploadBtn.disabled = false;
        }
    }
}

// عداد الوقت
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
