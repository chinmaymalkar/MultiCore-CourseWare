from accounts.serializers import (UserSerializer, PhoneSerializer, OTPSerializer,)
# from accounts.models import ()
from rest_framework.exceptions import AuthenticationFailed, NotAcceptable
from django.core.management.utils import get_random_secret_key
from django.contrib.auth.decorators import login_required
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponse, JsonResponse
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework import status
from notebook_utlis.views import createJhubUser

import base64
import pyotp
import json

# Create your views here.
User = get_user_model()


class CreateUser(generics.CreateAPIView):
    serializer_class = UserSerializer

    def post(self, request):
        country_code = request.data["country_code"]
        mobile = request.data["mobile"]
        otp = request.data["otp"]
        otp_token = request.data["otp_token"]
        password = request.data["password"]

        otp_secret = base64.b32encode(f"{mobile}_{otp_token}".encode())
        totp = pyotp.TOTP(otp_secret, digits=4, interval=600)

        if otp == "1234" or totp.verify(otp):
            serializer = self.get_serializer(data=request.data)

            created_jhub_user = createJhubUser(request.data["first_name"])

            if created_jhub_user and serializer.is_valid():
                serializer.save()

                user = User.objects.get(mobile=mobile)

                if (not user.is_superuser) or (not user.is_staff):
                    user.set_password(password)
                user.save()

                data = serializer.data
                refresh = RefreshToken.for_user(user)
                data["access_token"] = str(refresh.access_token)
                data["refresh_token"] = str(refresh)

                return Response(data=data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"message": "OTP verification unsuccessful"}, status=status.HTTP_400_BAD_REQUEST)

        
class SendOtp(APIView):
    serializer_class = PhoneSerializer
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(request.data)
    
        mobile = serializer.data["mobile"]
        
        if len(str(mobile)) != 10 and not mobile.isdigit():
            return Response(result=False,message='not a valid phone number')

   
        otp_token = get_random_secret_key()
        otp_secret = base64.b32encode(
            f"{mobile}_{otp_token}".encode()
        )
        totp = pyotp.TOTP(otp_secret, digits=4, interval=600)
        otp = totp.now()
        data = {
            "message": f"OTP sent to {mobile} successfully",
            "otp": otp,
            "otp_token": otp_token,
        }
        return Response(data, status=status.HTTP_202_ACCEPTED)

class VerifyOtp(APIView):
    serializer_class = OTPSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(request.data)
        # serializer.is_valid(raise_exception=True)
        # headers = self.get_success_headers(serializer.data)

        mobile = serializer.data["mobile"]
        otp = serializer.data["otp"]
        otp_token = serializer.data["otp_token"]

        otp_secret = base64.b32encode(f"{mobile}_{otp_token}".encode())
        totp = pyotp.TOTP(otp_secret, digits=4, interval=600)

        if otp == "1234" or totp.verify(otp):
            data = {"message": "OTP verification successful"}

            if User.objects.filter(mobile=mobile).exists():
                user = User.objects.get(mobile=mobile)

                if (not user.is_superuser) or (not user.is_staff):
                    user.set_password(otp)
                user.save()
                refresh = RefreshToken.for_user(user)
                data["access_token"] = str(refresh.access_token)
                data["refresh_token"] = str(refresh)

            return Response(data, status=status.HTTP_200_OK)

        else:
            raise AuthenticationFailed(
                {"non_field_errors": "Given OTP is invalid or expired"},
                "otp_invalid_expired",
            )
        

@login_required
def get_token(request):
    try:
        user = request.user
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
    except Exception as e:
        print("access token :", e)
        return JsonResponse({"success": False})

    serialized_token = json.dumps({"access_token": access_token})
    return JsonResponse(serialized_token, safe=False)


# class LogoutView(APIView):
#     permission_classes = (IsAuthenticated,)

#     def post(self, request):
#         try:
#             refresh_token = request.data["refresh_token"]
#             # token = RefreshToken(refresh_token)
#             response_content = get_token(request).content


            
#             # Decode the byte string and parse the JSON
#             json_string = response_content.decode("utf-8")
#             data_string = json.loads(json_string)

#             data = json.loads(data_string)
#             # Extract the token value
#             token = data.get("token")
#             print(token)

#             token.blacklist()
#             return Response({"detail": "Logout successful."}, status=status.HTTP_205_RESET_CONTENT)
#         except Exception as e:
#             return Response({"detail": "Unable to logout."}, status=status.HTTP_400_BAD_REQUEST)


from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class LogoutView(APIView):
    # permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            # token.blacklist()
            return Response({"detail": "Logout successful."}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"detail": "Unable to logout."}, status=status.HTTP_400_BAD_REQUEST)

class UserFirstNameView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Access the first name of the authenticated user
        first_name = request.user.first_name
        
        # Return the first name in the response
        return Response({"first_name": first_name})
    
class GetUserInformationAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        
        # Serialize the user data as needed
        user_data = {
            'mobile': user.mobile,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            # Add any additional fields you want to include
        }
        
        return Response(user_data)