from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models, auth, crud
from sqlmodel import SQLModel, create_engine, Session
import os

DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///./app.db')
engine = create_engine(DATABASE_URL, connect_args={'check_same_thread': False})

def init_db():
    SQLModel.metadata.create_all(engine)
    with Session(engine) as s:
        pass

app = FastAPI(title="Tournament Manager (MVP)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

@app.on_event("startup")
def on_startup():
    init_db()

app.include_router(auth.router, prefix='/auth', tags=['auth'])
app.include_router(crud.router, prefix='/api', tags=['api'])

