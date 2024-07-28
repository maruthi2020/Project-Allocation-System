from django.http import JsonResponse
from rest_framework.decorators import api_view,permission_classes
from rest_framework.status import HTTP_400_BAD_REQUEST,HTTP_200_OK,HTTP_204_NO_CONTENT
from rest_framework.response import Response

from Employee.models import Designation, Employee,Employee_skill
from Projects.models import Project, Project_Employee
from Skills.models import Skill
from .serializers import EmployeeSerializer,ProjectSerializer,EmployeeSkillSerializer
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from Api.authentication import JWTAuthentication


#for getting loged user details ,edit the user
@api_view(['GET','PUT','DELETE'])
@authentication_classes([JWTAuthentication])  
@permission_classes([IsAuthenticated])
def User_details(request):
    eid=request.user.id
    emp= Employee.objects.get(id=eid)
    if request.method=="GET":
        serializer = EmployeeSerializer(emp)
        return JsonResponse(serializer.data,safe=False)
    elif request.method=="PUT":
        serializer = EmployeeSerializer()
        if serializer:
            request.data["designation"] = Designation.objects.get(id = request.data.get("designation"))
            emp = serializer.update(emp,data=request.data)
            serializer=EmployeeSerializer(emp)
            return Response(serializer.data,status=HTTP_200_OK)
        else:
            print("invalid",serializer.errors)
        return Response(serializer.errors,status=HTTP_400_BAD_REQUEST)
    elif request.method == "DELETE":
        emp.delete()
        return Response(status=HTTP_204_NO_CONTENT)


#to get the user projects
@api_view(['GET'])
@authentication_classes([JWTAuthentication])  
@permission_classes([IsAuthenticated])
def User_projects(request):
    if request.method == "GET":
        emp_id=request.user.id
        emp=Employee.objects.get(id=emp_id)
        project_set=Project_Employee.objects.filter(employee=emp).values('project')
        project_ids = [item['project'] for item in project_set.values('project')]
        projects = Project.objects.filter(id__in=project_ids)
        serializer = ProjectSerializer(projects,many=True)
        return JsonResponse(serializer.data,safe=False)


#to get user skills
@api_view(['GET','PUT','DELETE'])
@authentication_classes([JWTAuthentication])  
@permission_classes([IsAuthenticated])
def User_skills(request):
    emp_skill_set= Employee_skill.objects.filter(employee=request.user.id)
    emp=Employee.objects.get(id=request.user.id)
    if request.method=="GET":
        serializer = EmployeeSkillSerializer(emp_skill_set,many=True)
        return JsonResponse(serializer.data,safe=False)
    elif request.method=="PUT":
        skill=Skill.objects.get(id=request.data['skill'])
        emp_skill ,created= Employee_skill.objects.get_or_create(employee=emp , skill=skill)
        serializer = EmployeeSkillSerializer(emp_skill,data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=HTTP_200_OK)
        else:
            print("invalid",serializer.errors)
        return Response(serializer.errors,status=HTTP_400_BAD_REQUEST)
    elif request.method == "DELETE":
        try:
            skill=Skill.objects.get(id=request.data['skill'])
            emp_skill= Employee_skill.objects.get(employee=emp , skill=skill,expertiseLevel=request.data['expertiseLevel'])
            emp_skill.delete()
        except :
            print("no data available for deleting ")
            return Response(status=HTTP_400_BAD_REQUEST)
        
        return Response(status=HTTP_204_NO_CONTENT)
