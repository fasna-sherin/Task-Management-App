# Generated by Django 5.1.6 on 2025-02-23 05:02

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('TODO', '0014_remove_userprofile_birth_date_and_more'),
        ('authtoken', '0004_alter_tokenproxy_options'),
    ]

    operations = [
        migrations.CreateModel(
            name='ExpiringToken',
            fields=[
                ('token_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='authtoken.token')),
                ('expires_at', models.DateTimeField(blank=True, null=True)),
            ],
            bases=('authtoken.token',),
        ),
    ]
