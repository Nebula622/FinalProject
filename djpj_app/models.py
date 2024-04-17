from django.db import models

# Create your models here.
class User(models.Model):
    username = models.CharField(max_length=100, unique=True) # 사용자 이름
    password = models.CharField(max_length=128) # 사용자 패스워드
    robotname = models.CharField(max_length=128)
    
class FairyTale(models.Model):
    name = models.CharField(max_length=128, unique=True)

class UserProgress(models.Model):
    username = models.ForeignKey(User, on_delete=models.CASCADE)
    fairytale = models.ForeignKey(FairyTale, on_delete=models.CASCADE)
    progress = models.IntegerField(default=0)

    class Meta:
        unique_together = ('username', 'fairytale')  # Ensure unique user-fairy_tale combination