import os

from dateutil import relativedelta
from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import models
from accounts.models import StudentAccount
from core.utils import EXP_GROUP_TAGS, OPP_GROUP_TAGS, generate_random_string
from django.db import IntegrityError
from django.utils.translation import gettext_lazy as _
import locale
from django.urls import reverse
from django.contrib.contenttypes.models import ContentType


locale.setlocale(locale.LC_ALL, 'en_US.utf8')
User = get_user_model()


class NameField(models.CharField):
    def __init__(self, *args, **kwargs):
        super(NameField, self).__init__(*args, **kwargs)

    def get_prep_value(self, value):
        return str(value).lower()


class TagManager(models.Manager):
    def create(self, name, created_by, group):
        name_low = name.lower()
        if Tag.objects.filter(name=name_low).exists():
            raise IntegrityError()
        if group not in [x[0] for x in EXP_GROUP_TAGS + OPP_GROUP_TAGS]:
            raise ValueError("Il gruppo non è valido")
        tag = self.model(name=name_low, created_by=created_by, group=group)
        tag.save(using=self._db)
        tag.save()
        return tag


class OpportunityManager(models.Manager):
    pass


class InternshipProfessorManager(models.Manager):
    def create(self, **kwargs):
        ward = kwargs.pop('ward').lower()
        obj = self.model(ward=ward, **kwargs)
        self._for_write = True
        obj.save(force_insert=True, using=self.db)
        return obj


class Tag(models.Model):
    name = NameField(_('nome'), primary_key=True, max_length=300)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tags',
                                   verbose_name='creato da')
    group = models.CharField(_('gruppo'), max_length=50)
    objects = TagManager()

    class Meta:
        db_table = 'tags'
        verbose_name = 'tag'
        verbose_name_plural = 'tags'

    def __str__(self):
        return self.name

    def get_exp_count(self):
        return self.experiences.count()

    def get_opp_count(self):
        return self.opportunities.count()


class University(models.Model):
    name = models.CharField(_("nome dell'università"), max_length=200)
    country = models.CharField(_("stato"), max_length=20)
    link = models.CharField(_("link"), max_length=300)
    objects = models.Manager()

    class Meta:
        db_table = 'universities'
        verbose_name = 'università'
        verbose_name_plural = 'università'

    def __str__(self):
        return self.name


class City(models.Model):
    country = models.CharField(_('stato'), max_length=300, help_text=_('stato'))
    region = models.CharField(_('regione'), max_length=300, help_text=_('regione'),
                              null=True, blank=True)
    city = models.CharField(_('comune'), max_length=300, help_text=_('comune'))

    objects = models.Manager()

    def __str__(self):
        return self.city + ' presso ' + self.country

    class Meta:
        db_table = 'cities'
        verbose_name = 'città'
        verbose_name_plural = 'città'


class BaseExp(models.Model):
    created_at = models.DateField(_('aggiunta il'), auto_now_add=True)
    updated_at = models.DateField(_('aggiornata il'), auto_now=True)
    author_contact = models.CharField(_('contatto autore'),
                                      max_length=150, blank=True, default='email istituzionale')
    review = models.TextField(_('recensione'), blank=True, null=True, help_text=_("Descrizione e recensione"))
    slug = models.SlugField(max_length=255, unique=True)

    class Meta:
        abstract = True


class Experience(BaseExp):
    started_at = models.DateField(_('iniziata il'), null=True, blank=True)
    ended_at = models.DateField(_('terminata il'), null=True, blank=True)
    description = models.CharField(_('descrizione'), max_length=300)
    indications = models.TextField(_('consigli'), blank=True, null=True, help_text=_("Consigli pratici da dare"))
    img = models.ImageField(_('immagine'), upload_to="imgs/%Y/%m/%d", blank=True, null=True)
    ref = models.CharField(_('referente'), max_length=150,
                           help_text=_("referente a cui rivolgersi per effetturare l'esperienza "))
    ref_email = models.CharField(_('email del referente'), max_length=150,
                                 help_text=_("email del referente"), default="Non disponibile")
    type = models.CharField(_('tipo esperienza'), max_length=14, blank=True)
    group = models.CharField(_('gruppo'), max_length=6, default=generate_random_string(), blank=True, null=False)

    author = models.ForeignKey(StudentAccount, on_delete=models.CASCADE, related_name='experiences',
                               verbose_name='autore')
    city = models.ForeignKey(City, verbose_name='città', on_delete=models.CASCADE, related_name='experiences',
                             blank=True, null=True)
    tags = models.ManyToManyField(Tag, related_name='experiences', verbose_name='tags', blank=True)
    universities = models.ManyToManyField(University, verbose_name=_('università'), blank=True)
    objects = models.Manager()

    class Meta:
        db_table = 'experiences'
        verbose_name = 'esperienza'
        verbose_name_plural = 'esperienze'

    def __str__(self):
        return self.description

    def get_attribute(self):
        if hasattr(self, 'sfs_lab_erasmus_attrs'):
            return getattr(self, 'sfs_lab_erasmus_attrs')
        elif hasattr(self, 'congress_conference_summerschool_attrs'):
            return getattr(self, 'congress_conference_summerschool_attrs')
        elif hasattr(self, 'internship_attrs'):
            return getattr(self, 'internship_attrs')
        else:
            return None

    @property
    def status(self):
        if self.ended_at:
            diff = relativedelta.relativedelta(self.ended_at, self.started_at)
            years = diff.years
            months = diff.months
            days = diff.days
            return '{} y {} m {} d'.format(years, months, days)
        return "In corso"

    def get_absolute_url(self):
        return r"/dettagli/%s" % format(self.slug)

    def get_admin_url(self):
        content_type = ContentType.objects.get_for_model(self.__class__)
        return reverse("admin:%s_%s_change" % (content_type.app_label, content_type.model), args=(self.pk,))

    def delete(self, *args, **kwargs):
        if self.img:
            os.remove(os.path.join(settings.MEDIA_ROOT, self.img.name))
        super(Experience, self).delete(*args, **kwargs)


class Rating(models.Model):
    global_r = models.PositiveSmallIntegerField(_('v. globale'))
    stay_r = models.PositiveSmallIntegerField(_('v. istituzione'))
    aquired_knowledge_r = models.PositiveSmallIntegerField(_('v. conoscenza acquisita'))
    involvement_r = models.PositiveSmallIntegerField(_('v. coinvolgimento'))
    updated_at = models.DateField(_('aggiornata il'), auto_now=True)
    experience = models.OneToOneField(Experience, on_delete=models.CASCADE, related_name='rating',
                                      verbose_name='esperienza', null=True, blank=True)
    objects = models.Manager()

    class Meta:
        db_table = 'ratings'
        verbose_name = 'valutazione'
        verbose_name_plural = 'valutazioni'

    def __str__(self):
        return "Valutazione complessiva: {}".format(self.global_r)

    def get_average(self):
        return round((self.global_r + self.stay_r + self.aquired_knowledge_r + self.involvement_r) / 4, 0)


class SfsLabErasmusAdditionalAttributes(models.Model):
    thesis = models.BooleanField(_('si può scrivere la tesi?'), default=None, null=True, blank=True)
    istitution = models.CharField(_('istituzione'), max_length=300, null=True, blank=True)
    experience = models.OneToOneField(Experience, on_delete=models.CASCADE, related_name='sfs_lab_erasmus_attrs',
                                      verbose_name='esperienza')
    objects = models.Manager()

    class Meta:
        db_table = 'sfs_lab_attributes'
        verbose_name = 'attributi sfs, laboratorio ed erasmus'
        verbose_name_plural = 'attributi sfs, laboratori ed erasmus'

    def __str__(self):
        return "Attributi del soggiorno fuorisede presso %s : %s " % (
            self.istitution, self.experience.started_at.strftime('%B %Y'))

    def get_admin_url(self):
        content_type = ContentType.objects.get_for_model(self.__class__)
        return reverse("admin:%s_%s_change" % (content_type.app_label, content_type.model), args=(self.pk,))


class CongressConferenceSummerSchoolAdditionalAttributes(models.Model):
    title = models.CharField(_('titolo'), max_length=300, null=True, blank=True)
    cost = models.DecimalField(_('costo'), max_digits=8, decimal_places=2, default=0, blank=True)
    organization = models.CharField(_('organizzazione'), max_length=300, null=True, blank=True)
    link_organization = models.CharField(_('link organizzazione'), max_length=1000, null=True, blank=True)
    link = models.CharField(_('link conferenza'), max_length=1000, null=True, blank=True)

    experience = models.OneToOneField(Experience, on_delete=models.CASCADE,
                                      related_name='congress_conference_summerschool_attrs',
                                      verbose_name='esperienza')
    objects = models.Manager()

    class Meta:
        db_table = 'congress_conference_summerschool_attributes'
        verbose_name = 'attributi congresso, conferenza e summer school'
        verbose_name_plural = 'attributi congressi, conferenze e summer schools'

    def __str__(self):
        return self.title

    def get_admin_url(self):
        content_type = ContentType.objects.get_for_model(self.__class__)
        return reverse("admin:%s_%s_change" % (content_type.app_label, content_type.model), args=(self.pk,))

    def delete(self, *args, **kwargs):
        os.remove(os.path.join(settings.MEDIA_ROOT, self.poster.name))
        os.remove(os.path.join(settings.MEDIA_ROOT, self.program.name))
        super(CongressConferenceSummerSchoolAdditionalAttributes, self).delete(*args, **kwargs)


class InternshipAdditionalAttributes(models.Model):
    experience = models.OneToOneField(Experience, on_delete=models.CASCADE,
                                      related_name='internship_attrs',
                                      verbose_name='esperienza')
    ward = models.CharField(_('reparto'), max_length=50, null=True, blank=True)
    istitution = models.CharField(_('istituzione'), max_length=300, null=True, blank=True)
    objects = models.Manager()

    class Meta:
        db_table = "internship_attributes"
        verbose_name = "attributi del tirocinio"
        verbose_name_plural = "attributi dei tirocini"

    def __str__(self):
        return "Tirocinio non professionalizzante presso il reparto di %s dell'istituto %s " % \
               (self.ward, self.istitution)

    def get_admin_url(self):
        content_type = ContentType.objects.get_for_model(self.__class__)
        return reverse("admin:%s_%s_change" % (content_type.app_label, content_type.model), args=(self.pk,))


class UnipiInternship(BaseExp):
    academic_year = models.PositiveSmallIntegerField(_('anno accademico'))
    recommended_year = models.PositiveSmallIntegerField(_('anno accademico consigliato'))
    ward = models.CharField(_('reparto'), max_length=2)
    author = models.ForeignKey(StudentAccount, on_delete=models.CASCADE,
                               related_name='unipi_internship', verbose_name='autore')
    rating = models.PositiveSmallIntegerField(_('valutazione'))
    active = models.BooleanField(_('attivo'), default=True)
    place = models.CharField(_('luogo'), max_length=3)
    attendance = models.PositiveSmallIntegerField(_('presenze'))
    objects = models.Manager()

    class Meta:
        db_table = 'internships'
        verbose_name = 'tirocinio unipi'
        verbose_name_plural = 'tirocini unipi'

    def __str__(self):
        return "Tirocinio di %s presso il reparto di %s" % (self.author.__str__(), self.ward)


class Opportunity(models.Model):
    created_at = models.DateField(_('aggiunta il'), auto_now_add=True)
    updated_at = models.DateField(_('aggiornata il'), auto_now=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE,
                               related_name="opportunities", verbose_name="autore")
    description = models.TextField(_("descrizione"))
    university = models.ForeignKey(University, on_delete=models.CASCADE, related_name="opportunities",
                                   verbose_name="università")
    istitution = models.CharField(_("istituto"), max_length=300)

    ref = models.CharField(_('referente'), max_length=150)

    active = models.BooleanField(_('attivo'), default=True)

    slug = models.SlugField(max_length=255, unique=True)

    tags = models.ManyToManyField(Tag,  related_name='opportunities', verbose_name='tag', blank=True)

    objects = OpportunityManager()

    class Meta:
        db_table = 'opportunities'
        verbose_name = "opportunità"
        verbose_name_plural = "opportunità"

    def __str__(self):
        return "Opportunità presso l'istituto %s di %s" % (self.istitution, self.university)