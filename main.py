import flet as ft

# دالة لإنشاء زر الخدمة المربع
def create_service_button(page, text, icon, on_click_function=None):
    return ft.Container(
        content=ft.Column(
            [
                ft.Icon(icon, color="white", size=40),
                ft.Text(text, color="white", size=12, text_align=ft.TextAlign.CENTER),
            ],
            alignment=ft.MainAxisAlignment.CENTER,
            horizontal_alignment=ft.CrossAxisAlignment.CENTER,
            spacing=5
        ),
        width=100,
        height=100,
        bgcolor="#3f51b5", # لون أزرق للزر
        border_radius=ft.border_radius.all(10),
        alignment=ft.alignment.center,
        on_click=lambda e: on_click_function(e) if on_click_function else None,
        data=text # لتحديد الزر الذي تم الضغط عليه
    )

def main_dashboard(page: ft.Page):
    page.title = "Bankak - بنكك"
    page.theme_mode = ft.ThemeMode.LIGHT
    page.window_width = 380  # عرض مناسب لشاشة الموبايل
    page.window_height = 700 # طول مناسب
    page.padding = 0
    page.vertical_alignment = ft.CrossAxisAlignment.START # للبدء من الأعلى

    def navigate_to_transfers(e):
        # هذه الدالة ستغير الواجهة إلى "التحويلات"
        # نحتاج لإعادة تحميل الصفحة أو استخدام Routing
        # لتبسيط الأمر، حاليا سنطبع رسالة
        print("Navigate to Transfers Page!")
        page.clean() # لتنظيف المحتوى القديم
        transfers_page(page) # استدعاء واجهة التحويلات


    # رأس التطبيق (بنكك والزر الجانبي)
    app_bar = ft.Container(
        content=ft.Row([
            ft.IconButton(ft.icons.MENU, icon_color="white"),
            ft.Text("bankak", color="white", size=24, weight="bold", expand=True, text_align=ft.TextAlign.CENTER),
            ft.IconButton(ft.icons.NOTIFICATIONS, icon_color="white"), # ممكن نضيف زر إشعارات
        ], alignment=ft.MainAxisAlignment.SPACE_BETWEEN),
        bgcolor="#8B2323", # اللون الأحمر المميز
        padding=ft.padding.only(left=10, right=10, top=10, bottom=10),
        height=60,
        alignment=ft.alignment.center
    )

    # رسالة الترحيب
    greeting_message = ft.Text(
        "مساء الخير،",
        size=18,
        weight="bold",
        text_align=ft.TextAlign.RIGHT,
        margin=ft.margin.only(right=20, top=10)
    )

    # شبكة الأزرار
    services_grid = ft.Column(
        [
            ft.Row(
                [
                    create_service_button(page, "تفاصيل الحساب", ft.icons.PERSON),
                    create_service_button(page, "دفع فواتير", ft.icons.RECEIPT_LONG),
                    create_service_button(page, "تحويلات", ft.icons.SYNC_ALT, on_click_function=navigate_to_transfers),
                ],
                alignment=ft.MainAxisAlignment.SPACE_EVENLY,
                spacing=10
            ),
            ft.Row(
                [
                    create_service_button(page, "سحب بدون بطاقة", ft.icons.ATM),
                    create_service_button(page, "بنكك PAY", ft.icons.PAYMENT),
                    create_service_button(page, "الودائع الاستثمارية", ft.icons.MONEY),
                ],
                alignment=ft.MainAxisAlignment.SPACE_EVENLY,
                spacing=10
            ),
            ft.Row(
                [
                    create_service_button(page, "ادارة المستفيدين", ft.icons.ADD_CIRCLE),
                    create_service_button(page, "المعاملات السابقة", ft.icons.HISTORY),
                    create_service_button(page, "ادارة البطاقات", ft.icons.CREDIT_CARD),
                ],
                alignment=ft.MainAxisAlignment.SPACE_EVENLY,
                spacing=10
            ),
            ft.Row(
                [
                    create_service_button(page, "الطلبات", ft.icons.DESCRIPTION),
                    create_service_button(page, "ام رفع دائم", ft.icons.CHECK_CIRCLE), # غيرت النص للتبسيط
                    create_service_button(page, "الضبط", ft.icons.SETTINGS),
                ],
                alignment=ft.MainAxisAlignment.SPACE_EVENLY,
                spacing=10
            ),
        ],
        alignment=ft.MainAxisAlignment.START,
        horizontal_alignment=ft.CrossAxisAlignment.CENTER,
        spacing=15,
        expand=True,
        margin=ft.margin.only(top=20, bottom=20)
    )
    
    # إضافة كل العناصر للصفحة
    page.add(
        app_bar,
        greeting_message,
        services_grid
    )
    page.update() # تحديث الصفحة


# الملف الثاني: `transfers.py` (واجهة التحويلات)
# سنقوم بدمجها في نفس الملف main.py لتبسيط النشر على Render
def transfers_page(page: ft.Page):
    page.title = "Bankak - تحويلات"
    page.theme_mode = ft.ThemeMode.LIGHT
    page.window_width = 380
    page.window_height = 700
    page.padding = 0
    page.vertical_alignment = ft.CrossAxisAlignment.START

    def go_back(e):
        page.clean()
        main_dashboard(page) # العودة للواجهة الرئيسية

    app_bar = ft.Container(
        content=ft.Row([
            ft.IconButton(ft.icons.MENU, icon_color="white"),
            ft.Text("bankak", color="white", size=24, weight="bold", expand=True, text_align=ft.TextAlign.CENTER),
            ft.IconButton(ft.icons.NOTIFICATIONS, icon_color="white"),
        ], alignment=ft.MainAxisAlignment.SPACE_BETWEEN),
        bgcolor="#8B2323",
        padding=ft.padding.only(left=10, right=10, top=10, bottom=10),
        height=60,
        alignment=ft.alignment.center
    )

    # زر الرجوع
    back_button_row = ft.Container(
        content=ft.Row([
            ft.ElevatedButton(
                content=ft.Row([
                    ft.Icon(ft.icons.ARROW_BACK),
                    ft.Text("رجوع", size=16),
                ]),
                on_click=go_back,
                bgcolor=ft.colors.GREY_100,
                color=ft.colors.BLACK,
                style=ft.ButtonStyle(
                    shape=ft.RoundedRectangleBorder(radius=5),
                    padding=10
                )
            )
        ], alignment=ft.MainAxisAlignment.END),
        padding=ft.padding.only(right=20, top=10)
    )

    # عنوان الواجهة
    transfers_title = ft.Text(
        "تحويلات",
        size=24,
        weight="bold",
        text_align=ft.TextAlign.RIGHT,
        margin=ft.margin.only(right=20, top=10, bottom=20)
    )

    # دالة لإنشاء زر خيار التحويل
    def create_transfer_option(text, icon):
        return ft.Container(
            content=ft.Row([
                ft.Icon(ft.icons.CHEVRON_LEFT, color=ft.colors.GREY_600),
                ft.Text(text, size=16, expand=True, text_align=ft.TextAlign.RIGHT),
                ft.Icon(icon, color="#8B2323", size=30),
            ], alignment=ft.MainAxisAlignment.END),
            padding=ft.padding.symmetric(horizontal=15, vertical=10),
            border=ft.border.all(1, ft.colors.GREY_300),
            border_radius=ft.border_radius.all(10),
            margin=ft.margin.only(bottom=15),
            bgcolor=ft.colors.WHITE,
            on_click=lambda e: print(f"Clicked on {text}")
        )

    page.add(
        app_bar,
        back_button_row,
        transfers_title,
        ft.Container(
            content=ft.Column(
                [
                    create_transfer_option("تحويل لحسابات بنك الخرطوم", ft.icons.ACCOUNT_BALANCE),
                    create_transfer_option("الدفع عبر الموبايل", ft.icons.PHONE_ANDROID),
                    create_transfer_option("تحويل لبنك آخر (باستخدام رقم البطاقة)", ft.icons.CREDIT_CARD),
                ],
                alignment=ft.MainAxisAlignment.START,
                horizontal_alignment=ft.CrossAxisAlignment.CENTER,
                spacing=10,
                expand=True,
                margin=ft.margin.only(left=20, right=20)
            ),
            expand=True
        )
    )
    page.update()

# دالة لتحديد الواجهة الأولية عند بدء التطبيق
def app_router(page: ft.Page):
    if not page.route: # إذا لم يكن هناك مسار محدد، ابدأ بالواجهة الرئيسية
        main_dashboard(page)
    else: # يمكنك إضافة مسارات أخرى هنا لاحقا
        main_dashboard(page)

# تشغيل التطبيق كمتصفح ويب
ft.app(target=app_router, view=ft.AppView.WEB_BROWSER, port=8000)
