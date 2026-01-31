from django.db import models
from django.core.validators import EmailValidator


class Employee(models.Model):
    """
    Employee model representing an employee in the HRMS system.
    """
    employee_id = models.CharField(
        max_length=50,
        unique=True,
        db_index=True,
        help_text="Unique identifier for the employee"
    )
    full_name = models.CharField(
        max_length=255,
        help_text="Full name of the employee"
    )
    email = models.EmailField(
        unique=True,
        validators=[EmailValidator()],
        help_text="Email address of the employee"
    )
    department = models.CharField(
        max_length=100,
        help_text="Department the employee belongs to"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'employees'
        ordering = ['-created_at']
        verbose_name = 'Employee'
        verbose_name_plural = 'Employees'

    def __str__(self):
        return f"{self.employee_id} - {self.full_name}"
