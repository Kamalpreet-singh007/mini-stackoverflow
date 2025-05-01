from .models import User
from accounts.serializers import UserSerializer

from rest_framework.views import APIView
from rest_framework.response import Response as DRFResponse
from rest_framework import status

# class UserAPIview(APIView):
#     def get(self,request,pk = None):
#         if pk :
#             try:
#                 user = User.objects.get(pk = pk)
#                 serializer = UserSerializer(user)
#                 return DRFResponse(serializer.data, status = status.HTTP_200_OK)
#             except User.DoesNotExist:
#                 return DRFResponse({"ERROR":"404 Not Found"}, status = 404)
#         else:
#             user = User.objects.all()
#             serializer = UserSerializer(user, many = True)
#             return DRFResponse(serializer.data, status = status.HTTP_200_OK)


# class UserLoginAPI(APIView):

# class UserSigninAPI(APIView):

# class UserLogoutAPI(APIView):
    