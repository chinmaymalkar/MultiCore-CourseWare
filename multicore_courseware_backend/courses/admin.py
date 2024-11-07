from django.contrib import admin
from .models import Course, CourseContent, UserCourseProgress, UserCourseContentProgress, Enrollment, Certificate

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'tag', 'price']
    search_fields = ['title', 'tag']

@admin.register(CourseContent)
class CourseContentAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'content_type', 'sequence_no']
    list_filter = ['course', 'content_type']
    search_fields = ['title']

@admin.register(UserCourseProgress)
class UserCourseProgressAdmin(admin.ModelAdmin):
    list_display = ['user', 'course', 'completed']
    list_filter = ['user', 'course', 'completed']

@admin.register(UserCourseContentProgress)
class UserCourseContentProgressAdmin(admin.ModelAdmin):
    list_display = ['user', 'course', 'course_content', 'completed']
    list_filter = ['user', 'course', 'course_content', 'completed']

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ['user', 'course', 'enrolled_at']
    list_filter = ['user', 'course']

@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ['user', 'course', 'certificate_image', 'date_issued']
    list_filter = ['user', 'course']
