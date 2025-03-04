from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed
from .models import ExpiringToken
from django.utils.timezone import now

class ExpiringTokenAuthentication(TokenAuthentication):
    """
    Custom authentication class that checks token expiration.
    """
    model = ExpiringToken

    def authenticate_credentials(self, key):
        try:
            token = self.model.objects.get(key=key)
        except self.model.DoesNotExist:
            raise AuthenticationFailed("Invalid token")

        if token.is_expired():
            token.delete()
            raise AuthenticationFailed("Token has expired")

        return (token.user, token)
