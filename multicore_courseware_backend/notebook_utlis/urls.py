from django.urls import path

from notebook_utlis import views


urlpatterns = [
    path('get-cookies/', views.GetCookiesAPIView.as_view(), name="hub-login"),
    path('upload-notebook/', views.UploadNotebookAPIView.as_view(), name="upload-notebook"),
    path('get-cors/', views.GetCorsAPIView.as_view(), name="get-cors"),
    path('get-jhub-user-token/', views.GetJhubUserTokenView.as_view(), name="get-jhub-user-token"),
]