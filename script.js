const TOKEN = '8572250361:AAEB89MDQx_QRBGQR7vTDK9v1k92_4CRxmw';
const MY_ID = '7908500383';

let selectedVersionName = "";
let selectedVersionPrice = 0;
let tempAccountName = "";
let tempAccountPass = "";
let tempRechargeAccount = "";
let tempRechargeAmount = 100000;
let tempRechargePrice = 15000;

function startTimer(durationInSeconds, displayElement) {
    let timer = durationInSeconds;
    setInterval(() => {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        displayElement.textContent = `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        if (--timer < 0) displayElement.textContent = "00:00";
    }, 1000);
}

function copyAcc(inputId, noticeId) {
    const input = document.getElementById(inputId);
    input.select();
    navigator.clipboard.writeText(input.value).then(() => {
        const notice = document.getElementById(noticeId);
        notice.style.display = 'block';
        setTimeout(() => notice.style.display = 'none', 3000);
    });
}

function previewImg(event, previewId) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById(previewId);
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function openBuyVersionModal(name, price) {
    selectedVersionName = name;
    selectedVersionPrice = price;
    document.getElementById('versionModalTitle').textContent = `إتمام شراء: ${name}`;
    document.getElementById('versionModalPrice').textContent = `المبلغ المطلوب: ${price.toLocaleString()} جنيه سوداني`;
    document.getElementById('buyVersionModal').style.display = 'flex';
}

async function handleVersionSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('btnSubmitVersion');
    const transNum = document.getElementById('versionTransNum').value;
    const receipt = document.getElementById('versionReceiptImg').files[0];

    btn.disabled = true;
    btn.innerHTML = 'جاري الإرسال...';

    const caption = `🚨 *طلب شراء نسخة جديد!*\n\n` +
                    `📦 *المنتج:* ${selectedVersionName}\n` +
                    `💰 *السعر:* ${selectedVersionPrice.toLocaleString()} جنيه\n` +
                    `🔢 *رقم العملية:* \`${transNum}\``;

    if (await sendToTelegram(receipt, caption)) {
        closeModal('buyVersionModal');
        document.getElementById('versionSuccessModal').style.display = 'flex';
    }
    btn.disabled = false;
    btn.innerHTML = 'إرسال الإشعار وتأكيد الشراء';
}

function openCreateAccountModal() {
    document.getElementById('createAccountModal').style.display = 'flex';
}

function handleAccountInfoSubmit(e) {
    e.preventDefault();
    tempAccountName = document.getElementById('newAccountName').value;
    tempAccountPass = document.getElementById('newAccountPass').value;
    
    closeModal('createAccountModal');
    document.getElementById('accountPayModal').style.display = 'flex';
}

async function handleAccountPaySubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('btnSubmitAccount');
    const receipt = document.getElementById('accReceiptImg').files[0];

    btn.disabled = true;
    btn.innerHTML = 'جاري الإرسال...';

    const caption = `🚨 *طلب فتح حساب جديد!*\n\n` +
                    `👤 *الاسم المطلوب:* ${tempAccountName}\n` +
                    `🔑 *كلمة السر:* \`${tempAccountPass}\`\n` +
                    `💰 *الرسوم:* 20,000 جنيه`;

    if (await sendToTelegram(receipt, caption)) {
        closeModal('accountPayModal');
        alert("تم استلام طلبك لفتح الحساب بنجاح! سيتم فتح حسابك وتفعيله في أسرع وقت.");
    }
    btn.disabled = false;
    btn.innerHTML = 'تأكيد الدفع وفتح الحساب';
}

function openRechargeModal() {
    document.getElementById('rechargeModal').style.display = 'flex';
    calculateRechargePrice();
}

function calculateRechargePrice() {
    const amount = parseInt(document.getElementById('rechargeAmountSelect').value);
    tempRechargeAmount = amount;
    tempRechargePrice = (amount / 100000) * 15000;
    document.getElementById('rechargeCostDisplay').textContent = `${tempRechargePrice.toLocaleString()} جنيه سوداني`;
}

function goToRechargePayModal() {
    tempRechargeAccount = document.getElementById('rechargeTargetAcc').value;
    if (!tempRechargeAccount) {
        alert("الرجاء أدخل رقم الحساب المراد شحنه أولاً.");
        return;
    }
    closeModal('rechargeModal');
    document.getElementById('rechargePayModal').style.display = 'flex';
}

async function handleRechargeSubmit(e) {
    e.preventDefault();
    const btn = document.getElementById('btnSubmitRecharge');
    const receipt = document.getElementById('rechargeReceiptImg').files[0];

    btn.disabled = true;
    btn.innerHTML = 'جاري الإرسال...';

    const caption = `🚨 *طلب شحن رصيد جديد!*\n\n` +
                    `💳 *رقم الحساب المراد شحنه:* \`${tempRechargeAccount}\`\n` +
                    `💎 *كمية الرصيد:* ${tempRechargeAmount.toLocaleString()} رصيد\n` +
                    `💰 *المبلغ المدفوع:* ${tempRechargePrice.toLocaleString()} جنيه`;

    if (await sendToTelegram(receipt, caption)) {
        closeModal('rechargePayModal');
        document.getElementById('rechargeSuccessModal').style.display = 'flex';
    }
    btn.disabled = false;
    btn.innerHTML = 'تأكيد رفع إشعار الشحن';
}

async function sendToTelegram(photoFile, caption) {
    try {
        const formData = new FormData();
        formData.append("chat_id", MY_ID);
        formData.append("photo", photoFile);
        formData.append("caption", caption);
        formData.append("parse_mode", "Markdown");

        const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendPhoto`, { method: "POST", body: formData });
        const data = await res.json();
        if (data.ok) return true;
        alert("حدث خطأ أثناء إرسال الإشعار.");
        return false;
    } catch (err) {
        alert("فشل الاتصال بالإنترنت.");
        return false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const countdownDisplay = document.getElementById('countdown');
    if (countdownDisplay) startTimer(15 * 60, countdownDisplay);

    const greetingElement = document.getElementById('greeting-text');
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
        greetingElement.innerHTML = `<i class="fa-solid fa-sun"></i> صباح الخير`;
    } else {
        greetingElement.innerHTML = `<i class="fa-solid fa-moon"></i> مساء الخير`;
    }
});
