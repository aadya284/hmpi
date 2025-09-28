# Jal-Bhoomi: Heavy Metal Pollution Index Monitoring System

A comprehensive web application for monitoring and analyzing heavy metal contamination in groundwater using the Heavy Metal Pollution Index (HMPI) methodology.

## 🌟 Features

### Frontend (React + TypeScript)
- **Interactive Geospatial Map**: Leaflet.js-based map with contamination heatmap
- **Data Analysis Dashboard**: Upload CSV/Excel files for automatic HMPI calculation
- **Timeline Analysis**: Track contamination trends over time
- **Health Impact Assessment**: Population health metrics and risk analysis
- **Alert System**: Real-time contamination alerts and notifications
- **Remediation Suggestions**: Treatment methods and implementation strategies

### Backend (FastAPI + Python)
- **Automated HMPI Calculation**: Standard WHO/BIS methodology
- **File Upload Support**: CSV and Excel file processing
- **Health Metrics**: Hazard Quotient (HQ) and Hazard Index (HI)
- **Risk Assessment**: Categorize water quality based on HMPI values
- **Data Visualization**: Generate charts and graphs
- **CORS Support**: Configured for React frontend integration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd hmpi
```

### 2. Setup Backend
```bash
cd backend
python setup.py
```

Or manually:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Start Backend Server
```bash
cd backend
python main.py
```
The API will be available at `http://localhost:8000`

### 4. Setup Frontend
```bash
# In the root directory
npm install
npm run dev
```
The frontend will be available at `http://localhost:3000`

## 📊 HMPI Calculation

The system uses the standard HMPI formula:

```
Qi = (Mi / Si) × 100
HMPI = (Σ Wi·Qi) / (Σ Wi)
HQ = Mi / Si
HI = Σ HQ
```

Where:
- **Mi**: Measured concentration of metal i
- **Si**: Standard permissible limit for metal i
- **Wi**: Unit weight for metal i
- **Qi**: Quality index for metal i
- **HQ**: Hazard Quotient
- **HI**: Hazard Index

## 🧪 Supported Metals

| Metal | Standard Limit (mg/L) | Unit Weight |
|-------|----------------------|-------------|
| Lead (Pb) | 0.01 | 0.15 |
| Cadmium (Cd) | 0.003 | 0.20 |
| Mercury (Hg) | 0.001 | 0.25 |
| Arsenic (As) | 0.01 | 0.18 |
| Chromium (Cr) | 0.05 | 0.12 |
| Nickel (Ni) | 0.02 | 0.10 |
| Zinc (Zn) | 3.0 | 0.05 |
| Copper (Cu) | 2.0 | 0.08 |
| Iron (Fe) | 0.3 | 0.03 |
| Manganese (Mn) | 0.1 | 0.04 |
| Aluminum (Al) | 0.2 | 0.02 |

## 🚨 Risk Categories

| Category | HMPI Range | Description |
|----------|------------|-------------|
| Safe | 0-25 | Excellent water quality |
| Moderate | 25-50 | Good water quality |
| Risky | 50-75 | Requires attention |
| High Risk | 75-100 | Poor water quality |
| Critical | 100+ | Extremely poor quality |

## 🔧 API Endpoints

### Backend API (FastAPI)
- **GET** `/` - API information
- **GET** `/health` - Health check
- **GET** `/standards` - Standard limits and unit weights
- **POST** `/calculate` - Upload file for HMPI calculation
- **POST** `/calculate-direct` - Direct calculation from concentration values

### Documentation
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## 📁 Project Structure

```
hmpi/
├── backend/                 # FastAPI backend
│   ├── main.py             # Main API application
│   ├── requirements.txt    # Python dependencies
│   ├── setup.py           # Setup script
│   ├── test_api.py        # API test suite
│   ├── sample_data.csv    # Sample data file
│   └── README.md          # Backend documentation
├── src/                    # React frontend
│   ├── components/        # React components
│   │   ├── DataAnalysis.tsx
│   │   ├── GeospatialMap.tsx
│   │   ├── LeafletMap.tsx
│   │   └── ui/            # UI components
│   ├── App.tsx            # Main application
│   └── main.tsx           # Entry point
├── package.json           # Frontend dependencies
└── README.md              # This file
```

## 🧪 Testing

### Test Backend API
```bash
cd backend
python test_api.py
```

### Test Frontend
```bash
npm run dev
# Open http://localhost:3000
```

## 📊 Sample Data Format

### CSV Format
```csv
Sample_ID,Lead (Pb),Cadmium (Cd),Mercury (Hg),Arsenic (As),Chromium (Cr)
Sample_001,0.008,0.002,0.0008,0.007,0.03
Sample_002,0.015,0.004,0.0012,0.012,0.08
```

### Excel Format
Same structure as CSV, but in Excel format (.xlsx or .xls)

## 🔄 Integration

### Frontend-Backend Integration
The React frontend automatically connects to the FastAPI backend:

```javascript
// API calls are handled in DataAnalysis.tsx
const response = await fetch('http://localhost:8000/calculate', {
  method: 'POST',
  body: formData
});
```

### CORS Configuration
The backend is configured to accept requests from:
- `http://localhost:3000`
- `http://localhost:3001`
- `http://localhost:3002`
- `http://localhost:3003`

## 🛠️ Development

### Backend Development
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development
```bash
npm run dev
```

## 📈 Features in Detail

### 1. Data Analysis
- Upload CSV/Excel files with metal concentration data
- Automatic HMPI calculation using standard methodology
- Health metrics calculation (HQ, HI)
- Risk categorization and assessment
- Interactive visualizations

### 2. Geospatial Mapping
- Interactive Leaflet.js map
- Contamination heatmap overlay
- Location-based HMPI visualization
- Zoom and pan functionality
- Detailed location reports

### 3. Health Impact Assessment
- Population health risk analysis
- Chronic disease risk assessment
- Community impact evaluation
- Treatment recommendations

### 4. Timeline Analysis
- Historical contamination trends
- Predictive analysis
- Seasonal variation tracking
- Long-term monitoring

## 🚀 Deployment

### Backend Deployment
```bash
# Using uvicorn
uvicorn main:app --host 0.0.0.0 --port 8000

# Using gunicorn (production)
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Frontend Deployment
```bash
npm run build
# Deploy the 'dist' folder to your hosting service
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation at `/docs` endpoint
- Review the test suite in `backend/test_api.py`
- Check the sample data format in `backend/sample_data.csv`

## 🔮 Future Enhancements

- [ ] Database integration for data persistence
- [ ] Real-time data streaming
- [ ] Machine learning predictions
- [ ] Mobile app development
- [ ] Advanced visualization options
- [ ] Multi-language support
- [ ] User authentication and authorization
- [ ] Data export functionality
- [ ] Integration with IoT sensors
- [ ] Automated report generation