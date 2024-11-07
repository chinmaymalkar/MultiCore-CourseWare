from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.core.validators import RegexValidator
from .managers import UserManager
from django.utils.translation import gettext_lazy as _
from .managers import UserManager

# Create your models here.


class User(AbstractUser):

    username = None
    
    phone_regex = RegexValidator(
        regex=r"^\+?1?\d{9,15}$", message="Please enter a valid phone number"
    )
    mobile = models.CharField(validators=[phone_regex], max_length=10, unique=True)
    email = models.EmailField(null=True, blank=True)
    first_name = models.CharField(null=True, blank=True, max_length=256)
    last_name = models.CharField(null=True, blank=True, max_length=256)
    date_joined = models.DateTimeField(default=timezone.now)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    USERNAME_FIELD = "mobile"
    object = UserManager()

    def __str__(self):
        return "{} {}".format(self.first_name, self.last_name)

