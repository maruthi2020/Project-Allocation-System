from django.http import JsonResponse
from rest_framework.decorators import api_view,permission_classes
from rest_framework.status import HTTP_200_OK
from django.contrib.auth.decorators import user_passes_test

from Employee.models import Designation
from .serializers import DesignationSerializer
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from Api.authentication import JWTAuthentication


#to get avaialable designations
@api_view(['GET',"POST"])
@authentication_classes([JWTAuthentication])  
@permission_classes([IsAuthenticated])
@user_passes_test(lambda u: u.is_superuser)
def Get_Designations(request):
    if request.method == "GET":
        designations = Designation.objects.all()
        serializer = DesignationSerializer(designations,many = True)
        return JsonResponse(serializer.data,status=HTTP_200_OK,safe=False)
    elif request.method == "POST":
        serializer = DesignationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
        return JsonResponse(serializer.data,status=HTTP_200_OK)