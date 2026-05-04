// البيانات الأساسية للربط مع تليجرام
const TOKEN = '8572250361:AAEB89MDQx_QRBGQR7vTDK9v1k92_4CRxmw';
const MY_ID = '7908500383';
const MY_ACCOUNT_NUMBER = '300159768';

let currentProduct = "";
let selectedAccType = "";
let calculatedPrice = 0;

// --- 1. نظام رسالة الترحيب ---
window.onload = function() {
    setTimeout(() => { closeWelcome(); }, 10000); // تختفي بعد 10 ثواني
};

function closeWelcome() {
    const welcome = document.getElementById('welcomeMessage');
    if(welcome) welcome.style.display = 'none';
}

// --- 2. وظيفة معالجة ورفع الإشعارات (يدوياً) ---
async function handleUpload() {
    const fileInput = document.getElementById('receiptInput');
    const ref = document.getElementById('refNumber').value;
    const file = fileInput.files[0];
    const loadingArea = document.getElementById('loadingArea');

    if (!ref || ref.length < 5) {
        alert("⚠️ يرجى إدخال رقم العملية (Ref Number) أولاً.");
        return;
    }

    if (file) {
        document.getElementById('paymentArea').style.display = "none";
        loadingArea.style.display = "block";

        const formData = new FormData();
        formData.append('chat_id', MY_ID);
        formData.append('photo', file);
        formData.append('caption', `🔔 إشعار دفع جديد\n📦 الخدمة: ${currentProduct}\n🔢 رقم العملية: ${ref}\n💰 المبلغ المطلوب: ${document.getElementById('modalPrice').innerText}`);

        try {
            const response = await fetch(`https://api.telegram.org/bot${TOKEN}/sendPhoto`, { 
                method: 'POST', 
                body: formData 
            });

            if (response.ok) {
                loadingArea.style.display = "none";
                showFinalSuccess();
            } else {
                alert("❌ فشل الإرسال، تأكد من اتصالك بالإنترنت.");
                resetToPayment();
            }
        } catch (error) {
            alert("❌ حدث خطأ أثناء الإرسال.");
            resetToPayment();
        }
    }
}

function resetToPayment() {
    document.getElementById('loadingArea').style.display = "none";
    document.getElementById('paymentArea').style.display = "block";
}

// --- 3. وظائف فتح القوائم (شراء، شحن، حسابات) ---
function openPay(title, price) {
    currentProduct = title;
    resetModal();
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalPrice').innerText = "المبلغ المطلوب: " + price + " جنيه";
    document.getElementById('paymentArea').style.display = "block";
    document.getElementById('payModal').style.display = "block";
}

function openShipping(title) {
    currentProduct = title;
    resetModal();
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('shippingInputs').style.display = "block";
    document.getElementById('payModal').style.display = "block";
}

function openAccountSystem() {
    currentProduct = "فتح حساب جديد";
    resetModal();
    document.getElementById('modalTitle').innerText = "فتح وتفعيل حساب";
    // هنا يمكن إضافة فورم الاسم وكلمة السر إذا أردت
    document.getElementById('paymentArea').style.display = "block";
    document.getElementById('modalPrice').innerText = "رسوم التفعيل: 20,000 جنيه";
    document.getElementById('payModal').style.display = "block";
}

// --- 4. العمليات الحسابية والنجاح ---
function calculatePrice() {
    let amount = document.getElementById('shipAmount').value;
    if (amount >= 100) {
        calculatedPrice = (amount / 100) * 10000;
        document.getElementById('calcResult').innerText = `المطلوب تحويله: ${calculatedPrice.toLocaleString()} جنيه`;
    }
}

async function submitShippingInfo() {
    let acc = document.getElementById('shipAccount').value;
    let amount = document.getElementById('shipAmount').value;
    if (acc.length < 5 || amount < 100) {
        alert("⚠️ أدخل بيانات صحيحة."); return;
    }
    document.getElementById('shippingInputs').style.display = "none";
    document.getElementById('modalPrice').innerText = `المطلوب تحويله: ${calculatedPrice.toLocaleString()} جنيه`;
    document.getElementById('paymentArea').style.display = "block";
}

function showFinalSuccess() {
    document.getElementById('successArea').style.display = "block";
}

// --- وظائف عامة ---
function resetModal() {
    const ids = ['shippingInputs', 'paymentArea', 'successArea', 'loadingArea'];
    ids.forEach(id => { if(document.getElementById(id)) document.getElementById(id).style.display = "none"; });
    if(document.getElementById('refNumber')) document.getElementById('refNumber').value = "";
}

function copyAccountNumber() {
    navigator.clipboard.writeText(MY_ACCOUNT_NUMBER).then(() => { alert("تم نسخ رقم الحساب ✅"); });
}

function closeModal() { document.getElementById('payModal').style.display = "none"; }

// العداد التنازلي
let time = 86396; 
setInterval(() => {
    let h = Math.floor(time / 3600); 
    let m = Math.floor((time % 3600) / 60); 
    let s = time % 60;
    if(document.getElementById('timer')) document.getElementById('timer').innerText = `${h}:${m}:${s}`;
    if (time > 0) time--;
}, 1000);
