from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
import io
import json
from datetime import datetime
from typing import Dict, List, Optional

# Initialize FastAPI app
app = FastAPI(
    title="HMPI Calculator API",
    description="Heavy Metal Pollution Index and Health Metrics Calculator",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Standard permissible limits (WHO/BIS standards) in mg/L
STANDARD_LIMITS = {
    'Lead (Pb)': 0.01,
    'Cadmium (Cd)': 0.003,
    'Mercury (Hg)': 0.001,
    'Arsenic (As)': 0.01,
    'Chromium (Cr)': 0.05,
    'Nickel (Ni)': 0.02,
    'Zinc (Zn)': 3.0,
    'Copper (Cu)': 2.0,
    'Iron (Fe)': 0.3,
    'Manganese (Mn)': 0.1,
    'Aluminum (Al)': 0.2
}

# Unit weights for HMPI calculation
UNIT_WEIGHTS = {
    'Lead (Pb)': 0.15,
    'Cadmium (Cd)': 0.20,
    'Mercury (Hg)': 0.25,
    'Arsenic (As)': 0.18,
    'Chromium (Cr)': 0.12,
    'Nickel (Ni)': 0.10,
    'Zinc (Zn)': 0.05,
    'Copper (Cu)': 0.08,
    'Iron (Fe)': 0.03,
    'Manganese (Mn)': 0.04,
    'Aluminum (Al)': 0.02
}

# Risk categories based on HMPI values
RISK_CATEGORIES = {
    'Safe': {'min': 0, 'max': 25, 'color': '#22c55e'},
    'Moderate': {'min': 25, 'max': 50, 'color': '#eab308'},
    'Risky': {'min': 50, 'max': 75, 'color': '#f97316'},
    'High Risk': {'min': 75, 'max': 100, 'color': '#ef4444'},
    'Critical': {'min': 100, 'max': float('inf'), 'color': '#dc2626'}
}

def get_risk_category(hmpi_value: float) -> Dict:
    """Determine risk category based on HMPI value"""
    for category, limits in RISK_CATEGORIES.items():
        if limits['min'] <= hmpi_value < limits['max']:
            return {
                'category': category,
                'color': limits['color'],
                'description': get_risk_description(category)
            }
    return {
        'category': 'Unknown',
        'color': '#6b7280',
        'description': 'Unable to determine risk level'
    }

def get_risk_description(category: str) -> str:
    """Get description for risk category"""
    descriptions = {
        'Safe': 'Water quality is excellent and safe for consumption',
        'Moderate': 'Water quality is good with minor concerns',
        'Risky': 'Water quality requires attention and monitoring',
        'High Risk': 'Water quality is poor and needs immediate treatment',
        'Critical': 'Water quality is extremely poor and poses serious health risks'
    }
    return descriptions.get(category, 'Unknown risk level')

def calculate_hmpi(concentrations: Dict[str, float]) -> Dict:
    """Calculate HMPI and related metrics"""
    results = {
        'hmpi': 0.0,
        'hazard_quotients': {},
        'hazard_index': 0.0,
        'risk_category': {},
        'metal_contributions': {},
        'quality_ratios': {}
    }
    
    total_weighted_qi = 0.0
    total_weights = 0.0
    hazard_quotients = []
    
    for metal, concentration in concentrations.items():
        if metal in STANDARD_LIMITS and metal in UNIT_WEIGHTS:
            # Calculate Quality Index (Qi)
            si = STANDARD_LIMITS[metal]
            qi = (concentration / si) * 100
            
            # Calculate Hazard Quotient (HQ)
            hq = concentration / si
            hazard_quotients.append(hq)
            
            # Store results
            results['hazard_quotients'][metal] = {
                'concentration': concentration,
                'standard_limit': si,
                'quality_index': qi,
                'hazard_quotient': hq,
                'unit_weight': UNIT_WEIGHTS[metal]
            }
            
            # Calculate weighted contribution
            wi = UNIT_WEIGHTS[metal]
            weighted_qi = wi * qi
            total_weighted_qi += weighted_qi
            total_weights += wi
            
            # Store individual contributions
            results['metal_contributions'][metal] = {
                'contribution': weighted_qi,
                'percentage': 0  # Will be calculated later
            }
            
            # Quality ratio
            results['quality_ratios'][metal] = {
                'ratio': concentration / si,
                'status': 'Safe' if concentration <= si else 'Exceeded'
            }
    
    # Calculate HMPI
    if total_weights > 0:
        results['hmpi'] = total_weighted_qi / total_weights
    
    # Calculate Hazard Index
    results['hazard_index'] = sum(hazard_quotients)
    
    # Determine risk category
    results['risk_category'] = get_risk_category(results['hmpi'])
    
    # Calculate percentage contributions
    for metal in results['metal_contributions']:
        if total_weighted_qi > 0:
            contribution = results['metal_contributions'][metal]['contribution']
            results['metal_contributions'][metal]['percentage'] = (contribution / total_weighted_qi) * 100
    
    return results

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "HMPI Calculator API",
        "version": "1.0.0",
        "status": "active",
        "endpoints": {
            "calculate": "/calculate",
            "standards": "/standards",
            "health": "/health"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/standards")
async def get_standards():
    """Get standard limits and unit weights"""
    return {
        "standard_limits": STANDARD_LIMITS,
        "unit_weights": UNIT_WEIGHTS,
        "risk_categories": RISK_CATEGORIES
    }

@app.post("/calculate")
async def calculate_hmpi_from_file(file: UploadFile = File(...)):
    """Calculate HMPI from uploaded CSV/Excel file"""
    try:
        # Validate file type
        if not file.filename.endswith(('.csv', '.xlsx', '.xls')):
            raise HTTPException(status_code=400, detail="File must be CSV or Excel format")
        
        # Read file content
        content = await file.read()
        
        # Parse file based on extension
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.StringIO(content.decode('utf-8')))
        else:
            df = pd.read_excel(io.BytesIO(content))
        
        # Validate required columns
        required_metals = list(STANDARD_LIMITS.keys())
        available_metals = [col for col in df.columns if col in required_metals]
        
        if not available_metals:
            raise HTTPException(
                status_code=400, 
                detail=f"No recognized metal columns found. Expected: {required_metals}"
            )
        
        # Process each row (sample)
        results = []
        for index, row in df.iterrows():
            # Extract concentrations for available metals
            concentrations = {}
            for metal in available_metals:
                if pd.notna(row[metal]) and row[metal] >= 0:
                    concentrations[metal] = float(row[metal])
            
            if concentrations:
                # Calculate HMPI for this sample
                sample_results = calculate_hmpi(concentrations)
                
                # Add sample information
                sample_info = {
                    'sample_id': f"Sample_{index + 1}",
                    'row_index': index,
                    'available_metals': available_metals,
                    'timestamp': datetime.now().isoformat()
                }
                
                results.append({
                    **sample_info,
                    **sample_results
                })
        
        if not results:
            raise HTTPException(status_code=400, detail="No valid data found in the file")
        
        # Calculate overall statistics
        hmpi_values = [r['hmpi'] for r in results]
        overall_stats = {
            'total_samples': len(results),
            'average_hmpi': sum(hmpi_values) / len(hmpi_values),
            'min_hmpi': min(hmpi_values),
            'max_hmpi': max(hmpi_values),
            'std_hmpi': 0,  # Simplified without numpy
            'risk_distribution': {}
        }
        
        # Risk distribution
        for result in results:
            category = result['risk_category']['category']
            overall_stats['risk_distribution'][category] = overall_stats['risk_distribution'].get(category, 0) + 1
        
        return {
            'success': True,
            'filename': file.filename,
            'overall_statistics': overall_stats,
            'samples': results,
            'analysis_timestamp': datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@app.post("/calculate-direct")
async def calculate_hmpi_direct(concentrations: Dict[str, float]):
    """Calculate HMPI directly from concentration values"""
    try:
        # Validate input
        if not concentrations:
            raise HTTPException(status_code=400, detail="No concentration data provided")
        
        # Calculate HMPI
        results = calculate_hmpi(concentrations)
        
        return {
            'success': True,
            'results': results,
            'timestamp': datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in calculation: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
