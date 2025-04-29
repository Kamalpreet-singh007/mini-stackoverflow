from rest_framework import serializers
from .models import Question, Response, Comment

class Questionserializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields ='__all__'

class Responseserializer(serializers.ModelSerializer):
    class Meta:
        model = Response
        fields ='__all__'

class Commentserializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields ='__all__'