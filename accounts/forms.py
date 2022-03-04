from django import forms
from accounts.models import CustomUserManager, StudentAccount, WhitelistEmail
from core.utils import entry_year_generator, TUTORS
from django.contrib.admin.widgets import FilteredSelectMultiple
from django.contrib.auth import get_user_model, password_validation
from django.contrib.auth.models import Group
from django.db.models import Q
from django.utils.translation import gettext_lazy as _
from django_registration.forms import RegistrationForm
from django.contrib.auth.forms import AuthenticationForm, UsernameField, ReadOnlyPasswordHashField
from django.forms import ValidationError
from django.db import IntegrityError
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from core.utils import titles_login as titles

User = get_user_model()


def create_username(first_name, last_name):
    username = first_name.lower().strip()[0][0] + '.' + last_name.lower().replace(" ", "")
    i = 1
    while 1 > 0:
        if User.objects.filter(username=username).exists():
            username = ''.join([i for i in username if not i.isdigit()]) + str(i)
            i = i + 1
        else:
            return username


def validate_user_permissions(user):
    if user:
        return user.title in titles or user.is_staff or WhitelistEmail.objects.filter(email=user.email).exists()
    else:
        return False


class AuthentificationCustomForm(AuthenticationForm):
    error_messages = {
        'invalid_login': _(
            "Nome utente e password invalidi"
        ),
        'unauthorized': _("Non hai i permessi per effettuare l'accesso"),
        'inactive': _("Questo account è inattivo."),
        'blacklist': _("Attualmente ti trovi nella blacklist, per questo non puoi accedere")
    }
    username = UsernameField(widget=forms.TextInput(attrs={'autofocus': True}), label='Nome utente &emsp;  (n.cognome)')

    def get_invalid_login_error(self):
        try:
            user = User.objects.get(username=self.cleaned_data.get('username'))
        except User.DoesNotExist:
            user = None

        if user and not user.is_active:
            raise forms.ValidationError(
                self.error_messages['inactive'],
                code='inactive', )

        else:
            return forms.ValidationError(
                self.error_messages['invalid_login'],
                code='invalid_login',
                params={'username': self.username_field.verbose_name}, )

    def confirm_login_allowed(self, user):
        if user and user.groups.filter(name="Blacklist").exists():
            raise forms.ValidationError(
                self.error_messages['blacklist'],
                code='blacklist', )
        if user and not validate_user_permissions(user):
            User.objects.filter(pk=user.username).delete()
            raise forms.ValidationError(
                self.error_messages['unauthorized'],
                code='inactive', )


class UserAdminCreationForm(forms.ModelForm):
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Password confirmation', widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', "last_name", "is_staff", 'title', 'employeeType', 'ou')

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords don't match")
        return password2

    def clean(self):
        password = self.clean_password2()
        username = self.clean_username()
        email = self.clean_email()
        if password:
            try:
                password_validation.validate_password(password, self.instance)
            except forms.ValidationError as error:
                self.add_error('password1', error)

    def clean_username(self):
        username = self.cleaned_data.get('username')
        if User.objects.filter(username=username).exists():
            raise ValidationError("This username already exists")
        return username

    def clean_email(self):
        email = self.cleaned_data.get('email')
        email_n = CustomUserManager.normalize_email(email)
        if User.objects.filter(email=email_n).exists():
            raise ValidationError("This email is just taken")
        return email

    def save(self, commit=True):
        # Save the provided password in hashed format
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user


class UserAdminChangeForm(forms.ModelForm):
    password = ReadOnlyPasswordHashField(
        label=_("Password"),
        help_text=_(
            'Raw passwords are not stored, so there is no way to see this '
            'user’s password, but you can change the password using '
            '<a href="{}">this form</a>.'
        ),
    )

    class Meta:
        model = User
        fields = '__all__'
        field_classes = {'username': UsernameField}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        password = self.fields.get('password')
        if password:
            password.help_text = password.help_text.format('../password/')
        user_permissions = self.fields.get('user_permissions')
        if user_permissions:
            user_permissions.queryset = user_permissions.queryset.select_related('content_type')

    def clean_password(self):
        # Regardless of what the user provides, return the initial value.
        # This is done here, rather than on the field, because the
        # field does not have access to the initial value
        return self.initial.get('password')


class AccountActivationForm(forms.ModelForm):
    entry_year = forms.ChoiceField(choices=entry_year_generator(), required=True,
                                   label='Anno accademico della immatricolazione a medicina')
    tutor = forms.ChoiceField(choices=TUTORS, required=True, label='Tutor')

    data_treatment = forms.BooleanField(label="Accetti le condizioni", required=False)

    class Meta:
        model = StudentAccount
        fields = ('entry_year', 'tutor')

    def __init__(self, *args, **kwargs):
        super(AccountActivationForm, self).__init__(*args, **kwargs)
        self.fields['entry_year'].choices = entry_year_generator()
        self.fields['tutor'].choices = TUTORS

    def clean(self):
        if not self.cleaned_data.get('data_treatment'):
            raise forms.ValidationError("Devi accettare le condizioni per proseguire")


class ExStudentRegistrationForm(RegistrationForm):
    error_messages = {
        'password_mismatch': _('Le password non corrispondono'),
    }

    username = UsernameField(label='Nome utente &emsp;  (n.cognome)', required=False)
    first_name = forms.CharField(required=True, max_length=150, label='Nome')
    last_name = forms.CharField(required=True, max_length=150, label='Cognome')

    entry_year = forms.ChoiceField(choices=entry_year_generator(6), required=True,
                                   label='Anno accademico della immatricolazione a medicina')
    tutor = forms.ChoiceField(choices=TUTORS, required=True, label='Tutor')

    data_treatment = forms.BooleanField(required=True, label="Accetti le condizioni")

    class Meta:
        model = User
        fields = ('email',)

    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop("request")
        super(ExStudentRegistrationForm, self).__init__(*args, **kwargs)
        self.fields['entry_year'].choices = entry_year_generator(6)
        self.fields['tutor'].choices = TUTORS

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise ValidationError('Questa email è gia associata ad un utente')
        return email

    def clean(self):
        first_name = self.cleaned_data.get('first_name')
        last_name = self.cleaned_data.get('last_name')
        if User.objects.filter(Q(first_name=first_name), Q(last_name=last_name)).exists():
            raise ValidationError('Hai già un account')

        if not self.cleaned_data.get('data_treatment'):
            raise forms.ValidationError("Devi accettare le condizioni per proseguire")

    def save(self, commit=True):
        is_account_created = True
        user = super().save(commit=False)
        first_name = self.cleaned_data.get('first_name')
        last_name = self.cleaned_data.get('last_name')
        user.username = create_username(first_name=first_name.replace(" ", ""), last_name=last_name.replace(" ", ""))
        user.first_name = first_name
        user.last_name = last_name
        user.email = self.clean_email()
        user.title = 'Ex-Allievo ciclo unico 6 anni'
        user.employeeType = 'Corso Ordinario Ciclo Unico 6 Anni (terminato)'
        user.ou = 'Cl. Sc. Sperimentali - Medicina'
        user.is_active = False
        user.dpc = self.cleaned_data.get('data_treatment')
        if commit:
            user.save()
        try:
            StudentAccount.objects.ex_student_create(user=user, entry_year=self.cleaned_data.get('entry_year'),
                                                     tutor=self.cleaned_data.get('tutor'))
        except IntegrityError:
            try:
                a = StudentAccount.objects.get(user=user)
                a.entry_year = int(self.cleaned_data.get('entry_year'))
                a.tutor = self.cleaned_data.get('tutor')
                a.is_set_up = True
                a.save()
            except StudentAccount.DoesNotExist:
                is_account_created = False

        WhitelistEmail.objects.create(email=user.email)
        staff_users = User.objects.filter(is_staff=True)
        subject = "Registrazione dell'ex-allievo %s %s al sito MEDSSSUP" \
                  % (user.first_name, user.last_name)
        if is_account_created:
            html_message = render_to_string('accounts/staff_notification_email.html', {
                'username': user.username,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'year': user.student.get_entry_year(),
                'email': str(user.email),
                'tutor': user.student.tutor
            }, request=self.request)
            plain_message = strip_tags(html_message)
            for staff_user in staff_users:
                staff_user.email_user(subject=subject,
                                      html_message=html_message,
                                      message=plain_message)
        else:
            html_message = render_to_string('accounts/staff_notification_email.html', {
                'first_name': user.first_name,
                'last_name': user.last_name,
            }, request=self.request)
            plain_message = strip_tags(html_message)
            for staff_user in staff_users:
                staff_user.email_user(subject=subject,
                                      html_message=html_message,
                                      message=plain_message)
        return user


class GroupAdminForm(forms.ModelForm):
    class Meta:
        model = Group
        exclude = []

    # Add the users field.
    users = forms.ModelMultipleChoiceField(
        queryset=User.objects.all(),
        required=False,
        # Use the pretty 'filter_horizontal widget'.
        widget=FilteredSelectMultiple('users', False)
    )

    def __init__(self, *args, **kwargs):
        # Do the normal form initialisation.
        super(GroupAdminForm, self).__init__(*args, **kwargs)
        # If it is an existing group (saved objects have a pk).
        if self.instance.pk:
            # Populate the users field with the current Group users.
            self.fields['users'].initial = self.instance.user_set.all()

    def save_m2m(self):
        # Add the users to the Group.
        self.instance.user_set.set(self.cleaned_data['users'])

    def save(self, *args, **kwargs):
        # Default save
        instance = super(GroupAdminForm, self).save()
        # Save many-to-many data
        self.save_m2m()
        return instance
