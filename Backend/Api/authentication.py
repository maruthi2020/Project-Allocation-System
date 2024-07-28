from datetime import datetime, timedelta

from django.http import JsonResponse
import jwt
from Api.serializers import EmployeeSerializer
import Backend.settings as settings
from rest_framework import authentication
from rest_framework.exceptions import AuthenticationFailed


from Employee.models import Employee

class JWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):

        jwt_token = request.META.get('HTTP_AUTHORIZATION')
        #print("hey",jwt_token)
        #print("he;;p")
        if jwt_token is None:
            return None
        #print("hello")
        jwt_token = JWTAuthentication.get_the_token_from_header(jwt_token) 
        #print("heyy")
        try:
            payload = jwt.decode(jwt_token, settings.SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token expired')
        except jwt.InvalidTokenError: 
            raise AuthenticationFailed('Invalid token')
        username_or_email = payload.get('employee_identifier')
        if username_or_email is None:
            raise AuthenticationFailed('Employee identifier not found in JWT')
        #print("hey ",username_or_email)
        emp = Employee.objects.filter(username=username_or_email).first()
        if emp is None:
            emp = Employee.objects.filter(email=username_or_email).first()
            if emp is None:
                raise AuthenticationFailed('Employee not found')
        return emp, payload

    def authenticate_header(self, request):
        return 'Bearer'

    @classmethod
    def create_jwt(cls, emp):
        payload = {
            'employee_identifier': emp.username,
            #expire time
            'exp': int((datetime.now() + timedelta(hours=settings.JWT_CONF['TOKEN_LIFETIME_HOURS'])).timestamp()),
            #issued time
            'iat': datetime.now().timestamp(),
        }
        jwt_token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

        return jwt_token

    @classmethod
    def get_the_token_from_header(cls, token):
        token = token.replace('Bearer', '').replace(' ', '') 
        return token