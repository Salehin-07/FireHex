from django.contrib import admin
from .models import Tournament, TournamentJoinRequest, TournamentCredentialLog, Ads

@admin.register(Tournament)
class TournamentAdmin(admin.ModelAdmin):
    list_display = ('title','game_name','start_datetime','is_active')

@admin.register(TournamentJoinRequest)
class JoinRequestAdmin(admin.ModelAdmin):
    list_display = ('tournament','user','paid','created_at')
    list_filter = ('paid','tournament')

@admin.register(TournamentCredentialLog)
class CredentialLogAdmin(admin.ModelAdmin):
    list_display = ('tournament','posted_by','posted_at')

@admin.register(Ads)
class AdsAdmin(admin.ModelAdmin):
    list_display = ('title','is_active')