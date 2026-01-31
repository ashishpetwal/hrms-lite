"""
Custom exception handler for the HRMS Lite API.
"""

from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status


def custom_exception_handler(exc, context):
    """
    Custom exception handler that provides consistent error responses.
    """
    response = exception_handler(exc, context)

    if response is not None:
        custom_response_data = {
            'success': False,
            'error': {
                'status_code': response.status_code,
                'message': get_error_message(response),
                'details': response.data if isinstance(response.data, dict) else {'error': response.data}
            }
        }
        response.data = custom_response_data
    
    return response


def get_error_message(response):
    """
    Extract a human-readable error message from the response.
    """
    status_messages = {
        400: 'Bad Request - Invalid data provided',
        401: 'Unauthorized - Authentication required',
        403: 'Forbidden - You do not have permission to perform this action',
        404: 'Not Found - The requested resource does not exist',
        405: 'Method Not Allowed',
        409: 'Conflict - Resource already exists',
        500: 'Internal Server Error',
    }
    return status_messages.get(response.status_code, 'An error occurred')
