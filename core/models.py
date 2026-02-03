import uuid
from django.db import models
from django.conf import settings
from django.urls import reverse

class Tournament(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    max_player_number = models.IntegerField(default=50)
    game_name = models.CharField(max_length=255)
    start_datetime = models.DateTimeField()
    entry_fee = models.DecimalField(max_digits=10, decimal_places=2)
    prize_first = models.CharField(max_length=255)
    prize_second = models.CharField(max_length=255)
    prize_third = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    credentials = models.TextField(blank=True, null=True)
    credentials_release_time = models.DateTimeField(blank=True, null=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='tournaments_created')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        permissions = [
            ('update_credentials', 'Can update tournament credentials'),
        ]
    
    def get_absolute_url(self):
        return reverse('core:admin_tournaments')
    
    def __str__(self):
        return self.title

class TournamentJoinRequest(models.Model):
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='join_requests')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='join_requests')
    whatsapp_number = models.CharField(max_length=32)
    social_profile_url = models.URLField()
    paid = models.BooleanField(default=False)
    admin_handled_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='handled_requests')
    admin_handled_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.user.username} -> {self.tournament.title} ({'paid' if self.paid else 'pending'})"

class TournamentCredentialLog(models.Model):
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='credential_logs')
    credentials_text = models.TextField()
    posted_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    posted_at = models.DateTimeField(auto_now_add=True)


class Ads(models.Model):
    img_url = models.URLField(null=True, blank=True)
    description = models.TextField()
    title = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)  # Optional: to enable/disable ads
    created_at = models.DateTimeField(auto_now_add=True)  # Optional: track creation
    
    class Meta:
        verbose_name = "Advertisement"
        verbose_name_plural = "Advertisements"
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title