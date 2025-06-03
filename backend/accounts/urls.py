from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('logout/',views.UserLogoutApiView.as_view()),
    path('register', views.UserAPIview.as_view()),
    path('me', views.CurrentUserAPIview.as_view()),
]