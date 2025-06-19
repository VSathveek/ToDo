from django.urls import path
from index import views
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth import views as auth_views
from django.urls import path

urlpatterns = [
    path('', views.home, name='home'),
    #path('task/<int:task_id>/details/', views.task_details, name='task_details'),
    path('projects', views.projects, name='projects'),
    #path('efficency', views.efficency, name='efficency'),
    path('recyclebin', views.recyclebin, name='recyclebin'),
    path('createtask', views.create_task_view, name='createtask'), 
    path('tasks/create-from-editor/', views.create_task_from_editor, name='create_task_from_editor'),
    path('tasks/<int:task_id>/document/', views.view_document, name='view_document'),
    path('tasks/create/', views.create_task_view, name='create_task'),
    path('dashboard', views.dashboard, name='dashboard'),
    path('login/', auth_views.LoginView.as_view(), name='login'),
    path('logout/', auth_views.LogoutView.as_view(template_name='registration/logout.html'), name='logout'),
    path('signup/', views.signup, name='signup'),
    path('tasks/<int:pk>/update/', views.update_task, name='update_task'),
    #path('tasks/<int:pk>/complete/',views.mark_as_completed, name='mark_as_completed'),
    path("task/<int:task_id>/complete/", views.mark_task_completed, name="mark_task_completed"),
    path('tasks/file/<int:file_id>/delete/', views.delete_task_file, name='delete_task_file'),
    path('tasks/<int:pk>/', views.task_detail, name='task_detail'),
    path('task_efficiency', views.task_efficiency, name='task_efficiency'),
    path('chart-image/', views.chart_image, name='chart_image'),
    path('calendar/', views.calendar_view, name='calendar_view'),
    path('calendar/tasks/', views.tasks_json, name='tasks_json'),
    path('tasks/file/<int:file_id>/delete/', views.delete_task_file, name='delete_task_file'),
    path('tasks/<int:pk>/delete/', views.delete_task, name='delete_task'),
    #path('project/edit/', views.project_edit, name='project_create'),
    #path('project/edit/<int:project_id>/',views.project_edit, name='project_edit'),
    path('update-document/', views.update_task_document, name="update_task_document"),
    path('task/edit-document/<int:task_id>/', views.edit_task_document, name='edit_task_document'),
    path('task/update-document/', views.update_task_document, name='update_task_document'),
    path('task/success/<int:task_id>/', views.task_success, name='task_success'),
    path('developers/', views.developers, name='developers'),
    path('how-it-works/', views.how_it_works, name='how_it_works'),

    path('sticky-notes/', views.sticky_notes_view, name='sticky_notes'),
    path('api/sticky-notes/', views.sticky_notes_list, name='sticky_notes_list'),
    path('api/sticky-notes/create/', views.sticky_note_create, name='sticky_note_create'),
    path('api/sticky-notes/<int:pk>/', views.sticky_note_detail, name='sticky_note_detail'),


   #path('sticky-notes/create/', views.create_note, name='create_note'),
    #path('sticky-notes/update/<int:note_id>/', views.update_note, name='update_note'),
    #path('sticky-notes/delete/<int:note_id>/', views.delete_note, name='delete_note'),
    path('tasks/<int:pk>/update_checklist/', views.update_checklist, name='update_checklist'),
    path('canvas/', views.canvas_dashboard, name='canvas-dashboard'),
    path('canvas/save/', views.save_canvas, name='save-canvas'),



    path('whiteboard/new/', views.create_whiteboard, name='create_whiteboard'),
    path('whiteboard/', views.list_whiteboards, name='list_whiteboards'),
    path('whiteboard/<uuid:pk>/', views.view_whiteboard, name='view_whiteboard'),
    path('whiteboard/<uuid:pk>/save/', views.save_whiteboard, name='save_whiteboard'),
    path('whiteboard/<uuid:pk>/delete/', views.delete_whiteboard, name='delete_whiteboard'),
    path('whiteboard/<uuid:pk>/share/', views.share_whiteboard, name='share_whiteboard'),
    path('whiteboard/shared/', views.shared_whiteboards, name='shared_whiteboards'),
    

    
    
    path('whiteboard/<uuid:pk>/remove-shared/', views.remove_shared_whiteboard, name='remove_shared_whiteboard'),

    
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)