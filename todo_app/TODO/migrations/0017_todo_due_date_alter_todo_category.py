# Generated by Django 5.1.6 on 2025-02-24 07:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('TODO', '0016_todo_category'),
    ]

    operations = [
        migrations.AddField(
            model_name='todo',
            name='due_date',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='todo',
            name='category',
            field=models.CharField(choices=[('work', 'Work'), ('personal', 'Personal'), ('urgent', 'Urgent'), ('Study', 'Study'), ('others', 'Others')], default='others', max_length=10),
        ),
    ]
