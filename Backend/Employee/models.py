from typing import Iterable
from django.db import models
from django.contrib.auth.models import AbstractUser

from Skills.models import Skill,ExpertiseLevel
class Designation(models.Model):
    designation = models.CharField(("designation"), default="developer", max_length=20, unique=True)

    def __str__(self):
        return self.designation

class Employee(AbstractUser):
    phone_number = models.CharField(("phone_number"), max_length=15,blank=True)
    blood_group = models.CharField(("blood_group"), max_length=10,blank=True)
    contact_address = models.CharField(("contact_address"), max_length=100,blank=True)
    GENDER_CHOICES = (
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    )
    gender = models.CharField(("Gender"),max_length = 1, choices=GENDER_CHOICES ,default='M')
    designation = models.ForeignKey(
        Designation, verbose_name=("designation"),
        default=None, on_delete=models.SET_NULL,null =True
    )

    def save(self, *args, **kwargs):
        if self.designation and self.designation.designation == "Project lead":
            self.is_staff = True
            self.is_superuser = True
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username


class Employee_skill(models.Model):
    employee = models.ForeignKey(Employee, verbose_name=("employee"), on_delete=models.CASCADE,)
    skill = models.ForeignKey(Skill, verbose_name=("skill"), on_delete=models.CASCADE,default=None,null=True)
    expertiseLevel = models.CharField(
        max_length=2,
        choices=ExpertiseLevel.choices,
        default=ExpertiseLevel.BEGINNER,
    )
    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['employee', 'skill'], name='emp skill')
        ]

    def __str__(self):
        return f"{self.employee.username} skill"


