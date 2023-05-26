from django.urls import include, path
from rest_framework.routers import DefaultRouter
from experiences.api import views as ev

router = DefaultRouter()
router.register(r"experiences", ev.ExperienceViewSet)
router.register(r"unipi-internships", ev.UnipiInternshipViewSet)

urlpatterns = [
    path("", include(router.urls)),

    path("user-experiences/", ev.UserExperienceListView.as_view(), name="user-experience-list"),

    path("user-internships/", ev.UserInternshipListView.as_view(), name="user-internship-list"),

    path("experience/<slug:slug>/attrs/create/", ev.ExperienceAttrsCreateView.as_view(),
         name="create-attrs"),

    path("experience/<slug:slug>/attrs/", ev.ExperienceAttrsRUDAPIView.as_view(), name="experience-attrs"),

    path("universities/", ev.UniversityListView.as_view(), name="university-list"),

    path("cities/create/", ev.CityCreateView.as_view(), name="create-city"),

    path("cities/", ev.CityListView.as_view(), name="city-list"),

    path("tags/create/", ev.TagCreateView.as_view(), name="create-tag"),

    path("tags/groups/", ev.TagGroupsApiView.as_view(), name="tag-groups"),

    path("tags/<str:activity>/", ev.TagListView.as_view(), name="tag-list"),

    path("internship-wards/", ev.UnipiInternshipWardsApiView.as_view(), name="internship-ward-list"),

    path("internship-attendances/", ev.UnipiInternshipAttendanceChoicesApiView.as_view(),
         name="internship-attendance-list"),

    path("internship-places/", ev.UnipiInternshipPlacesApiView.as_view(), name="internship-place-list"),

    path("internship-years/", ev.UnipiInternshipYearsApiView.as_view(), name="internship-year-list"),

    path("experience-types/", ev.ExperienceTypesApiView.as_view(), name="experience-type-list"),

    path("countries/", ev.CountriesApiView.as_view(), name="countries-list"),

    path("regions/", ev.RegionsApiView.as_view(), name="regions-list"),

    path("data/experiences/types/", ev.ExperienceTypeGraphDataApiView.as_view(), name="experience-type-graph-data"),

    path("data/experiences/countries/", ev.ExperienceCountryGraphDataApiView.as_view(),
         name="experience-country-graph-data"),
    path("data/experiences/tags/", ev.ExperienceTagGraphDataApiView.as_view(),
         name="experience-tag-graph-data"),

    path("tutor/data/<str:username>/experiences/", ev.ExperiencesTutorDashboard.as_view(),
         name="tutor-data-student-experiences"),
]
