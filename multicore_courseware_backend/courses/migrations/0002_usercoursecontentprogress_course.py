# Generated by Django 5.0.3 on 2024-04-06 11:47

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='usercoursecontentprogress',
            name='course',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='courses.course'),
        ),
    ]
