from django import forms
from accounts.models import StudentAccount, CustomUser
from .models import Experience, Rating, Tag, Opportunity, University, UnipiInternship
from django.utils import timezone
from core.utils import EXPERIENCE_TYPES, EXP_GROUP_TAGS, OPP_GROUP_TAGS, WARDS, UNIPI_INTERNSHIP_YEAR, \
    ATTENDANCE_CHOICES, UNIPI_INTERNSHIP_PLACES


def removeFirstDuplicatesFromNestedListOnIndex(arr):
    # TODO update
    return list(set(map(lambda i: tuple(sorted(i)), arr)))


class TagAdminForm(forms.ModelForm):
    group = forms.ChoiceField(choices=list(set(EXP_GROUP_TAGS + OPP_GROUP_TAGS)))

    class Meta:
        model = Tag
        fields = ('name', 'created_by')


class RatingAdminForm(forms.ModelForm):
    global_r = forms.IntegerField(max_value=10, min_value=0, label="Valutazione globale")
    stay_r = forms.IntegerField(max_value=10, min_value=0, label="Valutazione istituzione")
    aquired_knowledge_r = forms.IntegerField(max_value=10, min_value=0, label="Valutazione conoscenza acquisita")
    involvement_r = forms.IntegerField(max_value=10, min_value=0, label="Valutazione coinvolgimento")

    class Meta:
        model = Rating
        fields = ('global_r', 'stay_r', 'aquired_knowledge_r', "involvement_r")


class ExperienceCreationAdminForm(forms.ModelForm):
    type = forms.ChoiceField(choices=EXPERIENCE_TYPES, label="Tipologia")
    group = forms.ChoiceField(label="Gruppo", required=False)

    class Meta:
        model = Experience
        fields = (
            'started_at', 'ended_at', 'type', "city", "description", "review", "indications", 'img', 'ref', 'ref_email',
            'author', 'author_contact', 'tags', 'universities'
        )

    def __init__(self, *args, **kwargs):
        super(ExperienceCreationAdminForm, self).__init__(*args, **kwargs)
        self.fields['author'].queryset = StudentAccount.objects.filter(is_set_up=True)
        choices = [[x.group, x.description] for x in Experience.objects.order_by('created_at')]
        self.fields['group'].choices = tuple([(None, "Nuovo gruppo")] +
                                             removeFirstDuplicatesFromNestedListOnIndex(choices))
        self.fields['tags'].queryset = Tag.objects.filter(group__in=[x[0] for x in EXP_GROUP_TAGS])

    def clean_started_at(self):
        if self.cleaned_data.get("started_at"):
            if self.cleaned_data.get('started_at') > timezone.datetime.now().date():
                raise forms.ValidationError("La data di inizio dell'esperienza può "
                                            "al massimo coincidere con quella di oggi")
        else:
            raise forms.ValidationError("Campo obbligatorio.")
        return self.cleaned_data.get('started_at')

    def clean(self):
        if self.cleaned_data.get("ended_at"):
            if self.clean_started_at() > self.cleaned_data.get("ended_at"):
                raise forms.ValidationError('La data di inizio non può essere più recente di quella di fine')


class ExperienceChangeAdminForm(forms.ModelForm):
    group = forms.ChoiceField(label="Gruppo", required=False)

    class Meta:
        model = Experience
        fields = (
            'started_at', 'ended_at', 'type', "city", "description", "review", "indications", 'img', 'ref', 'ref_email',
            'author', 'author_contact', 'tags', 'universities'
        )

    def __init__(self, *args, **kwargs):
        super(ExperienceChangeAdminForm, self).__init__(*args, **kwargs)
        self.fields['author'].queryset = StudentAccount.objects.filter(is_set_up=True)
        self.fields['group'].choices = [[x.group, x.description] for x in Experience.objects.all()]
        self.fields['tags'].queryset = Tag.objects.filter(group__in=[x[0] for x in EXP_GROUP_TAGS])

    def clean_started_at(self):
        if self.cleaned_data.get("started_at"):
            if self.cleaned_data.get('started_at') > timezone.datetime.now().date():
                raise forms.ValidationError("La data di inizio dell'esperienza può "
                                            "al massimo coincidere con quella di oggi")
        else:
            raise forms.ValidationError("Campo obbligatorio.")
        return self.cleaned_data.get('started_at')

    def clean(self):
        if self.cleaned_data.get("ended_at"):
            if self.clean_started_at() > self.cleaned_data.get("ended_at"):
                raise forms.ValidationError('La data di inizio non può essere più recente di quella di fine')


class UnipiInternshipAdminForm(forms.ModelForm):
    academic_year = forms.ChoiceField(choices=UNIPI_INTERNSHIP_YEAR, label="Anno accademico svolto")
    recommended_year = forms.ChoiceField(choices=UNIPI_INTERNSHIP_YEAR, label="Anno accademico consigliato")
    attendance = forms.ChoiceField(choices=ATTENDANCE_CHOICES, label="Presenze")
    place = forms.ChoiceField(choices=UNIPI_INTERNSHIP_PLACES, label="Luogo")
    ward = forms.ChoiceField(choices=WARDS, label="Reparto")
    rating = forms.IntegerField(min_value=0, max_value=10, label='Valutazione')

    class Meta:
        model = UnipiInternship
        fields = ('author', 'review', 'author_contact', 'active')


class OpportunityAdminForm(forms.ModelForm):
    university = forms.ModelChoiceField(queryset=University.objects.all(), label='Università')

    class Meta:
        model = Opportunity
        fields = ('author', 'description', 'istitution', 'ref', 'active')

    def __init__(self, *args, **kwargs):
        super(OpportunityAdminForm, self).__init__(*args, **kwargs)
        pks = [x.username for x in CustomUser.objects.all() if x.is_auth2]
        self.fields['author'].queryset = CustomUser.objects.filter(pk__in=pks)
        self.fields['tags'].queryset = Tag.objects.filter(group__in=[x[0] for x in OPP_GROUP_TAGS])

