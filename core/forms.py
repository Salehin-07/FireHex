from django import forms
from .models import TournamentJoinRequest

class TournamentJoinForm(forms.ModelForm):
    class Meta:
        model = TournamentJoinRequest
        fields = ('whatsapp_number','social_profile_url')

    def clean_whatsapp_number(self):
        n = self.cleaned_data['whatsapp_number']
        digits = ''.join(ch for ch in n if ch.isdigit())
        if len(digits) < 9:
            raise forms.ValidationError('Enter a valid WhatsApp number.')
        return n
