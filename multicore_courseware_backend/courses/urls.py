from django.urls import path
from courses import views

urlpatterns = [
    path("course-list/", views.CourseListView.as_view(), name="list-courses"),
    path('course/detail/<int:pk>/', views.CourseDetailView.as_view(), name='course-detail'),
    path('enrollments-list/', views.EnrollmentListView.as_view(), name='enrollment-list'),
    path('enrollments-create/', views.EnrollmentCreateView.as_view(), name='enrollment-create'),
    path('enrollments-list-detail/', views.EnrollmentListDetailView.as_view(), name='enrollment-list-detail'),
    path('<int:course_id>/content/', views.CourseContentView.as_view(), name='course_content'),
    path('get-course/<int:course_id>/contents/progress/', views.CourseContentProgressView.as_view(), name='course-content-progress'),
    path('post-course/<int:course_id>/contents/<int:course_content_id>/progress/', views.CourseContentProgressView.as_view(), name='course-content-progress'),
    path('course-progress/<int:course_id>/', views.CourseProgressView.as_view(), name='course-progress'),
    path('get-certificate/<int:course_id>/', views.CertificateRetrieveAPIView.as_view(), name='get-certificate'),
]