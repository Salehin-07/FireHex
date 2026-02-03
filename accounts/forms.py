from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.models import User

class SignUpForm(UserCreationForm):
    first_name = forms.CharField(max_length=30, required=False)
    last_name = forms.CharField(max_length=30, required=False)
    username = forms.IntegerField(
        label="uid",
        help_text="Once updated, it can't be changed.",
        error_messages={
            'required': 'Please give correct uid.',
            'invalid': 'Please give correct uid.',
        }
    )

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name')

    def clean_username(self):
        uid = self.cleaned_data['username']
        # Prevent reuse of existing uid
        if User.objects.filter(username=str(uid)).exists():
            raise forms.ValidationError("This uid is already taken.")
        return str(uid)  # store as string in User.username

class LoginForm(AuthenticationForm):
    username = forms.IntegerField(
        label="UID",
        error_messages={
            'required': 'Please enter your UID.',
            'invalid': 'Please enter a valid numeric UID.',
        }
    )
    
    def clean_username(self):
        uid = self.cleaned_data['username']
        return str(uid)  # Convert to string for authentication


class AdminLoginForm(AuthenticationForm):
    pass