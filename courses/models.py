from courses.choices import months, academic_years
from accounts.models import FacultyMember
from django.db import models
from django.utils.translation import gettext_lazy as _


class ThematicArea(models.Model):
    name = models.CharField(_("nome"), max_length=300, unique=True)

    objects = models.Manager()

    class Meta:
        verbose_name = _('Area tematica')
        verbose_name_plural = _("Aree tematiche")

    def __str__(self):
        return self.name

    def get_courses_number(self, years=None):
        if not years:
            return self.courses.count()


class Course(models.Model):
    title = models.CharField(_('titolo'), max_length=300)
    professor = models.ForeignKey(FacultyMember, related_name="courses", on_delete=models.CASCADE,
                                  verbose_name=_('professore'))

    lecturer = models.CharField(_("titolare"), max_length=300)
    ssd = models.CharField(_("SSD titolare"), max_length=30)

    abstract = models.TextField(_("abstract"))
    syllabus = models.TextField(_("syllabus"), null=True, blank=True)

    min_participant_year = models.IntegerField(_("anno minimo raccomandato"))
    area = models.ForeignKey(ThematicArea, related_name="courses", on_delete=models.CASCADE,
                             verbose_name=_("area tematica"))

    objects = models.Manager()

    class Meta:
        unique_together = ("title", "professor")
        verbose_name = _("Corso interno")
        verbose_name_plural = _("Corsi interni")

    def __str__(self):
        return self.title


class CourseAttendance(models.Model):
    course = models.ForeignKey(Course, related_name="attendances", on_delete=models.CASCADE,
                               verbose_name=_("corso interno"))
    academic_year = models.IntegerField(_("anno accademico"), choices=academic_years)
    participants = models.IntegerField(_("numero partecipanti"))
    started_at = models.CharField(_("mese di inizio"), choices=months, max_length=40)
    ended_at = models.CharField(_("mese di fine"), choices=months, max_length=40)

    objects = models.Manager()

    class Meta:
        unique_together = ('course', 'academic_year'),
        verbose_name = _("Dato corso")
        verbose_name_plural = _("Dati corso")

    def __str__(self):
        return "{} {}".format(self.course, self.academic_year)
