from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from .main import engine
from .models import Tournament, Team, Match, MatchSheet, User
from typing import List
from pydantic import BaseModel
from jose import jwt
import os

router = APIRouter()

# Simple dependency to extract user id from Authorization Bearer token (no full auth)
def get_current_user(authorization: str = None):
    if not authorization:
        return None
    try:
        token = authorization.split(' ')[1]
        payload = jwt.decode(token, os.getenv('SECRET_KEY','CHANGE_ME'), algorithms=['HS256'])
        return int(payload.get('sub'))
    except Exception:
        return None

class TournamentCreate(BaseModel):
    name: str
    kind: str = 'campionato'

@router.post('/tournaments', response_model=Tournament)
def create_tournament(input: TournamentCreate, user_id: int = Depends(get_current_user)):
    with Session(engine) as s:
        t = Tournament(name=input.name, kind=input.kind)
        s.add(t); s.commit(); s.refresh(t)
        return t

@router.get('/tournaments', response_model=List[Tournament])
def list_tournaments():
    with Session(engine) as s:
        return s.exec(select(Tournament)).all()

class TeamCreate(BaseModel):
    name: str
    tournament_id: int

@router.post('/teams', response_model=Team)
def create_team(input: TeamCreate):
    with Session(engine) as s:
        team = Team(name=input.name, tournament_id=input.tournament_id)
        s.add(team); s.commit(); s.refresh(team)
        return team

@router.get('/matches', response_model=List[Match])
def list_matches():
    with Session(engine) as s:
        return s.exec(select(Match)).all()

class MatchSheetCreate(BaseModel):
    match_id: int
    compiled_by: int
    payload: str

@router.post('/matchsheet', response_model=MatchSheet)
def create_matchsheet(input: MatchSheetCreate):
    with Session(engine) as s:
        ms = MatchSheet(match_id=input.match_id, compiled_by=input.compiled_by, payload=input.payload)
        s.add(ms); s.commit(); s.refresh(ms)
        return ms

# --- Certificates endpoint (upload placeholder) ---
from fastapi import UploadFile, File

@router.post('/players/{player_id}/certificate')
def upload_certificate(player_id: int, file: UploadFile = File(...)):
    # For MVP placeholder: save file to ./uploads and mark certificate as pending approval
    uploads_dir = os.path.join(os.path.dirname(__file__), '..', 'uploads')
    os.makedirs(uploads_dir, exist_ok=True)
    dest = os.path.join(uploads_dir, f'player_{player_id}_' + file.filename)
    with open(dest, 'wb') as out:
        out.write(file.file.read())
    return {'status':'uploaded', 'path': dest, 'player_id': player_id, 'approved': False}

# --- Comments and votes ---
class CommentCreate(BaseModel):
    match_id: int
    user_id: int
    player_id: int = None
    text: str
    vote: int = None

COMMENTS = []

@router.post('/comments')
def create_comment(c: CommentCreate):
    cid = len(COMMENTS) + 1
    record = {'id': cid, 'match_id': c.match_id, 'user_id': c.user_id, 'player_id': c.player_id, 'text': c.text, 'vote': c.vote}
    COMMENTS.append(record)
    return record

@router.get('/matches/{match_id}/comments')
def list_comments(match_id: int):
    return [c for c in COMMENTS if c['match_id'] == match_id]

# --- Simple calendar generator ---
class CalendarRequest(BaseModel):
    tournament_id: int
    start_date: str  # ISO date
    pause_dates: list = []
    preferences: dict = {}  # team_id -> list of preferred weekdays (0=Mon..6=Sun)

@router.post('/generate-calendar')
def generate_calendar(req: CalendarRequest):
    # Very simple round-robin generator for even number of teams
    with Session(engine) as s:
        teams = s.exec(select(Team).where(Team.tournament_id == req.tournament_id)).all()
    team_ids = [t.id for t in teams]
    n = len(team_ids)
    if n < 2:
        return {'error': 'Not enough teams'}
    # if odd, add bye (None)
    bye = None
    if n % 2 == 1:
        team_ids.append(None)
        n += 1
    rounds = []
    teams_copy = team_ids[:]
    for r in range(n-1):
        pairs = []
        for i in range(n//2):
            t1 = teams_copy[i]
            t2 = teams_copy[n-1-i]
            if t1 is not None and t2 is not None:
                pairs.append({'home': t1, 'away': t2, 'round': r+1})
        # rotate teams except first
        teams_copy = [teams_copy[0]] + [teams_copy[-1]] + teams_copy[1:-1]
        rounds.append(pairs)
    return {'rounds': rounds, 'generated_for': req.tournament_id}
