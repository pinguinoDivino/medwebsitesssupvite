from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.generics import UpdateAPIView
from rest_framework.response import Response
from accounts.api.serializers import UserDisplaySerializer, UserUpdateDpcSerializer, TutorAccountDisplaySerializer
from core.utils import TUTORS
from .permissions import IsTutor

User = get_user_model()


class CurrentUser(APIView):
    def get(self, request):
        serializer = UserDisplaySerializer(request.user)
        return Response(serializer.data)


class TutorListApiView(APIView):
    def get(self, request, format=None):
        return Response(TUTORS)


class UserUpdateDpcView(UpdateAPIView):
    serializer_class = UserUpdateDpcSerializer

    def get_object(self):
        return self.request.user


class TutorInformation(APIView):
    permission_classes = [IsTutor, ]

    def get(self, request):
        serializer = TutorAccountDisplaySerializer(request.user.tutor)
        return Response(serializer.data)
