from .models import User
from accounts.serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated

from rest_framework.views import APIView
from rest_framework.response import Response as DRFResponse
from rest_framework import status

class UserAPIview(APIView):
  
    def post(self,request):
        email = request.data.get('email')
        firstname = request.data.get('firstname')
        lastname = request.data.get('lastname')
        password = request.data.get('password')
       

        if not all([email, firstname, password]):
            return DRFResponse({"ERROR": "Allfeilds are required"}, status = status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(email = email).exists():
            return DRFResponse({"ERROR": "An account already exists."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(email=email, password=password, first_name = firstname ,last_name = lastname or "")
        return DRFResponse({"message": "User registered successfully!"}, status=status.HTTP_201_CREATED)



class UserLogoutApiView(APIView):
    
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({"message": "Successfully logged out."}, status=status.HTTP_205_RESET_CONTENT)
        except KeyError:
            return Response({"error": "Refresh token not provided"}, status=status.HTTP_400_BAD_REQUEST)
        except TokenError:
            return Response({"error": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)

class CurrentUserAPIview(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):

        serializer = UserSerializer(request.user)
        return DRFResponse(serializer.data, status = status.HTTP_200_OK)

    def patch(self, request):
        data = {**request.data}
        user = User.objects.get(pk = request.user.id)
        serializer = UserSerializer(user, data = data, partial = True)
        if serializer.is_valid():
            serializer.save()
            return DRFResponse(serializer.data, status=status.HTTP_200_OK)
        return DRFResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


        
# class UserLoginAPI(APIView):

# class UserSigninAPI(APIView):

# class UserLogoutAPI(APIView):
    