from django.urls import path
from .views import *
from django.conf import settings
from django.conf.urls.static import static



urlpatterns = [

    path('register/',RegisterUserView.as_view()),
    path('login/',LoginApi.as_view()),
    path('todos/',TodoListView.as_view()),
    path('todos/<int:id>/', TodoDetailView.as_view(), name='todo_detail'),
    path('todocomplete/<int:id>/',TodoComplete.as_view(), name='todo_complete'),
    path('logout/', LogoutApi.as_view(), name='logout'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('forgot_password/', ForgotPassword.as_view() , name='user-profile'),
    path('otp_verify/<int:id>/', OTPVerify.as_view(), name='otp_verify'),
    path('password_reset/<int:id>/',PasswordReset.as_view(),name='password_reset'),
    path('admin_page/',AdminPage.as_view(),),
    path('user_tasks/<int:id>/',UserTasksView.as_view(),),
    path('block-unblock/<int:user_id>/', BlockUnblockUserView.as_view(), name='block-unblock-user'),
    path("todos/reorder/", reorder_todos, name="reorder_todos"),
    path("ai/",ai_suggestions),
    # path("complete/<int:id>/",complete_task),
    path('user/points/', UserPointsView.as_view(), name='user_points'),
    
   
    
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

