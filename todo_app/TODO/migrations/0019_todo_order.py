# Generated by Django 5.1.6 on 2025-02-28 10:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('TODO', '0018_todo_priority'),
    ]

    operations = [
        migrations.AddField(
            model_name='todo',
            name='order',
            field=models.IntegerField(default=0),
        ),
    ]
