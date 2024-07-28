from rest_framework.decorators import api_view,permission_classes,authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import HTTP_201_CREATED,HTTP_400_BAD_REQUEST,HTTP_200_OK,HTTP_204_NO_CONTENT
from rest_framework.response import Response
from django.http import JsonResponse

from .authentication import JWTAuthentication
from Skills.models import Skill
from .serializers import SkillSerializer


#to get all the skills present
@api_view(["GET","POST"])
@authentication_classes([JWTAuthentication])  
@permission_classes([IsAuthenticated])
def Skill_viewset(request):
    if request.method == "GET":
        skill_set=Skill.objects.all()
        serializer = SkillSerializer(skill_set,many=True)
        return Response(serializer.data,status=HTTP_200_OK)
    elif request.method == "POST":
        serializer = SkillSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
        return JsonResponse(serializer.data,status=HTTP_200_OK)
    return Response(status=HTTP_400_BAD_REQUEST)
