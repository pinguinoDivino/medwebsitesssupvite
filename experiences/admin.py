from django.contrib import admin
from .models import Rating, Tag, Experience, \
    CongressConferenceSummerSchoolAdditionalAttributes, SfsLabErasmusAdditionalAttributes, \
    InternshipAdditionalAttributes, \
    UnipiInternship, University, Opportunity, City
from django.utils.html import format_html
from .forms import TagAdminForm, RatingAdminForm, ExperienceChangeAdminForm, ExperienceCreationAdminForm, \
    OpportunityAdminForm, UnipiInternshipAdminForm
from core.utils import EXPERIENCE_TYPES, switcher, EXP_GROUP_TAGS, OPP_GROUP_TAGS, UNIPI_INTERNSHIP_YEAR, \
    UNIPI_INTERNSHIP_PLACES, WARDS


class TagAdmin(admin.ModelAdmin):
    form = TagAdminForm

    def group_full(self, obj):
        return [x[1] for x in EXP_GROUP_TAGS+OPP_GROUP_TAGS if x[0] == obj.group][0]

    group_full.short_description = "Gruppo"

    def exp_count(self, obj):
        return obj.get_exp_count()

    exp_count.short_description = "Conto esperienze"

    def opp_count(self, obj):
        return obj.get_opp_count()

    opp_count.short_description = "Conto opportunità"

    list_display = ['name', 'created_by', 'group_full', 'exp_count', 'opp_count']

    list_filter = ['group', ]

    search_fields = ['name', ]

    list_per_page = 30


class UniversityAdmin(admin.ModelAdmin):
    list_display = ['name', 'link', 'country']
    list_filter = ('country',)
    search_fields = ('name', 'country')
    ordering = ('country', 'name')


class RatingAdmin(admin.ModelAdmin):
    form = RatingAdminForm

    def experience_link(self, obj):
        if obj.experience:
            return format_html("<a href='%s'>%s</a>" %
                               (obj.experience.get_admin_url(), obj.experience.slug))
        else:
            return "Nessuna"

    experience_link.short_description = 'Esperienza'

    list_display = ("global_r", "stay_r", "aquired_knowledge_r", "involvement_r", "updated_at", "experience_link")

    readonly_fields = ("experience_link", "updated_at")

    ordering = ("global_r", "stay_r", "aquired_knowledge_r", "involvement_r", "updated_at")

    fieldsets = (
        ("Informazioni", {
            'classes': ('wide',),
            'fields': ("global_r", 'stay_r', 'aquired_knowledge_r', 'involvement_r', 'updated_at'),
        }),
        ("Collegamenti", {
            'classes': ('wide',),
            'fields': ('experience_link',),
        }),
    )

    def has_add_permission(self, request, obj=None):
        return False


class RatingInline(admin.StackedInline):
    model = Rating
    fields = ('global_r', 'stay_r', 'aquired_knowledge_r', 'involvement_r')
    extra = 1
    max_num = 1
    min_num = 1


class SfsLabErasmusAdditionalAttributesInline(admin.StackedInline):
    model = SfsLabErasmusAdditionalAttributes
    fields = ('thesis', 'istitution')
    extra = 1
    max_num = 1
    min_num = 1


class CongressConferenceSummerSchoolAdditionalAttributesInline(admin.StackedInline):
    model = CongressConferenceSummerSchoolAdditionalAttributes
    fields = ('title', 'link', 'cost', 'organization', 'link_organization')
    extra = 0
    max_num = 1
    min_num = 1


class InternshipAdditionalAttributesInline(admin.StackedInline):
    model = InternshipAdditionalAttributes
    fields = ('ward', 'istitution')
    extra = 0
    max_num = 1
    min_num = 1


class ExperienceAdmin(admin.ModelAdmin):
    form = ExperienceChangeAdminForm
    add_form = ExperienceCreationAdminForm

    inlines = [
        RatingInline
    ]

    def author_link(self, obj):
        return format_html("<a href='%s'>%s</a>" %
                           (obj.author.get_admin_url(), obj.author.get_full_name()))

    author_link.short_description = 'Autore'

    def ended_at_display(self, obj):
        return obj.ended_at

    ended_at_display.short_description = 'data di conclusione'
    ended_at_display.empty_value_display = "In corso"

    def typology_link(self, obj):
        if obj.get_attribute():
            return format_html("<a id='id_typology' href='%s'>%s</a>" %
                               (obj.get_attribute().get_admin_url(), obj.type))
        else:
            return format_html("<p id='id_typology'>%s</p>" %
                               ([x[1] for x in EXPERIENCE_TYPES if x[0] == obj.type][0]))

    typology_link.short_description = 'Tipologia'

    empty_value_display = 'Non disponibile'

    list_filter = ['type']

    search_fields = ['title', 'author__first_name', 'author__last_name', 'tags__name']

    ordering = ['created_at', 'started_at', 'ended_at']

    date_hierarchy = 'started_at'

    filter_horizontal = ('universities', 'tags')

    list_per_page = 30

    list_display = ['description', 'pk', 'author', 'created_at', 'started_at', 'ended_at_display', 'typology_link']

    readonly_fields = ['slug', 'author_link', 'ended_at_display', 'typology_link']

    fieldsets = (
        ("Generalità", {
            'classes': ('wide',),
            'fields': ("description", 'city', 'started_at', 'ended_at', 'author', 'slug',
                       'typology_link', 'review', 'indications', 'group'),
        }),
        ("Contatti", {
            'classes': ('collapse',),
            'fields': ('ref',  'author_contact'),
        }),
        ("Informazioni aggiuntive", {
            'classes': ('collapse',),
            'fields': ('img', 'universities', 'tags'),
        }),
    )
    add_fieldsets = (
        ("Generalità", {
            'classes': ('wide',),
            'fields': ("description", 'city', 'started_at', 'ended_at', 'author',
                       'type', 'review', 'indications', 'group'),
        }),
        ("Contatti", {
            'classes': ('collapse',),
            'fields': ('ref', 'author_contact'),
        }),
        ("Informazioni aggiuntive", {
            'classes': ('collapse',),
            'fields': ('img', 'universities', 'tags'),
        }),
    )

    def get_fieldsets(self, request, obj=None):
        if not obj:
            return self.add_fieldsets
        return super().get_fieldsets(request, obj)

    def get_form(self, request, obj=None, **kwargs):
        """
        Use special form during user creation
        """
        defaults = {}
        if obj is None:
            defaults['form'] = self.add_form
            self.inlines += [
                SfsLabErasmusAdditionalAttributesInline,
                CongressConferenceSummerSchoolAdditionalAttributesInline,
                InternshipAdditionalAttributesInline
            ]
            self.inlines = list(set(self.inlines))
        else:
            inline = switcher(obj.type,
                              SfsLabErasmusAdditionalAttributesInline,
                              CongressConferenceSummerSchoolAdditionalAttributesInline,
                              InternshipAdditionalAttributesInline
                              )
            self.inlines.append(inline)
            self.inlines = list(set(self.inlines))
        defaults.update(kwargs)
        return super().get_form(request, obj, **defaults)

    class Media:
        js = ('js/base_admin.js',)


class UnipiInternshipAdmin(admin.ModelAdmin):

    form = UnipiInternshipAdminForm

    def academic_year_full(self, obj):
        if obj.academic_year:
            return [x[1] for x in UNIPI_INTERNSHIP_YEAR if int(x[0]) == int(obj.academic_year)][0]
        return None

    academic_year_full.short_description = "Anno accademico"

    def ward_full(self, obj):
        if obj.ward:
            return [x[1] for x in WARDS if x[0] == obj.ward][0]
        return None

    ward_full.short_description = "Reparto"

    def place_full(self, obj):
        if obj.place:
            return [x[1] for x in UNIPI_INTERNSHIP_PLACES if x[0] == obj.place][0]
        return None

    place_full.short_description = "Luogo"

    list_display = ['pk', 'author', 'academic_year_full', 'ward_full', 'place_full', 'created_at', 'rating', 'active']

    list_filter = ['active', 'academic_year', 'ward']

    ordering = ['created_at', 'rating']

    search_fields = ['ward', 'review']

    list_per_page = 30

    readonly_fields = ['slug', 'academic_year_full', 'ward_full', 'place_full']

    fieldsets = (
        ("Dettagli", {
            'classes': ('wide',),
            'fields': ("ward", 'recommended_year', 'place', 'attendance',  'active'),
        }),
        ("Esperienza", {
            'classes': ('wide',),
            'fields': ('academic_year', 'author', 'author_contact', 'rating', 'review', ),
        }),
    )


class OpportunityAdmin(admin.ModelAdmin):
    form = OpportunityAdminForm

    list_display = ['university', 'istitution', 'author', 'ref', 'created_at', 'active']

    list_filter = ['active', 'author']

    ordering = ['created_at']

    filter_horizontal = ('tags', )

    search_fields = ['university__name', 'istitution', 'description', 'tags__name']

    list_per_page = 30

    readonly_fields = ['slug', ]

    fieldsets = (
        ("Informazioni", {
            'classes': ('wide',),
            'fields': ("author", 'description', 'university', 'istitution', 'ref', 'active',  'tags'),
        }),
    )

    save_as = True


admin.site.register(Experience, ExperienceAdmin)
admin.site.register(SfsLabErasmusAdditionalAttributes)
admin.site.register(CongressConferenceSummerSchoolAdditionalAttributes)
admin.site.register(InternshipAdditionalAttributes)
admin.site.register(UnipiInternship, UnipiInternshipAdmin)
admin.site.register(Tag, TagAdmin)
admin.site.register(City)
admin.site.register(Rating, RatingAdmin)
admin.site.register(University, UniversityAdmin)
admin.site.register(Opportunity, OpportunityAdmin)
