from datetime import date
from .models import Task
from django.http import HttpResponseForbidden

def notifications_processor(request):
    if not request.user.is_authenticated:
        return {'notifications_count': 0, 'notifications': []}

    today = date.today()
    notifications_count = Task.objects.filter(deadline=today, completed=False, created_by=request.user).count()
    notifications = Task.objects.filter(deadline=today,completed=False, created_by=request.user)
    
    return {'notifications_count': notifications_count, 'notifications': notifications}
