from django.http import HttpResponse,JsonResponse,response
from rest_framework.decorators import api_view,permission_classes
from rest_framework.status import HTTP_201_CREATED,HTTP_404_NOT_FOUND,HTTP_500_INTERNAL_SERVER_ERROR,HTTP_400_BAD_REQUEST,HTTP_200_OK,HTTP_204_NO_CONTENT
from rest_framework.response import Response
from rest_framework import permissions
from django.contrib.auth.decorators import user_passes_test,login_required
from django.contrib.auth import authenticate, login,logout

from Employee.models import Employee,Employee_skill,Designation
from Projects.models import Project,Project_skill
from Skills.models import Skill
from .serializers import EmployeeSerializer,ProjectSerializer,EmployeeSkillSerializer,ProjectSkillSerializer
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from Api.authentication import JWTAuthentication



#for getting all employees and creating a new employee only for superuser
@api_view(["GET",'POST'])
@authentication_classes([JWTAuthentication])  
@permission_classes([IsAuthenticated])
@user_passes_test(lambda u: u.is_superuser)
def Employees_View(request):
    #print(request.user)
    if request.method == "GET":
        emps= Employee.objects.all()
        serializer = EmployeeSerializer(emps,many=True)
        return JsonResponse(serializer.data,safe=False)
    elif request.method == "POST":
        try:
            serializer=EmployeeSerializer()
            request.data["designation"] = Designation.objects.get(id = request.data.get("designation"))
            #print("rtrtsdnkn")
            serializer.create(data = request.data)
            #print("sdnkn")
            return Response(serializer.data, status=HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=HTTP_400_BAD_REQUEST)

#getting employee skills and modify the skills only for superuser
@api_view(['GET','PUT','DELETE'])
@authentication_classes([JWTAuthentication])  
@permission_classes([IsAuthenticated])
@user_passes_test(lambda u: u.is_superuser)
def Employee_skills(request,eid):
    emp_skill_set= Employee_skill.objects.filter(employee=eid)
    emp=Employee.objects.get(id=eid)
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
        skill_id = request.data.get('skill')
        skill=Skill.objects.get(id=skill_id)
        try:
            emp_skill= Employee_skill.objects.get(employee=emp , skill=skill)
            emp_skill.delete()
            return Response(status=HTTP_204_NO_CONTENT)
        except Project_skill.DoesNotExist:
            return Response({"error": "Employee skill not found"}, status=HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)




# @api_view(["GET",'POST'])
# def Employee_skill_viewset(request):
#      if request.method == "GET":
#         emps= Employee_skill.objects.all()
#         serializer = EmployeeSkillSerializer(emps,many=True)
#         return JsonResponse(serializer.data,safe=False)
#      elif request.method == "POST":
#         serializer = EmployeeSkillSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data,status=HTTP_201_CREATED)
#         else:
#             print("invalid",serializer.errors)
#         return Response(serializer.errors,status=HTTP_400_BAD_REQUEST)