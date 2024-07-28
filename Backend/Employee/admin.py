from django.contrib import admin

# Register your models here.
from .models import Employee,Designation,Employee_skill


admin.site.register(Designation)
admin.site.register(Employee)
admin.site.register(Employee_skill)