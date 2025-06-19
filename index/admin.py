'''from django.contrib import admin
from .models import Task

class TaskAdmin(admin.ModelAdmin):
    list_display = ("name", "created_by", "assignee", "deadline", "created_at")  # Ensure these exist in models.py
    list_filter = ("assignee", "created_at", "updated_at")  # Ensure fields exist

admin.site.register(Task, TaskAdmin)'''

from django.contrib import admin
from .models import Task, TaskFile

class TaskFileAdmin(admin.ModelAdmin):
    list_display = ('task', 'file', 'uploaded_at')
    search_fields = ('task__name',)
    list_filter = ('uploaded_at',)

admin.site.register(TaskFile, TaskFileAdmin)

class TaskAdmin(admin.ModelAdmin):
    list_display = ("name", "created_by", "assignee", "deadline", "created_at")
    list_filter = ("assignee", "created_at", "updated_at")
    search_fields = ("name", "description")

admin.site.register(Task, TaskAdmin)
