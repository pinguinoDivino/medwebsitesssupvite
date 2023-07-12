from django.urls import path
from courses.api import views

urlpatterns = [
    path("thematic-areas/", views.ThematicAreasListView.as_view(), name="thematic-area-list"),
]
