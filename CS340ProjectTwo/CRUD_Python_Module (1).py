# Example Python Code to Insert a Document 

from pymongo import MongoClient 
from bson.objectid import ObjectId 

class AnimalShelter(object): 
    """ CRUD operations for Animal collection in MongoDB """ 

    def __init__(self, username, password): 
        # Initializing the MongoClient. This helps to access the MongoDB 
        # databases and collections. This is hard-wired to use the aac 
        # database, the animals collection, and the aac user. 
        # 
        # You must edit the password below for your environment. 
        # 
        # Connection Variables 
        # 
        USER = username 
        PASS = password 
        HOST = 'localhost' 
        PORT = 27017 
        DB = 'aac' 
        COL = 'animals' 
        # 
        # Initialize Connection 
        # 
        self.client = MongoClient(
    'mongodb://%s:%s@%s:%d/?authSource=aac' % (USER, PASS, HOST, PORT)
)
        self.database = self.client['%s' % (DB)] 
        self.collection = self.database['%s' % (COL)] 

    # Create a method to return the next available record number for use in the create method
            
    # Complete this create method to implement the C in CRUD. 
    def create(self, data):
        try:
            if data is not None:
                result = self.collection.insert_one(data)
                return result.acknowledged
            else:
                return False
        except Exception as e:
            print("Error inserting document:", e)
            return False 

# Implements the Read operation in CRUD.
# Queries the animals collection using the supplied query.
    
    def read(self, query):
        try:
            if query is not None:
                result = self.collection.find(query)
                return list(result)
            else:
                return []
        except Exception as e:
            print("Error reading documents:", e)
            return []
        
# Implements the Update operation in CRUD.
# Updates all documents that match the supplied query.
        
    def update(self, query, new_data):
        try:
            if query is not None and new_data is not None:
                result = self.collection.update_many(
                query,
                {"$set": new_data}
            )
                return result.modified_count
            else:
                return 0
        except Exception as e:
            print("Error updating documents:", e)
            return 0
        
# Implements the Delete operation in CRUD.
# Removes all documents that match the supplied query.
        
    def delete(self, query):
        try:
            if query is not None:
                result = self.collection.delete_many(query)
                return result.deleted_count
            else:
                return 0
        except Exception as e:
            print("Error deleting documents:", e)
            return 0