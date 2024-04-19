from sqlalchemy import create_engine
from dotenv import load_dotenv
import os
 
class AlchemyConnection:
   
    def __init__(self, db):
        load_dotenv()  # Cargar las variables de entorno desde el archivo .env
        self.engine = os.getenv(f"{db}_ENGINE")
        self.options = os.getenv(f"{db}_OPTIONS")
        self.connection_string = os.getenv(f"{db}_CONNECTION_STRING")
 
    def create_connection(self):
        engine = create_engine(f"{self.engine}+{self.options}://{self.connection_string}", echo=False)
        return engine