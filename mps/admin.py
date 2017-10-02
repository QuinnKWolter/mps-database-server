from django.contrib import admin
from django.contrib.auth.admin import UserAdmin, GroupAdmin
from django.contrib.auth.models import User, Group


class MyUserAdmin(UserAdmin):
    """Revised User Admin interface"""
    save_on_top = True
    list_display = (
        'username',
        'email',
        'first_name',
        'last_name',
        'all_groups',
        'is_active',
        'is_staff',
        'is_superuser'
    )

    def all_groups(self, obj):
        return '<br>'.join([group.name for group in obj.groups.all().order_by('name')])

    all_groups.allow_tags = True

admin.site.unregister(User)
admin.site.register(User, MyUserAdmin)


class MyGroupAdmin(GroupAdmin):
    """Revised Group Admin interface"""
    save_on_top = True
    list_display = (
        'name',
        'all_users'
    )

    def all_users(self, obj):
        return '<br>'.join([' '.join([user.first_name, user.last_name]) for user in obj.user_set.all().order_by('username')])

    all_users.allow_tags = True

admin.site.unregister(Group)
admin.site.register(Group, MyGroupAdmin)
