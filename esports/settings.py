import os
from pathlib import Path
from django.utils.log import DEFAULT_LOGGING
from dotenv import load_dotenv
load_dotenv()

DATABASE_URL = os.environ.get('DATABASE_URL', False)

BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'dev-secret-key')
#DEBUG = os.environ.get('DJANGO_DEBUG', '1') == '1'
DEBUG = False
ALLOWED_HOSTS = [
    'firehex.onrender.com',
    '.onrender.com',
    'localhost',
    'ar-sr.onrender.com',
    '*.onrender.com',
]
CSRF_TRUSTED_ORIGINS = [
    'https://firehex.onrender.com',
    'https://ar-sr.onrender.com'
]


INSTALLED_APPS = [
    'jazzmin',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'pwa',
    'compressor',
    'accounts',
    'core',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'esports.urls'
TEMPLATES = [{
    'BACKEND': 'django.template.backends.django.DjangoTemplates',
    'DIRS': [BASE_DIR / 'templates'],
    'APP_DIRS': True,
    'OPTIONS': {
        'context_processors': [
            'django.template.context_processors.debug',
            'django.template.context_processors.request',
            'django.contrib.auth.context_processors.auth',
            'django.contrib.messages.context_processors.messages',
            'core.context_processors.active_ad',
        ],
    },
}]

WSGI_APPLICATION = 'esports.wsgi.application'

DATABASE_URL = os.environ.get('DATABASE_URL')
if DATABASE_URL:
    import dj_database_url
    DATABASES = {'default': dj_database_url.parse(DATABASE_URL)}
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Dhaka'
USE_I18N = True
USE_L10N = True
USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_DIRS = [BASE_DIR / 'static']
STATICFILES_STORAGE = 'whitenoise.storage.CompressedStaticFilesStorage'
STATICFILES_FINDERS = [
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    'compressor.finders.CompressorFinder',
]

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

JAZZMIN_SETTINGS = {
    'site_title': 'E-Sports Admin',
    'site_header': 'E-Sports Admin',
    'welcome_sign': 'Manage tournaments and requests',
}

LOGGING = DEFAULT_LOGGING


#WhiteNoise caching
if DEBUG : 
  WHITENOISE_MAX_AGE = 0  # DEVOLOPMENT
else :
  WHITENOISE_MAX_AGE = 31536000 # production : 1 year
#   CSRF_COOKIE_SECURE = True
#   SESSION_COOKIE_SECURE = True
#   SECURE_SSL_REDIRECT = True  # If using HTTPS
#   SECURE_HSTS_SECONDS = 31536000  # 1 year
#   SECURE_HSTS_INCLUDE_SUBDOMAINS = True
#   SECURE_HSTS_PRELOAD = True
#   SECURE_BROWSER_XSS_FILTER = True
#   SECURE_CONTENT_TYPE_NOSNIFF = True
#   X_FRAME_OPTIONS = "DENY"




LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
        },
    },
}


COMPRESS_ENABLED = False
#COMPRESS_OFFLINE = True  # For production



PWA_APP_NAME = 'FIRE HEX'
PWA_APP_DESCRIPTION = "FIRE HEX TOUNAMENT"
PWA_APP_THEME_COLOR = '#0A0302'
PWA_APP_BACKGROUND_COLOR = '#ffffff'
PWA_APP_DISPLAY = 'standalone'
PWA_APP_SCOPE = '/'
PWA_APP_ORIENTATION = 'any'
PWA_APP_START_URL = '/'
PWA_APP_STATUS_BAR_COLOR = 'default'
PWA_APP_ICONS = [
    {
        'src': '/static/img/logo.png',
        'sizes': '160x160'
    }
]
PWA_APP_ICONS_APPLE = [
    {
        'src': '/static/img/logo.png',
        'sizes': '160x160'
    }
]
PWA_APP_SPLASH_SCREEN = [
    {
        'src': '/static/img/logo.png',
        'media': '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)'
    }
]
PWA_APP_DIR = 'ltr'
PWA_APP_LANG = 'en-US'
PWA_APP_SHORTCUTS = []
PWA_APP_SCREENSHOTS = [
    {
      'src': '/static/img/logo.png',
      'sizes': '750x1334',
      "type": "image/png"
    }
]

PWA_SERVICE_WORKER_PATH = BASE_DIR / 'sw.js'