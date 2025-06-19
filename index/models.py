from django.db import models
from django.contrib.auth.models import User
from datetime import datetime
from django.utils import timezone
from datetime import date
from django.core.exceptions import ValidationError


class Task(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    file = models.FileField(upload_to="task_files/", blank=True, null=True)  
    document = models.TextField(blank=True, null=True)  
    assignee = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)
    mention = models.ManyToManyField(User, related_name="mentions", blank=True)
    checklist = models.JSONField(default=list, blank=True, null=True)
    deadline = models.DateField(blank=True, null=True)
    start_task_on = models.DateField(blank=True, null=True)
    duration = models.CharField(max_length=50, blank=True, null=True)
    
    tags = models.CharField(max_length=255, blank=True, null=True)
    completed = models.BooleanField(default=False) 
    shared_with = models.ManyToManyField(
        User, 
        related_name="shared_tasks",
        blank=True
    )


    created_by = models.ForeignKey(User, related_name="tasks_created", on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)  
    updated_at = models.DateTimeField(auto_now=True)  


    @property
    def is_deadline_passed(self):
        
        if self.deadline:
            return self.deadline < datetime.today().date()
        return False
    
    def __str__(self):
        return self.name

    @property
    def task_status(self):
       
        if self.completed:
            return "completed"
        if not self.deadline:
            return "normal"  
        today = date.today()
        days_left = (self.deadline - today).days
        if days_left <= 0:
            return "overdue"
        elif days_left == 1:
            return "warning"
        else:
            return "normal"


class TaskFile(models.Model):
    task = models.ForeignKey(Task, related_name='files', on_delete=models.CASCADE)
    file = models.FileField(upload_to='task_files/')  
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"File for {self.task.name}"


    def get_file_url(self):
        return self.file.url if self.file else None


from django import forms
from .models import Task

class TaskForm(forms.ModelForm):
    remove_file = forms.BooleanField(required=False, label="Remove current file")

    class Meta:
        model = Task
        fields = [
            'name', 'description', 'file', 'document', 'assignee', 
            'deadline', 'start_task_on', 'duration', 'tags']
    



from django.db import models

class StickyNote(models.Model):
    COLOR_CHOICES = [
        ('#fff9c4', 'Yellow'),
        ('#c8e6c9', 'Green'),
        ('#bbdefb', 'Blue'),
        ('#ffccbc', 'Orange'),
        ('#d1c4e9', 'Purple'),
        ('#f8bbd0', 'Pink'),
    ]
    
    title = models.CharField(max_length=100, blank=True)
    content = models.TextField(blank=True)
    color = models.CharField(max_length=7, choices=COLOR_CHOICES, default='#fff9c4')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
    
    def __str__(self):
        return self.title or f"Note #{self.id}"




























from django.db import models
from django.contrib.auth.models import User

class UserCanvas(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    title = models.CharField(max_length=100, default="My Design")
    canvas_data = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username}'s Canvas"
    





















from django.db import models
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()

class Whiteboard(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    content = models.JSONField(default=dict)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_whiteboards')
    created_at = models.DateTimeField(auto_now_add=True)
    shared_with = models.ManyToManyField(User, related_name='shared_whiteboards', blank=True)

    def __str__(self):
        return self.title