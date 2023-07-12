from rest_framework.generics import ListAPIView
from accounts.api.permissions import IsFacultyMember
from courses.models import ThematicArea, Course, CourseAttendance
from courses.api.serializers import ThematicAreaSerializer, CourseSerializer, CourseAttendanceSerializer


class ThematicAreasListView(ListAPIView):
    serializer_class = ThematicAreaSerializer
    queryset = ThematicArea.objects.all()


class CourseListView(ListAPIView):
    serializer_class = CourseSerializer
    queryset = Course.objects.all()


class CourseAttendanceListView(ListAPIView):
    serializer_class = CourseAttendanceSerializer
    queryset = CourseAttendance.objects.all()