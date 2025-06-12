from django.db import models
from accounts.models import User 
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation


class Upvote(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    target = GenericForeignKey('content_type', 'object_id')

    class Meta:
        unique_together = ('author', 'content_type', 'object_id')

# Create your models here.
class Question(models.Model):
    title  =  models.CharField(max_length= 100 )
    body   =  models.TextField() 
    author =  models.ForeignKey(User, related_name='questions', on_delete=models.SET_NULL ,null = True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    upvotes = GenericRelation(Upvote)


    def __str__(self):
        return self.title


class Response(models.Model):        
    body = models.TextField() 
    author =  models.ForeignKey(User, related_name='responses', on_delete=models.SET_NULL, null = True)
    question = models.ForeignKey(Question, related_name='responses', on_delete=models.CASCADE, null = True)
    upvotes = GenericRelation(Upvote)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.author.email}'s response to {self.question.title}"

class Comment(models.Model):

    body = models.TextField() 
    upvotes = GenericRelation(Upvote)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    author =  models.ForeignKey(User, related_name='comments', on_delete=models.SET_NULL, null = True)
    response = models.ForeignKey(Response, related_name='comments', on_delete=models.CASCADE, null = True, blank = True)
    parent_comment  = models.ForeignKey("self", related_name='comments', on_delete=models.CASCADE, null = True, blank = True)
    
    def __str__(self):
        return f"{self.author.email}'s comment "

    # def clean(self):
    #     if self.parent_comment and self.response:
    #         raise ValidationError("A comment cannot have both a parent comment and a response.")
    #     if not self.parent_comment and not self.response:
    #         raise ValidationError("A comment must have either a parent comment or a response.")



