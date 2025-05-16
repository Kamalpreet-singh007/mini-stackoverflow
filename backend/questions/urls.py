from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [


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
    
# # upvotes urls
    path('upvote/<int:target_pk>/', views.UpvoteAPIView.as_view(), name = ''),
    path('upvote/<int:target_pk>/all', views.UpvoteCountAPIView.as_view(), name = ''),
    path('upvote/<int:target_pk>/unlike', views.DownvoteAPIView.as_view(), name = ''),
    

    # path('upvote/<int:target_pk>/all', views.GetAllUpvoteApiView.as_view(), name = ''),
    # path('upvote/<int:target_pk>/unlike'views.UpvoteUnlikeApiView.as_view(), name = ''),

    
#     path('questions/<int:question_pk>/upvotes', views.QuestionUpvotesAPIView.as_view(), name = ''),
#     path('responses/<int:response_pk>/upvotes', views.ResponseUpvotesAPIView.as_view(), name = ''),
#     path('comments/<int:comment_pk>/upvotes', views.CommentUpvotesAPIView.as_view(), name = ''),

#     path('questions/<int:question_pk/upvotes/all', views.QuestionUpvotesCountAPIView.as_view(),name =''),
#     path('responses/<int:response_pk/upvotes/all', views.ResponseUpvotesCountAPIView.as_view(),name =''),
#     path('comments/<int:comment_pk/upvotes/all', views.CommentUpvotesCountAPIView.as_view(),name =''),

#     path('questions/<int:question_pk>/unlike', views.QuestionUnlikeAPIView.as_view(),name = ''),
#     path('responses/<int:response_pk>/unlike', views.ResponseUnlikeAPIView.as_view(),name = ''),
#     path('comments/<int:comment_pk>/unlike', views.CommentUnlikeAPIView.as_view(),name = ''),
]

