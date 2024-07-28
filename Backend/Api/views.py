from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import logout

from .authentication import JWTAuthentication

from Employee.models import  Employee

@api_view(["POST"])
def Login(request):
    username_or_email = request.data.get('username')
    password = request.data.get('password')
    emp = Employee.objects.filter(username=username_or_email).first()
    if emp is None:
        emp = Employee.objects.filter(email=username_or_email).first()
    if emp is None or not emp.check_password(password):
        return Response({'message': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
    jwt_token = JWTAuthentication.create_jwt(emp)

    return Response({'token': jwt_token})