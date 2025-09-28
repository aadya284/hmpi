#!/usr/bin/env python3
"""
Setup script for HMPI Calculator Backend API
"""

import os
import sys
import subprocess
import platform

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required")
        print(f"Current version: {sys.version}")
        return False
    print(f"✅ Python {sys.version.split()[0]} detected")
    return True

def create_virtual_environment():
    """Create virtual environment"""
    print("🔧 Creating virtual environment...")
    try:
        subprocess.run([sys.executable, "-m", "venv", "venv"], check=True)
        print("✅ Virtual environment created")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to create virtual environment: {e}")
        return False

def get_activation_command():
    """Get the correct activation command based on OS"""
    if platform.system() == "Windows":
        return "venv\\Scripts\\activate"
    else:
        return "source venv/bin/activate"

def install_dependencies():
    """Install required dependencies"""
    print("📦 Installing dependencies...")
    try:
        # Determine pip path
        if platform.system() == "Windows":
            pip_path = "venv\\Scripts\\pip"
        else:
            pip_path = "venv/bin/pip"
        
        subprocess.run([pip_path, "install", "-r", "requirements.txt"], check=True)
        print("✅ Dependencies installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        return False

def create_sample_data():
    """Create sample data file if it doesn't exist"""
    sample_data = """Sample_ID,Lead (Pb),Cadmium (Cd),Mercury (Hg),Arsenic (As),Chromium (Cr),Nickel (Ni),Zinc (Zn),Copper (Cu),Iron (Fe),Manganese (Mn),Aluminum (Al)
Sample_001,0.008,0.002,0.0008,0.007,0.03,0.015,2.5,1.8,0.25,0.08,0.15
Sample_002,0.015,0.004,0.0012,0.012,0.08,0.025,3.2,2.1,0.35,0.12,0.25
Sample_003,0.005,0.001,0.0005,0.005,0.02,0.010,1.8,1.2,0.18,0.06,0.10
Sample_004,0.025,0.008,0.002,0.020,0.12,0.040,4.5,3.0,0.50,0.18,0.40
Sample_005,0.012,0.003,0.001,0.010,0.06,0.020,2.8,2.0,0.30,0.10,0.20"""
    
    if not os.path.exists("sample_data.csv"):
        with open("sample_data.csv", "w") as f:
            f.write(sample_data)
        print("✅ Sample data file created")
    else:
        print("✅ Sample data file already exists")

def main():
    """Main setup function"""
    print("🚀 HMPI Calculator Backend Setup")
    print("=" * 50)
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Create virtual environment
    if not create_virtual_environment():
        sys.exit(1)
    
    # Install dependencies
    if not install_dependencies():
        sys.exit(1)
    
    # Create sample data
    create_sample_data()
    
    # Setup complete
    print("\n🎉 Setup completed successfully!")
    print("\n📋 Next steps:")
    print(f"1. Activate virtual environment: {get_activation_command()}")
    print("2. Run the server: python main.py")
    print("3. Or use: python run_server.py")
    print("4. Test the API: python test_api.py")
    print("\n🌐 API will be available at:")
    print("   • Main API: http://localhost:8000")
    print("   • Documentation: http://localhost:8000/docs")
    print("   • ReDoc: http://localhost:8000/redoc")
    
    print("\n🔧 Manual setup (if needed):")
    print("   pip install -r requirements.txt")
    print("   python main.py")

if __name__ == "__main__":
    main()
