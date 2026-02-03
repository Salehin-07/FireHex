from django.urls import path
from django.views.decorators.cache import cache_page
from . import views

app_name = 'core'
urlpatterns = [
    path('', cache_page(60 * 15)(views.TournamentListView.as_view()), name='tournament_list'),
    path('tournament/<uuid:pk>/', views.TournamentDetailView.as_view(), name='tournament_detail'),
    path('tournament/<uuid:pk>/join/', views.TournamentJoinCreateView.as_view(), name='tournament_join'),
    path('my/applications/', views.MyApplicationsView.as_view(), name='my_applications'),
    path('admin_setup/dashboard/requests/', views.AdminRequestListView.as_view(), name='admin_requests'),
    path('admin_setup/dashboard/request/<int:pk>/', views.AdminRequestDetailView.as_view(), name='admin_request_detail'),
    path('admin_setup/dashboard/tournaments/', views.AdminTournamentListView.as_view(), name='admin_tournaments'),
    path('admin_setup/dashboard/tournaments/<uuid:pk>/credentials/', views.CredentialUpdateView.as_view(), name='credential_update'),
]