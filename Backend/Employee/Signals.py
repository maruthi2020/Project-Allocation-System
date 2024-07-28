from django.db.models.signals import post_delete,post_save,pre_save,pre_delete
from django.dispatch import receiver

from .models import Employee,Employee_skill
from Notification.models import Notification


@receiver(post_save,sender = Employee)
def employee_creation(sender,instance,created, **kwargs):
    if created: 
        Notification.objects.create(employee=instance, message = "Welcome to beehyv community")
        print("employee created")
    else:
        Notification.objects.create(employee=instance, message = "your details are updated")
        print("updated")
    print(sender,vars(instance),kwargs)

@receiver(post_save,sender = Employee_skill)
def employee_skills(sender,instance,created, **kwargs):
    # employee = Employee.objects.get(id = instance.emp)
    if created: 
        Notification.objects.create(employee=instance.employee, message = "new skill added")
        print("new skill has been added")
    else:
        Notification.objects.create(employee=instance.employee, message = "your skill ratings are updated")
        print("updated")