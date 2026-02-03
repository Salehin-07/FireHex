from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User, Permission
from .models import Tournament, TournamentJoinRequest
from django.utils import timezone
import datetime

class CoreTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user('alice', password='pass')
        self.admin = User.objects.create_user('admin', password='pass')
        # Create a tournament
        self.t1 = Tournament.objects.create(
            title='Test Cup', game_name='FC', start_datetime=timezone.now()+datetime.timedelta(days=1),
            entry_fee=10, prize_first='100', prize_second='50', prize_third='25', created_by=self.admin
        )

    def test_list_view(self):
        resp = self.client.get(reverse('core:tournament_list'))
        self.assertEqual(resp.status_code, 200)

    def test_detail_view(self):
        resp = self.client.get(reverse('core:tournament_detail', kwargs={'pk':self.t1.pk}))
        self.assertEqual(resp.status_code, 200)

    def test_join_requires_login(self):
        resp = self.client.post(reverse('core:tournament_join', kwargs={'pk':self.t1.pk}), {
            'whatsapp_number':'0123456789', 'social_profile_url':'https://fb.com/u'
        })
        self.assertIn(resp.status_code, (302, 302))

    def test_join_create(self):
        self.client.login(username='alice', password='pass')
        resp = self.client.post(reverse('core:tournament_join', kwargs={'pk':self.t1.pk}), {
            'whatsapp_number':'0123456789', 'social_profile_url':'https://fb.com/u'
        })
        self.assertEqual(TournamentJoinRequest.objects.count(), 1)

    def test_permission_mark_paid(self):
        self.client.login(username='admin', password='pass')
        req = TournamentJoinRequest.objects.create(tournament=self.t1, user=self.user, whatsapp_number='0123', social_profile_url='http://x')
        resp = self.client.post(reverse('core:admin_request_detail', kwargs={'pk':req.pk}), {'action':'mark_paid'})
        req.refresh_from_db()
        self.assertFalse(req.paid)
