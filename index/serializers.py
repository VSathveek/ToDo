from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'



from rest_framework import serializers
from .models import StickyNote

class StickyNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = StickyNote
        fields = ['id', 'title', 'content', 'color', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']