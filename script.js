function openPayment(name, price) {
    document.getElementById('itemTitle').innerText = name;
    document.getElementById('itemPrice').innerText = "السعر المعتمد: " + price;
    document.getElementById('payModal').style.display = "block";
}

function closeModal() {
    document.getElementById('payModal').style.display = "none";
}

function confirmOrder() {
    const acc = document.getElementById('accNum').value;
    const file = document.getElementById('fileUp').value;

    if(acc === "" || file === "") {
        alert("يا بطل، الرجاء إدخال رقم حسابك ورفع صورة الإشعار أولاً!");
    } else {
        alert("✅ تم رفع الإشعار بنجاح! جاري المراجعة من قبل الإدارة.");
        closeModal();
    }
}

// إغلاق النافذة عند الضغط خارجها
window.onclick = function(event) {
    let modal = document.getElementById('payModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
