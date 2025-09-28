# HMPI Calculator Backend API

A FastAPI-based backend service for calculating Heavy Metal Pollution Index (HMPI) and health metrics from uploaded lab reports.

## Features

- **File Upload Support**: Accept CSV and Excel files with metal concentration data
- **HMPI Calculation**: Automatic calculation using standard formulas
- **Health Metrics**: Hazard Quotient (HQ) and Hazard Index (HI) calculations
- **Risk Assessment**: Categorize water quality based on HMPI values
- **Visualization**: Generate charts and graphs for analysis
- **CORS Support**: Configured for React frontend integration

## Installation

1. **Create Virtual Environment**:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install Dependencies**:
```bash
pip install -r requirements.txt
```

3. **Run the Server**:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

## API Endpoints

### 1. Root Endpoint
- **GET** `/` - API information and available endpoints

### 2. Health Check
- **GET** `/health` - Server health status

### 3. Standards
- **GET** `/standards` - Get standard limits and unit weights

### 4. File Upload & Calculation
- **POST** `/calculate` - Upload CSV/Excel file and calculate HMPI
- **POST** `/calculate-direct` - Calculate HMPI from direct concentration values

## Usage Examples

### Upload File for Analysis
```bash
curl -X POST "http://localhost:8000/calculate" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@sample_data.csv"
```

### Direct Calculation
```bash
curl -X POST "http://localhost:8000/calculate-direct" \
     -H "Content-Type: application/json" \
     -d '{
       "Lead (Pb)": 0.05,
       "Cadmium (Cd)": 0.01,
       "Mercury (Hg)": 0.002,
       "Arsenic (As)": 0.02
     }'
```

## Supported Metals

The API supports the following metals with their standard limits (WHO/BIS):

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

## Risk Categories

| Category | HMPI Range | Description |
|----------|------------|-------------|
| Safe | 0-25 | Excellent water quality |
| Moderate | 25-50 | Good water quality |
| Risky | 50-75 | Requires attention |
| High Risk | 75-100 | Poor water quality |
| Critical | 100+ | Extremely poor quality |

## Response Format

### Successful Calculation Response
```json
{
  "success": true,
  "filename": "sample_data.csv",
  "overall_statistics": {
    "total_samples": 5,
    "average_hmpi": 45.2,
    "min_hmpi": 12.3,
    "max_hmpi": 78.9,
    "std_hmpi": 25.1,
    "risk_distribution": {
      "Safe": 2,
      "Moderate": 2,
      "Risky": 1
    }
  },
  "samples": [
    {
      "sample_id": "Sample_1",
      "hmpi": 45.2,
      "hazard_index": 2.3,
      "risk_category": {
        "category": "Moderate",
        "color": "#eab308",
        "description": "Water quality is good with minor concerns"
      },
      "hazard_quotients": {
        "Lead (Pb)": {
          "concentration": 0.05,
          "standard_limit": 0.01,
          "quality_index": 500.0,
          "hazard_quotient": 5.0,
          "unit_weight": 0.15
        }
      },
      "visualization": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
    }
  ],
  "analysis_timestamp": "2024-01-15T10:30:00"
}
```

## Integration with React Frontend

The API is configured with CORS to work with the React frontend. Update your frontend to make API calls:

```javascript
// Upload file for analysis
const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('http://localhost:8000/calculate', {
    method: 'POST',
    body: formData
  });
  
  return await response.json();
};

// Direct calculation
const calculateHMPI = async (concentrations) => {
  const response = await fetch('http://localhost:8000/calculate-direct', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(concentrations)
  });
  
  return await response.json();
};
```

## Error Handling

The API returns appropriate HTTP status codes:

- **200**: Success
- **400**: Bad Request (invalid file format, missing data)
- **500**: Internal Server Error

Error response format:
```json
{
  "detail": "Error message describing the issue"
}
```

## Development

### Running in Development Mode
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### API Documentation
Once running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## Testing

Test the API using the provided examples or the interactive documentation at `/docs`.
