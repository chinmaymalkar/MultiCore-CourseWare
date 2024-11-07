from rest_framework import generics, serializers, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied

from .models import (Course, Enrollment, CourseContent, 
                     UserCourseContentProgress, UserCourseProgress, Certificate)
from .serializers import (CourseListSerializer, CourseDetailSerializer,
                          EnrollmentListSerializer, EnrollmentCreateSerializer,
                          CourseContentSerializer, UserCourseContentProgressSerializer,
                          UserCourseProgressSerializer, CertificateSerializer)
from notebook_utlis.views import uploadNotebook

class CourseListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]  # Add authentication permission
    queryset = Course.objects.all()
    serializer_class = CourseListSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            "status": "success",
            "message": "Course list retrieved successfully",
            "data": serializer.data
        }, status=status.HTTP_200_OK)


class CourseDetailView(generics.RetrieveAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseDetailSerializer
    lookup_field = 'pk'  # Assuming primary key is used for lookup

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            "status": "success",
            "message": "Course details retrieved successfully",
            "data": serializer.data
        }, status=status.HTTP_200_OK)
    
class EnrollmentListView(generics.ListAPIView):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentListSerializer

class EnrollmentCreateView(generics.CreateAPIView):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentCreateSerializer

    def perform_create(self, serializer):
        # Get the user from the request
        user = self.request.user
        username = user.first_name
        
        # Get the course from the serializer data
        course = serializer.validated_data['course']

        # Check if an enrollment with the same course and user already exists
        if Enrollment.objects.filter(user=user, course=course).exists():
            # If exists, return a conflict response
            raise serializers.ValidationError("Enrollment already exists for this user and course.")
        
        # Retrieve course content for the enrolled course
        course_content = course.coursecontent_set.all()
        
        # Update UserCourseContentProgress records for each course content
        for content in course_content:
            # Get or create UserCourseContentProgress record for the user and course content
            progress, created = UserCourseContentProgress.objects.get_or_create(
                user=user,
                course_content=content,
                defaults={'course': course}  # Set default values for new instances
            )
            # If the record was created or if it was already completed, set completed=False
            if created or progress.completed:
                progress.completed = False
                progress.save()
                
        uploaded = uploadNotebook(username.lower(), course)
        if uploaded :
            # Create the enrollment
            serializer.save(user=user)

from django.db.models import Q

class EnrollmentListDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Filter the queryset based on the current user
        user = request.user
        enrollments = Enrollment.objects.filter(user=user)
        
        # Serialize the queryset
        serializer = EnrollmentListSerializer(enrollments, many=True)
        
        # Return the serialized data
        return Response(serializer.data)
    
class CourseContentView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id):
        try:
            user = request.user
            # Check if the requesting user is enrolled in the specified course
            if not Enrollment.objects.filter(user=request.user, course=course_id).exists():
                raise PermissionDenied("You are not enrolled in this course.")

            # Retrieve course content for the given course_id
            course_content = CourseContent.objects.filter(course=course_id)
            
            
            serializer = CourseContentSerializer(course_content, many=True)
            return Response({
                "status": "success",
                "message": "Course content retrieved successfully",
                "data": serializer.data
            }, status=200)
        except PermissionDenied as e:
            return Response({
                "status": "error",
                "message": str(e)
            }, status=403)
        except Exception as e:
            return Response({
                "status": "error",
                "message": "Failed to retrieve course content",
                "error": str(e)
            }, status=500)
        

from django.core.exceptions import MultipleObjectsReturned

class CourseContentProgressView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id):
        try:
            user = request.user

            # Check if the requesting user is enrolled in the specified course
            if not Enrollment.objects.filter(user=user, course=course_id).exists():
                raise PermissionDenied("You are not enrolled in this course.")

            # Retrieve course content for the given course_id
            course_content = CourseContent.objects.filter(course=course_id)
            
            # Serialize the course content with its data
            content_data = CourseContentSerializer(course_content, many=True).data

            # Retrieve all course content progress for the given user and course
            course = Course.objects.get(pk=course_id)
            course_content_progress = UserCourseContentProgress.objects.filter(
                user=user,
                course=course
            )

            # Serialize the course content progress
            progress_data = []
            for progress in course_content_progress:
                progress_data.append({
                    "id": progress.id,
                    "completed": progress.completed,
                    "user": progress.user_id,
                    "course": progress.course_id,
                    "course_content": CourseContentSerializer(progress.course_content).data
                })

                # Get all course content progress for the given user and course
                course_content_progress = UserCourseContentProgress.objects.filter(
                    user=user,
                    course_content__course_id=course_id
                )

                # Check if all course content progress instances are completed
                all_completed = all(progress.completed for progress in course_content_progress)
            


            # Return success response with serialized data
            return Response({
                "status": "success",
                "message": "Course content and progress retrieved successfully",
                "course_content_progress": progress_data,
                "course_completed": all_completed
            })

        except PermissionDenied as e:
            # Return permission denied response
            return Response({
                "status": "error",
                "message": str(e)
            }, status=status.HTTP_403_FORBIDDEN)
        except Exception as e:
            # Return error response
            return Response({
                "status": "error",
                "message": "Failed to retrieve course content and progress",
                "error": str(e),
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    def post(self, request, course_id, course_content_id):
        try:
            user = request.user

            # Retrieve the course and course content objects
            course = Course.objects.get(pk=course_id)
            course_content = CourseContent.objects.get(pk=course_content_id)

            try:
                # Try to retrieve a single UserCourseContentProgress instance
                course_content_progress = UserCourseContentProgress.objects.get(
                    user=user,
                    course_content=course_content,
                    course=course
                )

                # Update the completed status and save changes
                course_content_progress.completed = True
                course_content_progress.save()

                # Serialize the updated progress
                serializer = UserCourseContentProgressSerializer(course_content_progress)

                
                # Return success response
                return Response({
                    "status": "success",
                    "message": "Successfully updated course content progress",
                    "data": serializer.data
                })
            except UserCourseContentProgress.DoesNotExist:
                # Handle the case where no instance is found
                return Response({
                    "status": "error",
                    "message": "UserCourseContentProgress instance does not exist for the given parameters."
                }, status=status.HTTP_404_NOT_FOUND)
            except MultipleObjectsReturned:
                # Handle the case where multiple instances are found
                return Response({
                    "status": "error",
                    "message": "Multiple UserCourseContentProgress instances found for the given parameters. Cannot update."
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            # Return error response
            return Response({
                "status": "error",
                "message": "Failed to update course content progress",
                "error": str(e),
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class CourseProgressView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id):
        try:
            user = request.user

            # Get the course progress for the given user and course
            course_progress = UserCourseProgress.objects.filter(
                user=user,
                course_id=course_id
            ).first()  # Get the first instance if exists, or None

            if course_progress:
                # If course progress exists, return True if completed, False otherwise

                return Response({
                    "status": "success",
                    "message": "Course progress found",
                    "data": {
                        "exists": True,
                        "completed": course_progress.completed
                    }
                })
            else:
                # If course progress does not exist, return False
                return Response({
                    "status": "success",
                    "message": "Course progress not found",
                    "data": {
                        "exists": False
                    }
                })

        except Exception as e:
            return Response({
                "status": "error",
                "message": "Failed to retrieve course progress",
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, course_id):
        try:
            user = request.user
            
            # Check if the course exists
            course = Course.objects.get(pk=course_id)

            # Get all course content progress for the given user and course
            course_content_progress = UserCourseContentProgress.objects.filter(
                user=user,
                course_content__course_id=course_id
            )

            # Check if all course content progress instances are completed
            all_completed = all(progress.completed for progress in course_content_progress)
            
            if all_completed:
                # Mark course as completed
                course_progress, created = UserCourseProgress.objects.get_or_create(
                    user=user,
                    course=course,
                    completed=True
                )
                serializer = UserCourseProgressSerializer(course_progress)

                if created:
                
                    # Generate Certificate
                    course_name = course.title
                    certificate_path = generate_certificate(user.first_name, course_name)

                    if certificate_path:
                        # Save certificate information to the database
                        certificate = Certificate.objects.get_or_create(
                            user=user,
                            course=course,
                            certificate_image=certificate_path
                        )
                    else:
                        # Certificate generation failed
                        return Response({
                            "status": "error",
                            "message": "Failed to generate certificate"
                        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                    return Response({
                        "status": "success",
                        "message": "Course marked as completed",
                        "data": serializer.data
                    })
                
                else:
                    return Response({
                        "status": "success",
                        "message": "Course already completed",
                        "data": serializer.data
                    }, status=status.HTTP_200_OK)

            else:
                return Response({
                    "status": "success",
                    "message": "Not all course content progress completed yet",
                })
        except Course.DoesNotExist:
            return Response({
                "status": "error",
                "message": "Course does not exist"
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                "status": "error",
                "message": "Failed to update course progress",
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                

import os
import cv2

def generate_certificate(name, course_name):
    try:
        # Load the certificate template image
        template_path = './media/certificate_template/certificate_template.png'
        if not os.path.exists(template_path):
            raise FileNotFoundError("Certificate template image not found")

        template = cv2.imread(template_path)

        # Add user's name and course name to the certificate
        font = cv2.FONT_HERSHEY_COMPLEX
        font_scale = 1.4  # Increase font size
        # font_color = (150, 150, 150)  # Smooth grey color
        font_color = (50, 50, 50)  # Darker grey color

        thickness = 2
        line_type = cv2.LINE_AA

        name_position = (600, 1090)  # Adjust position as needed
        course_position = (1000, 1560)  # Adjust position as needed

        cv2.putText(template, name, name_position, font, font_scale, font_color, thickness, line_type)
        cv2.putText(template, course_name, course_position, font, font_scale, font_color, thickness, line_type)

        # Save the generated certificate
        output_path = f"./media/certificates/{name}_{course_name}_certificate.png"
        cv2.imwrite(output_path, template)

        return f"certificates/{name}_{course_name}_certificate.png"
    except Exception as e:
        print(f"Error generating certificate: {e}")
        return None
    


    
class CertificateRetrieveAPIView(generics.RetrieveAPIView):
    serializer_class = CertificateSerializer
    lookup_field = 'course_id'  # Assuming primary key is used for lookup
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Retrieve the current user
        user = self.request.user
        
        # Retrieve the course ID from the URL kwargs
        course_id = self.kwargs['course_id']

        # Query for the specific certificate based on user and course ID
        queryset = Certificate.objects.filter(user=user, course_id=course_id)
        
        return queryset

    def retrieve(self, request, *args, **kwargs):

        try: 
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            return Response({
                "status": "success",
                "message": "Certificate retrieved successfully",
                "data": serializer.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                "status": "Failed",
                "message": "Certificate retrieved unsuccessfully",
                "data": str(e)
            })