from rest_framework.permissions import BasePermission, AllowAny, IsAuthenticated 
from rest_framework.views import APIView

class IsOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.author == request.user

class StandardPermissionAPIView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        elif self.request.method == 'POST':
            return [IsAuthenticated()]
        elif self.request.method in ['PATCH', 'DELETE']:
            return [IsAuthenticated(), IsOwner()]
        return super().get_permissions()