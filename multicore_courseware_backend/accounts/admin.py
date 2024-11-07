from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as DefaultUserAdmin
from django.utils.translation import gettext_lazy as _

User = get_user_model()

@admin.register(User)
class CustomUserAdmin(DefaultUserAdmin):
    fieldsets = (
        (
            None,
            {"fields": ("mobile", "first_name", "last_name", "email", "password")},
        ),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "user_permissions",
                ),
            },
        ),
        (_("Important dates"), {"fields": ("date_joined",)}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "mobile",
                    "first_name",
                    "last_name",
                    "email",
                    "password1",
                    "password2",
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "user_permissions",
                ),
            },
        ),
    )
    list_display = [
        "id",
        "mobile",
        "first_name",
        "is_active",
        "is_staff",
        "is_superuser",
    ]
    list_display_links = [
        "id",
        "first_name",
        "mobile",
        "is_active",
        "is_staff",
        "is_superuser",
    ]
    list_filter = [
        "is_staff",
        "is_superuser",
        "is_active",
    ]
    search_fields = ["mobile", "first_name", "last_name"]
    readonly_fields = ["last_login", "date_joined"]
    ordering = ["mobile"]
    exclude = ["username"]

