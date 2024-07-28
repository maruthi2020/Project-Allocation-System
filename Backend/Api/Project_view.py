from django.http import HttpResponse,JsonResponse,response
from rest_framework.decorators import api_view,permission_classes,authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import HTTP_500_INTERNAL_SERVER_ERROR,HTTP_201_CREATED,HTTP_400_BAD_REQUEST,HTTP_200_OK,HTTP_404_NOT_FOUND,HTTP_204_NO_CONTENT
from rest_framework.response import Response
from rest_framework import permissions
from django.contrib.auth.decorators import user_passes_test,login_required
from django.contrib.auth import authenticate, login,logout


from .authentication import JWTAuthentication
from Employee.models import Employee,Employee_skill
from Projects.models import Project,Project_skill,Project_Employee
from Skills.models import Skill
from .serializers import EmployeeSerializer,ProjectSerializer,EmployeeSkillSerializer,ProjectSkillSerializer





@api_view(["GET",'POST',"PUT","DELETE"])
@authentication_classes([JWTAuthentication])  
@permission_classes([IsAuthenticated])
def Project_skill_detail(request,pid):
    proj=Project.objects.get(id=pid)
    proj_skill_set= Project_skill.objects.filter(project=proj)
    if request.method=="GET":
        serializer = ProjectSkillSerializer(proj_skill_set,many=True)
        return JsonResponse(serializer.data,safe=False)
    elif request.method=="PUT" or request.method=="POST":
        #print(request.data,"-------------------")
        skill=Skill.objects.get(id =request.data['skill'])
        proj_skill ,created= Project_skill.objects.get_or_create(project=proj ,skill=skill)
        #print(vars(proj_skill),created)
        serializer = ProjectSkillSerializer(proj_skill,data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=HTTP_200_OK)
        else:
            print("invalid",serializer.errors,request.data)
        return Response(serializer.errors,status=HTTP_400_BAD_REQUEST)
    elif request.method == "DELETE":
        #print("del",request.data)
        project_id = request.data.get('project')
        skill_id = request.data.get('skill')

        if project_id is None or skill_id is None:
            return Response({"error": "Project ID or Skill ID is missing"}, status=HTTP_400_BAD_REQUEST)

        try:
            proj_skill = Project_skill.objects.get(project=project_id, skill=skill_id)
            proj_skill.delete()
            return Response(status=HTTP_204_NO_CONTENT)
        except Project_skill.DoesNotExist:
            return Response({"error": "Project skill not found"}, status=HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET","POST","DELETE"])
@authentication_classes([JWTAuthentication])  
@permission_classes([IsAuthenticated])
def Employees_in_Project(request,pid):
    req_project = Project.objects.get(id=pid)
    if request.method == "GET":
        employee_set=Project_Employee.objects.filter(project=req_project).values('employee')
        employee_ids = [item['employee'] for item in employee_set.values('employee')]
        emps = Employee.objects.filter(id__in=employee_ids)
        serializer = EmployeeSerializer(emps,many=True)
        return Response(serializer.data,status=HTTP_200_OK)
    elif request.method == "POST":
        employee_id = request.data.get("employee")
        if employee_id:
            try:
                employee = Employee.objects.get(id=employee_id)
                proj_employee, created = Project_Employee.objects.get_or_create(
                    employee=employee,
                    project=req_project
                )
                if created:
                    return Response(status=HTTP_201_CREATED)
                else:
                    return Response(status=HTTP_200_OK)
            except Employee.DoesNotExist:
                return Response({"error": "Employee not found"}, status=HTTP_404_NOT_FOUND)
        else:
            return Response({"error": "Employee ID not provided"}, status=HTTP_400_BAD_REQUEST)
    if request.method == "DELETE":
        print(request.data)
        employee_id = request.data.get("employee")
        if employee_id:
            try:
                employee = Employee.objects.get(id=employee_id)
                proj_employee = Project_Employee.objects.get(
                    employee=employee,
                    project=req_project
                )
                proj_employee.delete()
                return Response(status=HTTP_200_OK)
            except Employee.DoesNotExist:
                return Response({"error": "Employee not found"}, status=HTTP_404_NOT_FOUND)
        else:
            return Response({"error": "Employee ID not provided"}, status=HTTP_400_BAD_REQUEST)

    return Response({"error": "Invalid request method"}, status=HTTP_400_BAD_REQUEST)



@api_view(["GET",'POST'])
@authentication_classes([JWTAuthentication])  
@permission_classes([IsAuthenticated])
@user_passes_test(lambda u: u.is_superuser)
def Project_viewset(request):
    if request.method=="GET":
        projs=Project.objects.all()
        serializer=ProjectSerializer(projs,many=True)
        return JsonResponse(serializer.data,safe=False)
    elif request.method=="POST":
        if(request.data["lead"] == ""):
            request.data["lead"]=request.user.id
        serializer=ProjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            try:
                #print(serializer.data)
                project=Project.objects.get(id= serializer.data["id"])
                employee = Employee.objects.get(id = serializer.data["lead"])
                Project_Employee.objects.create(project=project,employee = employee)
            except Exception as e:
                print("project employee creation error",e)
                return Response(status=HTTP_400_BAD_REQUEST)
            return Response(serializer.data,status=HTTP_201_CREATED)
        else:
            print(serializer.errors)
        return Response(serializer.errors,status=HTTP_400_BAD_REQUEST)
    



@api_view(['GET','PUT','DELETE'])
def Project_detail(request,pid):
    proj= Project.objects.get(id=pid)
    if request.method=="GET":
        serializer = ProjectSerializer(proj)
        return JsonResponse(serializer.data,safe=False)
    elif request.method=="PUT":
        serializer = ProjectSerializer(proj,data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=HTTP_200_OK)
        else:
            print("invalid",serializer.errors)
        return Response(serializer.errors,status=HTTP_400_BAD_REQUEST)
    elif request.method == "DELETE":
        proj.delete()
        return Response(status=HTTP_204_NO_CONTENT)





#get suggested employees for the project based on req projet skill set
@api_view(["GET","DELETE"])
def Suggested_Employees(request,pid):
    proj=Project.objects.get(id=pid)
    proj_req_skills=Project_skill.objects.filter(project_id=pid)
    proj_req_skill_ids= set(proj_req_skills.values_list('skill'))
    proj_req_skill_dict=dict(proj_req_skills.values_list('skill','expertiseLevel'))
    #employees already present in project
    employee_set=Project_Employee.objects.filter(project=proj).values('employee')
    employee_ids = [item['employee'] for item in employee_set.values('employee')]
    emps=Employee.objects.all()
    final_emp_list=list(emps)
    for emp in emps:
        if emp.id in employee_ids:
            final_emp_list.remove(emp)
            continue
        emp_skill_set=Employee_skill.objects.filter(employee=emp)
        emp_skill_ids = set(emp_skill_set.values_list('skill'))
        exp_level={
            "IN":2,
            "BG":1,
            "EX":3
        }
        if proj_req_skill_ids.issubset(emp_skill_ids):
            emp_skill_dict = dict(emp_skill_set.values_list('skill','expertiseLevel'))
            for proj_skill_id in proj_req_skill_dict.keys():
                if exp_level[proj_req_skill_dict[proj_skill_id]] > exp_level[emp_skill_dict[proj_skill_id]]:
                    final_emp_list.remove(emp)
                    break
        else:
            final_emp_list.remove(emp)
    serializer = EmployeeSerializer(final_emp_list,many=True)
    return Response(serializer.data,status=HTTP_200_OK)
    
@api_view(["GET"])
def Check_employees_satisfaction(request,pid):
    #print("checking--------")
    proj=Project.objects.get(id=pid)
    proj_req_skills=Project_skill.objects.filter(project_id=pid)
    proj_req_skill_ids= set(proj_req_skills.values_list('skill'))
    proj_req_skill_dict=dict(proj_req_skills.values_list('skill','expertiseLevel'))
    #print(proj_req_skill_dict,"idtc proj")
    employee_set=Project_Employee.objects.filter(project=proj).values('employee')
    employee_ids = [item['employee'] for item in employee_set.values('employee')]
    #print(employee_ids,"----" )
    if proj.lead_id in employee_ids:
        employee_ids.remove(proj.lead_id)
    emps = Employee.objects.filter(id__in=employee_ids)
    for emp in emps:
        emp_skill_set=Employee_skill.objects.filter(employee=emp)
        emp_skill_ids = set(emp_skill_set.values_list('skill'))
        exp_level={
            "IN":2,
            "BG":1,
            "EX":3
        }
        if proj_req_skill_ids.issubset(emp_skill_ids):
            emp_skill_dict = dict(emp_skill_set.values_list('skill','expertiseLevel'))
            #print(emp_skill_dict,"emp  ditc")
            for proj_skill_id in proj_req_skill_dict.keys():
                if exp_level[proj_req_skill_dict[proj_skill_id]] > exp_level[emp_skill_dict[proj_skill_id]]:
                    employee_instance = Project_Employee.objects.get(project = proj ,employee = emp)
                    employee_instance.delete()
                    break
        else:
            employee_instance = Project_Employee.objects.get(project = proj ,employee = emp)
            employee_instance.delete()
        #print()
    return Response(status=HTTP_200_OK)