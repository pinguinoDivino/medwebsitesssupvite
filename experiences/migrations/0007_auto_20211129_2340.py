# Generated by Django 3.1.2 on 2021-11-29 22:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('experiences', '0006_auto_20211129_1605'),
    ]

    operations = [
        migrations.AddField(
            model_name='unipiinternship',
            name='rating',
            field=models.PositiveSmallIntegerField(default=6, verbose_name='valutazione'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='experience',
            name='group',
            field=models.CharField(blank=True, default='xw6njb', max_length=6, verbose_name='gruppo'),
        ),
        migrations.AlterField(
            model_name='unipiinternship',
            name='recommended_year',
            field=models.PositiveSmallIntegerField(verbose_name='anno accademico consigliato'),
        ),
    ]
