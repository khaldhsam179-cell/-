function showOrder(name, price) {
    document.getElementById('modalTitle').innerText = name;
    document.getElementById('modalPrice').innerText = "السعر: " + price;
    document.getElementById('orderModal').style.display = "block";
}

function closeModal() {
    document.getElementById('orderModal').style.display = "none";
}

function finishOrder() {
    const phone = document.getElementById('userPhone').value;
    const file = document.getElementById('userFile').value;

    if (phone === "" || file === "") {
        alert("الرجاء إدخال رقم حسابك ورفع صورة الإشعار");
    } else {
        alert("✅ تم رفع الإشعار بنجاح!");
        closeModal();
    }
}

// كود العداد التنازلي البسيط
let timer = 7200;
setInterval(() => {
    let h = Math.floor(timer / 3600);
    let m = Math.floor((timer % 3600) / 60);
    let s = timer % 60;
    document.getElementById('timer').innerHTML = `${h}:${m}:${s}`;
    if (timer > 0) timer--;
}, 1000);
