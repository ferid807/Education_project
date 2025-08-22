from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone
from emergentintegrations.llm.chat import LlmChat, UserMessage
import json

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Student Profile Models
class StudentProfile(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    university: str
    faculty: str
    gpa: float
    total_credits: int
    completed_credits: int
    achievements: List[str] = []
    extracurriculars: List[str] = []
    preferred_countries: List[str] = []
    financial_situation: str  # "excellent", "good", "needs_scholarship", "limited"
    career_goals: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StudentProfileCreate(BaseModel):
    name: str
    email: str
    university: str
    faculty: str
    gpa: float
    total_credits: int
    completed_credits: int
    achievements: List[str] = []
    extracurriculars: List[str] = []
    preferred_countries: List[str] = []
    financial_situation: str
    career_goals: str

class StudentProfileUpdate(BaseModel):
    name: Optional[str] = None
    university: Optional[str] = None
    faculty: Optional[str] = None
    gpa: Optional[float] = None
    total_credits: Optional[int] = None
    completed_credits: Optional[int] = None
    achievements: Optional[List[str]] = None
    extracurriculars: Optional[List[str]] = None
    preferred_countries: Optional[List[str]] = None
    financial_situation: Optional[str] = None
    career_goals: Optional[str] = None

# University and Scholarship Models
class University(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    country: str
    ranking: int
    programs: List[str]
    acceptance_rate: float
    tuition_fee: float
    scholarships_available: bool
    language_requirements: List[str]
    min_gpa: float
    application_deadline: str

class Scholarship(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    provider: str
    countries: List[str]
    fields: List[str]
    amount: float
    requirements: List[str]
    deadline: str
    description: str

# Chat Models
class ChatMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    student_id: str
    message: str
    response: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ChatRequest(BaseModel):
    student_id: str
    message: str

# Career Recommendation Models
class CareerRecommendation(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    student_id: str
    recommendations: Dict[str, Any]
    acceptance_probabilities: Dict[str, float]
    suggested_improvements: List[str]
    generated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Initialize sample data
async def initialize_sample_data():
    # Check if universities already exist
    existing_universities = await db.universities.count_documents({})
    if existing_universities == 0:
        sample_universities = [
            {
                "id": str(uuid.uuid4()),
                "name": "MIT",
                "country": "USA",
                "ranking": 1,
                "programs": ["Computer Science", "Engineering", "Business"],
                "acceptance_rate": 0.07,
                "tuition_fee": 55000,
                "scholarships_available": True,
                "language_requirements": ["English"],
                "min_gpa": 3.8,
                "application_deadline": "January 1"
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Oxford University",
                "country": "UK",
                "ranking": 2,
                "programs": ["Computer Science", "Engineering", "Medicine", "Law"],
                "acceptance_rate": 0.15,
                "tuition_fee": 45000,
                "scholarships_available": True,
                "language_requirements": ["English"],
                "min_gpa": 3.7,
                "application_deadline": "October 15"
            },
            {
                "id": str(uuid.uuid4()),
                "name": "TU Munich",
                "country": "Germany",
                "ranking": 15,
                "programs": ["Engineering", "Computer Science", "Physics"],
                "acceptance_rate": 0.30,
                "tuition_fee": 0,
                "scholarships_available": True,
                "language_requirements": ["German", "English"],
                "min_gpa": 3.5,
                "application_deadline": "March 15"
            },
            {
                "id": str(uuid.uuid4()),
                "name": "University of Toronto",
                "country": "Canada",
                "ranking": 20,
                "programs": ["Computer Science", "Engineering", "Business", "Medicine"],
                "acceptance_rate": 0.25,
                "tuition_fee": 30000,
                "scholarships_available": True,
                "language_requirements": ["English"],
                "min_gpa": 3.6,
                "application_deadline": "January 15"
            }
        ]
        await db.universities.insert_many(sample_universities)

    # Check if scholarships already exist
    existing_scholarships = await db.scholarships.count_documents({})
    if existing_scholarships == 0:
        sample_scholarships = [
            {
                "id": str(uuid.uuid4()),
                "name": "Fulbright Scholarship",
                "provider": "US Government",
                "countries": ["USA"],
                "fields": ["All"],
                "amount": 50000,
                "requirements": ["GPA > 3.5", "English Proficiency", "Leadership Experience"],
                "deadline": "October 1",
                "description": "Full scholarship for graduate studies in the USA"
            },
            {
                "id": str(uuid.uuid4()),
                "name": "DAAD Scholarship",
                "provider": "German Government",
                "countries": ["Germany"],
                "fields": ["Engineering", "Science", "Technology"],
                "amount": 25000,
                "requirements": ["GPA > 3.0", "German or English Proficiency"],
                "deadline": "January 31",
                "description": "Scholarship for international students in Germany"
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Rhodes Scholarship",
                "provider": "Rhodes Trust",
                "countries": ["UK"],
                "fields": ["All"],
                "amount": 70000,
                "requirements": ["Exceptional Academic Record", "Leadership", "Character"],
                "deadline": "September 1",
                "description": "Prestigious scholarship for Oxford University"
            }
        ]
        await db.scholarships.insert_many(sample_scholarships)

# API Routes
@api_router.get("/")
async def root():
    return {"message": "Career Guidance Platform API"}

# Student Profile Routes
@api_router.post("/students", response_model=StudentProfile)
async def create_student_profile(student: StudentProfileCreate):
    student_dict = student.dict()
    student_obj = StudentProfile(**student_dict)
    await db.students.insert_one(student_obj.dict())
    await initialize_sample_data()  # Initialize sample data when first student is created
    return student_obj

@api_router.get("/students/{student_id}", response_model=StudentProfile)
async def get_student_profile(student_id: str):
    student = await db.students.find_one({"id": student_id})
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return StudentProfile(**student)

@api_router.put("/students/{student_id}", response_model=StudentProfile)
async def update_student_profile(student_id: str, updates: StudentProfileUpdate):
    update_dict = {k: v for k, v in updates.dict().items() if v is not None}
    update_dict["updated_at"] = datetime.now(timezone.utc)
    
    result = await db.students.update_one(
        {"id": student_id}, 
        {"$set": update_dict}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Student not found")
    
    updated_student = await db.students.find_one({"id": student_id})
    return StudentProfile(**updated_student)

# Universities and Scholarships Routes
@api_router.get("/universities", response_model=List[University])
async def get_universities(country: Optional[str] = None, program: Optional[str] = None):
    filter_query = {}
    if country:
        filter_query["country"] = {"$regex": country, "$options": "i"}
    if program:
        filter_query["programs"] = {"$regex": program, "$options": "i"}
    
    universities = await db.universities.find(filter_query).to_list(100)
    return [University(**uni) for uni in universities]

@api_router.get("/scholarships", response_model=List[Scholarship])
async def get_scholarships(country: Optional[str] = None, field: Optional[str] = None):
    filter_query = {}
    if country:
        filter_query["countries"] = {"$regex": country, "$options": "i"}
    if field:
        filter_query["fields"] = {"$regex": field, "$options": "i"}
    
    scholarships = await db.scholarships.find(filter_query).to_list(100)
    return [Scholarship(**scholarship) for scholarship in scholarships]

# AI Chat Route
@api_router.post("/chat", response_model=ChatMessage)
async def chat_with_ai(chat_request: ChatRequest):
    try:
        # Get student profile for context
        student = await db.students.find_one({"id": chat_request.student_id})
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        
        # Create system message with student context
        system_message = f"""You are an expert career guidance counselor specializing in helping university students with graduate school applications, scholarships, and career planning.

Student Profile:
- Name: {student['name']}
- University: {student['university']}
- Faculty: {student['faculty']}
- GPA: {student['gpa']}
- Credits: {student['completed_credits']}/{student['total_credits']}
- Achievements: {', '.join(student['achievements'])}
- Extracurriculars: {', '.join(student['extracurriculars'])}
- Preferred Countries: {', '.join(student['preferred_countries'])}
- Financial Situation: {student['financial_situation']}
- Career Goals: {student['career_goals']}

Provide personalized, actionable advice. Be encouraging but realistic. Focus on:
1. University and program recommendations
2. Scholarship opportunities
3. Application strategies
4. Profile improvement suggestions
5. Timeline planning

Keep responses concise but comprehensive."""

        # Initialize AI chat
        chat = LlmChat(
            api_key=os.environ['EMERGENT_LLM_KEY'],
            session_id=f"student_{chat_request.student_id}",
            system_message=system_message
        ).with_model("openai", "gpt-4o-mini")

        # Send message to AI
        user_message = UserMessage(text=chat_request.message)
        response = await chat.send_message(user_message)

        # Save chat to database
        chat_message = ChatMessage(
            student_id=chat_request.student_id,
            message=chat_request.message,
            response=response
        )
        await db.chat_messages.insert_one(chat_message.dict())

        return chat_message

    except Exception as e:
        logging.error(f"Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Chat service error: {str(e)}")

# Career Recommendations Route
@api_router.post("/recommendations/{student_id}", response_model=CareerRecommendation)
async def generate_career_recommendations(student_id: str):
    try:
        # Get student profile
        student = await db.students.find_one({"id": student_id})
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")

        # Get relevant universities and scholarships
        universities = await db.universities.find({
            "country": {"$in": student['preferred_countries']},
            "min_gpa": {"$lte": student['gpa']}
        }).to_list(10)

        scholarships = await db.scholarships.find({
            "countries": {"$in": student['preferred_countries']}
        }).to_list(10)

        # Create AI prompt for recommendations
        prompt = f"""Generate comprehensive career recommendations for this student:

Student Profile:
- GPA: {student['gpa']}
- Field: {student['faculty']}
- Progress: {student['completed_credits']}/{student['total_credits']} credits
- Achievements: {', '.join(student['achievements'])}
- Extracurriculars: {', '.join(student['extracurriculars'])}
- Preferred Countries: {', '.join(student['preferred_countries'])}
- Financial Situation: {student['financial_situation']}
- Career Goals: {student['career_goals']}

Available Universities: {[uni['name'] + ' (' + uni['country'] + ')' for uni in universities]}
Available Scholarships: {[sch['name'] for sch in scholarships]}

Please provide:
1. Top 3 university recommendations with acceptance probability (%)
2. Top 3 scholarship opportunities with success probability (%)
3. 5 specific profile improvement suggestions
4. Application timeline with key deadlines

Format as JSON with keys: universities, scholarships, improvements, timeline, probabilities"""

        # Get AI recommendations
        chat = LlmChat(
            api_key=os.environ['EMERGENT_LLM_KEY'],
            session_id=f"recommendations_{student_id}",
            system_message="You are an expert career counselor. Provide detailed, realistic recommendations in JSON format."
        ).with_model("openai", "gpt-4o-mini")

        user_message = UserMessage(text=prompt)
        ai_response = await chat.send_message(user_message)

        try:
            # Parse AI response as JSON
            recommendations_data = json.loads(ai_response)
        except json.JSONDecodeError:
            # Fallback if AI doesn't return valid JSON
            recommendations_data = {
                "universities": [uni['name'] for uni in universities[:3]],
                "scholarships": [sch['name'] for sch in scholarships[:3]],
                "improvements": ["Improve GPA", "Gain research experience", "Learn new language"],
                "timeline": "Start applications 6 months before deadline",
                "probabilities": {"MIT": 15, "Oxford": 25, "TU Munich": 60}
            }

        # Calculate acceptance probabilities based on student profile
        acceptance_probabilities = {}
        for uni in universities[:5]:
            base_prob = uni['acceptance_rate'] * 100
            gpa_bonus = max(0, (student['gpa'] - uni['min_gpa']) * 10)
            achievement_bonus = len(student['achievements']) * 2
            final_prob = min(95, base_prob + gpa_bonus + achievement_bonus)
            acceptance_probabilities[uni['name']] = round(final_prob, 1)

        # Create and save recommendation
        recommendation = CareerRecommendation(
            student_id=student_id,
            recommendations=recommendations_data,
            acceptance_probabilities=acceptance_probabilities,
            suggested_improvements=[
                "Increase GPA through focused study",
                "Gain research experience in your field",
                "Develop leadership skills through extracurriculars",
                "Improve language proficiency",
                "Build professional network"
            ]
        )

        await db.recommendations.insert_one(recommendation.dict())
        return recommendation

    except Exception as e:
        logging.error(f"Recommendations error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Recommendations service error: {str(e)}")

# Get chat history
@api_router.get("/chat/{student_id}", response_model=List[ChatMessage])
async def get_chat_history(student_id: str):
    messages = await db.chat_messages.find({"student_id": student_id}).sort("timestamp", -1).to_list(50)
    return [ChatMessage(**msg) for msg in messages]

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()