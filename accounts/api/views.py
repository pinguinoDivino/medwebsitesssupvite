from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.generics import UpdateAPIView, ListAPIView
from rest_framework.response import Response
from accounts.api.serializers import UserDisplaySerializer, UserUpdateDpcSerializer, \
    FacultyMemberDisplaySerializer
from accounts.api.permissions import IsFacultyMember
from accounts.models import FacultyMember

User = get_user_model()


class CurrentUser(APIView):
    def get(self, request):
        serializer = UserDisplaySerializer(request.user)
        return Response(serializer.data)


class FacultyMemberListApiView(ListAPIView):
    serializer_class = FacultyMemberDisplaySerializer
    queryset = FacultyMember.objects.all()


class UserUpdateDpcView(UpdateAPIView):
    serializer_class = UserUpdateDpcSerializer

    def get_object(self):
        return self.request.user


class FacultyMemberInformation(APIView):
    permission_classes = [IsFacultyMember, ]

    def get(self, request):
        serializer = FacultyMemberDisplaySerializer(request.user.faculty_member)
        return Response(serializer.data)
