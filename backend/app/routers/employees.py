from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.employee import Employee
from app.models.entity import Entity
from app.schemas.employee import EmployeeCreate, EmployeeResponse, EmployeeUpdate

router = APIRouter()


def _get_entity_or_404(entity_id: str, db: Session) -> Entity:
    entity = db.query(Entity).filter(Entity.id == entity_id).first()
    if not entity:
        raise HTTPException(status_code=404, detail="Entity not found")
    return entity


@router.get("/{entity_id}/employees", response_model=list[EmployeeResponse])
def list_employees(entity_id: str, db: Session = Depends(get_db)):
    _get_entity_or_404(entity_id, db)
    employees = (
        db.query(Employee)
        .filter(Employee.entity_id == entity_id)
        .order_by(Employee.name)
        .all()
    )
    return employees


@router.post("/{entity_id}/employees", response_model=EmployeeResponse, status_code=201)
def create_employee(entity_id: str, payload: EmployeeCreate, db: Session = Depends(get_db)):
    _get_entity_or_404(entity_id, db)
    now = datetime.utcnow().isoformat()
    employee = Employee(
        **payload.model_dump(),
        entity_id=entity_id,
        created_at=now,
        updated_at=now,
    )
    db.add(employee)
    db.commit()
    db.refresh(employee)
    return employee


@router.put("/{entity_id}/employees/{employee_id}", response_model=EmployeeResponse)
def update_employee(entity_id: str, employee_id: str, payload: EmployeeUpdate, db: Session = Depends(get_db)):
    employee = (
        db.query(Employee)
        .filter(Employee.id == employee_id, Employee.entity_id == entity_id)
        .first()
    )
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(employee, field, value)
    employee.updated_at = datetime.utcnow().isoformat()
    db.commit()
    db.refresh(employee)
    return employee


@router.delete("/{entity_id}/employees/{employee_id}", status_code=204)
def delete_employee(entity_id: str, employee_id: str, db: Session = Depends(get_db)):
    employee = (
        db.query(Employee)
        .filter(Employee.id == employee_id, Employee.entity_id == entity_id)
        .first()
    )
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    db.delete(employee)
    db.commit()
