from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),

# Question URLs
    path('questions/', views.QuestionAPIView.as_view(), name='question_list_create'),
    path('questions/<int:question_pk>/', views.QuestionAPIView.as_view(), name='question_detail'),

#  Responses URLs
    path('questions/<int:question_pk>/responses/', views.ResponseAPIView.as_view(), name='response_list_create'),
    path('responses/<int:response_pk>/', views.SingleResponseAPIView.as_view(), name='response_detail'),

#comment urls    
    path('responses/<int:response_pk>/comments/', views.CommentAPIView.as_view(), name='response_comment_list_create'), 
    path('comments/<int:comment_pk>/', views.SingleCommentAPIView.as_view(), name='comment_detail'),
    path('comments/<int:comment_pk>/replies', views.ReplieAPIView.as_view(), name='comment_comment_list_create'),
    
]
