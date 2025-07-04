from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime
import uuid

class UserCreate(BaseModel):
    email: EmailStr
    nickname: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    nickname: str
    password_hash: str
    found_cards: List[str] = Field(default_factory=list)
    is_admin: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserResponse(BaseModel):
    id: str
    email: str
    nickname: str
    found_cards: List[str]
    is_admin: bool
    created_at: datetime

class ExpansionCreate(BaseModel):
    name: str
    description: str
    color: str
    image: Optional[str] = None
    published: bool = False  # Nuovo campo

class ExpansionUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    color: Optional[str] = None
    image: Optional[str] = None
    published: Optional[bool] = None  # Nuovo campo

class Expansion(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    color: str
    total_cards: int = 0
    image: str = ""
    published: bool = False  # Nuovo campo
    created_at: datetime = Field(default_factory=datetime.utcnow)

class CardCreate(BaseModel):
    name: str
    expansion_id: str
    image: str  # base64 encoded image
    holo: bool = False
    order: Optional[int] = None  # Nuovo campo per ordinamento

class CardUpdate(BaseModel):
    name: Optional[str] = None
    expansion_id: Optional[str] = None
    image: Optional[str] = None
    holo: Optional[bool] = None
    order: Optional[int] = None  # Nuovo campo per ordinamento

class Card(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    expansion_id: str
    image: str  # base64 encoded image
    holo: bool = False
    order: Optional[int] = None  # Nuovo campo per ordinamento
    created_at: datetime = Field(default_factory=datetime.utcnow)

class OpenPackRequest(BaseModel):
    expansion_id: str

class OpenPackResponse(BaseModel):
    cards: List[Card]
    new_unique_cards: List[str]

class AdminUserUpdate(BaseModel):
    is_admin: bool

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse