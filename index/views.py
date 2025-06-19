from django.shortcuts import render,HttpResponse,redirect
from django.conf import settings
import os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json 
from django.contrib.auth.models import User
from datetime import datetime
from django.contrib.auth.decorators import login_required
from .models import Task, TaskFile







from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm

def signup(request):
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()  
            return redirect('login')  
    else:
        form = UserCreationForm()

    return render(request, 'signup.html', {'form': form})



def projects(request):
    return render(request,'projects.html')



def recyclebin(request):
    return render(request,'recyclebin.html')


from django.db.models import Q
from django.shortcuts import render
from .models import Task

from django.db.models import Q
from django.contrib.auth.decorators import login_required

@login_required
def dashboard(request):
    search_query = request.GET.get('q', '')
    

    tasks = Task.objects.filter(created_by=request.user)
    
    if search_query:
        tasks = tasks.filter(
            Q(name__icontains=search_query) |
            Q(description__icontains=search_query) |
            Q(document__icontains=search_query) |
            Q(tags__icontains=search_query) |
            Q(assignee__username__icontains=search_query) |
            Q(deadline__icontains=search_query) |
            Q(start_task_on__icontains=search_query) |
            Q(duration__icontains=search_query)
        ).distinct()
    

    for task in tasks:
        task.status = task.task_status
    
    context = {
        'tasks': tasks,
        'task_count': tasks.count(),
    }
    return render(request, 'index.html', context)



from .models import Task
from django.shortcuts import render
from datetime import date
from django.http import JsonResponse
from django.shortcuts import render
from .models import Task, TaskFile
from django.contrib.auth.models import User
import json



from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import Task, TaskFile
from django.contrib.auth.models import User
import json
from datetime import datetime

@login_required
def create_task_view(request):
    if request.method == "POST":
    
        name = request.POST.get("name")
        description = request.POST.get("description", "")
        files = request.FILES.getlist("file")  
        assignee_username = request.POST.get("assignee", None)
        mention_usernames = request.POST.getlist("mention")
        checklist_items = request.POST.get("checklist", "[]")
        deadline = request.POST.get("deadline", None)
        start_task_on = request.POST.get("start_task_on", None)
        
        tags = request.POST.get("tags", "")

        print(f"Received request data: {request.POST}")
        print(f"Files received: {request.FILES}")


        def parse_date(date_str):

            date_str = date_str.split(":")[0]  
            if date_str:
                try:
                    return datetime.strptime(date_str, "%Y-%m-%d").date()
                except ValueError:
                    print(f"Raw Start Task On Value: {start_task_on}")
                    return None
            return None

        # Parse dates
        deadline = parse_date(deadline)
        start_task_on = parse_date(start_task_on) 
        

    
        assignee = User.objects.filter(username=assignee_username).first() if assignee_username else None

    
        try:
            checklist = json.loads(checklist_items)
        except json.JSONDecodeError:
            checklist = []

    
        mentioned_users = User.objects.filter(username__in=mention_usernames)

        task = Task.objects.create(
            name=name,
            description=description,
            assignee=assignee,
            deadline=deadline,
            start_task_on=start_task_on,
            
            tags=tags,
            checklist=checklist,
            created_by=request.user,
            completed=False
        )

    
        for file in files:
            TaskFile.objects.create(task=task, file=file)  


        task.mention.set(mentioned_users)

        return JsonResponse({"message": "Task created successfully!", "id": task.id})

    return render(request, "createtask.html")




from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from datetime import date
from .models import Task, TaskFile
from django.contrib.auth.models import User
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from datetime import date
from .models import Task, TaskFile

@login_required
def home(request):
    tasks = Task.objects.filter(
        Q(created_by=request.user) | Q(shared_with=request.user)
    ).distinct()
    
    task_files_dict = {} 
    today = date.today()
    notifications = Task.objects.filter(
        deadline=today,
        completed=False, 
        created_by=request.user
    )
    notifications_count = notifications.count()
    task_count = tasks.count()

    for task in tasks:
        task_files_dict[task.id] = TaskFile.objects.filter(task=task)
        task.status = task.task_status

        task.is_shared = task.created_by != request.user

    context = {
        'tasks': tasks,
        'task_files_dict': task_files_dict,  
        'notifications': notifications,
        'today': today, 
        'notifications_count': notifications_count,
        'task_count': task_count
    }

    return render(request, 'index.html', context)





from django.shortcuts import render, get_object_or_404
from .models import Task



from django.shortcuts import get_object_or_404, redirect, render
from django.http import HttpResponseForbidden
from django.contrib.auth.decorators import login_required
from .models import Task, TaskFile
from .forms import TaskForm

@login_required
def update_task(request, pk):
    task = get_object_or_404(Task, pk=pk)

    if task.created_by != request.user:
        return HttpResponseForbidden("You are not allowed to update this task.")

    if request.method == "POST":
        form = TaskForm(request.POST, request.FILES, instance=task)
        if form.is_valid():

            if form.cleaned_data.get('remove_file'):
                if task.file:
                    task.file.delete(save=False)
                task.file = None
            task = form.save()
    
            additional_files = request.FILES.getlist('additional_files')
            if additional_files:
                for f in additional_files:
                    TaskFile.objects.create(task=task, file=f)
            return redirect('task_detail', pk=task.pk)
    else:
        form = TaskForm(instance=task)
    
    
    files = task.files.all()
    return render(request, 'update_task.html', {'form': form, 'task': task, 'files': files})


@login_required
def delete_task_file(request, file_id):
    file_obj = get_object_or_404(TaskFile, id=file_id)
    if file_obj.task.created_by != request.user:
        return HttpResponseForbidden("Not allowed")
    task_pk = file_obj.task.pk
    file_obj.delete()
    return redirect('update_task', pk=task_pk)




@login_required
def mark_task_completed(request, task_id):

    if request.method == "POST":
        task = get_object_or_404(Task, id=task_id, created_by=request.user)
        task.completed = True
        task.save()
        return JsonResponse({"success": True, "task_id": task_id})

    return JsonResponse({"success": False, "error": "Invalid request."}, status=400)

from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from .models import Task

@login_required
def task_efficiency(request):
    total_tasks = Task.objects.filter(created_by=request.user).count()
    completed_tasks = Task.objects.filter(created_by=request.user, completed=True).count()
    pending_tasks = Task.objects.filter(created_by=request.user, completed=False).count()
    
    context = {
        'total_tasks': total_tasks,
        'completed_tasks': completed_tasks,
        'pending_tasks': pending_tasks,
    }
    return render(request, 'task_efficiency.html', context)


import io
import matplotlib
matplotlib.use('Agg')  
import matplotlib.pyplot as plt

from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from .models import Task

@login_required
def chart_image(request):

    total_tasks = Task.objects.filter(created_by=request.user).count()
    completed_tasks = Task.objects.filter(created_by=request.user, completed=True).count()
    pending_tasks = Task.objects.filter(created_by=request.user, completed=False).count()

    labels = ['Total Tasks', 'Completed Tasks', 'Pending Tasks']
    counts = [total_tasks, completed_tasks, pending_tasks]


    fig, ax = plt.subplots(figsize=(14,8))
    bars = ax.bar(labels, counts, color=['blue', 'green', 'red'])
    ax.set_ylabel('Count')
    ax.set_title('Task Efficiency')


    for bar in bars:
        height = bar.get_height()
        ax.annotate(f'{height}',
                    xy=(bar.get_x() + bar.get_width() / 2, height),
                    xytext=(0, 3),
                    textcoords="offset points",
                    ha='center', va='bottom')


    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    plt.close(fig) 
    buf.seek(0)

    return HttpResponse(buf.getvalue(), content_type='image/png')



from django.http import JsonResponse
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from .models import Task

@login_required
def tasks_json(request):
    tasks = Task.objects.filter(created_by=request.user, deadline__isnull=False)
    events = []
    for task in tasks:
        events.append({
            'title': task.name,
            'start': task.deadline.isoformat(),  
            'url': reverse('task_detail', args=[task.pk]),  
        })
    return JsonResponse(events, safe=False)


from django.shortcuts import render
from django.contrib.auth.decorators import login_required

@login_required
def calendar_view(request):
    return render(request, 'calendar.html')



from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponseForbidden
from django.contrib.auth.decorators import login_required
from .models import Task

@login_required
def delete_task(request, pk):
    task = get_object_or_404(Task, pk=pk)

    if task.created_by != request.user:
        return HttpResponseForbidden("You are not allowed to delete this task.")
    
    if request.method == "POST":
        task.delete()
        return redirect('home')  
    

    return render(request, 'confirm_delete.html', {'task': task})








import json, uuid
from datetime import datetime
from django.core.files.base import ContentFile
from django.http import JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from .models import Task, TaskFile
from .forms import TaskForm  

@login_required
def create_task_from_editor(request):
    if request.method == "POST":
        print("Uploaded Files:", request.FILES.getlist("file"))  
        for file in request.FILES.getlist("file"):
            print(f"File Name: {file.name}, Size: {file.size}")
        
        name = request.POST.get("name")
        description = request.POST.get("description", "")
        files = request.FILES.getlist("file")
        print("Uploaded Files:", files)
        assignee_username = request.POST.get("assignee", None)
        mention_usernames = request.POST.getlist("mention")
        checklist_items = request.POST.get("checklist", "[]")
        deadline = request.POST.get("deadline", None)
        start_task_on = request.POST.get("start_task_on", None)
        
        tags = request.POST.get("tags", "")

    
        def parse_date(date_str):
            if date_str:
                try:
                    return datetime.strptime(date_str, "%Y-%m-%d").date()
                except ValueError:
                    return None
            return None

        deadline = parse_date(deadline)
        start_task_on = parse_date(start_task_on)
        

        assignee = User.objects.filter(username=assignee_username).first() if assignee_username else None
        try:
            checklist = json.loads(checklist_items)
        except json.JSONDecodeError:
            checklist = []
        mentioned_users = User.objects.filter(username__in=mention_usernames)

    
        task = Task.objects.create(
            name=name,
            description=description,
            assignee=assignee,
            deadline=deadline,
            start_task_on=start_task_on,
            
            tags=tags,
            checklist=checklist,
            created_by=request.user,
            completed=False
        )

    
        for file in files:
            print("Saving file:", file.name)
            TaskFile.objects.create(task=task, file=file)

        task.mention.set(mentioned_users)

        document_content = request.POST.get("document_content", "")
        document_name = request.POST.get("document_name", "").strip()
        if document_content:
            if not document_name:
                document_name = "document.html"
            elif not document_name.endswith(".html"):
                document_name += ".html"
    
            task.file.save(document_name, ContentFile(document_content))
        
            task.document = document_content
            task.save()


        return redirect('task_success', task_id=task.id)
    return render(request, "create_task_from_editor.html")

@login_required
def task_success(request, task_id):
    task = get_object_or_404(Task, id=task_id)
    return render(request, 'task_success.html', {'task': task})





@login_required
def view_document(request, task_id):
    task = get_object_or_404(Task, id=task_id)

    return render(request, 'view_document.html', {'document': task.document, 'task': task})



import uuid
from django.core.files.base import ContentFile
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Task

@login_required
def update_task_document(request):
    if request.method == "POST":
        task_id = request.POST.get("task_id")
        updated_content = request.POST.get("document_content", "")
        
        if not task_id:
            return JsonResponse({"success": False, "message": "No task id provided."})
        
        task = get_object_or_404(Task, id=task_id)
    
        task.document = updated_content
    
        filename = f"document_{uuid.uuid4().hex}.html"
        task.file.save(filename, ContentFile(updated_content))
        task.save()
        
        return JsonResponse({"success": True, "message": "Document updated successfully."})
    
    return JsonResponse({"success": False, "message": "Invalid request method."})






from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required


@login_required
def edit_task_document(request, task_id):
    task = get_object_or_404(Task, id=task_id)
    return render(request, 'edit_document.html', {'task': task})



from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from .models import Task


import json
from django.shortcuts import get_object_or_404, render
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from .models import Task

@login_required
def update_checklist(request, pk):
    task = get_object_or_404(Task, pk=pk)

    if request.method == 'POST':
        try:
            
            payload = json.loads(request.body)
            item_text = payload.get('text')
            item_marked = payload.get('marked')

            
            checklist = task.checklist or []

            item_found = False
            for item in checklist:
                if item['text'] == item_text:
                    item['marked'] = item_marked 
                    item_found = True
                    break 

        
            if not item_found:
                checklist.append({'text': item_text, 'marked': item_marked})

            
            task.checklist = checklist
            task.save(update_fields=['checklist'])

            return JsonResponse({'status': 'success'})

        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)


import json
from django.contrib import messages
from .forms import ShareTaskForm

@login_required
def task_detail(request, pk):
    task = get_object_or_404(Task, pk=pk)
    checklist_data = [{"text": item, "marked": False} for item in task.checklist] if task.checklist else []
    
    if request.method == 'POST':
        form = ShareTaskForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            try:
                user_to_share = User.objects.get(username=username)
                if user_to_share == request.user:
                    messages.error(request, "You cannot share a task with yourself!")
                else:
                    task.shared_with.add(user_to_share)
                    messages.success(request, f"Task successfully shared with {username}!")
                    return redirect('task_detail', pk=task.pk)
            except User.DoesNotExist:
                messages.error(request, "User with this username does not exist!")
    else:
        form = ShareTaskForm()
    
    return render(request, 'task_detail.html', {
        'task': task,
        'checklist_data': checklist_data,
        'share_form': form,
    })



from django.shortcuts import render

def developers(request):
    
    context = {}
    return render(request, 'developers.html', context)

def how_it_works(request):
    
    context = {}
    return render(request, 'how_it_works.html', context)







from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import StickyNote
from .serializers import StickyNoteSerializer
import random

@api_view(['GET'])
def sticky_notes_list(request):
    notes = StickyNote.objects.all()
    serializer = StickyNoteSerializer(notes, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def sticky_note_create(request):
    serializer = StickyNoteSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['GET', 'PUT', 'DELETE'])
def sticky_note_detail(request, pk):
    try:
        note = StickyNote.objects.get(pk=pk)
    except StickyNote.DoesNotExist:
        return Response(status=404)

    if request.method == 'GET':
        serializer = StickyNoteSerializer(note)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = StickyNoteSerializer(note, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    elif request.method == 'DELETE':
        note.delete()
        return Response(status=204)
    


from django.shortcuts import render
from .models import StickyNote


def sticky_notes_view(request):
    color_choices = StickyNote.COLOR_CHOICES
    return render(request, 'sticky_notes.html', {
        'color_choices': color_choices
    })















from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import UserCanvas
import json

@login_required
def canvas_dashboard(request):
    # Get or create canvas for the current user
    canvas, created = UserCanvas.objects.get_or_create(user=request.user)
    return render(request, 'canvas/dashboard.html', {'canvas': canvas})

@login_required
def save_canvas(request):
    if request.method == 'POST':
        canvas = get_object_or_404(UserCanvas, user=request.user)
        canvas.canvas_data = request.body.decode('utf-8')
        canvas.save()
        return JsonResponse({'status': 'success', 'updated_at': canvas.updated_at.strftime("%Y-%m-%d %H:%M:%S")})
    return JsonResponse({'status': 'error'}, status=400)


















from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Whiteboard
from .forms import WhiteboardForm
import json

@login_required
def create_whiteboard(request):
    if request.method == 'POST':
        form = WhiteboardForm(request.POST)
        if form.is_valid():
            whiteboard = form.save(commit=False)
            whiteboard.created_by = request.user
            whiteboard.content = {'elements': []}
            whiteboard.save()
            return redirect('view_whiteboard', pk=whiteboard.id)
    else:
        form = WhiteboardForm()
    return render(request, 'create.html', {'form': form})

@login_required
def view_whiteboard(request, pk):
    whiteboard = get_object_or_404(Whiteboard, id=pk)
    return render(request, 'view.html', {
        'whiteboard': whiteboard,
        'initial_data': json.dumps(whiteboard.content)
    })

from django.http import JsonResponse
import json
@login_required
def save_whiteboard(request, pk):
    if request.method == 'POST':
        try:
            whiteboard = get_object_or_404(Whiteboard, id=pk)
            if whiteboard.created_by != request.user:
                return JsonResponse({
                    'status': 'error', 
                    'message': 'Not authorized'
                }, status=403)
            
            data = json.loads(request.body)
            whiteboard.content = data
            whiteboard.save()
            return JsonResponse({'status': 'success'})
        
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=500)
    

from django.shortcuts import render
import json
from django.core.exceptions import PermissionDenied


from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.http import Http404, JsonResponse
from django.contrib import messages
from .models import Whiteboard, User
import uuid

@login_required
def view_whiteboard(request, pk):

    try:

        if isinstance(pk, str):
            pk = uuid.UUID(pk)
            
        whiteboard = get_object_or_404(Whiteboard, id=pk)
        
        # Check permissions
        is_owner = request.user == whiteboard.created_by
        is_shared_with = request.user in whiteboard.shared_with.all()
        
        if not (is_owner or is_shared_with):
            raise Http404("You don't have permission to view this whiteboard")
        
        # Handle sharing form submission
        if request.method == 'POST' and is_owner:
            username = request.POST.get('username')
            try:
                user = User.objects.get(username=username)
                if user == request.user:
                    messages.error(request, "You can't share with yourself")
                else:
                    whiteboard.shared_with.add(user)
                    messages.success(request, f'Successfully shared with {username}')
            except User.DoesNotExist:
                messages.error(request, 'User not found')
            return redirect('view_whiteboard', pk=whiteboard.id)
    
        context = {
            'whiteboard': whiteboard,
            'whiteboard_data': whiteboard.content,
            'is_owner': is_owner,
            'shared_users': whiteboard.shared_with.all().exclude(id=request.user.id),
            'all_users': User.objects.exclude(id=request.user.id) if is_owner else None
        }
        
        return render(request, 'view.html', context)
        
    except (ValueError, uuid.UUIDError):
        raise Http404("Invalid whiteboard ID")





@login_required
def list_whiteboards(request):
    whiteboards = Whiteboard.objects.filter(created_by=request.user)
    return render(request, 'list.html', {'whiteboards': whiteboards})



from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required

@login_required
def delete_whiteboard(request, pk):
    whiteboard = get_object_or_404(Whiteboard, id=pk, created_by=request.user)
    if request.method == 'POST':
        whiteboard.delete()
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error'}, status=400)


from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from .models import Whiteboard
from django.contrib.auth import get_user_model

User = get_user_model()

@login_required
def share_whiteboard(request, pk):
    whiteboard = get_object_or_404(Whiteboard, id=pk, created_by=request.user)
    
    if request.method == 'POST':
        username = request.POST.get('username').strip()  # Clean the input
        try:
            user = User.objects.get(username=username)
            
            if user == request.user:
                return JsonResponse({
                    'status': 'error',
                    'message': "You can't share with yourself"
                }, status=400)
                
            if whiteboard.shared_with.filter(id=user.id).exists():
                return JsonResponse({
                    'status': 'info',
                    'message': f'Already shared with {username}'
                })
                
            whiteboard.shared_with.add(user)
            
        
            print(f"Whiteboard '{whiteboard.title}' now shared with:")
            print([u.username for u in whiteboard.shared_with.all()])
            
            return JsonResponse({
                'status': 'success',
                'message': f'Successfully shared with {username}'
            })
            
        except User.DoesNotExist:
            return JsonResponse({
                'status': 'error',
                'message': 'User not found'
            }, status=404)
            
    return JsonResponse({'status': 'error'}, status=400)

@login_required
def shared_whiteboards(request):

    shared_whiteboards = Whiteboard.objects.filter(
        shared_with=request.user
    ).exclude(created_by=request.user).select_related('created_by')
    
    print(f"User {request.user.username} can see these shared whiteboards:")
    for wb in shared_whiteboards:
        print(f"- {wb.title} (created by {wb.created_by.username})")
    
    return render(request, 'shared_whiteboards.html', {
        'shared_whiteboards': shared_whiteboards
    })

@login_required
def remove_shared_whiteboard(request, pk):
    whiteboard = get_object_or_404(Whiteboard, id=pk, shared_with=request.user)
    if request.method == 'POST':
        whiteboard.shared_with.remove(request.user)
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error'}, status=400)

from django.urls import reverse

def whiteboard_detail(request, pk):
    whiteboard = get_object_or_404(Whiteboard, id=pk)
    print(whiteboard.content) 
    return render(request, 'view.html', {
        'whiteboard': whiteboard,
        'save_url': reverse('save_whiteboard', args=[whiteboard.id]),
    })