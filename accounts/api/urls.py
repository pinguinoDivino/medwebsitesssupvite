from django.urls import path
from accounts.api import views

urlpatterns = [
    path('user/', views.CurrentUser.as_view(), name='current-user'),
    path('tutors/', views.TutorListApiView.as_view(), name='tutors-list'),
]