from django.contrib import admin
from .models import Question, Response, Comment
# Register your models here.

admin.site.register(Question)
admin.site.register(Response)
admin.site.register(Comment)
