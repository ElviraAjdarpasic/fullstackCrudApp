from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Här använder vi SQLite (en filbaserad databas)
DATABASE_URL = "sqlite:///./books.db"

# Skapa engine som hanterar databasen
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Skapar sessioner som vi kan använda i API:t
SessionLocal = sessionmaker(bind=engine)

# Basen för alla modeller
Base = declarative_base()