"""
URL configuration for hrms_lite project.
"""

from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse


def api_root(request):
    """API root endpoint with available endpoints info."""
    return JsonResponse({
        'success': True,
        'message': 'Welcome to HRMS Lite API',
        'version': '1.0.0',
        'endpoints': {
            'employees': '/api/employees/',
            'attendance': '/api/attendance/',
            'health': '/api/health/',
        }
    })


def health_check(request):
    """Health check endpoint for deployment verification."""
    return JsonResponse({
        'success': True,
        'status': 'healthy',
        'message': 'HRMS Lite API is running'
    })


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api_root, name='api-root'),
    path('api/health/', health_check, name='health-check'),
    path('api/employees/', include('employees.urls')),
    path('api/attendance/', include('attendance.urls')),
]
