from django.urls import path
from . import views

urlpatterns = [
    path('', views.attendance_list_create, name='attendance-list-create'),
    path('summary/', views.attendance_summary, name='attendance-summary'),
    path('<int:pk>/', views.attendance_detail, name='attendance-detail'),
    path('employee/<int:employee_pk>/', views.attendance_by_employee, name='attendance-by-employee'),
]
