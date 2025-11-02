from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlmodel import Session, select
from .models import User
from .main import engine
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os

router = APIRouter()
pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
SECRET_KEY = os.getenv('SECRET_KEY', 'CHANGE_ME')
ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES', '1440'))

class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str = None

class Token(BaseModel):
    access_token: str
    token_type: str = 'bearer'

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def get_password_hash(password):
    return pwd_context.hash(password)

@router.post('/register', response_model=Token)
def register(input: UserCreate):
    with Session(engine) as s:
        statement = select(User).where(User.email == input.email)
        user = s.exec(statement).first()
        if user:
            raise HTTPException(status_code=400, detail='Email already registered')
        u = User(email=input.email, full_name=input.full_name, hashed_password=get_password_hash(input.password), role='user')
        s.add(u); s.commit(); s.refresh(u)
        token = create_token({'sub': str(u.id)})
        return {'access_token': token, 'token_type':'bearer'}

def create_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({'exp': expire})
    encoded = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded

@router.post('/login', response_model=Token)
def login(input: UserCreate):
    with Session(engine) as s:
        statement = select(User).where(User.email == input.email)
        user = s.exec(statement).first()
        if not user or not verify_password(input.password, user.hashed_password):
            raise HTTPException(status_code=401, detail='Invalid credentials')
        token = create_token({'sub': str(user.id)})
        return {'access_token': token, 'token_type':'bearer'}
