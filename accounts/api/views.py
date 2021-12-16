from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from accounts.api.serializers import UserDisplaySerializer
from core.utils import TUTORS

User = get_user_model()


class CurrentUser(APIView):
    def get(self, request):
        serializer = UserDisplaySerializer(request.user)
        return Response(serializer.data)


class TutorListApiView(APIView):
    def get(self, request, format=None):
        return Response(TUTORS)
