from django.contrib import admin

# Register your models here.
from .models import Project_skill,Project,Project_Employee

admin.site.register(Project_skill)
admin.site.register(Project)
admin.site.register(Project_Employee)