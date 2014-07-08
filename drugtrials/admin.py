from django.contrib import admin
from django.contrib.admin.widgets import AdminURLFieldWidget
from django.db.models import URLField
from django.utils.safestring import mark_safe

from mps.base.admin import LockableAdmin
from drugtrials.models import *
from drugtrials.resource import *
from forms import *


class URLFieldWidget(AdminURLFieldWidget):
    def render(self, name, value, attrs=None):
        widget = super(URLFieldWidget, self).render(name, value, attrs)

        html = \
            u'<div style="width: 55em; height: 4em;">' \
            u'<div>' \
            u'{0}' \
            u'</div>' \
            u'<div style="float: right; z-index: 10;' \
            u' margin-top: -3em; margin-right: -25em;">' \
            u'<input type="button" ' \
            u'value="Click here to open the URL in a new window." ' \
            u'style="float: right; clear: both;" ' \
            u'onclick="window.' \
            u'open(document.getElementById(\'{1}\')' \
            u'.value)" />' \
            u'</div>' \
            u'</div>'.format(widget, attrs['id'])

        return mark_safe(html)


class SpeciesAdmin(LockableAdmin):
    list_per_page = 300
    save_on_top = True
    fieldsets = (
        (
            None, {
                'fields': (
                    'species_name',
                )
            }
        ),
        ('Change Tracking', {
            'fields': (
                'locked',
                ('created_by', 'created_on'),
                ('modified_by', 'modified_on'),
                ('signed_off_by', 'signed_off_date'),
            )
        }
        ),
    )

admin.site.register(Species, SpeciesAdmin)

# Participants information is now part of DrugTrials model
# instead of a seperate entity


class TrialSourceAdmin(LockableAdmin):
    save_on_top = True
    list_per_page = 300
    list_display = ('source_name', 'source_website', 'description')
    fieldsets = (
        (
            None, {
                'fields': (
                    'source_name',
                    'source_website',
                    'description',
                )
            }
        ),
        (
            'Change Tracking', {
                'fields': (
                    'locked',
                    ('created_by', 'created_on'),
                    ('modified_by', 'modified_on'),
                    ('signed_off_by', 'signed_off_date'),
                )
            }
        ),
    )
    actions = ['update_fields']


admin.site.register(TrialSource, TrialSourceAdmin)


class TestResultInline(admin.TabularInline):
    model = TestResult
    form = TestResultForm
    verbose_name = 'Organ Function Test'
    verbose_name_plural = 'Organ Function Test Results'
    fields = (('test_name', 'test_time', 'time_units', 'result',
               'severity', 'percent_min', 'percent_max', 'value',
               'value_units',),)
    extra = 0

    class Media(object):
        css = {"all": ("css/hide_admin_original.css",)}


class FindingResultInline(admin.TabularInline):
    model = FindingResult
    form = FindingResultForm
    verbose_name = 'Organ Finding'
    verbose_name_plural = 'Organ Findings'
    fields = (('finding_name', 'finding_time', 'time_units',
               'result', 'severity', 'percent_min', 'percent_max', 'value', 'value_units',
               'descriptor',),)
    extra = 0

    class Media(object):
        css = {"all": ("css/hide_admin_original.css",)}


class DrugTrialAdmin(LockableAdmin):

    resource_class = DrugTrialResource

    formfield_overrides = {
        URLField: {'widget': URLFieldWidget},
    }

    save_on_top = True
    list_per_page = 300
    list_display = (
        'compound', 'species', 'trial_type', 'trial_sub_type',
        'show_source_link', 'trial_date', 'locked')
    list_filter = ['trial_type', ]
    search_fields = [
        'compound__name', 'species__species_name']
    actions = ['update_fields']
    raw_id_fields = ('compound',)

    fieldsets = (
        (None, {
            'fields': (('compound', 'title'),
                       ('trial_type', 'trial_sub_type', 'trial_date'),
                       ('condition', 'description',),)
        }),
        ('Participants', {
            'fields': (
                ('species', 'gender', 'population_size',),
                ('age_min', 'age_max', 'age_average', 'age_unit',),
                ('weight_min', 'weight_max', 'weight_average', 'weight_unit'),
            )
        }),
        ('References', {
            'fields': (('source', 'references', 'source_link'),)
        }),
        ('Change Tracking', {
            'fields': (
                'locked',
                ('created_by', 'created_on'),
                ('modified_by', 'modified_on'),
                ('signed_off_by', 'signed_off_date'),
            )
        }
        ),
    )
    inlines = [TestResultInline, FindingResultInline]

    def show_source_link(self, obj):
        return '<a href="%s">%s</a>' % (obj.source_link, obj.source_link)
    show_source_link.allow_tags = True

admin.site.register(DrugTrial, DrugTrialAdmin)


class TestTypeAdmin(LockableAdmin):
    list_display = ('test_type', 'description',)
    list_per_page = 300
    save_on_top = True
    fieldsets = (
        (
            None, {
                'fields': (
                    'test_type',
                    'description',
                )
            }
        ),
        ('Change Tracking', {
            'fields': (
                'locked',
                ('created_by', 'created_on'),
                ('modified_by', 'modified_on'),
                ('signed_off_by', 'signed_off_date'),
            )
        }
        ),
    )


admin.site.register(TestType, TestTypeAdmin)


class FindingTypeAdmin(LockableAdmin):
    list_per_page = 300
    save_on_top = True
    list_display = ('finding_type', 'description')
    fieldsets = (
        (
            None, {
                'fields': (
                    'finding_type',
                    'description',
                )
            }
        ),
        ('Change Tracking', {
            'fields': (
                'locked',
                ('created_by', 'created_on'),
                ('modified_by', 'modified_on'),
                ('signed_off_by', 'signed_off_date'),
            )
        }
        ),
    )

admin.site.register(FindingType, FindingTypeAdmin)


class ResultDescriptorAdmin(LockableAdmin):
    list_per_page = 300
    save_on_top = True
    fieldsets = (
        (
            None, {
                'fields': (
                    'result_descriptor',
                )
            }
        ),
        (
            'Change Tracking', {
                'fields': (
                    'locked',
                    ('created_by', 'created_on'),
                    ('modified_by', 'modified_on'),
                    ('signed_off_by', 'signed_off_date'),
                )
            }
        ),
    )


admin.site.register(ResultDescriptor, ResultDescriptorAdmin)


class TestAdmin(LockableAdmin):
    save_on_top = True
    list_per_page = 300
    list_display = ('test_name', 'test_type', 'organ', 'test_unit',
                    'description', 'locked')
    search_fields = ['test_name', ]
    actions = ['update_fields']

    fieldsets = (
        (
            None, {
                'fields': (
                    ('organ_model', 'organ'),
                    ('test_type', 'test_name', 'test_unit'),
                    'description',
                )
            }
        ),
        (
            'Change Tracking', {
                'fields': (
                    'locked',
                    ('created_by', 'created_on'),
                    ('modified_by', 'modified_on'),
                    ('signed_off_by', 'signed_off_date'),
                )
            }
        ),
    )


admin.site.register(Test, TestAdmin)


class FindingAdmin(LockableAdmin):
    save_on_top = True
    list_per_page = 300
    list_display = ('finding_name', 'finding_type', 'organ', 'description')
    list_display_links = ('finding_name',)
    list_filter = sorted(['finding_type'])
    search_fields = ['finding_name', ]
    fieldsets = (
        (
            None, {
                'fields': (
                    'finding_name',
                    'finding_type',
                    'organ',
                    'description',
                )
            }
        ),
        (
            'Change Tracking', {
                'fields': (
                    'locked',
                    ('created_by', 'created_on'),
                    ('modified_by', 'modified_on'),
                    ('signed_off_by', 'signed_off_date'),
                )
            }
        ),
    )
    actions = ['update_fields']


admin.site.register(Finding, FindingAdmin)
