from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# SQLite-databas (filbaserad)
SQLALCHEMY_DATABASE_URL = "sqlite:///./books.db"

# Skapa engine
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# SessionLocal används för att skapa DB-sessioner
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Bas-klass för modeller
Base = declarative_base()