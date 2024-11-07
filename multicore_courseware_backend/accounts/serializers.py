from rest_framework import serializers
from accounts.models import User

from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['mobile', 'first_name', 'last_name', 'email', 'password']


class PhoneSerializer(serializers.Serializer):
    mobile = serializers.CharField( required=True)

    class Meta:
        fields = ['mobile']

class OTPSerializer(serializers.Serializer):
    mobile = serializers.CharField( required=True)
    otp = serializers.CharField( required=True)
    otp_token = serializers.CharField( required=True)
    class Meta:
        fields = ['mobile', 'otp', 'otp_token']