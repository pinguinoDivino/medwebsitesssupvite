from django.contrib import admin
from courses.models import ThematicArea, Course, CourseAttendance


class CourseAdmin(admin.ModelAdmin):
    list_display = ["title", "professor", "area", "min_participant_year"]


class CourseAttendanceAdmin(admin.ModelAdmin):
    list_display = ["course", "academic_year", "participants", "started_at", "ended_at"]


admin.site.register(ThematicArea)
admin.site.register(Course, CourseAdmin)
admin.site.register(CourseAttendance, CourseAttendanceAdmin)
