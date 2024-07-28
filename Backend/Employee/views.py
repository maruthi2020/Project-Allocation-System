from django.shortcuts import render
from django.http import HttpResponse

from .models import Employee,Employee_skill
from Skills.models import Skill,ExpertiseLevel
from Projects.models import Project,Project_skill 
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from Api.authentication import JWTAuthentication


def listOfemployees(request):
    print(request.user)
    list_of_users=Employee.objects.all().values()
    for mem in list_of_users:
        print(mem)
    return HttpResponse("<h1>hey phani</h1>")

def project_emp(request):
    proj=Project.objects.get(id=1)
    print("---------")
    proj_req_skill_set=set(Project_skill.objects.filter(project_id=proj).values_list('skill','expertiseLevel'))
    print(proj_req_skill_set)
    emps=Employee.objects.all()
    for emp in emps:
        emp_skilll_set=set(Employee_skill.objects.filter(employee=emp).values_list('skill','expertiseLevel'))
        print(emp_skilll_set)
        if proj_req_skill_set.issubset(emp_skilll_set):
            print("employee passed requirements ",emp)
        else:
            print("employee doesnot have suffient skills",emp)
    return HttpResponse("<h1>hey phani</h1>")

def add_emp(request):
    # Assuming skills.objects.get(id=0) returns a valid skill instance
    print(Skill.objects.all().values()) 
    skill_instance = Skill.objects.first()
    
    password = "phani123"
    user_created ,created= Employee.objects.get_or_create(username="phani", email="phani@gmail.com")
    user_created.set_password(password)
    user_created.save()
    print(user_created)
    # Create the emp_skills instance
    emp_sk,created = Employee_skill.objects.get_or_create(employee=user_created,skill=skill_instance)
    print(emp_sk)
    emp_sk.expertiseLevel=ExpertiseLevel.BEGINNER
    # Save the emp_skills instance before setting the many-to-many relationship
    emp_sk.save()
    print(emp_sk)
    return HttpResponse("<h1>hey phani</h1>")
