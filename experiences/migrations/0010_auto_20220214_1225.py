# Generated by Django 3.1.2 on 2022-02-14 11:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('experiences', '0009_auto_20211209_1951'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='experience',
            name='ref_email',
        ),
        migrations.AlterField(
            model_name='experience',
            name='group',
            field=models.CharField(blank=True, default='h6ocxi', max_length=6, verbose_name='gruppo'),
        ),
    ]
