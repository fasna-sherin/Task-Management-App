from rest_framework import serializers
from .models import*
from django.contrib.auth.models import User

class TodoSerializer(serializers.ModelSerializer):
    
     class Meta:
         model = Todo
         fields = '__all__' 

#         fields = ''
        # fields = ['id', 'todo_title', 'todo_description', 'is_completed']
# class TodoSerializer(serializers.ModelSerializer):
    
 
#         model = Todo
#         # fields = ["id", "todo_title", "todo_description", "is_completed", "username","userId"]
        
    # class Meta:
    #     model = Todo
    #     fields = ['id', 'todo_title', 'todo_description', 'is_completed']  # No need for 'user' field here

    # def create(self, validated_data):
    #     request = self.context['request']
    #     validated_data['user'] = request.user  # Assign user automatically
    #     return super().create(validated_data)
        
class UserProfileSerializer(serializers.ModelSerializer):
    
    user = serializers.CharField(source='user.username')
    email = serializers.EmailField(source='user.email', allow_null=True)
    profile_photo = serializers.ImageField(required=False)
    
    class Meta:
        model = UserProfile
        fields = ["id","user", "email","profile_photo"]
 
        
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email','is_active']
        
class RegisterSerializer(serializers.ModelSerializer):
    # mob_no = serializers.CharField(write_only=True)
    # birth_date = serializers.DateField(write_only=True, required=False)  # Allow optional input
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True) 

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password',"confirm_password"]
        
    def validate(self, data):
        
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"password": "Passwords do not match"})
        return data
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value

    def create(self, validated_data):
       
        # birth_date = validated_data.pop("birth_date", None)  # Default to None if not provided

        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"]
        )
        UserProfile.objects.create(user=user, )  # Store birth_date

        return user



   
class Loginserializer(serializers.Serializer):
    
    username = serializers.CharField()
    password = serializers.CharField()

class ForgotPasswordSerializer(serializers.Serializer):
    username = serializers.CharField()

class OTPVerifySerializer(serializers.Serializer):
    
    otp = serializers.CharField()

class PasswordResetSerializer(serializers.Serializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    def validate(self, data):
        if data["password1"] != data["password2"]:
            raise serializers.ValidationError("Passwords do not match")
        return data
