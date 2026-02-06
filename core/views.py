from django.shortcuts import get_object_or_404, redirect
from django.http import Http404
from django.urls import reverse_lazy
from django.views.generic import ListView, DetailView, CreateView, TemplateView, UpdateView
from .models import Tournament, TournamentJoinRequest, TournamentCredentialLog
from .forms import TournamentJoinForm
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin
from django.utils import timezone
from django.contrib import messages

class TournamentListView(ListView):
    model = Tournament
    template_name = 'core/tournament_list.html'
    paginate_by = 10
    queryset = Tournament.objects.filter(is_active=True).order_by('start_datetime')

class TournamentDetailView(DetailView):
    model = Tournament
    template_name = 'core/tournament_detail.html'

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        tournament = self.object
        user = self.request.user
        # Credentials visible to user only if they have a paid request for this tournament
        ctx['credentials_visible'] = False
        if tournament.credentials:
            if user.is_authenticated and tournament.join_requests.filter(user=user, paid=True).exists():
                ctx['credentials_visible'] = True
        ctx['join_request_count'] = tournament.join_requests.filter(paid=True).count()
        return ctx

class TournamentJoinCreateView(LoginRequiredMixin, CreateView):
    model = TournamentJoinRequest
    form_class = TournamentJoinForm
    template_name = 'core/tournament_detail.html'  # Add this line


    def dispatch(self, request, *args, **kwargs):
        self.tournament = get_object_or_404(Tournament, pk=kwargs['pk'])
        return super().dispatch(request, *args, **kwargs)
    
    def get_context_data(self, **kwargs):
        # Add this method to pass tournament to template
        ctx = super().get_context_data(**kwargs)
        ctx['object'] = self.tournament  # Add tournament as 'object'
        ctx['tournament'] = self.tournament  # Also add as 'tournament' for clarity
        # Add the same context from TournamentDetailView
        ctx['credentials_visible'] = False
        if self.tournament.credentials:
            if self.request.user.is_authenticated and self.tournament.join_requests.filter(user=self.request.user, paid=True).exists():
                ctx['credentials_visible'] = True
        ctx['join_request_count'] = self.tournament.join_requests.filter(paid=True).count()
        return ctx

    def form_valid(self, form):
        # Ensure user hasn't already applied to same tournament
        if TournamentJoinRequest.objects.filter(tournament=self.tournament, user=self.request.user).exists():
            messages.error(self.request, 'You have already applied to this tournament.')
            return redirect('core:tournament_detail', pk=self.tournament.pk)
        req = form.save(commit=False)
        req.tournament = self.tournament
        req.user = self.request.user
        req.save()
        messages.success(self.request, 'Our team will contact you for payment.')
        return redirect('core:tournament_detail', pk=self.tournament.pk)

class AdminRequestListView(PermissionRequiredMixin, ListView):
    permission_required = ('core.view_tournamentjoinrequest',)
    model = TournamentJoinRequest
    template_name = 'core/admin_requests.html'
    paginate_by = 20

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            if request.user.groups.filter(name='NPay').exists() and not request.user.groups.filter(name='Superadmin').exists():
                raise Http404
        return super().dispatch(request, *args, **kwargs)

    def get_queryset(self):
        qs = super().get_queryset().select_related('tournament','user')
        tournament = self.request.GET.get('tournament')
        paid = self.request.GET.get('paid')
        if tournament:
            qs = qs.filter(tournament__id=tournament)
        if paid in ('0','1'):
            qs = qs.filter(paid=bool(int(paid)))
        return qs.order_by('-created_at')


class AdminRequestDetailView(PermissionRequiredMixin, DetailView):
    permission_required = ('core.view_tournamentjoinrequest',)
    model = TournamentJoinRequest
    template_name = 'core/admin_request_detail.html'

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            if request.user.groups.filter(name='NPay').exists() and not request.user.groups.filter(name='Superadmin').exists():
                raise Http404
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        req = self.get_object()
        action = request.POST.get('action')
        if action in ['mark_paid', 'mark_unpaid', 'add_note'] and request.user.has_perm('core.change_tournamentjoinrequest'):
            if action == 'mark_paid':
                req.paid = True
                req.admin_handled_by = request.user
                req.admin_handled_at = timezone.now()
                messages.success(request, 'Marked as paid.')
            elif action == 'mark_unpaid':
                req.paid = False
                req.admin_handled_by = request.user
                req.admin_handled_at = timezone.now()
                messages.success(request, 'Marked as unpaid.')
            elif action == 'add_note':
                note = request.POST.get('note','')
                req.notes = (req.notes or '') + '\n' + note
                messages.success(request, 'Note added.')
            req.save()
        return redirect('core:admin_request_detail', pk=req.pk)

class AdminTournamentListView(PermissionRequiredMixin, ListView):
    permission_required = ('core.view_tournament',)
    model = Tournament
    template_name = 'core/admin_tournaments.html'
    
 
class CredentialUpdateView(PermissionRequiredMixin, UpdateView):
    permission_required = ('core.change_tournament',)
    model = Tournament
    fields = ('credentials','credentials_release_time')
    template_name = 'core/credential_update.html'

    def form_valid(self, form):
        obj = form.save()
        TournamentCredentialLog.objects.create(tournament=obj, credentials_text=obj.credentials or '', posted_by=self.request.user)
        messages.success(self.request, 'Credentials updated.')
        return super().form_valid(form)

class MyApplicationsView(LoginRequiredMixin, ListView):
    model = TournamentJoinRequest
    template_name = 'core/my_applications.html'
    paginate_by = 10

    def get_queryset(self):
        return TournamentJoinRequest.objects.filter(user=self.request.user, tournament__is_active=True).select_related('tournament').order_by('-created_at')
