// دالة لتوجيه المستخدم عند الضغط على أزرار الشراء أو الشحن
function contactDev() {
    window.open("https://t.me/R_I_I_F_vip", "_blank");
}

// كود العداد التنازلي
function startTimer(duration, display) {
    let timer = duration, hours, minutes, seconds;
    setInterval(function () {
        hours = parseInt(timer / 3600, 10);
        minutes = parseInt((timer % 3600) / 60, 10);
        seconds = parseInt(timer % 60, 10);

        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = hours + ":" + minutes + ":" + seconds;

        if (--timer < 0) {
            timer = duration; 
        }
    }, 1000);
}

window.onload = function () {
    let twentyFourHours = 24 * 60 * 60; 
    let display = document.querySelector('#timer');
    startTimer(twentyFourHours, display);
};
