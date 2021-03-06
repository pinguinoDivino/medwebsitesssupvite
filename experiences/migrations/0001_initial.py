# Generated by Django 3.1.2 on 2021-11-27 14:08

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('accounts', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='City',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('country', models.CharField(help_text='stato', max_length=300, verbose_name='stato')),
                ('region', models.CharField(blank=True, help_text='regione', max_length=300, null=True, verbose_name='regione')),
                ('city', models.CharField(help_text='comune', max_length=300, verbose_name='comune')),
            ],
            options={
                'verbose_name': 'città',
                'verbose_name_plural': 'città',
                'db_table': 'cities',
            },
        ),
        migrations.CreateModel(
            name='Experience',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateField(auto_now_add=True, verbose_name='aggiunta il')),
                ('updated_at', models.DateField(auto_now=True, verbose_name='aggiornata il')),
                ('author_contact', models.CharField(blank=True, default='email istituzionale', max_length=150, verbose_name='contatto autore')),
                ('review', models.TextField(blank=True, help_text="Descrizione dell'esperienza", null=True, verbose_name='recensione')),
                ('indications', models.TextField(blank=True, help_text='Consigli pratici da dare', null=True, verbose_name='consigli')),
                ('slug', models.SlugField(max_length=255, unique=True)),
                ('started_at', models.DateField(blank=True, null=True, verbose_name='iniziata il')),
                ('ended_at', models.DateField(blank=True, null=True, verbose_name='terminata il')),
                ('description', models.CharField(max_length=300, verbose_name='descrizione')),
                ('img', models.ImageField(blank=True, default='/experiences/default.png', null=True, upload_to='imgs/%Y/%m/%d', verbose_name='immagine')),
                ('ref', models.CharField(help_text="referente a cui rivolgersi per effetturare l'esperienza ", max_length=150, verbose_name='referente')),
                ('ref_email', models.CharField(default='Non disponibile', help_text='email del referente', max_length=150, verbose_name='email del referente')),
                ('type', models.CharField(blank=True, max_length=14, verbose_name='tipo esperienza')),
                ('group', models.CharField(blank=True, default='5bjh1u', max_length=6, verbose_name='gruppo')),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='experiences', to='accounts.studentaccount', verbose_name='autore')),
                ('city', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='experiences', to='experiences.city', verbose_name='città')),
            ],
            options={
                'verbose_name': 'esperienza',
                'verbose_name_plural': 'esperienze',
                'db_table': 'experiences',
            },
        ),
        migrations.CreateModel(
            name='InternshipProfessor',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=150, verbose_name='nome')),
                ('last_name', models.CharField(max_length=150, verbose_name='cognome')),
                ('ward', models.CharField(max_length=50, verbose_name='reparto')),
                ('active', models.BooleanField(default=True, verbose_name='attivo')),
            ],
            options={
                'verbose_name': 'Professore del tirocinio',
                'verbose_name_plural': 'Professori dei tirocini',
                'db_table': 'internships_professors',
                'unique_together': {('first_name', 'last_name', 'ward')},
            },
        ),
        migrations.CreateModel(
            name='University',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200, verbose_name="nome dell'università")),
                ('country', models.CharField(max_length=20, verbose_name='stato')),
                ('link', models.CharField(max_length=300, verbose_name='link')),
            ],
            options={
                'verbose_name': 'università',
                'verbose_name_plural': 'università',
                'db_table': 'universities',
            },
        ),
        migrations.CreateModel(
            name='UnipiInternship',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateField(auto_now_add=True, verbose_name='aggiunta il')),
                ('updated_at', models.DateField(auto_now=True, verbose_name='aggiornata il')),
                ('author_contact', models.CharField(blank=True, default='email istituzionale', max_length=150, verbose_name='contatto autore')),
                ('review', models.TextField(blank=True, help_text="Descrizione dell'esperienza", null=True, verbose_name='recensione')),
                ('indications', models.TextField(blank=True, help_text='Consigli pratici da dare', null=True, verbose_name='consigli')),
                ('slug', models.SlugField(max_length=255, unique=True)),
                ('academic_year', models.PositiveSmallIntegerField(verbose_name='anno accademico')),
                ('active', models.BooleanField(default=True, verbose_name='attivo')),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='unipi_internship', to='accounts.studentaccount', verbose_name='autore')),
                ('professor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='internships', to='experiences.internshipprofessor', verbose_name='professore')),
            ],
            options={
                'verbose_name': 'tirocinio unipi',
                'verbose_name_plural': 'tirocini unipi',
                'db_table': 'internships',
            },
        ),
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('name', models.CharField(max_length=300, primary_key=True, serialize=False, verbose_name='nome')),
                ('group', models.CharField(max_length=50, verbose_name='gruppo')),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tags', to=settings.AUTH_USER_MODEL, verbose_name='creato da')),
            ],
            options={
                'verbose_name': 'tag',
                'verbose_name_plural': 'tags',
                'db_table': 'tags',
            },
        ),
        migrations.CreateModel(
            name='SfsLabErasmusAdditionalAttributes',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('thesis', models.BooleanField(default=False, verbose_name='si può scrivere la tesi?')),
                ('istitution', models.CharField(blank=True, max_length=300, null=True, verbose_name='istituzione')),
                ('experience', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='sfs_lab_erasmus_attrs', to='experiences.experience', verbose_name='esperienza')),
            ],
            options={
                'verbose_name': 'attributi sfs, laboratorio ed erasmus',
                'verbose_name_plural': 'attributi sfs, laboratori ed erasmus',
                'db_table': 'sfs_lab_attributes',
            },
        ),
        migrations.CreateModel(
            name='Rating',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('global_r', models.PositiveSmallIntegerField(verbose_name='v. globale')),
                ('stay_r', models.PositiveSmallIntegerField(verbose_name='v. istituzione')),
                ('aquired_knowledge_r', models.PositiveSmallIntegerField(verbose_name='v. conoscenza acquisita')),
                ('involvement_r', models.PositiveSmallIntegerField(verbose_name='v. coinvolgimento')),
                ('updated_at', models.DateField(auto_now=True, verbose_name='aggiornata il')),
                ('experience', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='rating', to='experiences.experience', verbose_name='esperienza')),
            ],
            options={
                'verbose_name': 'valutazione',
                'verbose_name_plural': 'valutazioni',
                'db_table': 'ratings',
            },
        ),
        migrations.CreateModel(
            name='Opportunity',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateField(auto_now_add=True, verbose_name='aggiunta il')),
                ('updated_at', models.DateField(auto_now=True, verbose_name='aggiornata il')),
                ('description', models.TextField(verbose_name='descrizione')),
                ('istitution', models.CharField(max_length=300, verbose_name='istituto')),
                ('ref', models.CharField(max_length=150, verbose_name='referente')),
                ('active', models.BooleanField(default=True, verbose_name='attivo')),
                ('slug', models.SlugField(max_length=255, unique=True)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='opportunities', to=settings.AUTH_USER_MODEL, verbose_name='autore')),
                ('tags', models.ManyToManyField(blank=True, related_name='opportunities', to='experiences.Tag', verbose_name='tag')),
                ('university', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='opportunities', to='experiences.university', verbose_name='università')),
            ],
            options={
                'verbose_name': 'opportunità',
                'verbose_name_plural': 'opportunità',
                'db_table': 'opportunities',
            },
        ),
        migrations.CreateModel(
            name='InternshipAdditionalAttributes',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ward', models.CharField(blank=True, max_length=50, null=True, verbose_name='reparto')),
                ('istitution', models.CharField(blank=True, max_length=300, null=True, verbose_name='istituzione')),
                ('experience', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='internship_attrs', to='experiences.experience', verbose_name='esperienza')),
            ],
            options={
                'verbose_name': 'attributi del tirocinio',
                'verbose_name_plural': 'attributi dei tirocini',
                'db_table': 'internship_attributes',
            },
        ),
        migrations.AddField(
            model_name='experience',
            name='tags',
            field=models.ManyToManyField(blank=True, related_name='experiences', to='experiences.Tag', verbose_name='tags'),
        ),
        migrations.AddField(
            model_name='experience',
            name='universities',
            field=models.ManyToManyField(blank=True, to='experiences.University', verbose_name='università'),
        ),
        migrations.CreateModel(
            name='CongressConferenceSummerSchoolAdditionalAttributes',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(blank=True, max_length=300, null=True, verbose_name='titolo')),
                ('cost', models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=8, verbose_name='costo')),
                ('organization', models.CharField(blank=True, max_length=300, null=True, verbose_name='organizzazione')),
                ('link_organization', models.CharField(blank=True, max_length=300, null=True, verbose_name='link organizzazione')),
                ('program', models.FileField(blank=True, null=True, upload_to='programs/%Y/%m/%d', verbose_name='programma')),
                ('poster', models.FileField(blank=True, null=True, upload_to='posters/%Y/%m/%d', verbose_name='locandina')),
                ('experience', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='congress_conference_summerschool_attrs', to='experiences.experience', verbose_name='esperienza')),
            ],
            options={
                'verbose_name': 'attributi congresso, conferenza e summer school',
                'verbose_name_plural': 'attributi congressi, conferenze e summer schools',
                'db_table': 'congress_conference_summerschool_attributes',
            },
        ),
    ]
