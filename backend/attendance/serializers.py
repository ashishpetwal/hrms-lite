from rest_framework import serializers
from .models import Attendance
from employees.models import Employee


class AttendanceSerializer(serializers.ModelSerializer):
    """
    Serializer for Attendance model with validation.
    """
    employee_id = serializers.PrimaryKeyRelatedField(
        queryset=Employee.objects.all(),
        source='employee',
        write_only=True
    )
    employee_name = serializers.CharField(source='employee.full_name', read_only=True)
    employee_code = serializers.CharField(source='employee.employee_id', read_only=True)
    employee_department = serializers.CharField(source='employee.department', read_only=True)

    class Meta:
        model = Attendance
        fields = [
            'id', 'employee_id', 'employee_name', 'employee_code', 
            'employee_department', 'date', 'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_status(self, value):
        """Validate status is one of the allowed values."""
        if value not in ['present', 'absent']:
            raise serializers.ValidationError(
                "Status must be either 'present' or 'absent'."
            )
        return value

    def validate_date(self, value):
        """Validate date is provided."""
        if not value:
            raise serializers.ValidationError("Date is required.")
        return value

    def validate(self, data):
        """
        Check for duplicate attendance record (same employee, same date).
        """
        employee = data.get('employee')
        date = data.get('date')

        if employee and date:
            # Check for existing record
            existing = Attendance.objects.filter(employee=employee, date=date)
            
            # If updating, exclude current instance
            if self.instance:
                existing = existing.exclude(pk=self.instance.pk)
            
            if existing.exists():
                raise serializers.ValidationError({
                    'non_field_errors': [
                        f"Attendance for employee '{employee.employee_id}' on {date} already exists."
                    ]
                })

        return data


class AttendanceListSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for listing attendance records.
    """
    employee_name = serializers.CharField(source='employee.full_name', read_only=True)
    employee_code = serializers.CharField(source='employee.employee_id', read_only=True)
    employee_department = serializers.CharField(source='employee.department', read_only=True)

    class Meta:
        model = Attendance
        fields = [
            'id', 'employee_name', 'employee_code', 'employee_department',
            'date', 'status', 'created_at'
        ]


class AttendanceSummarySerializer(serializers.Serializer):
    """
    Serializer for attendance summary (bonus feature).
    """
    employee_id = serializers.IntegerField()
    employee_code = serializers.CharField()
    employee_name = serializers.CharField()
    department = serializers.CharField()
    total_present = serializers.IntegerField()
    total_absent = serializers.IntegerField()
    total_records = serializers.IntegerField()
