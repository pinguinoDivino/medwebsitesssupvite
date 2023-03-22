from django.urls import path
from accounts.api import views

urlpatterns = [
    path('user/', views.CurrentUser.as_view(), name='current-user'),
    path('user-dpc/', views.UserUpdateDpcView.as_view(), name='set-user-dpc'),
    path('faculty-members/', views.FacultyMemberListApiView.as_view(), name='faculty-members-list'),
    path('faculty-member/information/', views.FacultyMemberInformation.as_view(), name="faculty-member-information")
]
