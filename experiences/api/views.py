from django.contrib.auth import get_user_model
from django.db.models import Count
from rest_framework import viewsets, generics, views
from rest_framework.response import Response
from rest_framework import filters
from accounts.api.permissions import IsFacultyMember
from experiences.api.filters import experience_filter, DynamicSearchFilter, \
    DynamicSearchInternshipFilter, internship_filter
from experiences.api.pagination import StandardResultsSetPagination, \
    StandardUnipiInternshipsResultsSetPagination
from experiences.api.parser import MultipartJsonParser
from experiences.api.serializers import TagSerializer, ExperienceSerializer, \
    SfsLabErasmusAdditionalAttributesSerializer, CongressConferenceSummerSchoolAdditionalAttributesSerializer, \
    UnipiInternshipSerializer, UniversitySerializer, \
    InternshipAdditionalAttributesSerializer, CitySerializer
from experiences.api.permissions import IsAuthorOrReadOnly, IsAuth1OrReadOnly
from experiences.models import Tag, Experience, UnipiInternship, University, City
from core.utils import EXPERIENCE_TYPES, EXP_GROUP_TAGS, OPP_GROUP_TAGS, WARDS, switcher, UNIPI_INTERNSHIP_PLACES, \
    ATTENDANCE_CHOICES, UNIPI_INTERNSHIP_YEAR, COUNTRIES, ITALY_REGIONS
from collections import Counter

User = get_user_model()


class UniversityListView(generics.ListAPIView):
    queryset = University.objects.all().order_by('country')
    serializer_class = UniversitySerializer


class CityListView(generics.ListAPIView):
    queryset = City.objects.all()
    serializer_class = CitySerializer


class CityCreateView(generics.CreateAPIView):
    queryset = City.objects.all()
    serializer_class = CitySerializer


class CountriesApiView(views.APIView):
    def get(self, request, format=None):
        return Response(COUNTRIES)


class RegionsApiView(views.APIView):
    def get(self, request, format=None):
        return Response(ITALY_REGIONS)


class TagListView(generics.ListAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

    def filter_queryset(self, queryset):
        return queryset.filter(group__in=[x[0] for x in OPP_GROUP_TAGS]) if (
                self.kwargs.get("activity") == "opportunity") else queryset

    def get_queryset(self):
        count = "opportunities__pk" if (self.kwargs.get("activity") == "opportunity") else 'experiences__pk'
        return self.queryset.annotate(count=Count(count)).order_by('-count')


class TagGroupsApiView(views.APIView):
    def get(self, request, format=None):
        return Response(EXP_GROUP_TAGS)


class TagCreateView(generics.CreateAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class UserExperienceListView(generics.ListAPIView):
    serializer_class = ExperienceSerializer

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'student'):
            return Experience.objects.filter(author=user.student).order_by('-created_at', '-updated_at', '-id')
        else:
            return None


class UserInternshipListView(generics.ListAPIView):
    serializer_class = UnipiInternshipSerializer

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'student'):
            return UnipiInternship.objects.filter(author=user.student).order_by('-created_at', '-updated_at', '-id')
        else:
            return None


class ExperienceAttrsBaseView(generics.GenericAPIView):
    def get_experience(self):
        return Experience.objects.get(slug=self.kwargs.get('slug'))

    def get_serializer_class(self):
        return switcher(
            obj=self.get_experience().type,
            attrs1=SfsLabErasmusAdditionalAttributesSerializer,
            attrs2=CongressConferenceSummerSchoolAdditionalAttributesSerializer,
            attrs3=InternshipAdditionalAttributesSerializer
        )


class ExperienceAttrsCreateView(ExperienceAttrsBaseView, generics.CreateAPIView):
    permission_classes = [IsAuth1OrReadOnly, ]

    def perform_create(self, serializer):
        serializer.save(slug=self.kwargs.get('slug'))


class ExperienceAttrsRUDAPIView(ExperienceAttrsBaseView, generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuth1OrReadOnly, IsAuthorOrReadOnly]

    def get_object(self):
        exp = self.get_experience()
        return exp.get_attribute()


class ExperienceViewSet(viewsets.ModelViewSet):
    queryset = Experience.objects.all().order_by('-created_at', '-updated_at', '-id', '-ended_at')
    serializer_class = ExperienceSerializer
    lookup_field = "slug"
    lookup_url_kwarg = "slug"
    permission_classes = [IsAuthorOrReadOnly, IsAuth1OrReadOnly]
    pagination_class = StandardResultsSetPagination
    ordering_fields = ['created_at', 'updated_at', 'started_at', 'ended_at']
    filter_backends = [filters.OrderingFilter, DynamicSearchFilter]
    parser_classes = [MultipartJsonParser, ]

    def get_queryset(self):
        return experience_filter(self.request.query_params, self.queryset)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user.student, created_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(created_by=self.request.user)


class UnipiInternshipViewSet(viewsets.ModelViewSet):
    queryset = UnipiInternship.objects.filter(active=True).order_by('-created_at', '-updated_at', '-id')
    serializer_class = UnipiInternshipSerializer
    lookup_field = "slug"
    lookup_url_kwarg = "slug"
    pagination_class = StandardUnipiInternshipsResultsSetPagination
    permission_classes = [IsAuthorOrReadOnly, IsAuth1OrReadOnly]
    filter_backends = [filters.OrderingFilter, DynamicSearchInternshipFilter]

    def get_queryset(self):
        return internship_filter(self.request.query_params, self.queryset)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user.student)


class ExperienceTypesApiView(views.APIView):
    def get(self, request, format=None):
        return Response(EXPERIENCE_TYPES)


class UnipiInternshipWardsApiView(views.APIView):
    def get(self, request, format=None):
        return Response(WARDS)


class UnipiInternshipPlacesApiView(views.APIView):
    def get(self, request, format=None):
        return Response(UNIPI_INTERNSHIP_PLACES)


class UnipiInternshipAttendanceChoicesApiView(views.APIView):
    def get(self, request, format=None):
        return Response(ATTENDANCE_CHOICES)


class UnipiInternshipYearsApiView(views.APIView):
    def get(self, request, format=None):
        return Response(UNIPI_INTERNSHIP_YEAR)


class ExperienceTypeGraphDataApiView(views.APIView):
    def getTypeName(self, item):
        for el in EXPERIENCE_TYPES:
            if item == el[0]:
                return el[1]

    def get(self, request, format=None):
        data = {}
        for el in Experience.objects.all():
            if self.getTypeName(el.type) in list(data.keys()):
                data[self.getTypeName(el.type)] += 1
            else:
                data[self.getTypeName(el.type)] = 1
        return Response(data)


class ExperienceCountryGraphDataApiView(views.APIView):
    def get(self, request, format=None):
        data = {}
        for el in Experience.objects.all():
            if el.city.country in list(data.keys()):
                data[el.city.country] += 1
            else:
                data[el.city.country] = 1
        return Response(data)


class ExperienceTagGraphDataApiView(views.APIView):
    def get(self, request, format=None):
        data = {}
        for el in Experience.objects.all():
            for t in el.tags.all():
                if t.name in list(data.keys()):
                    data[t.name] += 1
                else:
                    data[t.name] = 1
        return Response(dict(Counter(data).most_common(10)))


class ExperiencesTutorDashboard(views.APIView):
    permission_classes = [IsFacultyMember, ]

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.dashboard = True

    def set_option(self):
        if self.kwargs.get('username') != "all":
            self.dashboard = False

    def get_username(self):
        return self.kwargs.get('username')

    def get_author_obj(self):
        return User.objects.get(username=self.get_username())

    def get_experiences(self):
        self.set_option()
        if self.dashboard:
            return Experience.objects.filter(author__in=self.request.user.tutor.tutees)
        return Experience.objects.filter(author=self.get_author_obj())
