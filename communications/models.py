import locale
from django.contrib.auth import get_user_model
from django.db import models
from django.utils.translation import gettext_lazy as _


locale.setlocale(locale.LC_ALL, 'en_US.utf8')
User = get_user_model()


class Diary(models.Model):
    created_at = models.DateField(_('data creazione'), auto_now_add=True)
    authors = models.ManyToManyField(User, related_name="diaries", verbose_name=_('autori'))

    objects = models.Manager()

    class Meta:
        db_table = 'diaries'
        verbose_name = 'diario'
        verbose_name_plural = 'diari'

    def __str__(self):
        return "Diario del {}".format(self.created_at)

    def get_pages_number(self):
        return self.pages.count()


class Page(models.Model):
    text = models.CharField(_("testo"), max_length=5000)
    created_at = models.DateField(_('data creazione'), auto_now_add=True)
    updated_at = models.DateField(_('data di modifica'), auto_now=True)
    diary = models.ForeignKey(Diary, on_delete=models.CASCADE, related_name="pages", verbose_name=_("diario"))

    objects = models.Manager()

    class Meta:
        db_table = 'pages'
        verbose_name = 'pagina'
        verbose_name_plural = 'pagine'

    def __str__(self):
        if len(str(self.text)) > 1000:
            return self.text[:1000]
        return self.text

    @property
    def get_authors(self):
        return self.diary.authors



