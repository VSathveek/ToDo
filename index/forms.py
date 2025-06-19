from django import forms
from .models import Task

class TaskForm(forms.ModelForm):
    class Meta:
        model = Task
        fields = ['name', 'description', 'file', 'document', 'assignee', 'mention', 'checklist', 'deadline', 'start_task_on', 'duration', 'tags']


from django import forms
from .models import StickyNote

class StickyNoteForm(forms.ModelForm):
    class Meta:
        model = StickyNote
        fields = ['title', 'content', 'color']
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Note title'
            }),
            'content': forms.Textarea(attrs={
                'class': 'form-control',
                'placeholder': 'Your note content...',
                'rows': 5
            }),
            'color': forms.Select(attrs={'class': 'form-control'}),
        }


from django import forms
from .models import Whiteboard

class WhiteboardForm(forms.ModelForm):
    class Meta:
        model = Whiteboard
        fields = ['title']
        widgets = {
            'title': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'My Whiteboard'
            })
        }




class ShareTaskForm(forms.Form):
    username = forms.CharField(
        max_length=150,
        label="Username",
        widget=forms.TextInput(attrs={'placeholder': 'Enter username to share with'})
    )