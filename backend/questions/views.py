    # from django.shortcuts import render
    # from django.http import HttpResponse 

from .serializer import Questionserializer, Responseserializer, Commentserializer
from .models import Question,Response, Comment

from rest_framework.views import APIView
from rest_framework.response import Response as DRFResponse
from rest_framework.pagination import PageNumberPagination
from rest_framework import status
# Create your views here.

class QuestionAPIView(APIView):
    def get(self, request, question_pk = None):
        if question_pk :
            try :
                ques = Question.objects.get(pk =question_pk)
            except Question.DoesNotExist:
                return DRFResponse({"ERROR":"404 Not Found"}, status = status.HTTP_400_BAD_REQUEST)
            serializer =Questionserializer(ques)
            return DRFResponse(serializer.data, status = status.HTTP_200_OK)
        else:
            questions = Question.objects.all().order_by('created_at')
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
        if question_pk:
            try:
                ques =  Question.objects.get(pk =question_pk)
            except Question.DoesNotExist:
                return DRFResponse({"ERROR": "Question not found"}, status=status.HTTP_404_NOT_FOUND)

            serializer = Questionserializer(ques, data  = request.data, partial = True)
            if serializer.is_valid():
                serializer.save()
                return DRFResponse(serializer.data, status=status.HTTP_200_OK)
            return DRFResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return DRFResponse({"ERROR":"Question ID not provided"},status=status.HTTP_400_BAD_REQUEST)
    def delete(self,request,question_pk = None):
        if question_pk:
            try:
                ques = Question.objects.get(pk = question_pk)
            except Question.DoesNotExist:
                return DRFResponse({"ERROR": "Question not found"}, status=status.HTTP_404_NOT_FOUND)
            ques.delete()
            return DRFResponse({"message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        return DRFResponse({"ERROR": "Question ID not provided"}, status=status.HTTP_400_BAD_REQUEST)


class ResponseAPIView(APIView):
    def get(self, request, question_pk = None):
       
        if question_pk :      
            try:
                resp = Response.objects.filter(question = question_pk)
            except Response.DoesNotExist:
                return DRFResponse({"ERROR":"404 Not Found"}, status = status.HTTP_404_NOT_FOUND)
               
            serializer = Responseserializer(resp, many = True)
            return DRFResponse(serializer.data, status = status.HTTP_200_OK)
               
        return DRFResponse({"ERROR": "Question ID not provided"}, status=status.HTTP_400_BAD_REQUEST)

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
        return DRFResponse({"ERROR": "Question ID not provided"}, status= status.HTTP_400_BAD_REQUEST)

class SingleResponseAPIView(APIView):
    def get(self , request, response_pk = None):
        if response_pk :
            try:
                resp = Response.objects.get(pk = response_pk)
            except Response.DoesNotExist:
                return DRFResponse({"ERROR":"404 Not Found"}, status = status.HTTP_404_NOT_FOUND)

            serializer = Responseserializer(resp)
            return DRFResponse(serializer.data, status = status.HTTP_200_OK)
        return DRFResponse({"ERROR":"Response ID not provided"}, status = status.HTTP_400_BAD_REQUEST)
    def patch(self,request,response_pk = None ):
        if response_pk :
            try:
                resp = Response.objects.get(pk = response_pk)
            except Response.DoesNotExist:
                return DRFResponse({"ERROR":"404 Not Found"}, status = status.HTTP_404_NOT_FOUND)

            serializer = Responseserializer(resp, data = request.data, partial = True)
            if serializer.is_valid():
                serializer.save()
                return DRFResponse(serializer.data, status=status.HTTP_200_OK)
            return DRFResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return DRFResponse({"ERROR": "Response ID not provided"}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self , request, response_pk = None,):
        if response_pk:
            try:
                resp =  Response.objects.get(pk = response_pk)
            except Response.DoesNotExist:
                return DRFResponse({"ERROR":"404 Not Found"}, status =status.HTTP_404_NOT_FOUND)
            resp.delete()
            return DRFResponse({"message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        return DRFResponse({"ERROR": "Response ID not provided"}, status=status.HTTP_400_BAD_REQUEST)
   

class CommentAPIView(APIView):
    def get(self, request, response_pk = None):
       
        if response_pk:
            try:
                comen = Comment.objects.filter(response =  response_pk)
            except Comment.DoesNotExist:
                return DRFResponse({"ERROR":"404 Not Found"}, status =status.HTTP_404_NOT_FOUND)
            serializer = Commentserializer(comen, many = True)
            return DRFResponse(serializer.data, status = status.HTTP_200_OK)

        return DRFResponse({"ERROR": "Response ID not provided"}, status= status.HTTP_400_BAD_REQUEST)


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
        return DRFResponse({"ERROR":"Response ID not provided"}, status = status.HTTP_400_BAD_REQUEST)       

class ReplieAPIView(APIView):
    def get(self,request, comment_pk = None):
        if comment_pk:
            try:
                comen = Comment.objects.filter(parent_comment = comment_pk)
            except Comment.DoesNotExist:
                return DRFResponse({"ERROR":"404 Not Found"}, status = status.HTTP_404_NOT_FOUND)
            serializer = Commentserializer(comen, many = True)
            return DRFResponse(serializer.data, status = status.HTTP_200_OK)
        return DRFResponse({"ERROR": "Comment ID not provided"}, status= status.HTTP_400_BAD_REQUEST)

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
        return DRFResponse({"ERROR": "Comment ID not provided"}, status= status.HTTP_400_BAD_REQUEST)

class SingleCommentAPIView(APIView):
    def get(self, request, comment_pk = None):
        if comment_pk :
            try:
                comen = Comment.objects.get(pk = comment_pk)
            except Comment.DoesNotExist:
                return DRFResponse({"ERROR":"404 Not Found"}, status =status.HTTP_404_NOT_FOUND)
            serializer = Commentserializer(comen)
            return DRFResponse(serializer.data, status = status.HTTP_200_OK)
        return DRFResponse({"ERROR": "Comment ID not provided"}, status= status.HTTP_400_BAD_REQUEST)

    def patch(self, request,comment_pk = None):
        if comment_pk:
            try:
                comen = Comment.objects.get(pk = comment_pk)
            except Comment.DoesNotExist:
                 return DRFResponse({"ERROR":"404 Not Found"}, status =status.HTTP_404_NOT_FOUND)
            data ={
                **request.data
            }
            serializer = Commentserializer(comen, data = request.data, partial = True)    
            if serializer.is_valid():
                serializer.save()
                return DRFResponse(serializer.data, status=200)
            return DRFResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return DRFResponse({"ERROR":"Comment ID not provided"},status =status.HTTP_400_BAD_REQUEST)

    def delete(self, request, comment_pk = None):
        if comment_pk:
            try:
                comen = Comment.objects.get(pk = comment_pk)
            except Comment.DoesNotExist:
                return DRFResponse({"ERROR":"404 Not Found"}, status = status.HTTP_404_NOT_FOUND)
            comen.delete()
            return DRFResponse({"message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        return DRFResponse({"ERROR": "Comment ID not provided"}, status=status.HTTP_400_BAD_REQUEST)


