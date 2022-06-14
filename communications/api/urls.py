from django.urls import path
from communications.api import views as ev


urlpatterns = [
    path("diaries/", ev.DiaryListApiView.as_view()),
    path("diaries/<int:pk>/", ev.DiaryRetrieveApiView.as_view()),
    path("diaries/<int:pk>/pages/create/", ev.PageCreateApiView.as_view()),
    path("pages/<int:pk>/", ev.PageRUDApiView.as_view()),
]
