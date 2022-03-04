from django.urls import path
from accounts.api import views

urlpatterns = [
    path('user/', views.CurrentUser.as_view(), name='current-user'),
    path('user-dpc/', views.UserUpdateDpcView.as_view(), name='set-user-dpc'),
    path('tutors/', views.TutorListApiView.as_view(), name='tutors-list'),
    path('tutor/informations/', views.TutorInformation.as_view(), name="tutor-informations")
]
