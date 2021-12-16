from django.db.models.signals import pre_save, post_delete
from django.dispatch import receiver
from django.utils.text import slugify

from core.utils import generate_random_string
from .models import Experience, UnipiInternship, Opportunity


@receiver(pre_save, sender=Experience)
def add_slug_to_experience(sender, instance, *args, **kwargs):
    if instance and not instance.slug:
        slug = slugify(instance.__str__())
        random_string = generate_random_string()
        instance.slug = slug + "-" + random_string


@receiver(pre_save, sender=Experience)
def add_group_to_experience(sender, instance, *args, **kwargs):
    if instance and (not instance.group or instance.group == ""):
        instance.group = generate_random_string()


@receiver(pre_save, sender=UnipiInternship)
def add_slug_to_internship(sender, instance, *args, **kwargs):
    if instance and not instance.slug:
        slug = slugify(instance.__str__())
        random_string = generate_random_string()
        instance.slug = slug + "-" + random_string


@receiver(pre_save, sender=Opportunity)
def add_slug_to_opportunity(sender, instance, *args, **kwargs):
    if instance and not instance.slug:
        slug = slugify(instance.__str__())
        random_string = generate_random_string()
        instance.slug = slug + "-" + random_string


"""
@receiver(post_delete, sender=Experience)
def remove_experience_rating(sender, instance, *args, **kwargs):
    if instance:
        instance.rating.delete()
"""
