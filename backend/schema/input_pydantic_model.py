from pydantic import BaseModel, Field
from typing import Literal

class RentInput(BaseModel):
    sqft: int = Field(..., ge=100, description="Area in square feet")
    beds: int = Field(..., ge=0, description="Number of bedrooms")
    bath: float = Field(..., ge=0, description="Number of bathrooms")

    laundry: Literal['(a) in-unit', '(b) on-site', '(c) no laundry']
    pets: Literal['(a) both', '(b) dogs', '(c) cats', '(d) no pets']
    housing_type: Literal['(a) single', '(b) double', '(c) multi']
    parking: Literal['(a) unknown', '(b) protected', '(c) off-street', '(d) no parking']
    
    hood_district: float = Field(..., ge=1, le=10, description="District code (1 to 10)")
