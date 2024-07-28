from django.urls import  path

from .views import listOfemployees,add_emp,project_emp 
urlpatterns = [
    path('users/',listOfemployees,name="employee"),
    path('add/',add_emp,name="add emp"),
    path("proj/",project_emp,name="project emp")
]