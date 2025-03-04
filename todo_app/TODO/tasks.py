import firebase_admin
from firebase_admin import credentials, messaging
from celery import shared_task
from django.utils.timezone import now
from .models import Todo

# Initialize Firebase (Only once)
cred = credentials.Certificate("todo_app/serviceAccountKey.json")
firebase_admin.initialize_app(cred)

@shared_task
def send_due_date_reminders():
    todos = Todo.objects.filter(due_date__lte=now(), is_completed=False)
    for todo in todos:
        if todo.user.fcm_token:  # Store FCM token in User model
            message = messaging.Message(
                notification=messaging.Notification(
                    title="Reminder: Your Todo is Due!",
                    body=f"Your task '{todo.todo_title}' is due! Please complete it soon.",
                ),
                token=todo.user.fcm_token,
            )
            response = messaging.send(message)
            print(f"Push Notification Sent: {todo.todo_title} - {response}")

    return "Due date push notifications sent successfully."
