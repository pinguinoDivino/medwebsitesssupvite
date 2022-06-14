from rest_framework import generics

from .pagination import StandardResultsSetPagination
from .permissions import DiaryIsAuthOrReadOnly
from ..models import Diary, Page
from .serializers import DiarySerializer, PageSerializer


class DiaryListApiView(generics.ListAPIView):
    serializer_class = DiarySerializer
    queryset = Diary.objects.all().order_by('-created_at')
    pagination_class = StandardResultsSetPagination


class DiaryRetrieveApiView(generics.RetrieveAPIView):
    serializer_class = DiarySerializer
    queryset = Diary.objects.all().order_by('-created_at')


class PageCreateApiView(generics.CreateAPIView):
    serializer_class = PageSerializer
    queryset = Page.objects.all().order_by('-updated_at', '-created_at')
    permission_classes = [DiaryIsAuthOrReadOnly, ]

    def perform_create(self, serializer):
        serializer.save(diary_id=self.kwargs.pop('pk'))


class PageRUDApiView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PageSerializer
    queryset = Page.objects.all().order_by('-updated_at', '-created_at')
    permission_classes = [DiaryIsAuthOrReadOnly, ]
