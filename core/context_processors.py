from .models import Ads
import random

def active_ad(request):
    """
    Context processor to add an active ad to all templates.
    
    You can customize the logic to:
    - Show a specific ad
    - Show a random ad
    - Show ads based on user preferences
    - Show ads based on page/category
    - Rotate ads in a specific order
    """
    
    try:
        ads = Ads.objects.all().filter(is_active=True)
        
        if ads.exists():
            # Get a random ad
            active_ad_instance = random.choice(ads)
            
            return {
                'active_ad': active_ad_instance
            }
    except Ads.DoesNotExist:
        pass
    except Exception as e:
        print(f"Error loading ad: {e}")
    
    return {
        'active_ad': None
    }
