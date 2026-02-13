import flet as ft

# دالة لإنشاء زر الخدمة المربع (الواجهة الرئيسية)
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

    greeting = ft.Text("مساء الخير،", size=18, weight="bold", text_align=ft.TextAlign.RIGHT, margin=ft.margin.only(right=20))

    def go_to_transfers(e):
        transfers_page(page)

    services_grid = ft.Column(
        [
            ft.Row([
                create_service_button(page, "تفاصيل الحساب", ft.icons.PERSON),
                create_service_button(page, "دفع فواتير", ft.icons.RECEIPT_LONG),
                create_service_button(page, "تحويلات", ft.icons.SYNC_ALT, on_click_function=go_to_transfers),
            ], alignment=ft.MainAxisAlignment.CENTER, spacing=10),
            # يمكنك إضافة باقي الصفوف هنا بنفس الطريقة
        ],
        spacing=15,
        scroll=ft.ScrollMode.AUTO
    )

    page.add(app_bar, greeting, services_grid)
    page.update()

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
                ft.Icon(ft.icons.CHEVRON_LEFT),
                ft.Text(text, expand=True, text_align=ft.TextAlign.RIGHT),
                ft.Icon(icon, color="#8B2323"),
            ]),
            padding=15,
            border=ft.border.all(1, "#ddd"),
            border_radius=10,
            on_click=lambda _: print(text)
        )

    page.add(
        app_bar,
        ft.Column([
            create_option("تحويل لحسابات بنك الخرطوم", ft.icons.ACCOUNT_BALANCE),
            create_option("الدفع عبر الموبايل", ft.icons.PHONE_ANDROID),
        ], padding=20)
    )
    page.update()

def main(page: ft.Page):
    page.title = "Bankak Web"
    page.rtl = True # لدعم اللغة العربية بشكل صحيح
    main_dashboard(page)

# السطر الأهم للتشغيل على Render
if __name__ == "__main__":
    ft.app(target=main, view=None, port=8000)
