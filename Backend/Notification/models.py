from django.db import models


from Employee.models import Employee
# Create your models here.
class Notification(models.Model):
    message = models.CharField(("messgae"), max_length=100)
    employee = models.ForeignKey(Employee, verbose_name=("employee"), on_delete=models.SET_NULL ,null =True)
    is_seen =models.BooleanField(("is_seen"),default = False)

    def __str__(self) -> str:
        return self.employee.username