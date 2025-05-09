from rest_framework import serializers
from .models import Question, Response, Comment
from django.forms.models import model_to_dict


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
        if self.instance:
        # Convert the instance to a dict and update it with incoming data
            existing_data = model_to_dict(self.instance)
            full_data = {**existing_data, **data}
        else:
            full_data = data

        parent_comment = full_data.get('parent_comment')
        response = full_data.get('response')

        if parent_comment and response:
            raise serializers.ValidationError("Comment can't have both a parent comment and a response.")
        if not parent_comment and not response:
            raise serializers.ValidationError("Comment must be linked to either a parent comment or a response.")
        
        return data
