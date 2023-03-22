from django.db.models.signals import post_save
import logging
from django.dispatch import receiver, Signal
from core.utils import SECTOR_DICT
from accounts.models import StudentAccount, CustomUser, FacultyMember
from core.utils import sector as s, title_default as td
from django.template.loader import render_to_string
from django.utils.html import strip_tags

post_signal = Signal(providing_args=['sender', 'instance', 'change', 'updatedfields', 'request'])


@receiver(post_save, sender=CustomUser)
def create_account(sender, instance, created, **kwargs):
    if instance.email in FacultyMember.objects.all().values_list('email', flat=True):
        faculty_member = FacultyMember.objects.get(email=instance.email)
        if not faculty_member.user:
            faculty_member.user = instance
            faculty_member.save()
    else:
        sector = None
        if instance.ou in SECTOR_DICT:
            sector = SECTOR_DICT[instance.ou]
        else:
            logging.warning("Unrecognized sector \"%s\"" % instance.ou)
        if created and sector == s and instance.title == td:
            StudentAccount.objects.create(user=instance)


@receiver(post_save, sender=CustomUser)
def save_account(sender, instance, **kwargs):
    if instance.ou in SECTOR_DICT.keys() and SECTOR_DICT[instance.ou] == s and StudentAccount.objects.filter(user=instance).exists():
        instance.student.save()


@receiver(post_signal)
def post_signalReciever(sender, **kwargs):
    if kwargs['change'] and kwargs['updatedfields'] == ['is_active']:
        if kwargs['instance'].is_active:
            subject = 'Il tuo account è stato attivato!'
            html_message = render_to_string('accounts/user_activation_email.html', {
                'username': kwargs['instance'].username,
                'first_name': kwargs['instance'].first_name,
                'last_name': kwargs['instance'].last_name,
                'year': kwargs['instance'].student.get_entry_year(),
                'tutor': kwargs['instance'].student.tutor
            }, request=kwargs['request'])
            plain_message = strip_tags(html_message)
            kwargs['instance'].email_user(
                subject=subject, message=plain_message, html_message=html_message)
        else:
            subject = 'Il tuo account è stato disattivato!'
            html_message = render_to_string('accounts/user_deactivation_email.html')
            plain_message = strip_tags(html_message)
            kwargs['instance'].email_user(
                subject=subject, message=plain_message, html_message=html_message)
    else:
        pass
