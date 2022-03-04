# Generated by Django 3.1.2 on 2021-11-27 14:08

import accounts.models
import django.contrib.auth.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='CustomUser',
            fields=[
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(error_messages={'unique': 'A user with that username already exists.'}, help_text='Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.', max_length=150, primary_key=True, serialize=False, validators=[django.contrib.auth.validators.UnicodeUsernameValidator()], verbose_name='username')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='nome')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='cognome')),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='email')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='attivo')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('title', models.CharField(default='Allievo ciclo unico 6 anni', max_length=50, verbose_name='titolo')),
                ('employeeType', models.CharField(default='corso Ordinario Ciclo Unico 6 Anni', max_length=50, verbose_name='componente di Scuola')),
                ('ou', models.CharField(default='Cl. Sc. Sperimentali - Medicina', max_length=50, verbose_name='settore')),
                ('is_user_disabled_by_school', models.CharField(default='Non è un account di Scuola', max_length=150, verbose_name='è stato disattivato da Scuola?')),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.Group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.Permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'utente',
                'verbose_name_plural': 'utenti',
                'db_table': 'users',
            },
            managers=[
                ('objects', accounts.models.CustomUserManager()),
            ],
        ),
        migrations.CreateModel(
            name='WhitelistEmail',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(max_length=254)),
            ],
            options={
                'verbose_name': 'Email whitelist',
                'verbose_name_plural': 'Emails whitelist',
                'db_table': 'whitelist_emails',
            },
        ),
        migrations.CreateModel(
            name='StudentAccount',
            fields=[
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, related_name='student', serialize=False, to='accounts.customuser', verbose_name='user')),
                ('entry_year', models.IntegerField(blank=True, help_text='anno di immatricolazione alla facoltà di medicina', null=True, verbose_name='anno accademico della immatricolazione a medicina')),
                ('tutor', models.CharField(blank=True, max_length=30, null=True, verbose_name='tutor')),
                ('is_set_up', models.BooleanField(default=False, verbose_name='registrazione completa?')),
            ],
            options={
                'verbose_name': 'studente',
                'verbose_name_plural': 'studenti',
                'db_table': 'students',
            },
        ),
        migrations.CreateModel(
            name='TutorAccount',
            fields=[
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, related_name='tutor', serialize=False, to='accounts.customuser', verbose_name='user')),
            ],
            options={
                'verbose_name': 'tutor',
                'verbose_name_plural': 'tutors',
                'db_table': 'tutors',
            },
        ),
    ]