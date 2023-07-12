from rest_framework import serializers
from courses.models import Course, CourseAttendance, ThematicArea


class ThematicAreaSerializer(serializers.ModelSerializer):

    courses_number = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = ThematicArea
        fields = "__all__"

    @staticmethod
    def get_courses_number(instance):
        return instance.get_courses_number()


class CourseSerializer(serializers.ModelSerializer):

    class Meta:
        model = Course
        fields = "__all__"


class CourseAttendanceSerializer(serializers.ModelSerializer):

    class Meta:
        model = CourseAttendance
        fields = "__all__"


