# Generated by Django 5.1.6 on 2025-03-01 16:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('TODO', '0020_alter_todo_options_todo_completed_at_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='todo',
            name='reward_points',
        ),
        migrations.AddField(
            model_name='userprofile',
            name='total_points',
            field=models.IntegerField(default=0),
        ),
    ]
