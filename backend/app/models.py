from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str
    full_name: Optional[str] = None
    hashed_password: str
    role: str = "user"  # super_admin, admin_tournament, arbitro, medico, responsabile_squadra, user
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Tournament(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    kind: str = "campionato"  # campionato, eliminazione, gironi
    date_start: Optional[datetime] = None
    date_end: Optional[datetime] = None

class Team(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    tournament_id: Optional[int] = Field(foreign_key="tournament.id")
    name: str

class Match(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    tournament_id: Optional[int] = Field(foreign_key="tournament.id")
    home_team_id: Optional[int] = Field(foreign_key="team.id")
    away_team_id: Optional[int] = Field(foreign_key="team.id")
    datetime: Optional[datetime] = None
    home_score: Optional[int] = 0
    away_score: Optional[int] = 0
    status: str = "scheduled"  # scheduled, finished, cancelled

class MatchSheet(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    match_id: Optional[int] = Field(foreign_key="match.id")
    compiled_by: Optional[int] = Field(foreign_key="user.id")
    payload: Optional[str] = None  # JSON blob with events/stats
