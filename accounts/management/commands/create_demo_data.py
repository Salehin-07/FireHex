from django.core.management.base import BaseCommand
from django.contrib.auth.models import User, Group, Permission
from django.contrib.contenttypes.models import ContentType
from core.models import Tournament
from django.utils import timezone
import datetime

class Command(BaseCommand):
    help = 'Create demo superadmin, admin, sample tournaments, and a user'

    def handle(self, *args, **options):
        super_g, _ = Group.objects.get_or_create(name='Superadmin')
        admin_g, _ = Group.objects.get_or_create(name='Admin')
        npay_g,_ = Group.objects.get_or_create(name='Npay')
        
        all_perms = Permission.objects.all()
        for p in all_perms:
            super_g.permissions.add(p)

        perms = Permission.objects.filter(codename__in=[
            'add_tournament','change_tournament','view_tournament',
            'view_tournamentjoinrequest','change_tournamentjoinrequest'
        ])
        for p in perms:
            admin_g.permissions.add(p)

        if not User.objects.filter(username='super').exists():
            superu = User.objects.create_superuser('super','super@example.com','superpass')
            superu.groups.add(super_g)
            self.stdout.write('Created super user: super / superpass')
        if not User.objects.filter(username='admin1').exists():
            a = User.objects.create_user('admin1','admin1@example.com','adminpass')
            a.groups.add(admin_g)
            self.stdout.write('Created admin user: admin1 / adminpass')
        if not User.objects.filter(username='admin2').exists():
            a1 = User.objects.create_user('admin2','admin2@example.com','adminpass')
            a1.groups.add(admin_g)
            a1.groups.add(npay_g)
            self.stdout.write('Created admin user: admin2 / adminpass')
        if not User.objects.filter(username='player').exists():
            p = User.objects.create_user('player','player@example.com','playerpass')
            self.stdout.write('Created player user: player / playerpass')

        if Tournament.objects.count()==0:
            Tournament.objects.create(
                title='Demo Cup A', game_name='FC', start_datetime=timezone.now()+datetime.timedelta(days=2),
                entry_fee=5.00, prize_first='500', prize_second='250', prize_third='100', created_by=User.objects.first()
            )
            Tournament.objects.create(
                title='Demo Cup B', game_name='FREEFIRE', start_datetime=timezone.now()+datetime.timedelta(days=5),
                entry_fee=3.00, prize_first='300', prize_second='150', prize_third='50', created_by=User.objects.first()
            )
            self.stdout.write('Created 2 demo tournaments')
