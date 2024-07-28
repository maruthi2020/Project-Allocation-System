from django.db.models.signals import post_delete,post_save,pre_save,pre_delete
from django.dispatch import receiver

from Notification.models import Notification

from .models import Project_Employee

@receiver(post_save,sender = Project_Employee)
def project_employee_signal(sender,instance,created, **kwargs):
    if created:
         Notification.objects.create(employee=instance.employee, message = "new project is assigned")