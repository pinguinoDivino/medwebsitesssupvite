from django.contrib import admin
from django.contrib.admin.widgets import FilteredSelectMultiple
from .models import Diary, Page
from accounts.models import USER_GROUP_DIARY as USER_GROUP
from django import forms
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model
User = get_user_model()

AUTHORS_NUMBER = 2


class DiaryForm(forms.ModelForm):

    authors = forms.ModelMultipleChoiceField(
        queryset=User.objects.filter(groups__name=USER_GROUP),
        required=True,
        label=_("autori"),
        widget=FilteredSelectMultiple(
            verbose_name=_("autori"),
            is_stacked=False))

    class Meta:
        model = Diary
        exclude = ('created_at', )

    def clean(self):
        authors = self.cleaned_data.get('authors')

        if len(authors) != AUTHORS_NUMBER:
            raise forms.ValidationError("Il numero di autori deve essere {}".format(AUTHORS_NUMBER))

        for author in authors:
            if not author.groups.filter(name=USER_GROUP):
                raise forms.ValidationError("Gli autori devono appartenere al gruppo dei {}".format(USER_GROUP))

        return self.cleaned_data


class DiaryAdmin(admin.ModelAdmin):

    form = DiaryForm

    def pages_number(self, obj):
        return obj.get_pages_number()

    def authors_full_name(self, obj):
        return ", ".join([a.__str__() for a in obj.authors.all()])

    authors_full_name.short_description = "Autori"

    pages_number.short_description = "Numero di pagine"

    readonly_fields = ['created_at', 'pages_number', 'authors_full_name']

    list_display = ['authors_full_name', 'created_at', 'pages_number']


class PageAdmin(admin.ModelAdmin):
    readonly_fields = ['created_at', 'updated_at']

    list_display = ['diary', 'created_at', 'updated_at']


admin.site.register(Diary, DiaryAdmin)
admin.site.register(Page, PageAdmin)
