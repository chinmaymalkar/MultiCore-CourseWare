from rest_framework import serializers
from .models import Course, CourseContent, UserCourseProgress, UserCourseContentProgress, Enrollment, Certificate

class CourseListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'title', 'image', 'price']

class CourseDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

class CourseContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseContent
        fields = '__all__'

class UserCourseProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCourseProgress
        fields = '__all__'

class UserCourseContentProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCourseContentProgress
        fields = '__all__'

class EnrollmentListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = '__all__'

class EnrollmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = ['id', 'course']

class CertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certificate
        fields = '__all__'
