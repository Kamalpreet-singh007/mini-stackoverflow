# from django.shortcuts import render
# from django.http import HttpResponse

from .serializer import (
    Questionserializer,
    Responseserializer,
    Commentserializer,
    UpvotesSerializer,
)
from .models import Question, Response, Comment, Upvote
from .permissions import StandardPermissionAPIView
from django.contrib.contenttypes.models import ContentType

from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response as DRFResponse
from rest_framework.pagination import PageNumberPagination
from rest_framework import status, filters
from django.core.exceptions import ObjectDoesNotExist

from django.db.models import Prefetch

# Create your views here.


class QuestionAPIView(StandardPermissionAPIView):
    def get(self, request, question_pk=None):
        print(request.user
              )
        if question_pk:
            try:
                question = Question.objects.get(pk=question_pk)
            except Question.DoesNotExist:
                return DRFResponse(
                    {"ERROR": "404 Not Found"}, status=status.HTTP_400_BAD_REQUEST
                )
            serializer = Questionserializer(question)
            return DRFResponse(serializer.data, status=status.HTTP_200_OK)
        else:
            questions = (
                Question.objects.select_related("author")
                .prefetch_related(
                    "upvotes",
                    Prefetch(
                        "responses", queryset=Response.objects.select_related("author")
                    ),
                )
                .order_by("created_at")
            )
            user = request.user.id
            data = []
            for question in questions:
                data.append(
                    {
                        "author": {
                            "id": question.author.id,
                            "username": question.author.username,
                        },
                        "id": question.id,
                        "title": question.title,
                        "body": question.body,
                        "response_count": question.responses.count(),
                        "created_at": question.created_at,
                        "updated_at": question.updated_at,
                        "upvote_count": question.upvotes.count(),
                        "upvoted_by_user": question.upvotes.filter(
                            author=user
                        ).exists(),
                    }
                )
            # paginator = PageNumberPagination()
            # paginator.page_size = 9
            # result_page = paginator.paginate_queryset(questions, request)
            # serializer = Questionserializer(result_page, many=True)

            # return paginator.get_paginated_response(serializer.data)
            return DRFResponse(data, status=status.HTTP_200_OK)

    def post(self, request):
        data = {**request.data, "author": request.user.id}
        serializer = Questionserializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return DRFResponse(serializer.data, status=status.HTTP_201_CREATED)
        return DRFResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, question_pk=None):
        if question_pk:
            try:
                question = Question.objects.get(pk=question_pk)
            except Question.DoesNotExist:
                return DRFResponse(
                    {"ERROR": "Question not found"}, status=status.HTTP_404_NOT_FOUND
                )
            self.check_object_permissions(request, question)
            serializer = Questionserializer(question, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return DRFResponse(serializer.data, status=status.HTTP_200_OK)
            return DRFResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return DRFResponse(
            {"ERROR": "Question ID not provided"}, status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, question_pk=None):
        if question_pk:
            try:
                question = Question.objects.get(pk=question_pk)
            except Question.DoesNotExist:
                return DRFResponse(
                    {"ERROR": "Question not found"}, status=status.HTTP_404_NOT_FOUND
                )
            self.check_object_permissions(request, question)
            question.delete()
            return DRFResponse(
                {"message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT
            )
        return DRFResponse(
            {"ERROR": "Question ID not provided"}, status=status.HTTP_400_BAD_REQUEST
        )


class ResponseAPIView(StandardPermissionAPIView):
    def get(self, request, question_pk=None):
        if question_pk:
            try:
                # response = Response.objects.filter(question=question_pk)
                response = (
                    Response.objects.filter(question=question_pk)
                    .select_related("author")
                    .prefetch_related("upvotes", "comments")
                )
            except Response.DoesNotExist:
                return DRFResponse(
                    {"ERROR": "404 Not Found"}, status=status.HTTP_404_NOT_FOUND
                )
            user = request.user.id
            data = []
            for res in response:
                data.append(
                    {
                        "id": res.id,
                        "body": res.body,
                        "author": {
                            "id": res.author.id,
                            "username": res.author.username,
                        },
                        "upvote_count": res.upvotes.count(),
                        "comment_count": res.comments.count(),
                        "created_at": res.created_at,
                        "updated_at": res.updated_at,
                        "upvoted_by_user": res.upvotes.filter(
                            author=user
                        ).exists(),
                    }
                )

            # serializer = Responseserializer(response, many=True)
            return DRFResponse(data, status=status.HTTP_200_OK)

        return DRFResponse(
            {"ERROR": "Question ID not provided"}, status=status.HTTP_400_BAD_REQUEST
        )

    def post(self, request, question_pk=None):
        if question_pk:
            data = {**request.data, "author": request.user.id, "question": question_pk}
            serializer = Responseserializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return DRFResponse(serializer.data, status=status.HTTP_201_CREATED)
            return DRFResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return DRFResponse(
            {"ERROR": "Question ID not provided"}, status=status.HTTP_400_BAD_REQUEST
        )


class SingleResponseAPIView(StandardPermissionAPIView):
    def get(self, request, response_pk=None):
        if response_pk:
            try:
                response = Response.objects.get(pk=response_pk)
            except Response.DoesNotExist:
                return DRFResponse(
                    {"ERROR": "404 Not Found"}, status=status.HTTP_404_NOT_FOUND
                )

            serializer = Responseserializer(response)
            return DRFResponse(serializer.data, status=status.HTTP_200_OK)
        return DRFResponse(
            {"ERROR": "Response ID not provided"}, status=status.HTTP_400_BAD_REQUEST
        )

    def patch(self, request, response_pk=None):
        if response_pk:
            try:
                response = Response.objects.get(pk=response_pk)
            except Response.DoesNotExist:
                return DRFResponse(
                    {"ERROR": "404 Not Found"}, status=status.HTTP_404_NOT_FOUND
                )
            self.check_object_permissions(request, response)
            serializer = Responseserializer(response, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return DRFResponse(serializer.data, status=status.HTTP_200_OK)
            return DRFResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return DRFResponse(
            {"ERROR": "Response ID not provided"}, status=status.HTTP_400_BAD_REQUEST
        )

    def delete(
        self,
        request,
        response_pk=None,
    ):
        if response_pk:
            try:
                response = Response.objects.get(pk=response_pk)
            except Response.DoesNotExist:
                return DRFResponse(
                    {"ERROR": "404 Not Found"}, status=status.HTTP_404_NOT_FOUND
                )
            self.check_object_permissions(request, response)
            response.delete()
            return DRFResponse(
                {"message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT
            )
        return DRFResponse(
            {"ERROR": "Response ID not provided"}, status=status.HTTP_400_BAD_REQUEST
        )


class CommentAPIView(StandardPermissionAPIView):
    def get(self, request, response_pk=None):
        if response_pk:
            try:
                comment = (
                    Comment.objects.filter(response=response_pk)
                    .select_related("author")
                    .prefetch_related("comments")
                )
            except Comment.DoesNotExist:
                return DRFResponse(
                    {"ERROR": "404 Not Found"}, status=status.HTTP_404_NOT_FOUND
                )
            user = request.user.id
            data = []
            for comment in comment:
                replies = comment.comments.all()

                data.append(
                    {
                        "id": comment.id,
                        "body": comment.body,
                        "author": {
                            "id": comment.author.id,
                            "username": comment.author.username,
                        },
                        "replies": [
                            {
                                "id": reply.id,
                                "body": reply.body,
                                "author": {
                                    "id": reply.author.id ,
                                    "username": reply.author.username
                                   
                                },
                                "upvote_count": reply.upvotes.count(),
                                "created_at": reply.created_at,
                                "updated_at": reply.updated_at,
                                "upvoted_by_user": reply.upvotes.filter(
                            author=user
                        ).exists(),
                            }
                            for reply in replies
                        ],
                        "upvote_count": comment.upvotes.count(),
                        "created_at": comment.created_at,
                        "updated_at": comment.updated_at,
                    }
                )
            return DRFResponse(data, status=status.HTTP_200_OK)

        return DRFResponse(
            {"ERROR": "Response ID not provided"}, status=status.HTTP_400_BAD_REQUEST
        )

    def post(self, request, response_pk=None):
        if response_pk:
            data = {**request.data, "author": request.user.id, "response": response_pk}
            serializer = Commentserializer(data=data)

            if serializer.is_valid():
                serializer.save()
                print(serializer.data)
                return DRFResponse(serializer.data, status=status.HTTP_201_CREATED)
            return DRFResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return DRFResponse(
            {"ERROR": "Response ID not provided"}, status=status.HTTP_400_BAD_REQUEST
        )


class ReplieAPIView(StandardPermissionAPIView):
    def get(self, request, comment_pk=None):
        if comment_pk:
            try:
                comment = Comment.objects.filter(parent_comment=comment_pk)
            except Comment.DoesNotExist:
                return DRFResponse(
                    {"ERROR": "404 Not Found"}, status=status.HTTP_404_NOT_FOUND
                )
            serializer = Commentserializer(comment, many=True)
            return DRFResponse(serializer.data, status=status.HTTP_200_OK)
        return DRFResponse(
            {"ERROR": "Comment ID not provided"}, status=status.HTTP_400_BAD_REQUEST
        )

    def post(self, request, comment_pk=None):
        if comment_pk:
            data = {
                **request.data,
                "parent_comment": comment_pk,
                "author": request.user.id,
            }
            serializer = Commentserializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return DRFResponse(serializer.data, status=status.HTTP_201_CREATED)
            return DRFResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return DRFResponse(
            {"ERROR": "Comment ID not provided"}, status=status.HTTP_400_BAD_REQUEST
        )


class SingleCommentAPIView(StandardPermissionAPIView):
    def get(self, request, comment_pk=None):
        if comment_pk:
            try:
                comment = Comment.objects.get(pk=comment_pk)
            except Comment.DoesNotExist:
                return DRFResponse(
                    {"ERROR": "404 Not Found"}, status=status.HTTP_404_NOT_FOUND
                )
            serializer = Commentserializer(comment)
            return DRFResponse(serializer.data, status=status.HTTP_200_OK)
        return DRFResponse(
            {"ERROR": "Comment ID not provided"}, status=status.HTTP_400_BAD_REQUEST
        )

    def patch(self, request, comment_pk=None):
        if comment_pk:
            try:
                comment = Comment.objects.get(pk=comment_pk)
            except Comment.DoesNotExist:
                return DRFResponse(
                    {"ERROR": "404 Not Found"}, status=status.HTTP_404_NOT_FOUND
                )
            self.check_object_permissions(request, comment)
            # data = {**request.data}
            serializer = Commentserializer(comment, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return DRFResponse(serializer.data, status=200)
            return DRFResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return DRFResponse(
            {"ERROR": "Comment ID not provided"}, status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, comment_pk=None):
        if comment_pk:
            try:
                comment = Comment.objects.get(pk=comment_pk)
            except Comment.DoesNotExist:
                return DRFResponse(
                    {"ERROR": "404 Not Found"}, status=status.HTTP_404_NOT_FOUND
                )
            self.check_object_permissions(request, comment)
            comment.delete()
            return DRFResponse(
                {"message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT
            )
        return DRFResponse(
            {"ERROR": "Comment ID not provided"}, status=status.HTTP_400_BAD_REQUEST
        )


class GetUpvoteCountAPIView(APIView):
    def post(self, request, target_pk=None):
        if target_pk:
            target_model = request.data.get("entity_type")
            # target_model = "question"
            try:
                content_type = ContentType.objects.get(model=target_model)
                model = content_type.model_class()
                obj = model.objects.get(pk=target_pk)
            except ContentType.DoesNotExist:
                return DRFResponse(
                    {"ERROR": f"Model '{model}' does not exist."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            except ObjectDoesNotExist:
                return DRFResponse(
                    {
                        "ERROR": f"Object with id {target_pk} does not exist in model '{model}'."
                    },
                    status=status.HTTP_404_NOT_FOUND,
                )
            data = obj.upvotes.all()
            upvote_count = data.count()
            return DRFResponse({"count": upvote_count}, status=status.HTTP_200_OK)
        return DRFResponse(
            {"ERROR": "Target ID not provided"}, status=status.HTTP_400_BAD_REQUEST
        )


class UpvoteAPIView(StandardPermissionAPIView):
    def post(self, request, target_pk=None):
        if target_pk:
            target_model = request.data.get("entity_type")

            try:
                content_type = ContentType.objects.get(model=target_model)
                model = content_type.model_class()
            except ContentType.DoesNotExist:
                return DRFResponse(
                    {"ERROR": "Model  does not exist."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            except ObjectDoesNotExist:
                return DRFResponse(
                    {
                        "ERROR": f"Object with id {target_pk} does not exist in model '{model}'."
                    },
                    status=status.HTTP_404_NOT_FOUND,
                )
            data = {
                "content_type": content_type.id,
                "author": request.user.id,
                "object_id": target_pk,
            }
            serializer = UpvotesSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return DRFResponse(serializer.data, status=status.HTTP_201_CREATED)
            return DRFResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return DRFResponse(
            {"ERROR": "Target ID not provided"}, status=status.HTTP_400_BAD_REQUEST
        )


class GetUpvoteAPIView(APIView):
    def post(self, request, target_pk=None):
        if target_pk:
            target_model = request.data.get("entity_type")

            try:
                content_type = ContentType.objects.get(model=target_model)
                model = content_type.model_class()
            except ContentType.DoesNotExist:
                return DRFResponse(
                    {"ERROR": "Model  does not exist."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            except ObjectDoesNotExist:
                return DRFResponse(
                    {
                        "ERROR": f"Object with id {target_pk} does not exist in model '{model}'."
                    },
                    status=status.HTTP_404_NOT_FOUND,
                )
            data = model.upvotes.all()
            serializer = UpvotesSerializer(data, many=True)
            return DRFResponse(serializer.data, status=status.HTTP_200_OK)
        return DRFResponse(
            {"ERROR": "Target ID not provided"}, status=status.HTTP_400_BAD_REQUEST
        )


class DownvoteAPIView(StandardPermissionAPIView):
    def post(self, request, target_pk):
        if target_pk:
            target_model = request.data.get("entity_type")

            try:
                content_type = ContentType.objects.get(model=target_model)
                model = content_type.model_class()
            except ContentType.DoesNotExist:
                return DRFResponse(
                    {"ERROR": "Model  does not exist."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            except ObjectDoesNotExist:
                return DRFResponse(
                    {
                        "ERROR": f"Object with id {target_pk} does not exist in model '{model}'."
                    },
                    status=status.HTTP_404_NOT_FOUND,
                )
            try:
                upvote = Upvote.objects.filter(
                    author=request.user, object_id=target_pk, content_type=content_type
                )
            except Upvote.DoesNotExist:
                return DRFResponse(
                    {"ERROR": "404 Not Found"}, status=status.HTTP_404_NOT_FOUND
                )
            self.check_object_permissions(request, upvote)
            upvote.delete()
            return DRFResponse(
                {"message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT
            )
        return DRFResponse(
            {"ERROR": "Target ID not provided"}, status=status.HTTP_400_BAD_REQUEST
        )


class QuestionSearchView(ListAPIView):
    queryset = Question.objects.all()
    serializer_class = Questionserializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["title", "body"]
