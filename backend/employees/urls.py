from django.urls import path
from . import views

urlpatterns = [
    path('', views.employee_list_create, name='employee-list-create'),
    path('<int:pk>/', views.employee_detail, name='employee-detail'),
]
