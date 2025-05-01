from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),

    # Question URLs
    path('questions/', views.QuestionAPIview.as_view(), name='question_list_create'),
    path('questions/<int:pk>/', views.QuestionAPIview.as_view(), name='question_detail'),

    # Get all responses for a particular question
    path('questions/<int:question_pk>/responses/', views.ResponseAPIview.as_view(), name='response_list_create'),

    # Get all comments for a particular question or response
    path('questions/<int:question_pk>/comments/', views.CommentAPIview.as_view(), name='comment_list_create'),
    path('responses/<int:response_pk>/comments/', views.CommentAPIview.as_view(), name='response_comment_list_create'), # to be done

    # Patch or delete a specific response or comment
    path('responses/<int:pk>/', views.ResponseAPIview.as_view(), name='response_detail'),
    path('comments/<int:pk>/', views.CommentAPIview.as_view(), name='comment_detail'),

]
