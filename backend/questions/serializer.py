from rest_framework import serializers
from .models import Question, Response, Comment, Upvote
from django.forms.models import model_to_dict
from django.contrib.contenttypes.models import ContentType

class ContentTypeNameMixin(serializers.Serializer):
    type_name = serializers.SerializerMethodField()

    def get_type_name(self, obj):
        return ContentType.objects.get_for_model(obj).model

class Questionserializer(ContentTypeNameMixin, serializers.ModelSerializer):
    class Meta:
        model = Question
        fields ='__all__'

class Responseserializer(ContentTypeNameMixin, serializers.ModelSerializer):
    class Meta:
        model = Response
        fields ='__all__'

class Commentserializer(ContentTypeNameMixin, serializers.ModelSerializer):
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

class UpvotesSerializer(serializers.ModelSerializer):
    class Meta():
        model = Upvote
        fields = '__all__'

    validators = [
        serializers.UniqueTogetherValidator(
            queryset=Upvote.objects.all(),
            fields=['author', 'content_type', 'object_id'],
            message="You have already upvoted this item."
        )
    ]



