from django.contrib.auth.validators import UnicodeUsernameValidator
from django.core.mail import send_mail
from django.db import IntegrityError
from django.db.models import Q
from core.utils import entry_year_generator, YEAR_DICT
from django.utils import timezone
from django.conf import settings
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, UserManager, PermissionsMixin
from django.utils.translation import gettext_lazy as _
from django.urls import reverse
from django.contrib.contenttypes.models import ContentType


class CustomUserManager(UserManager):
    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('title', 'Amministratore')
        extra_fields.setdefault('employeeType', 'Amministratore')
        extra_fields.setdefault('ou', 'Amministratore sito')
        extra_fields.setdefault('is_user_disabled_by_school', "Non è un account di Scuola")
        extra_fields.setdefault('first_name', 'Amministratore')
        extra_fields.setdefault('last_name', 'del Sito')

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))

        return self._create_user(username, email, password, **extra_fields)


class StudentAccountManager(models.Manager):
    def create(self, user):
        if StudentAccount.objects.filter(user=user).exists():
            raise IntegrityError()
        account = self.model(user=user)
        account.save(using=self._db)
        account.save()
        return account

    def ex_student_create(self, user, entry_year, tutor):
        account = self.create(user=user)
        account.entry_year = entry_year
        account.tutor = tutor
        account.is_set_up = True
        account.save()

    def complete(self, user, entry_year, tutor):
        account = user.account
        if account.is_set_up:
            raise ValueError("L'account %s è già stato configurato".format(account))
        account.entry_year = entry_year
        account.tutor = tutor
        account.is_set_up = True
        account.save()


class TutorAccountManager(models.Manager):
    def create(self, user):
        if TutorAccount.objects.filter(user=user).exists():
            raise IntegrityError()
        account = self.model(user=user)
        account.save(using=self._db)
        account.save()
        return account


class CustomUser(AbstractBaseUser, PermissionsMixin):
    username_validator = UnicodeUsernameValidator()
    username = models.CharField(
        _('username'),
        max_length=150,
        primary_key=True,
        help_text=_('Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.'),
        validators=[username_validator],
        error_messages={
            'unique': _("A user with that username already exists."),
        },
    )
    first_name = models.CharField(_('nome'), max_length=150, blank=True)
    last_name = models.CharField(_('cognome'), max_length=150, blank=True)
    email = models.EmailField(_('email'), blank=True)
    is_staff = models.BooleanField(
        _('staff status'),
        default=False,
        help_text=_('Designates whether the user can log into this admin site.'),
    )
    is_active = models.BooleanField(
        _('attivo'),
        default=True,
        help_text=_(
            'Designates whether this user should be treated as active. '
            'Unselect this instead of deleting accounts.'
        ),
    )
    date_joined = models.DateTimeField(_('date joined'), default=timezone.now)

    title = models.CharField(_('titolo'), max_length=50, default='Allievo ciclo unico 6 anni')
    employeeType = models.CharField(_('componente di Scuola'), max_length=50,
                                    default='corso Ordinario Ciclo Unico 6 Anni')
    ou = models.CharField(_('settore'), max_length=50, default='Cl. Sc. Sperimentali - Medicina')

    is_user_disabled_by_school = models.CharField(_('è stato disattivato da Scuola?'), max_length=150,
                                                  default="Non è un account di Scuola")

    EMAIL_FIELD = 'email'
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    objects = CustomUserManager()

    class Meta:
        db_table = 'users'
        verbose_name = 'utente'
        verbose_name_plural = 'utenti'

    def __str__(self):
        return self.get_full_name()

    def clean(self):
        super().clean()
        self.email = self.__class__.objects.normalize_email(self.email)

    def get_full_name(self):
        """
        Return the first_name plus the last_name, with a space in between.
        """
        full_name = '%s %s' % (self.first_name, self.last_name)
        return full_name.strip()

    def get_short_name(self):
        """Return the short name for the user."""
        return self.first_name

    def email_user(self, subject, message, from_email=None, **kwargs):
        """Send an email to this user."""
        send_mail(subject, message, from_email, [self.email], **kwargs)

    def get_admin_url(self):
        content_type = ContentType.objects.get_for_model(self.__class__)
        return reverse("admin:%s_%s_change" % (content_type.app_label, content_type.model), args=(self.pk,))

    @property
    def is_auth1(self):
        return StudentAccount.objects.filter(Q(user=self), Q(is_set_up=True)).exists() \
               or WhitelistEmail.objects.filter(email=self.email) or self.is_superuser

    @property
    def is_auth2(self):
        if self.is_superuser:
            return True
        return TutorAccount.objects.filter(user=self) or self.groups.filter(name="Recruiter").exists()


class WhitelistEmail(models.Model):
    email = models.EmailField()

    objects = models.Manager()

    class Meta:
        db_table = "whitelist_emails"
        verbose_name = "Email whitelist"
        verbose_name_plural = "Emails whitelist"

    def __str__(self):
        return self.email


class StudentAccount(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='student',
                                primary_key=True, verbose_name='user')
    entry_year = models.IntegerField(_('anno accademico della immatricolazione a medicina'),
                                     blank=True, null=True,
                                     help_text=_('anno di immatricolazione alla facoltà di medicina'))
    tutor = models.CharField(_('tutor'), max_length=30, blank=True, null=True)
    is_set_up = models.BooleanField(_('registrazione completa?'), default=False)

    objects = StudentAccountManager()

    class Meta:
        db_table = 'students'
        verbose_name = 'studente'
        verbose_name_plural = 'studenti'

    def __str__(self):
        return self.user.__str__()

    def get_entry_year(self):
        if self.entry_year:
            return entry_year_generator()[int(self.entry_year) - 2000][1]
        return None

    def get_year(self):
        if self.is_set_up:
            year = timezone.now().date().year - self.entry_year
            if 10 <= timezone.now().date().month <= 12:
                year += 1
            if year > 8:
                year = 8
            return YEAR_DICT[str(year)]
        else:
            return 'Non disponibile'

    @property
    def actual_year(self):
        return self.get_year()


class TutorAccount(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='tutor',
                                primary_key=True, verbose_name='user')

    objects = TutorAccountManager()

    class Meta:
        db_table = 'tutors'
        verbose_name = 'tutor'
        verbose_name_plural = 'tutors'

    def __str__(self):
        return self.user.__str__()

    @property
    def tutees(self):
        return StudentAccount.objects.filter(tutor=self.user.username)