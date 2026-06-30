# ToDo

A Django-based productivity application for managing tasks and collaborating in
real time. Beyond a simple task list, it includes projects, a calendar view,
efficiency charts, sticky notes, and collaborative whiteboards.

## Features

- **Tasks** — create, update, complete, and delete tasks, with file attachments
  and per-task checklists
- **Projects** — group and organize tasks
- **Dashboard & calendar** — overview of tasks and a calendar view with a JSON feed
- **Task efficiency** — charts summarizing progress
- **Sticky notes** — quick notes with a REST API
- **Whiteboards** — create, view, save, share, and delete collaborative boards
  (real-time updates via Django Channels)
- **Recycle bin** — recover deleted items
- **Authentication** — signup, login, and logout

## Tech Stack

- **Backend:** Django 5.1, Django REST Framework
- **Real-time:** Django Channels with a Redis channel layer
- **Database:** SQLite (default)
- **Frontend:** Django templates with a custom stylesheet

## Project Structure

```
.
├── manage.py
├── requirements.txt
├── ToDo/          # Project settings, URLs, ASGI config
├── index/         # Main application (views, URLs, models)
├── templates/     # HTML templates
├── static/        # CSS and static assets
└── task_files/    # Uploaded task attachments
```

## Getting Started

### Prerequisites

- Python 3.11+
- Redis (required for the real-time whiteboard/Channels features)

### Setup

```bash
# Create and activate a virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Apply database migrations
python manage.py migrate

# Create an admin user (optional)
python manage.py createsuperuser

# Run the development server
python manage.py runserver
```

The app will be available at `http://127.0.0.1:8000/`.

## Notes

Make sure a Redis server is running locally for the whiteboard and other
Channels-powered real-time features to work.
