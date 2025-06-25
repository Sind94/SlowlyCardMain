from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List
import random
from datetime import timedelta
import sys

# Add current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import our models and auth
import models
import auth
from models import (
    User, UserCreate, UserLogin, UserResponse, LoginResponse,
    Expansion, ExpansionCreate, ExpansionUpdate,
    Card, CardCreate, CardUpdate,
    OpenPackRequest, OpenPackResponse,
    AdminUserUpdate
)
from auth import (
    get_password_hash, verify_password, create_access_token,
    get_current_user, get_current_admin_user, user_to_response,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="SlowlyCard API", version="1.0.0")

# Abilita CORS per permettere richieste dal frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In produzione puoi specificare solo l'URL del frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ========== AUTH ENDPOINTS ==========

@api_router.post("/auth/register", response_model=LoginResponse)
async def register(user_data: UserCreate):
    """Register a new user"""
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    user = User(
        email=user_data.email,
        nickname=user_data.nickname,
        password_hash=get_password_hash(user_data.password),
        is_admin=user_data.email == "admin@example.com"  # Make admin@example.com an admin
    )
    
    await db.users.insert_one(user.dict())
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )
    
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        user=user_to_response(user)
    )

@api_router.post("/auth/login", response_model=LoginResponse)
async def login(user_data: UserLogin):
    """Login user"""
    user_doc = await db.users.find_one({"email": user_data.email})
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    user = User(**user_doc)
    if not verify_password(user_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )
    
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        user=user_to_response(user)
    )

@api_router.get("/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return user_to_response(current_user)

# ========== EXPANSION ENDPOINTS ==========

@api_router.get("/expansions", response_model=List[Expansion])
async def get_expansions():
    """Get all expansions"""
    expansions = await db.expansions.find().to_list(1000)
    return [Expansion(**expansion) for expansion in expansions]

@api_router.post("/expansions", response_model=Expansion)
async def create_expansion(
    expansion_data: ExpansionCreate,
    current_user: User = Depends(get_current_admin_user)
):
    """Create a new expansion (Admin only)"""
    expansion = Expansion(**expansion_data.dict())
    await db.expansions.insert_one(expansion.dict())
    return expansion

@api_router.put("/expansions/{expansion_id}", response_model=Expansion)
async def update_expansion(
    expansion_id: str,
    expansion_data: ExpansionUpdate,
    current_user: User = Depends(get_current_admin_user)
):
    """Update an expansion (Admin only)"""
    update_data = {k: v for k, v in expansion_data.dict().items() if v is not None}
    
    result = await db.expansions.update_one(
        {"id": expansion_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Expansion not found")
    
    updated_expansion = await db.expansions.find_one({"id": expansion_id})
    return Expansion(**updated_expansion)

@api_router.delete("/expansions/{expansion_id}")
async def delete_expansion(
    expansion_id: str,
    current_user: User = Depends(get_current_admin_user)
):
    """Delete an expansion and all its cards (Admin only)"""
    # Trova tutte le carte dell'espansione
    cards = await db.cards.find({"expansion_id": expansion_id}).to_list(1000)
    card_ids = [card["id"] for card in cards]

    # Elimina tutte le carte dell'espansione
    await db.cards.delete_many({"expansion_id": expansion_id})

    # Rimuovi tutti gli ID delle carte eliminate da tutti gli utenti
    if card_ids:
        await db.users.update_many({}, {"$pull": {"found_cards": {"$in": card_ids}}})

    # Elimina l'espansione
    result = await db.expansions.delete_one({"id": expansion_id})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Expansion not found")

    return {"message": "Expansion and all its cards deleted successfully"}

# ========== CARD ENDPOINTS ==========

@api_router.get("/cards", response_model=List[Card])
async def get_cards(expansion_id: str = None):
    """Get all cards or cards from specific expansion"""
    query = {"expansion_id": expansion_id} if expansion_id else {}
    cards = await db.cards.find(query).to_list(1000)
    return [Card(**card) for card in cards]

@api_router.post("/cards", response_model=Card)
async def create_card(
    card_data: CardCreate,
    current_user: User = Depends(get_current_admin_user)
):
    """Create a new card (Admin only)"""
    # Check if expansion exists
    expansion = await db.expansions.find_one({"id": card_data.expansion_id})
    if not expansion:
        raise HTTPException(status_code=404, detail="Expansion not found")
    
    card = Card(**card_data.dict())
    await db.cards.insert_one(card.dict())
    
    # Update expansion total_cards count
    await db.expansions.update_one(
        {"id": card_data.expansion_id},
        {"$inc": {"total_cards": 1}}
    )

    # (RIMOSSO) Non aggiungere la carta a tutti gli utenti!
    # await db.users.update_many(
    #     {},  # Per tutti gli utenti, oppure {"is_admin": True} solo per admin
    #     {"$addToSet": {"found_cards": card.id}}
    # )
    
    return card

@api_router.put("/cards/{card_id}", response_model=Card)
async def update_card(
    card_id: str,
    card_data: CardUpdate,
    current_user: User = Depends(get_current_admin_user)
):
    """Update a card (Admin only)"""
    update_data = {k: v for k, v in card_data.dict().items() if v is not None}
    
    result = await db.cards.update_one(
        {"id": card_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Card not found")
    
    updated_card = await db.cards.find_one({"id": card_id})
    return Card(**updated_card)

@api_router.delete("/cards/{card_id}")
async def delete_card(
    card_id: str,
    current_user: User = Depends(get_current_admin_user)
):
    """Delete a card (Admin only)"""
    card = await db.cards.find_one({"id": card_id})
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    
    # Delete the card
    await db.cards.delete_one({"id": card_id})
    
    # Remove card id from all users' found_cards
    await db.users.update_many({}, {"$pull": {"found_cards": card_id}})

    # Update expansion total_cards count
    await db.expansions.update_one(
        {"id": card["expansion_id"]},
        {"$inc": {"total_cards": -1}}
    )
    
    return {"message": "Card deleted successfully"}

# ========== PACK OPENING ENDPOINTS ==========

@api_router.post("/packs/open", response_model=OpenPackResponse)
async def open_pack(
    pack_data: OpenPackRequest,
    current_user: User = Depends(get_current_user)
):
    """Open a pack and get 5 random cards"""
    # Get all cards from the expansion
    expansion_cards = await db.cards.find({"expansion_id": pack_data.expansion_id}).to_list(1000)
    
    if not expansion_cards:
        raise HTTPException(status_code=404, detail="No cards found in this expansion")
    
    # Select 5 random cards
    selected_cards = random.sample(expansion_cards, min(5, len(expansion_cards)))
    if len(expansion_cards) >= 5:
        # If we have enough cards, we might get duplicates, so let's allow it
        selected_cards = [random.choice(expansion_cards) for _ in range(5)]
    
    cards = [Card(**card) for card in selected_cards]
    card_ids = [card.id for card in cards]
    
    # Update user's found cards (only unique ones)
    current_found_cards = set(current_user.found_cards)
    new_unique_cards = [card_id for card_id in card_ids if card_id not in current_found_cards]
    
    if new_unique_cards:
        await db.users.update_one(
            {"id": current_user.id},
            {"$addToSet": {"found_cards": {"$each": new_unique_cards}}}
        )
    
    return OpenPackResponse(
        cards=cards,
        new_unique_cards=new_unique_cards
    )

# ========== ADMIN USER MANAGEMENT ==========

@api_router.get("/admin/users", response_model=List[UserResponse])
async def get_all_users(current_user: User = Depends(get_current_admin_user)):
    """Get all users (Admin only)"""
    users = await db.users.find().to_list(1000)
    return [user_to_response(User(**user)) for user in users]

@api_router.put("/admin/users/{user_id}", response_model=UserResponse)
async def update_user_admin_status(
    user_id: str,
    user_update: AdminUserUpdate,
    current_user: User = Depends(get_current_admin_user)
):
    """Update user admin status (Admin only)"""
    result = await db.users.update_one(
        {"id": user_id},
        {"$set": {"is_admin": user_update.is_admin}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    updated_user = await db.users.find_one({"id": user_id})
    return user_to_response(User(**updated_user))

@api_router.post("/admin/users/{user_id}/reset_found_cards")
async def reset_user_found_cards(user_id: str, current_user: User = Depends(get_current_admin_user)):
    """Resetta tutte le carte trovate di un utente (solo admin)"""
    result = await db.users.update_one({"id": user_id}, {"$set": {"found_cards": []}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "Carte trovate azzerate per l'utente"}

@api_router.post("/admin/users/{user_id}/reset_password")
async def reset_user_password(user_id: str, new_password: str, current_user: User = Depends(get_current_admin_user)):
    """Resetta la password di un utente (solo admin)"""
    hashed = get_password_hash(new_password)
    result = await db.users.update_one({"id": user_id}, {"$set": {"hashed_password": hashed}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "Password resettata con successo"}

# ========== USER CARDS ENDPOINT ==========

@api_router.get("/user/cards", response_model=List[Card])
async def get_user_cards(current_user: User = Depends(get_current_user)):
    """Get only the cards found by the authenticated user"""
    if not current_user.found_cards:
        return []
    cards = await db.cards.find({"id": {"$in": current_user.found_cards}}).to_list(1000)
    return [Card(**card) for card in cards]

# ========== BASIC HEALTH CHECK ==========

@api_router.get("/")
async def root():
    return {"message": "SlowlyCard API is running!"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "SlowlyCard API"}

# Include the router in the main app
app.include_router(api_router)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

# Make db available for auth module
import sys
sys.modules[__name__].db = db

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)