from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone

# Create your models here.

class Todo(models.Model):
    
    CATEGORY_CHOICES = [
        ("work", "Work"),
        ("personal", "Personal"),
        ("urgent", "Urgent"),
        ("Study", "Study"),
        
        ("others", "Others"),
    ]
    PRIORITY_CHOICES = [
        ("high", "High"),
        ("medium", "Medium"),
        ("low", "Low"),
    ]
    user = models.ForeignKey(User,on_delete=models.CASCADE,null=True, related_name="todos")
    todo_title = models.CharField(max_length=20,null=True)
    todo_description = models.TextField(null=True)
    is_completed = models.BooleanField(default=False) 
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES, default="others")  # New category field
    due_date = models.DateTimeField(null=True, blank=True)  # Due date field
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default="medium")  # ✅ Add priority field
    order = models.IntegerField(default=0)
    completed_at = models.DateTimeField(null=True, blank=True) 
   
    
    class Meta:
        ordering = ["order"]  # ✅ Default sorting order field ഉപയോഗിച്ച്

    def __str__(self):
        return self.todo_title if self.todo_title else "Untitled Todo" 
    
class UserProfile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,null=True)
    profile_photo = models.ImageField(upload_to="images/",null=True,blank=True)
    points = models.IntegerField(default=0)  
    

class UserOTP(models.Model):
    otp = models.CharField(max_length=20)
    user = models.ForeignKey(User, on_delete=models.CASCADE,null=True)
    
from django.utils.timezone import now, timedelta
from django.conf import settings
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.db import models

class ExpiringToken(Token):
    """
    Custom Token model with expiration support.
    """
    expires_at = models.DateTimeField(null=True, blank=True)

    def is_expired(self):
        return self.expires_at and now() > self.expires_at
   
    
