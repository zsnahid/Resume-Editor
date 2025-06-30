@echo off
REM Resume Editor Backend Startup Script for Windows

echo 🚀 Starting Resume Editor Backend...

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

REM Check if we're in the backend directory
if not exist "main.py" (
    echo ❌ Please run this script from the backend directory.
    pause
    exit /b 1
)

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo 📦 Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo 🔄 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install/upgrade dependencies
echo 📥 Installing dependencies...
pip install -r requirements.txt

REM Create data directory if it doesn't exist
if not exist "data" (
    echo 📁 Creating data directory...
    mkdir data
)

echo ✅ Setup complete!
echo.
echo 🌐 Starting FastAPI server...
echo    API will be available at: http://localhost:8000
echo    Interactive docs at: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the server
python main.py

pause
