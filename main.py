import flet as ft

# =========================
# دالة إنشاء الأزرار (الشاشة الرئيسية)
# =========================
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
        bgcolor="#3f51b5",
        border_radius=ft.border_radius.all(10),
        alignment=ft.alignment.center,
        on_click=lambda e: on_click_function(e) if on_click_function else None,
    )

# =========================
# واجهة لوحة التحكم الرئيسية
# =========================
def main_dashboard(page: ft.Page):
    page.clean()
    
    # رأس التطبيق
    app_bar = ft.Container(
        content=ft.Row([
            ft.IconButton(ft.icons.MENU, icon_color="white"),
            ft.Text("bankak", color="white", size=24, weight="bold", expand=True, text_align=ft.TextAlign.CENTER),
            ft.IconButton(ft.icons.NOTIFICATIONS, icon_color="white"),
        ], alignment=ft.MainAxisAlignment.SPACE_BETWEEN),
        bgcolor="#8B2323",
        padding=10,
        height=70,
    )

    greeting = ft.Container(
        content=ft.Text("مساء الخير،", size=18, weight="bold", text_align=ft.TextAlign.RIGHT),
        padding=ft.padding.only(right=20, top=10)
    )

    def go_to_transfers(e):
        transfers_page(page)

    # شبكة الخدمات
    services_grid = ft.Column(
        [
            ft.Row([
                create_service_button(page, "تفاصيل الحساب", ft.icons.PERSON),
                create_service_button(page, "دفع فواتير", ft.icons.RECEIPT_LONG),
                create_service_button(page, "تحويلات", ft.icons.SYNC_ALT, on_click_function=go_to_transfers),
            ], alignment=ft.MainAxisAlignment.CENTER, spacing=10),
            ft.Row([
                create_service_button(page, "سحب بدون بطاقة", ft.icons.ATM),
                create_service_button(page, "بنكك PAY", ft.icons.PAYMENT),
                create_service_button(page, "الودائع الاستثمارية", ft.icons.MONEY),
            ], alignment=ft.MainAxisAlignment.CENTER, spacing=10),
        ],
        spacing=15,
        scroll=ft.ScrollMode.AUTO,
        expand=True
    )

    page.add(app_bar, greeting, services_grid)
    page.update()

# =========================
# واجهة التحويلات
# =========================
def transfers_page(page: ft.Page):
    page.clean()
    
    app_bar = ft.Container(
        content=ft.Row([
            ft.IconButton(ft.icons.ARROW_BACK, icon_color="white", on_click=lambda _: main_dashboard(page)),
            ft.Text("تحويلات", color="white", size=20, weight="bold", expand=True, text_align=ft.TextAlign.CENTER),
            ft.Container(width=40) 
        ]),
        bgcolor="#8B2323",
        padding=10,
    )

    def create_option(text, icon):
        return ft.Container(
            content=ft.Row([
                ft.Icon(ft.icons.CHEVRON_LEFT, color=ft.colors.GREY_400),
                ft.Text(text, expand=True, text_align=ft.TextAlign.RIGHT, size=16),
                ft.Icon(icon, color="#8B2323", size=30),
            ], alignment=ft.MainAxisAlignment.END),
            padding=15,
            border=ft.border.all(1, "#ddd"),
            border_radius=10,
            margin=ft.margin.only(bottom=10),
            on_click=lambda _: print(f"تم اختيار: {text}")
        )

    page.add(
        app_bar,
        ft.Container(
            content=ft.Column([
                create_option("تحويل لحسابات بنك الخرطوم", ft.icons.ACCOUNT_BALANCE),
                create_option("الدفع عبر الموبايل", ft.icons.PHONE_ANDROID),
                create_option("تحويل لبنك آخر", ft.icons.CREDIT_CARD),
            ], spacing=10),
            padding=20
        )
    )
    page.update()

# =========================
# نقطة الدخول الرئيسية (مهمة لـ Render)
# =========================
def main(page: ft.Page):
    page.title = "Bankak App"
    page.rtl = True  # دعم العربية
    page.theme_mode = ft.ThemeMode.LIGHT
    # إعدادات العرض للويب
    page.window_width = 400
    page.window_height = 800
    
    main_dashboard(page)

if __name__ == "__main__":
    # هذا السطر تم تعديله ليعمل على بورت 8000 وبدون فتح نافذة متصفح داخل السيرفر
    ft.app(target=main, view=None, port=8000)
