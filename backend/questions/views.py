from django.shortcuts import render
from django.http import HttpResponse 

from .serializer import Questionserializer, Responseserializer, Commentserializer
from .models import Question

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
# Create your views here.

class QuestionAPIview(APIView):
    def get(self, request):
         questions = Question.objects.all()
         serializer =Questionserializer()
         return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = Questionserializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
