from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('', include('pwa.urls')),
    path('XHj28vGk9pLxZq2jR7mT_wF4yB_nU6sH_aD1eC_oV0iQ_f/', admin.site.urls),
    path('accounts/', include('accounts.urls')),
    path('', include('core.urls')),
]
