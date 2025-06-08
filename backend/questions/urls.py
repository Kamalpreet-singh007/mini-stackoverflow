from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [


# Question URLs
    path('questions/', views.QuestionAPIView.as_view(), name='question_list_create'),
    path('questions/<int:question_pk>/', views.QuestionAPIView.as_view(), name='question_detail'),
    path('questions/search/', views.QuestionSearchView.as_view(), name='question-search'),
#  Responses URLs
    path('questions/<int:question_pk>/responses/', views.ResponseAPIView.as_view(), name='response_list_create'),
    path('responses/<int:response_pk>/', views.SingleResponseAPIView.as_view(), name='response_detail'),

#comment urls    
    path('responses/<int:response_pk>/comments/', views.CommentAPIView.as_view(), name='response_comment_list_create'), 
    path('comments/<int:comment_pk>/', views.SingleCommentAPIView.as_view(), name='comment_detail'),
    path('comments/<int:comment_pk>/replies', views.ReplieAPIView.as_view(), name='comment_comment_list_create'),
    
# # upvotes urls
    path('upvote/<int:target_pk>/', views.GetUpvoteCountAPIView.as_view(), name = ''),
    path('upvote/<int:target_pk>/add', views.UpvoteAPIView.as_view(), name = ''),

    path('upvote/<int:target_pk>/all', views.GetUpvoteAPIView.as_view(), name = ''),
    path('upvote/<int:target_pk>/unlike', views.DownvoteAPIView.as_view(), name = '') ]
          ]

