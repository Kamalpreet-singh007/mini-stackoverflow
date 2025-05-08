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
    def get(self, request, question_pk = None):
        if question_pk :
            try :
                ques = Question.objects.get(pk =question_pk)
            except Question.DoesNotExist:
                return DRFResponse({"ERROR":"404 Not Found"}, status = status.HTTP_400_BAD_REQUEST)
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
        data = {
            **request.data,
            'author' : request.user.id
            }
        serializer = Questionserializer(data = data)
        if serializer.is_valid():
            serializer.save()
            return DRFResponse(serializer.data, status=status.HTTP_201_CREATED)
        return DRFResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self ,request,question_pk = None):
        try:
            ques =  Question.objects.get(pk =question_pk)
        except Question.DoesNotExist:
            return DRFResponse({"error": "Question not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = Questionserializer(ques, data  = request.data, partial = True)
        if serializer.is_valid():
            serializer.save()
            return DRFResponse(serializer.data, status=status.HTTP_200_OK)
        return DRFResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self,request,question_pk = None):
        if pk:
            try:
                ques = Question.objects.get(pk = question_pk)
            except Question.DoesNotExist:
                return DRFResponse({"error": "Question not found"}, status=status.HTTP_404_NOT_FOUND)
            ques.delete()
            return DRFResponse({"message": "Deleted successfully"}, status=staus.HTTP_204_DELETED)
        return DRFResponse({"error": "No ID provided"}, status=status.HTTP_400_BAD_REQUEST)


class ResponseAPIview(APIView):
    def get(self, request, question_pk = None):
       
        if question_pk :      
            try:
                resp = Response.objects.filter(question = question_pk)
            except Response.DoesNotExist:
                return DRFResponse({"ERROR":"404 Not Found"}, status = status.HTTP_404_NOT_FOUND)
               
            serializer = Responseserializer(resp, many = True)
            return DRFResponse(serializer.data, status = status.HTTP_200_OK)
               
        return DRFResponse({"error": "No ID provided"}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, question_pk = None):
        if question_pk:
            data ={
                **request.data,
                'author' : request.user.id,
                'question'  : question_pk
            }
            serializer = Responseserializer(data = data)
            if serializer.is_valid():
                serializer.save()
                return DRFResponse(serializer.data, status=status.HTTP_201_CREATED)
            return DRFResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return DRFResponse({"error": "question_pk required"}, status= status.HTTP_400_BAD_REQUEST)

class SingleResponseAPIview(APIView):
    def get(self , request, reponse_pk = None):
        if reponse_pk :
            try:
                resp = Response.objects.get(pk = response_pk)
            except Response.DoesNotExist:
                return DRFResponse({"ERROR":"404 Not Found"}, status = status.HTTP_404_NOT_FOUND)

            serializer = Responseserializer(resp)
            return DRFResponse(serializer.data, status = status.HTTP_200_OK)

    def patch(self,request,response_pk = None ):
        if response_pk is None:
            return DRFResponse({"error": "No ID provided"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            resp = Response.objects.get(pk = response_pk)
        except Response.DoesNotExist:
            return DRFResponse({"ERROR":"404 Not Found"}, status = status.HTTP_404_NOT_FOUND)

        serializer = Responseserializer(resp, data = request.data, partial = True)
        if serializer.is_valid():
            serializer.save()
            return DRFResponse(serializer.data, status=status.HTTP_200_OK)
        return DRFResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self , request, response_pk = None, question_pk = None):
        if pk:
            try:
                resp =  Response.objects.get(pk = response_pk)
            except Response.DoesNotExist:
                return DRFResponse({"ERROR":"404 Not Found"}, status =status.HTTP_404_NOT_FOUND)
            resp.delete()
            return DRFResponse({"message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        return DRFResponse({"error": "No ID provided"}, status=status.HTTP_400_BAD_REQUEST)


class CommentAPIview(APIView):
    def get(self, request, response_pk = None):
       
        if response_pk:
            try:
                comen = Comment.objects.filter(response =  response_pk)
            except Comment.DoesNotExist:
                return DRFResponse({"ERROR":"404 Not Found"}, status =status.HTTP_404_NOT_FOUND)
            serializer = Commentserializer(comen, many = True)
            return DRFResponse(serializer.data, status = status.HTTP_200_OK)

        return DRFResponse({"ERROR": "No ID provided"}, status= status.HTTP_400_BAD_REQUEST)


    def post(self, request , response_pk = None ):
        
        if response_pk:
           
            data = {
                **request.data,
                'author'   : request.user.id,
                'response' : response_pk
            }
            serializer = Commentserializer(data = data)

            if serializer.is_valid():
                serializer.save()
                return DRFResponse(serializer.data ,  status=status.HTTP_201_CREATED)
            return DRFResponse(serializer.errors,status = status.HTTP_400_BAD_REQUEST)
       
class ReplieAPIview(APIView):
    def get(self,request, comment_pk = None):
        if comment_pk:
            try:
                comen = Comment.objects.filter(parent_comment = comment_pk)
            except Comment.DoesNotExist:
                return DRFResponse({"ERROR":"404 Not Found"}, status = status.HTTP_404_NOT_FOUND)
            serializer = Commentserializer(comen, many = True)
            return DRFResponse(serializer.data, status = status.HTTP_200_OK)
        return DRFResponse({"error": "No ID provided"}, status= status.HTTP_400_BAD_REQUEST)

    def post(self ,request, comment_pk = None):
        if comment_pk:
            data = {
                **request.data,
                'parent_comment' : comment_pk,
                'author' : request.user.id
            }
            serializer = Commentserializer(data = data)
            if serializer.is_valid():
                serializer.save()
                return DRFResponse(serializer.data ,  status=status.HTTP_201_CREATED)
            return DRFResponse(serializer.errors,status = status.HTTP_400_BAD_REQUEST)
        return DRFResponse({"error": "No ID provided"}, status= status.HTTP_400_BAD_REQUEST)

class SingleCommentAPIview(APIView):
    def get(self, request, comment_pk = None):
        if comment_pk :
            try:
                comen = Comment.objects.get(pk = comment_pk)
            except Comment.DoesNotExist:
                return DRFResponse({"ERROR":"404 Not Found"}, status =status.HTTP_404_NOT_FOUND)
            serializer = Commentserializer(comen)
            return DRFResponse(serializer.data, status = status.HTTP_200_OK)
        return DRFResponse({"error": "No ID provided"}, status= status.HTTP_400_BAD_REQUEST)

    def patch(self, request,comment_pk = None):
        if comment_pk:
            try:
                comen = Comment.objects.get(pk = comment_pk)
            except Comment.DoesNotExist:
                 return DRFResponse({"ERROR":"404 Not Found"}, status =status.HTTP_404_NOT_FOUND)
            serializer = Commentserializer(comen, request.data, partial = True)    
            if serializer.is_valid():
                serializer.save()
                return DRFResponse(serializer.data, status=200)
        return DRFResponse({"error": "No ID provided"}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, comment_pk = None):
        if comment_pk:
            try:
                comen = Comment.objects.get(pk = comment_pk)
            except comment.DoesNotExist:
                return DRFResponse({"ERROR":"404 Not Found"}, status = status.HTTP_404_NOT_FOUND)
            comen.delete()
            return DRFResponse({"message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        return DRFResponse({"error": "No ID provided"}, status=status.HTTP_400_BAD_REQUEST)


