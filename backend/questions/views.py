    # from django.shortcuts import render
    # from django.http import HttpResponse 

from .serializer import Questionserializer, Responseserializer, Commentserializer
from .models import Question,Response, Comment

from rest_framework.views import APIView
from rest_framework.response import Response as DRFResponse
from rest_framework.pagination import PageNumberPagination
from rest_framework import status
# Create your views here.

class QuestionAPIview(APIView):
    def get(self, request, pk = None):
        if pk :
            try :
                ques = Question.objects.get(pk =pk)
            except Question.DoesNotExist:
                return DRFResponse({"ERROR":"404 Not Found"}, status = 404)
            serializer =Questionserializer(ques)
            return DRFResponse(serializer.data, status = status.HTTP_200_OK)
        else:
            questions = Question.objects.all()
            paginator = PageNumberPagination()
            paginator.page_size = 2
            result_page = paginator.paginate_queryset(questions, request)
            serializer =Questionserializer(result_page, many = True)

            return paginator.get_paginated_response(serializer.data)
    
    def post(self, request):
        serializer = Questionserializer(data = request.data)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return DRFResponse(serializer.data, status=status.HTTP_201_CREATED)
        return DRFResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self ,request,pk = None):
        try:
            ques =  Question.objects.get(pk = pk)
        except Question.DoesNotExist:
            return DRFResponse({"error": "Question not found"}, status=404)

        serializer = Questionserializer(ques, data  = request.data, partial = True)
        if serializer.is_valid():
            serializer.save()
            return DRFResponse(serializer.data, status=200)
        return DRFResponse(serializer.errors, status=400)

    def delete(self,request,pk = None):
        if pk:
            try:
                ques = Question.objects.get(pk = pk)
            except Question.DoesNotExist:
                return DRFResponse({"error": "Question not found"}, status=404)
            ques.delete()
            return DRFResponse({"message": "Deleted successfully"}, status=204)
        return DRFResponse({"error": "No ID provided"}, status=status.HTTP_400_BAD_REQUEST)


class ResponseAPIview(APIView):
    def get(self, request,pk = None, question_pk = None):
        if pk :
            try:
                resp = Response.objects.get(pk = pk)
            except Response.DoesNotExist:
                return DRFResponse({"ERROR":"404 Not Found"}, status = 404)

            serializer = Responseserializer(resp)
            return DRFResponse(serializer.data, status = status.HTTP_200_OK)

        elif question_pk :      
            try:
                resp = Response.objects.filter(question = question_pk)
            except Response.DoesNotExist:
                return DRFResponse({"ERROR":"404 Not Found"}, status = 404)
               
            serializer = Responseserializer(resp, many = True)
            return DRFResponse(serializer.data, status = status.HTTP_200_OK)
               
        return DRFResponse({"error": "No ID provided"}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, question_pk = None):
        if question_pk:
            serializer = Responseserializer(data = request.data)
            if serializer.is_valid():
                try:
                    ques = Question.objects.get(pk =question_pk)
                except Question.DoesNotExist:
                    return DRFResponse({"ERROR":"404 Not Found"}, status = 404)
                serializer.save(author = request.user, question = ques)
                return DRFResponse(serializer.data, status=status.HTTP_201_CREATED)
            return DRFResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return DRFResponse({"error": "question_pk required"}, status=400)


    def patch(self,request,pk = None ,question_pk = None):
        if pk is None:
            return DRFResponse({"error": "No ID provided"}, status=400)
        try:
            resp = Response.objects.get(pk = pk)
        except Response.DoesNotExist:
            return DRFResponse({"ERROR":"404 Not Found"}, status = 404)

        serializer = Responseserializer(resp, data = request.data, partial = True)
        if serializer.is_valid():
            serializer.save()
            return DRFResponse(serializer.data, status=200)
        return DRFResponse(serializer.errors, status=400)

    def delete(self , request, pk = None, question_pk = None):
        if pk:
            try:
                resp =  Response.objects.get(pk = pk)
            except Response.DoesNotExist:
                return DRFResponse({"ERROR":"404 Not Found"}, status = 404)
            resp.delete()
            return DRFResponse({"message": "Deleted successfully"}, status=204)
        return DRFResponse({"error": "No ID provided"}, status=400)


class CommentAPIview(APIView):
    def get(self, request,pk = None):
        comen = Comment.objects.get(question = pk)
        serializer = Commentserializer(comen, many = True)
        return DRFResponse(serializer.data, status = status.HTTP_200_OK)
        
    def post(self, request , pk):
        serializer = Commentserializer(data =request.data)

        if serializer.is_valid():
            ques = Question.objects.get(pk =pk)
            serializer.save(author = request.user, question = ques)
            return DRFResponse(serializer.data, status=status.HTTP_201_CREATED)
        return DRFResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

           