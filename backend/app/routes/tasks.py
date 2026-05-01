from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.task import Task, StatusEnum
from app.models.project import Project, ProjectMember, RoleEnum
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse

router = APIRouter(prefix="/tasks", tags=["Tasks"])

def check_project_member(db, project_id, user_id):
    return db.query(ProjectMember).filter(
        ProjectMember.project_id == project_id,
        ProjectMember.user_id == user_id
    ).first()

@router.post("/{project_id}/tasks", response_model=TaskResponse, status_code=201)
def create_task(
    project_id: int,
    task_data: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    member = check_project_member(db, project_id, current_user.id)
    if not member:
        raise HTTPException(status_code=403, detail="Not a member of this project")

    if member.role != RoleEnum.admin and task_data.assigned_to:
        raise HTTPException(status_code=403, detail="Only admins can assign tasks")

    new_task = Task(
        title=task_data.title,
        description=task_data.description,
        status=task_data.status,
        priority=task_data.priority,
        due_date=task_data.due_date,
        project_id=project_id,
        assigned_to=task_data.assigned_to,
        created_by=current_user.id
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@router.get("/{project_id}/tasks", response_model=List[TaskResponse])
def get_project_tasks(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    member = check_project_member(db, project_id, current_user.id)
    if not member:
        raise HTTPException(status_code=403, detail="Not a member of this project")

    tasks = db.query(Task).filter(Task.project_id == project_id).all()
    return tasks

@router.get("/my-tasks", response_model=List[TaskResponse])
def get_my_tasks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    tasks = db.query(Task).filter(Task.assigned_to == current_user.id).all()
    return tasks

@router.put("/{project_id}/tasks/{task_id}", response_model=TaskResponse)
def update_task(
    project_id: int,
    task_id: int,
    task_data: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    member = check_project_member(db, project_id, current_user.id)
    if not member:
        raise HTTPException(status_code=403, detail="Not a member of this project")

    task = db.query(Task).filter(Task.id == task_id, Task.project_id == project_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task_data.title: task.title = task_data.title
    if task_data.description: task.description = task_data.description
    if task_data.status: task.status = task_data.status
    if task_data.priority: task.priority = task_data.priority
    if task_data.due_date: task.due_date = task_data.due_date
    if task_data.assigned_to: task.assigned_to = task_data.assigned_to

    db.commit()
    db.refresh(task)
    return task

@router.delete("/{project_id}/tasks/{task_id}", status_code=204)
def delete_task(
    project_id: int,
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    member = check_project_member(db, project_id, current_user.id)
    if not member or member.role != RoleEnum.admin:
        raise HTTPException(status_code=403, detail="Only admins can delete tasks")

    task = db.query(Task).filter(Task.id == task_id, Task.project_id == project_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()

@router.get("/dashboard", response_model=dict)
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    my_tasks = db.query(Task).filter(Task.assigned_to == current_user.id).all()
    total = len(my_tasks)
    todo = len([t for t in my_tasks if t.status == StatusEnum.todo])
    in_progress = len([t for t in my_tasks if t.status == StatusEnum.in_progress])
    done = len([t for t in my_tasks if t.status == StatusEnum.done])
    overdue = len([t for t in my_tasks if t.due_date and t.due_date < datetime.utcnow() and t.status != StatusEnum.done])

    memberships = db.query(ProjectMember).filter(ProjectMember.user_id == current_user.id).all()

    return {
        "total_tasks": total,
        "todo": todo,
        "in_progress": in_progress,
        "done": done,
        "overdue": overdue,
        "total_projects": len(memberships)
    }