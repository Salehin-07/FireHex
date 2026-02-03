from django.urls import reverse_lazy
from django.views import generic
from .forms import SignUpForm, LoginForm, AdminLoginForm
from django.contrib.auth import views as auth_views

class SignUpView(generic.CreateView):
    form_class = SignUpForm
    template_name = 'accounts/signup.html'
    success_url = reverse_lazy('accounts:login')

class LoginView(auth_views.LoginView):
    template_name = 'accounts/login.html'
    authentication_form = LoginForm

class AdminLoginView(auth_views.LoginView):
    template_name = 'accounts/login.html'
    authentication_form = AdminLoginForm


class ProfileView(generic.TemplateView):
    template_name = 'accounts/profile.html'
