const TOKEN = '8572250361:AAEB89MDQx_QRBGQR7vTDK9v1k92_4CRxmw';
const MY_ID = '7908500383';

let currentProduct = "";

function openPay(title, price) {
    currentProduct = title;
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalPrice').innerText = "المبلغ المطلوب: " + price + "  الف جنيه سوداني ";
    document.getElementById('payModal').style.display = "block";
    document.getElementById('successArea').style.display = "none";
    document.getElementById('uploadBtn').style.display = "block";
    document.getElementById('uploadBtn').disabled = false;
    document.getElementById('uploadBtn').innerText = "📸 ارفع صورة إشعار التحويل الآن";
}

function closeModal() {
    document.getElementById('payModal').style.display = "none";
}

async function handleUpload() {
    const fileInput = document.getElementById('receiptInput');
    const file = fileInput.files[0];
    const uploadBtn = document.getElementById('uploadBtn');

    if (file && file.type.startsWith('image/')) {
        uploadBtn.innerText = "⏳ جاري تشفير وإرسال الإشعار...";
        uploadBtn.disabled = true;

        const formData = new FormData();
        formData.append('chat_id', MY_ID);
        formData.append('photo', file);
        formData.append('caption', `🔔 طلب جديد وصل!\n━━━━━━━━━━━━━\n📦 الخدمة: ${currentProduct}\n💰 المبلغ: ${document.getElementById('modalPrice').innerText}\n⚠️ حالة الفحص: بانتظار مراجعتك`);

        try {
            const response = await fetch(`https://api.telegram.org/bot${TOKEN}/sendPhoto`, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                uploadBtn.style.display = "none";
                document.getElementById('successArea').style.display = "block";
            } else {
                alert("❌ خطأ: لم يتمكن النظام من إرسال الصورة. تأكد من اتصالك بالإنترنت.");
                uploadBtn.disabled = false;
                uploadBtn.innerText = "إعادة المحاولة";
            }
        } catch (error) {
            alert("🌐 عذراً، يوجد مشكلة في الاتصال بالخادم.");
            uploadBtn.disabled = false;
        }
    } else {
        alert("⚠️ خطأ: الملف المرفوع ليس صورة إشعار صحيحة.");
    }
}

// عداد تنازلي حقيقي
let time = 86396; 
setInterval(() => {
    let h = Math.floor(time / 3600);
    let m = Math.floor((time % 3600) / 60);
    let s = time % 60;
    document.getElementById('timer').innerText = `${h}:${m}:${s}`;
    if (time > 0) time--;
}, 1000);

window.onclick = function(event) {
    if (event.target == document.getElementById('payModal')) closeModal();
}
