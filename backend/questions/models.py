from django.db import models
from accounts.models import User 

# Create your models here.
class Question(models.Model):
    title  =  models.CharField(max_length= 100 )
    body   =  models.TextField() 
    author =  models.ForeignKey(User, related_name='questions', on_delete=models.SET_NULL ,null = True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return self.title


class Response(models.Model):        
    body = models.TextField() 
    author =  models.ForeignKey(User, related_name='responses', on_delete=models.SET_NULL, null = True)
    question = models.ForeignKey(Question, related_name='responses', on_delete=models.CASCADE, null = True)
    upvotes = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.author.email}'s response to {self.question.title}"

class Comment(models.Model):
    author =  models.ForeignKey(User, related_name='comments', on_delete=models.SET_NULL, null = True)
    parent_response = models.ForeignKey(Response, related_name='comments', on_delete=models.CASCADE, null = True, blank = True)
    parent_comment  = models.ForeignKey("self", related_name='comments', on_delete=models.CASCADE, null = True, blank = True)
    body = models.TextField() 
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.author.email}'s comment on {self.parent_response}"

    
