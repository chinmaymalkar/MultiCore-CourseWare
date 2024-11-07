from django.db import models
from courses.models import Course

# Create your models here.
class CourseFile(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    file = models.FileField(upload_to='course_files/')  # Specify the upload path

    def __str__(self):
        return self.title