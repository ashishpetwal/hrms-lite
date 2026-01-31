from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Count, Q
from .models import Attendance
from .serializers import AttendanceSerializer, AttendanceListSerializer, AttendanceSummarySerializer
from employees.models import Employee


@api_view(['GET', 'POST'])
def attendance_list_create(request):
    """
    GET: List all attendance records with optional filters
    POST: Create a new attendance record
    """
    if request.method == 'GET':
        attendance = Attendance.objects.select_related('employee').all()
        
        # Filter by date (bonus feature)
        date_filter = request.query_params.get('date')
        if date_filter:
            attendance = attendance.filter(date=date_filter)
        
        # Filter by employee
        employee_id = request.query_params.get('employee_id')
        if employee_id:
            attendance = attendance.filter(employee_id=employee_id)
        
        # Filter by status
        status_filter = request.query_params.get('status')
        if status_filter:
            attendance = attendance.filter(status=status_filter)

        serializer = AttendanceListSerializer(attendance, many=True)
        return Response({
            'success': True,
            'count': attendance.count(),
            'data': serializer.data
        })

    elif request.method == 'POST':
        serializer = AttendanceSerializer(data=request.data)
        if serializer.is_valid():
            attendance = serializer.save()
            return Response({
                'success': True,
                'message': 'Attendance marked successfully',
                'data': AttendanceSerializer(attendance).data
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
def attendance_detail(request, pk):
    """
    GET: Retrieve a single attendance record
    PUT: Update an attendance record
    DELETE: Delete an attendance record
    """
    try:
        attendance = Attendance.objects.select_related('employee').get(pk=pk)
    except Attendance.DoesNotExist:
        return Response({
            'success': False,
            'error': {
                'status_code': 404,
                'message': f'Attendance record with ID {pk} not found',
                'details': {}
            }
        }, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = AttendanceSerializer(attendance)
        return Response({
            'success': True,
            'data': serializer.data
        })

    elif request.method == 'PUT':
        serializer = AttendanceSerializer(attendance, data=request.data, partial=True)
        if serializer.is_valid():
            attendance = serializer.save()
            return Response({
                'success': True,
                'message': 'Attendance updated successfully',
                'data': AttendanceSerializer(attendance).data
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
        attendance.delete()
        return Response({
            'success': True,
            'message': 'Attendance record deleted successfully'
        }, status=status.HTTP_200_OK)


@api_view(['GET'])
def attendance_by_employee(request, employee_pk):
    """
    GET: List attendance records for a specific employee
    """
    try:
        employee = Employee.objects.get(pk=employee_pk)
    except Employee.DoesNotExist:
        return Response({
            'success': False,
            'error': {
                'status_code': 404,
                'message': f'Employee with ID {employee_pk} not found',
                'details': {}
            }
        }, status=status.HTTP_404_NOT_FOUND)

    attendance = Attendance.objects.filter(employee=employee).order_by('-date')
    
    # Filter by date range (bonus feature)
    start_date = request.query_params.get('start_date')
    end_date = request.query_params.get('end_date')
    
    if start_date:
        attendance = attendance.filter(date__gte=start_date)
    if end_date:
        attendance = attendance.filter(date__lte=end_date)

    serializer = AttendanceListSerializer(attendance, many=True)
    
    # Calculate summary (bonus feature)
    total_present = attendance.filter(status='present').count()
    total_absent = attendance.filter(status='absent').count()
    
    return Response({
        'success': True,
        'employee': {
            'id': employee.id,
            'employee_id': employee.employee_id,
            'full_name': employee.full_name,
            'department': employee.department
        },
        'summary': {
            'total_present': total_present,
            'total_absent': total_absent,
            'total_records': attendance.count()
        },
        'data': serializer.data
    })


@api_view(['GET'])
def attendance_summary(request):
    """
    GET: Get attendance summary for all employees (bonus feature)
    """
    employees = Employee.objects.annotate(
        total_present=Count('attendance_records', filter=Q(attendance_records__status='present')),
        total_absent=Count('attendance_records', filter=Q(attendance_records__status='absent')),
        total_records=Count('attendance_records')
    )
    
    summary_data = []
    for emp in employees:
        summary_data.append({
            'employee_id': emp.id,
            'employee_code': emp.employee_id,
            'employee_name': emp.full_name,
            'department': emp.department,
            'total_present': emp.total_present,
            'total_absent': emp.total_absent,
            'total_records': emp.total_records
        })
    
    serializer = AttendanceSummarySerializer(summary_data, many=True)
    
    return Response({
        'success': True,
        'count': len(summary_data),
        'data': serializer.data
    })
