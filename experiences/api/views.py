from django.db.models import Count
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets, generics, views
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, JSONParser
from rest_framework import filters
from experiences.api.filters import experience_filter, DynamicSearchFilter, DynamicSearchOpportunityFilter, \
    opportunity_filter, DynamicSearchInternshipFilter, internship_filter
from experiences.api.pagination import StandardResultsSetPagination, StandardOpportunitiesResultsSetPagination, \
    StandardUnipiInternshipsResultsSetPagination
from experiences.api.serializers import TagSerializer, ExperienceSerializer, UpdateExperienceImageSerializer, \
    SfsLabErasmusAdditionalAttributesSerializer, CongressConferenceSummerSchoolAdditionalAttributesSerializer, \
    UnipiInternshipSerializer, UniversitySerializer, \
    InternshipAdditionalAttributesSerializer, OpportunitySerializer, OpportunityStatusSerializer, CitySerializer
from experiences.api.permissions import IsAuthorOrReadOnly, IsAuth1OrReadOnly, IsAuth2OrReadOnly
from experiences.models import Tag, Experience, SfsLabErasmusAdditionalAttributes, \
    CongressConferenceSummerSchoolAdditionalAttributes, \
    UnipiInternship, University, InternshipAdditionalAttributes, Opportunity, City
from core.utils import EXPERIENCE_TYPES, EXP_GROUP_TAGS, OPP_GROUP_TAGS, WARDS, switcher, UNIPI_INTERNSHIP_PLACES, \
    ATTENDANCE_CHOICES, UNIPI_INTERNSHIP_YEAR


class UniversityListView(generics.ListAPIView):
    queryset = University.objects.all().order_by('country')
    serializer_class = UniversitySerializer


class CityListView(generics.ListAPIView):
    queryset = City.objects.all()
    serializer_class = CitySerializer


class CityCreateView(generics.CreateAPIView):
    queryset = City.objects.all()
    serializer_class = CitySerializer


class ExpTagListView(generics.ListAPIView):
    queryset = Tag.objects.filter(group__in=[x[0] for x in EXP_GROUP_TAGS]).annotate(count=Count('experiences__pk')).order_by('-count')
    serializer_class = TagSerializer


class OppTagListView(generics.ListAPIView):
    queryset = Tag.objects.filter(group__in=[x[0] for x in OPP_GROUP_TAGS]).annotate(count=Count('opportunities__pk')).order_by(
        '-count')
    serializer_class = TagSerializer


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


class UserOpportunityListView(generics.ListAPIView):
    serializer_class = OpportunitySerializer

    def get_queryset(self):
        return Opportunity.objects.filter(author=self.request.user).order_by('-created_at', '-updated_at', '-id')


class UserOpportunityActivationUpdateView(generics.UpdateAPIView):
    queryset = Opportunity.objects.all()
    serializer_class = OpportunityStatusSerializer
    permission_classes = [IsAuthorOrReadOnly, IsAuth2OrReadOnly]
    lookup_field = "slug"


class UpdateExperienceImage(generics.UpdateAPIView):
    queryset = Experience.objects.all().order_by('-created_at')
    lookup_field = "slug"
    serializer_class = UpdateExperienceImageSerializer
    permission_classes = [IsAuthorOrReadOnly, IsAuth1OrReadOnly]
    parser_classes = [MultiPartParser, JSONParser]


class SfsLabErasmusAdditionalAttributesCreate(generics.CreateAPIView):
    queryset = SfsLabErasmusAdditionalAttributes.objects.all()
    serializer_class = SfsLabErasmusAdditionalAttributesSerializer
    permission_classes = [IsAuth1OrReadOnly, ]

    def perform_create(self, serializer):
        serializer.save(slug=self.kwargs.get('slug'))


class CongressConferenceSummerSchoolAdditionalAttributesCreate(generics.CreateAPIView):
    queryset = CongressConferenceSummerSchoolAdditionalAttributes.objects.all()
    serializer_class = CongressConferenceSummerSchoolAdditionalAttributesSerializer
    permission_classes = [IsAuth1OrReadOnly, ]

    def perform_create(self, serializer):
        serializer.save(slug=self.kwargs.get('slug'))


class InternshipAdditionalAttributesCreate(generics.CreateAPIView):
    queryset = InternshipAdditionalAttributes.objects.all()
    serializer_class = InternshipAdditionalAttributesSerializer
    permission_classes = [IsAuth1OrReadOnly, ]

    def perform_create(self, serializer):
        serializer.save(slug=self.kwargs.get('slug'))


class ExperienceAttrsRUDAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuth1OrReadOnly, IsAuthorOrReadOnly]

    def get_experience(self):
        return Experience.objects.get(slug=self.kwargs.get('slug'))

    def get_object(self):
        exp = self.get_experience()
        return exp.get_attribute()

    def get_serializer_class(self):
        exp = self.get_experience()
        try:
            return switcher(obj=exp.type,
                            attrs1=SfsLabErasmusAdditionalAttributesSerializer,
                            attrs2=CongressConferenceSummerSchoolAdditionalAttributesSerializer,
                            attrs3=InternshipAdditionalAttributesSerializer
                            )
        except ValueError:
            raise ValueError


class OpportunityStatusUpdateView(generics.UpdateAPIView):
    queryset = Opportunity.objects.all()
    lookup_field = "slug"
    lookup_url_kwarg = "slug"
    serializer_class = OpportunityStatusSerializer
    permission_classes = [IsAuth2OrReadOnly, IsAuthorOrReadOnly]


class ExperienceViewSet(viewsets.ModelViewSet):
    queryset = Experience.objects.all().order_by('-created_at', '-updated_at', '-id', '-ended_at')
    serializer_class = ExperienceSerializer
    lookup_field = "slug"
    lookup_url_kwarg = "slug"
    permission_classes = [IsAuthorOrReadOnly, IsAuth1OrReadOnly]
    pagination_class = StandardResultsSetPagination
    ordering_fields = ['created_at', 'updated_at', 'started_at', 'ended_at']
    filter_backends = [filters.OrderingFilter, DynamicSearchFilter]

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


class OpportunityViewSet(viewsets.ModelViewSet):
    queryset = Opportunity.objects.all().order_by('-created_at', '-updated_at', '-id')
    serializer_class = OpportunitySerializer
    lookup_field = "slug"
    lookup_url_kwarg = "slug"
    permission_classes = [IsAuth2OrReadOnly, IsAuthorOrReadOnly]
    pagination_class = StandardOpportunitiesResultsSetPagination
    filter_backends = [filters.OrderingFilter, DynamicSearchOpportunityFilter]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user, created_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(created_by=self.request.user)

    def get_queryset(self):
        return opportunity_filter(self.request.query_params, self.queryset)


class ExpTagGroupView(views.APIView):
    def get(self, request, format=None):
        return Response(EXP_GROUP_TAGS)


class OppTagGroupView(views.APIView):
    def get(self, request, format=None):
        return Response(OPP_GROUP_TAGS)


class ExperienceTypes(views.APIView):
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
