from django.http import HttpResponse,JsonResponse,response
from rest_framework.decorators import api_view,permission_classes
from rest_framework.status import HTTP_201_CREATED,HTTP_400_BAD_REQUEST,HTTP_200_OK,HTTP_204_NO_CONTENT
from rest_framework.response import Response
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated

from Employee.models import Employee
from Projects.models import Project_Employee,Project
from Notification.models import Notification

from .serializers import NotificationSerializer
from Api.authentication import JWTAuthentication



@api_view(["GET",'POST',"PUT"])
@authentication_classes([JWTAuthentication])  
@permission_classes([IsAuthenticated])
def Get_notifications(request):
    if request.method == "GET":
        notifications = Notification.objects.filter(employee =request.user ,is_seen =False)
        #print(notifications)
        serializer = NotificationSerializer(notifications,many=True)
        return Response(serializer.data,status = HTTP_200_OK)
    elif request.method == "PUT":
        notifications = Notification.objects.filter(employee =request.user ,is_seen =False)
        notifications.update(is_seen=True)
        #print(request.data)
        return Response(status=HTTP_200_OK)
    elif request.method == "POST":
        #print(request.data)
        serializer = NotificationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
        return Response(status=HTTP_200_OK)
    return Response(status=HTTP_400_BAD_REQUEST)




@api_view(['POST'])
@authentication_classes([JWTAuthentication])  
@permission_classes([IsAuthenticated])
def Request_skill(request):
    project_set=Project_Employee.objects.filter(employee=request.user).values('project')
    project_ids = [item['project'] for item in project_set.values('project')]
    projects = Project.objects.filter(id__in=project_ids)
    Lead_ids=set()
    for proj in projects:
        Lead_ids.add(proj.lead.id)
    #print(Lead_ids)
    data=request.data
    for lead in Lead_ids:
        data["employee"]=lead
        serializer = NotificationSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
    return Response(status=HTTP_200_OK)

