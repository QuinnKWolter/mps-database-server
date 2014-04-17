# coding=utf-8

"""

TrackableAdmin should be the default class inheirited by other Admin modules

This class implements timestamps on each item generated including
who created the item and who last edited the item


"""

from django.contrib import admin


class TrackableAdmin(admin.ModelAdmin):
    """

    The class that all other "normal" admin classes subclass by default.

    "Normal" being defined as a class that ought to subclass admin.ModelAdmin
    However, our TrackableAdmin will provide additional user access info.

    """

    def save_model(self, request, obj, form, change):

        """

        Given a model instance save it to the database.

        Update modified_by and created_by when the model is created
        otherwise update the modified_by field since the object was saved
        and modified

        """

        if change:
            obj.modified_by = request.user
        else:
            obj.modified_by = obj.created_by = request.user
        obj.save()

    # Do not allow modification of our data but still display it:
    readonly_fields = ('created_by',
                       'created_on',
                       'modified_by',
                       'modified_on')

    class Meta(object):
        abstract = True


class LockableAdmin(TrackableAdmin):
    """

    The non-trackable Locking admin class

    Use TrackableLockableAdmin to also enable user tracking features

    """

    actions = ['enable_editing_entries', 'disable_editing_entries']

    def enable_editing_entries(self, request, queryset):
        queryset.update(locked=False)

    def disable_editing_entries(self, request, queryset):
        queryset.update(locked=True)

    class Meta(object):
        abstract = True
