from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.project import Project, ProjectMember, RoleEnum
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse, MemberAdd

router = APIRouter(prefix="/projects", tags=["Projects"])

def get_member_role(db: Session, project_id: int, user_id: int):
    member = db.query(ProjectMember).filter(
        ProjectMember.project_id == project_id,
        ProjectMember.user_id == user_id
    ).first()
    return member

@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    project_data: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Create project
    new_project = Project(
        name=project_data.name,
        description=project_data.description,
        created_by=current_user.id
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    # Auto-add creator as admin
    admin_member = ProjectMember(
        project_id=new_project.id,
        user_id=current_user.id,
        role=RoleEnum.admin
    )
    db.add(admin_member)
    db.commit()
    db.refresh(new_project)
    return new_project

@router.get("/", response_model=List[ProjectResponse])
def get_my_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get all projects where user is a member
    memberships = db.query(ProjectMember).filter(
        ProjectMember.user_id == current_user.id
    ).all()
    project_ids = [m.project_id for m in memberships]
    projects = db.query(Project).filter(Project.id.in_(project_ids)).all()
    return projects

@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Check if user is a member
    member = get_member_role(db, project_id, current_user.id)
    if not member:
        raise HTTPException(status_code=403, detail="Not a member of this project")
    return project

@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: int,
    project_data: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Only admin can update
    member = get_member_role(db, project_id, current_user.id)
    if not member or member.role != RoleEnum.admin:
        raise HTTPException(status_code=403, detail="Only admins can update projects")

    if project_data.name:
        project.name = project_data.name
    if project_data.description:
        project.description = project_data.description

    db.commit()
    db.refresh(project)
    return project

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Only admin can delete
    member = get_member_role(db, project_id, current_user.id)
    if not member or member.role != RoleEnum.admin:
        raise HTTPException(status_code=403, detail="Only admins can delete projects")

    db.delete(project)
    db.commit()

@router.post("/{project_id}/members", response_model=ProjectResponse)
def add_member(
    project_id: int,
    member_data: MemberAdd,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # Only admin can add members
    member = get_member_role(db, project_id, current_user.id)
    if not member or member.role != RoleEnum.admin:
        raise HTTPException(status_code=403, detail="Only admins can add members")

    # Find user by email
    user_to_add = db.query(User).filter(User.email == member_data.email).first()
    if not user_to_add:
        raise HTTPException(status_code=404, detail="User not found")

    # Check if already a member
    existing = get_member_role(db, project_id, user_to_add.id)
    if existing:
        raise HTTPException(status_code=400, detail="User already a member")

    new_member = ProjectMember(
        project_id=project_id,
        user_id=user_to_add.id,
        role=member_data.role
    )
    db.add(new_member)
    db.commit()
    db.refresh(project)
    return project

@router.delete("/{project_id}/members/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_member(
    project_id: int,
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Only admin can remove members
    member = get_member_role(db, project_id, current_user.id)
    if not member or member.role != RoleEnum.admin:
        raise HTTPException(status_code=403, detail="Only admins can remove members")

    member_to_remove = get_member_role(db, project_id, user_id)
    if not member_to_remove:
        raise HTTPException(status_code=404, detail="Member not found")

    db.delete(member_to_remove)
    db.commit()