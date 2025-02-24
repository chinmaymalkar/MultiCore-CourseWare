# Generated by Django 5.0.3 on 2024-04-14 04:59

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0003_certificate_certificate_image'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='certificate',
            unique_together={('user', 'course')},
        ),
    ]
