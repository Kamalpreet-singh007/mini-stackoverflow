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

    def validate(self, data):
        parent_comment = data.get('parent_comment')
        response = data.get('response')

        if parent_comment and response:
            raise serializers.ValidationError("Comment can't have both a parent comment and a response.")
        if not parent_comment and not response:
            raise serializers.ValidationError("Comment must be linked to either a parent comment or a response.")
        
        return data
