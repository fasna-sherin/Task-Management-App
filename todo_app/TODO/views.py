from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from .models import *
from django.contrib.auth.models import User
from django.contrib.auth import logout 
from .serializers import *
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from rest_framework.authentication import TokenAuthentication
from datetime import  datetime,timedelta
import random
from django.core.mail import send_mail
from django.contrib.auth.hashers import make_password
from django.core.cache import cache
from celery import shared_task
from django.utils.timezone import now
import openai
from django.http import JsonResponse
from django.utils import timezone
from rest_framework.exceptions import AuthenticationFailed

class RegisterUserView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")
        confirm_password = data.get("confirm_password")
        profile_photo = request.FILES.get("profile_photo")

        if not username or not email or not password:
            return Response({"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)
        
        if password != confirm_password:
            return Response({"error": "Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, email=email, password=password)
        
        profile = UserProfile.objects.create(
            user=user, 
            profile_photo=profile_photo  
        )
        
        profile_serializer = UserProfileSerializer(profile)

        return Response({
            "message": "User registered successfully",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
            },
            "profile": profile_serializer.data,
        }, status=status.HTTP_201_CREATED)



class LoginApi(APIView):
    permission_classes = []

    def post(self, request):
        data = request.data
        username = data.get("username")
        password = data.get("password")
        remember_me = data.get("remember_me", False)

        if not username or not password:
            return Response({"message": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)
        if user:
            token, created = Token.objects.get_or_create(user=user)
            expires_at = datetime.now() + (timedelta(days=30) if remember_me else timedelta(hours=1))

            return Response({
                "status": "true",
                "message": "Login successful",
                "token": token.key,
                "is_admin": user.is_superuser,
                "expires_at": expires_at.strftime("%Y-%m-%dT%H:%M:%S")
            }, status=status.HTTP_200_OK)

        return Response({"status": "false", "message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


class TodoListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        print("Authenticated User:", request.user)
        
        todos = Todo.objects.filter(user=request.user)

  
        sort_by = request.GET.get('sort_by')  
        order = request.GET.get('order', 'asc') 

        if sort_by == 'priority':
            priority_order = {'high': 1, 'medium': 2, 'low': 3}
            todos = sorted(todos, key=lambda t: priority_order[t.priority], reverse=(order == 'desc'))

        serializer = TodoSerializer(todos, many=True)
        return Response(serializer.data)

    def post(self, request):
        print("Request Data:", request.data)

        data = request.data.copy()

        if 'due_date' in data and data['due_date']:
            try:
                data['due_date'] = datetime.strptime(data['due_date'], "%Y-%m-%dT%H:%M:%S.%fZ")
            except ValueError:
                return Response(
                    {
                        "success": False,
                        "message": "Invalid due_date format. Use ISO format: YYYY-MM-DDTHH:MM:SSZ",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        serializer = TodoSerializer(data=data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(
                {
                    "success": True,
                    "message": "Todo created successfully.",
                    "data": serializer.data,
                },
                status=status.HTTP_201_CREATED,
            )

        print("Validation Errors:", serializer.errors)
        return Response(
            {
                "success": False,
                "message": "Todo creation failed",
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

class TodoDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        todo = get_object_or_404(Todo, id=id, user=request.user)  
        serializer = TodoSerializer(todo)
        return Response(serializer.data)

    def put(self, request, id):
        todo = get_object_or_404(Todo, id=id, user=request.user)
        serializer = TodoSerializer(todo, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                "message": "Todo edited successfully.",
                "data": serializer.data,
            }, status=status.HTTP_200_OK)
        return Response({
            "success": False,
            "message": "Todo edition failed",
            "data": serializer.errors,
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        todo = get_object_or_404(Todo, id=id, user=request.user)
        todo.delete()
        return Response({"message": "Todo deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

class TodoComplete(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def put(self, request, id):
        todo = get_object_or_404(Todo, id=id, user=request.user)
        user = request.user

        profile, _ = UserProfile.objects.get_or_create(user=user)

        previous_status = todo.is_completed
        todo.is_completed = not todo.is_completed
        todo.save()

        if not previous_status and todo.is_completed and todo.due_date and todo.due_date >= timezone.now().date():
            profile.points += 10
            profile.save()

        return Response({
            "success": True,
            "message": "Todo status updated successfully",
            "is_completed": todo.is_completed,
            "total_points": profile.points,
        }, status=status.HTTP_200_OK)

class UserProfileView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutApi(APIView):
    authentication_classes = [TokenAuthentication]  
    permission_classes = [IsAuthenticated]  

    def post(self, request):
        request.auth.delete()  
        logout(request)  

        return Response({
            'status': 'true',
            'message': 'Successfully logged out',
        }, status=status.HTTP_200_OK)


class ForgotPassword(APIView):
    permission_classes = []

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data["username"]
            user = User.objects.filter(username=username).first()

            if user:
                email = user.email
                otp = random.randint(1000, 9999)  # Generate 4-digit OTP
                
              
                subject = 'Password Reset OTP'
                message = f'Here is your One-Time Password (OTP): {otp}'
                from_email = 'fasnasherin603@gmail.com'
                recipient_list = [email]

                try:
                    send_mail(subject, message, from_email, recipient_list, fail_silently=False)
                
                    UserOTP.objects.update_or_create(user=user, defaults={'otp': otp})

                    return Response({'message': 'OTP sent successfully', 'user_id': user.id}, status=200)

                except Exception as e:
                    return Response({'error': 'Failed to send OTP', 'details': str(e)}, status=500)

            return Response({'error': 'User not found'}, status=404)

        return Response(serializer.errors, status=400)


class OTPVerify(APIView):
    permission_classes = []

    def post(self, request, id):
        serializer = OTPVerifySerializer(data=request.data)
        if serializer.is_valid():
            user = User.objects.filter(id=id).first()
            if not user:
                return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

            submitted_otp = serializer.validated_data["otp"]
            user_otp_obj = UserOTP.objects.filter(user=user).first()

            if not user_otp_obj:
                return Response({"error": "OTP not found"}, status=status.HTTP_404_NOT_FOUND)

            if submitted_otp == user_otp_obj.otp:
                return Response({"message": "OTP verified successfully"}, status=status.HTTP_200_OK)

            return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=400)
       
class PasswordReset(APIView):
    permission_classes = []

    def post(self, request, id):
        user = User.objects.filter(id=id).first()
        if not user:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            user.password = make_password(serializer.validated_data["password1"])
            user.save()

            return Response({"message": "Password reset successful"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class AdminPage(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAdminUser]

    def get(self, request):
        users = User.objects.all()
        users_data = UserSerializer(users, many=True).data  
        
        return Response({"users": users_data}) 

class BlockUnblockUserView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAdminUser]

    def post(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        user.is_active = not user.is_active
        user.save()
        status_text = "unblocked" if user.is_active else "blocked"
        return Response({"message": f"User {user.username} has been {status_text}."})
    

class ReorderTodosView(APIView):
    def post(self, request):
        data = request.data.get('reordered_todos', [])  
        for item in data:
            try:
                todo = Todo.objects.get(id=item["id"])
                todo.order = item["new_order"]  
                todo.save()
            except Todo.DoesNotExist:
                continue
        return Response({"message": "Reordered successfully"}, status=status.HTTP_200_OK)


class ExpiringTokenAuthentication(TokenAuthentication):
    def authenticate_credentials(self, key):
        user, token = super().authenticate_credentials(key)
        expiration_time = cache.get(f"token_expiry_{key}")
        if expiration_time and now() > expiration_time:
            token.delete()
            cache.delete(f"token_expiry_{key}")
            raise AuthenticationFailed("Token has expired. Please log in again.")
        
        return user, token