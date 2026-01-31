from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Employee
from .serializers import EmployeeSerializer, EmployeeListSerializer


@api_view(['GET', 'POST'])
def employee_list_create(request):
    """
    GET: List all employees
    POST: Create a new employee
    """
    if request.method == 'GET':
        employees = Employee.objects.all()
        serializer = EmployeeListSerializer(employees, many=True)
        return Response({
            'success': True,
            'count': employees.count(),
            'data': serializer.data
        })

    elif request.method == 'POST':
        serializer = EmployeeSerializer(data=request.data)
        if serializer.is_valid():
            employee = serializer.save()
            return Response({
                'success': True,
                'message': 'Employee created successfully',
                'data': EmployeeSerializer(employee).data
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'error': {
                'status_code': 400,
                'message': 'Validation failed',
                'details': serializer.errors
            }
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def employee_detail(request, pk):
    """
    GET: Retrieve a single employee
    PUT: Update an employee
    DELETE: Delete an employee
    """
    try:
        employee = Employee.objects.get(pk=pk)
    except Employee.DoesNotExist:
        return Response({
            'success': False,
            'error': {
                'status_code': 404,
                'message': f'Employee with ID {pk} not found',
                'details': {}
            }
        }, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = EmployeeSerializer(employee)
        return Response({
            'success': True,
            'data': serializer.data
        })

    elif request.method == 'PUT':
        serializer = EmployeeSerializer(employee, data=request.data, partial=True)
        if serializer.is_valid():
            employee = serializer.save()
            return Response({
                'success': True,
                'message': 'Employee updated successfully',
                'data': EmployeeSerializer(employee).data
            })
        
        return Response({
            'success': False,
            'error': {
                'status_code': 400,
                'message': 'Validation failed',
                'details': serializer.errors
            }
        }, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        employee_id = employee.employee_id
        employee.delete()
        return Response({
            'success': True,
            'message': f'Employee {employee_id} deleted successfully'
        }, status=status.HTTP_200_OK)
