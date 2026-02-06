from django import forms
from .models import TournamentJoinRequest

class TournamentJoinForm(forms.ModelForm):
    class Meta:
        model = TournamentJoinRequest
        fields = ('bkash_number','transaction_id')

    def clean_whatsapp_number(self):
        n = self.cleaned_data['bkash_number']
        digits = ''.join(ch for ch in n if ch.isdigit())
        if len(digits) < 9:
            raise forms.ValidationError('Enter a valid bkash number.')
        return n
