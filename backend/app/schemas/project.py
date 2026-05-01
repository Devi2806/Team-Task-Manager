from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from app.models.project import RoleEnum

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class MemberAdd(BaseModel):
    email: str
    role: RoleEnum = RoleEnum.member

class MemberResponse(BaseModel):
    id: int
    user_id: int
    role: RoleEnum
    joined_at: datetime

    class Config:
        from_attributes = True

class ProjectResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    created_by: int
    created_at: datetime
    members: List[MemberResponse] = []

    class Config:
        from_attributes = True