from django.db import models
from employees.models import Employee


class Attendance(models.Model):
    """
    Attendance model for tracking employee attendance.
    """
    STATUS_CHOICES = [
        ('present', 'Present'),
        ('absent', 'Absent'),
    ]

    employee = models.ForeignKey(
        Employee,
        on_delete=models.CASCADE,
        related_name='attendance_records',
        help_text="Employee whose attendance is being recorded"
    )
    date = models.DateField(
        db_index=True,
        help_text="Date of attendance"
    )
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        help_text="Attendance status (present/absent)"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'attendance'
        ordering = ['-date', '-created_at']
        verbose_name = 'Attendance'
        verbose_name_plural = 'Attendance Records'
        unique_together = ['employee', 'date']  # One record per employee per day

    def __str__(self):
        return f"{self.employee.employee_id} - {self.date} - {self.status}"
