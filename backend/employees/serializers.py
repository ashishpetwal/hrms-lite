from rest_framework import serializers
from .models import Employee


class EmployeeSerializer(serializers.ModelSerializer):
    """
    Serializer for Employee model with validation.
    """
    
    class Meta:
        model = Employee
        fields = ['id', 'employee_id', 'full_name', 'email', 'department', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_employee_id(self, value):
        """Validate employee_id is not empty and handle duplicates."""
        if not value or not value.strip():
            raise serializers.ValidationError("Employee ID is required and cannot be empty.")
        
        # Check for duplicate on create
        if self.instance is None:
            if Employee.objects.filter(employee_id=value).exists():
                raise serializers.ValidationError(f"An employee with ID '{value}' already exists.")
        # Check for duplicate on update (excluding current instance)
        elif Employee.objects.filter(employee_id=value).exclude(pk=self.instance.pk).exists():
            raise serializers.ValidationError(f"An employee with ID '{value}' already exists.")
        
        return value.strip()

    def validate_full_name(self, value):
        """Validate full_name is not empty."""
        if not value or not value.strip():
            raise serializers.ValidationError("Full name is required and cannot be empty.")
        return value.strip()

    def validate_email(self, value):
        """Validate email format and handle duplicates."""
        if not value or not value.strip():
            raise serializers.ValidationError("Email is required and cannot be empty.")
        
        value = value.strip().lower()
        
        # Check for duplicate on create
        if self.instance is None:
            if Employee.objects.filter(email=value).exists():
                raise serializers.ValidationError(f"An employee with email '{value}' already exists.")
        # Check for duplicate on update (excluding current instance)
        elif Employee.objects.filter(email=value).exclude(pk=self.instance.pk).exists():
            raise serializers.ValidationError(f"An employee with email '{value}' already exists.")
        
        return value

    def validate_department(self, value):
        """Validate department is not empty."""
        if not value or not value.strip():
            raise serializers.ValidationError("Department is required and cannot be empty.")
        return value.strip()


class EmployeeListSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for listing employees.
    """
    
    class Meta:
        model = Employee
        fields = ['id', 'employee_id', 'full_name', 'email', 'department', 'created_at']
