from django.urls import include, path
from rest_framework.routers import DefaultRouter
from experiences.api import views as ev

router = DefaultRouter()
router.register(r"experiences", ev.ExperienceViewSet)
router.register(r"unipi-internships", ev.UnipiInternshipViewSet)
router.register(r"opportunities", ev.OpportunityViewSet)

urlpatterns = [
    path("", include(router.urls)),

    path("exp-tags/", ev.ExpTagListView.as_view(), name="tag-exp-list"),

    path("opp-tags/", ev.OppTagListView.as_view(), name="tag-opp-list"),

    path("tags/create/", ev.TagCreateView.as_view(), name="create-tag"),

    path("user-experiences/", ev.UserExperienceListView.as_view(), name="user-experience-list"),

    path("user-internships/", ev.UserInternshipListView.as_view(), name="user-internship-list"),

    path("user-opportunities/", ev.UserOpportunityListView.as_view(), name="user-opportunity-list"),

    path("opportunity/<slug:slug>/status/", ev.UserOpportunityActivationUpdateView.as_view(),
         name="user-opportunity-activation"),

    path("experience/<slug:slug>/update-img/", ev.UpdateExperienceImage.as_view(), name="update-experience-img"),

    path("experience/<slug:slug>/attrs1/create/", ev.SfsLabErasmusAdditionalAttributesCreate.as_view(),
         name="create-attrs1"),
    path("experience/<slug:slug>/attrs2/create/", ev.CongressConferenceSummerSchoolAdditionalAttributesCreate.as_view(),
         name="create-attrs2"),
    path("experience/<slug:slug>/attrs3/create/", ev.InternshipAdditionalAttributesCreate.as_view(),
         name="create-attrs3"),
    path("experience/<slug:slug>/attrs/", ev.ExperienceAttrsRUDAPIView.as_view(), name="experience-attrs"),

    path("universities/", ev.UniversityListView.as_view(), name="university-list"),

    path("cities/", ev.CityListView.as_view(), name="city-list"),

    path("cities/create/", ev.CityCreateView.as_view(), name="create-city"),

    path("opportunities/<slug:slug>/status/", ev.OpportunityStatusUpdateView.as_view(), name="university-status-update"),

    path("expTagGroups/", ev.ExpTagGroupView.as_view(), name="exp-tags-group"),

    path("oppTagGroups/", ev.OppTagGroupView.as_view(), name="opp-tags-group"),

    path("internshipWards/", ev.UnipiInternshipWardsApiView.as_view(), name="internship-ward-list"),

    path("internshipAttendances/", ev.UnipiInternshipAttendanceChoicesApiView.as_view(),
         name="internship-attendance-list"),

    path("internshipPlaces/", ev.UnipiInternshipPlacesApiView.as_view(), name="internship-place-list"),

    path("internshipYears/", ev.UnipiInternshipYearsApiView.as_view(), name="internship-year-list"),

    path("experienceTypes/", ev.ExperienceTypes.as_view(), name="experience-type-list"),
]
