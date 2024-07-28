from rest_framework import serializers
from djoser.serializers import UserCreateSerializer

from Employee.models import Employee,Employee_skill,Designation
from Projects.models import Project,Project_skill
from Skills.models import Skill
from Notification.models import Notification

class DesignationSerializer(serializers.ModelSerializer):
    class Meta:
        model =Designation
        fields = ['id','designation']

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id','skill']

class EmployeeSerializer(serializers.ModelSerializer):
    emp_designation = DesignationSerializer(source='designation', read_only=True)
    emp_gender=serializers.CharField(source='get_gender_display', read_only=True)
    class Meta:
        model = Employee
        fields = ['id','password','designation','gender','username','first_name','last_name','emp_gender','email','date_joined','contact_address','emp_designation','blood_group','phone_number','is_superuser']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, data):
        try:
            emp = super().create(data)
            if data["designation"].designation=="Project Lead":
                emp.is_superuser=True
            emp.set_password(data['password'])
            emp.save()
        except Exception as e:
            print(e,"serializer create error")
        return emp
    
    def update(self, instance, data):
        emp = super().update(instance, data)
        try:
            emp.set_password(data['password'])
            emp.save()
            if data["designation"].designation=="Project Lead":
                emp.is_superuser=True
            emp.save()
        except KeyError:
            pass
        return emp


class ProjectSerializer(serializers.ModelSerializer):
    project_lead=EmployeeSerializer(source="lead",read_only=True,)
    class Meta:
        model=Project
        fields= ['id','title','description','starting_date','deadline','lead','project_lead']

class EmployeeSkillSerializer(serializers.ModelSerializer):
    skill_info= SkillSerializer(source='skill', read_only=True)
    expertise_level=serializers.CharField(source='get_expertiseLevel_display', read_only=True)
    class Meta:
        model=Employee_skill
        fields = ['id','employee', 'skill','skill_info','expertise_level','expertiseLevel']

class ProjectSkillSerializer(serializers.ModelSerializer):
    skill_info= SkillSerializer(source='skill', read_only=True)
    expertise_level=serializers.CharField(source='get_expertiseLevel_display', read_only=True)
    class Meta:
        model= Project_skill
        fields = ['project','skill_info','skill','expertiseLevel','expertise_level','id']

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'