from django import template

register = template.Library()

@register.filter
def can_see(user):
    if not user or user.is_anonymous:
        return False

    has_admin = user.groups.filter(name='Admin').exists()
    has_npay = user.groups.filter(name='NPay').exists()
    has_superadmin = user.groups.filter(name='Superadmin').exists()

    # Rule:
    # Show if superadmin OR (admin AND not npay)
    return has_superadmin or (has_admin and not has_npay)

@register.filter
def admin_or_super(user):
    """
    Show content if user is either in Admin or Superadmin group.
    """
    if not user or user.is_anonymous:
        return False

    return user.groups.filter(name__in=['Admin', 'Superadmin']).exists()
