from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    # path('user', views.UserAPIview.as_view()),
    # path('user/<int:pk>', views.UserAPIview.as_view()),
]