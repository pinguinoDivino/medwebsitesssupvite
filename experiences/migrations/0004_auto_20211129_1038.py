# Generated by Django 3.1.2 on 2021-11-29 09:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('experiences', '0003_auto_20211127_2351'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='unipiinternship',
            name='indications',
        ),
        migrations.AlterField(
            model_name='experience',
            name='group',
            field=models.CharField(blank=True, default='akzfta', max_length=6, verbose_name='gruppo'),
        ),
        migrations.AlterField(
            model_name='experience',
            name='review',
            field=models.TextField(blank=True, help_text='Descrizione e recensione', null=True, verbose_name='recensione'),
        ),
        migrations.AlterField(
            model_name='unipiinternship',
            name='review',
            field=models.TextField(blank=True, help_text='Descrizione e recensione', null=True, verbose_name='recensione'),
        ),
    ]
