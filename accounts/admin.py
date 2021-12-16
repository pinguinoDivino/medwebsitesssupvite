import types

from django.contrib import admin
from django.contrib.admin.forms import AdminAuthenticationForm

from .models import CustomUser, WhitelistEmail, StudentAccount, TutorAccount
from .forms import UserAdminChangeForm, UserAdminCreationForm, GroupAdminForm
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import Group
from django.contrib.auth.forms import AdminPasswordChangeForm
from .signals import post_signal


class CustomUserAdmin(BaseUserAdmin):
    form = UserAdminChangeForm
    add_form = UserAdminCreationForm
    change_password_form = AdminPasswordChangeForm

    list_display = ('username', 'email', 'first_name', 'last_name', 'ou', 'last_login', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_active')
    fieldsets = (
        ("User", {'fields': ('username', 'email', 'password')}),
        ('Anagrafica', {'fields': ('first_name', 'last_name')}),
        ('Ruolo', {'fields': ('title', 'employeeType', 'ou')}),
        ('Attività', {'fields': ('date_joined', 'last_login', 'is_active', 'is_staff', 'groups', 'user_permissions')}),
        ('Informazioni aggiuntive', {'fields': ('is_user_disabled_by_school',)})
    )

    readonly_fields = ['date_joined', 'last_login']

    add_fieldsets = (
        ("User", {
            'classes': ('wide',),
            'fields': ('username', 'email', 'first_name', "last_name", 'password1', 'password2', 'is_staff'),
        }),
    )
    search_fields = ('username', 'email', 'ou')
    ordering = ('username', 'email', 'date_joined', 'last_login')

    list_per_page = 50

    def save_model(self, request, obj, form, change):
        if not change and form.has_changed():
            super().save_model(request, obj, form, change)
            post_signal.send(self.__class__, instance=obj, change=change, updatedfields=form.changed_data,
                             request=request)
        elif change and form.has_changed():
            super().save_model(request, obj, form, change)
            post_signal.send(self.__class__, instance=obj, change=change, updatedfields=form.changed_data,
                             request=request)
        elif change and not form.has_changed():
            pass


class GroupAdmin(admin.ModelAdmin):
    form = GroupAdminForm
    filter_horizontal = ['permissions']


class StudentAccountAdmin(admin.ModelAdmin):

    def get_year(self, obj):
        return obj.get_year()

    def get_entry_year(self, obj):
        return obj.get_entry_year()

    get_year.short_description = 'Anno accademico'
    get_entry_year.short_description = 'Anno di iscrizione a medicina'

    list_display = ('user', 'get_entry_year', 'get_year', 'tutor', 'is_set_up')
    list_filter = ('is_set_up',)

    search_fields = ('user__username', 'tutor', 'entry_year')
    readonly_fields = ('get_year', 'get_entry_year')


class TutorAccountAdmin(admin.ModelAdmin):
    list_display = ('user',)

    search_fields = ('user__username',)


admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(WhitelistEmail)
admin.site.unregister(Group)
admin.site.register(Group, GroupAdmin)
admin.site.register(StudentAccount, StudentAccountAdmin)
admin.site.register(TutorAccount, TutorAccountAdmin)


# override default admin site


def has_permission(self, request):
    return request.user.is_active and (request.user.is_staff or request.user.groups.filter(name='rappset').exists())


class GroupAdminAuthenticationForm(AdminAuthenticationForm):
    def confirm_login_allowed(self, user):
        if user.groups.filter(name="rappset").exists():
            user.is_staff = True
        super().confirm_login_allowed(user)


admin.site.site_header = 'Pannello di Amministrazione'
admin.site.index_title = 'Amministrazione'
admin.site.login_form = GroupAdminAuthenticationForm
admin.site.has_permission = types.MethodType(has_permission, admin.site)
