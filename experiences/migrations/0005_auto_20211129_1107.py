# Generated by Django 3.1.2 on 2021-11-29 10:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('experiences', '0004_auto_20211129_1038'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='unipiinternship',
            name='professor',
        ),
        migrations.AddField(
            model_name='unipiinternship',
            name='ward',
            field=models.CharField(default='Epatologia', max_length=50, verbose_name='reparto'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='experience',
            name='group',
            field=models.CharField(blank=True, default='yb44a0', max_length=6, verbose_name='gruppo'),
        ),
        migrations.DeleteModel(
            name='InternshipProfessor',
        ),
    ]
