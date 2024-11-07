from django.contrib import admin
from .models import CourseFile
# admin.py

@admin.register(CourseFile)
class CourseFileAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'file']
    search_fields = ['title', 'course__title']