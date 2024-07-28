from django.db import models

# Create your models here.
class Skill(models.Model):
    skill =models.CharField(("skill"), max_length=30,unique=True)
    def __str__(self):
        return f"{self.skill}"

class ExpertiseLevel(models.TextChoices):
        BEGINNER = "BG", 
        INTERMEDIATE = "IN"
        EXPERT = "EX"