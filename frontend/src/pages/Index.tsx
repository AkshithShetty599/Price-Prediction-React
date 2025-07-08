import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, MapPin, DollarSign, Home, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PredictionData {
  sqft: number;
  beds: number;
  bath: number;
  laundry: '(a) in-unit' | '(b) on-site' | '(c) no laundry';
  pets: '(a) both' | '(b) dogs' | '(c) cats' | '(d) no pets';
  housing_type: '(a) single' | '(b) double' | '(c) multi';
  parking: '(a) unknown' | '(b) protected' | '(c) off-street' | '(d) no parking';
  hood_district: number;
}

const Index = () => {
  const [formData, setFormData] = useState<PredictionData>({
    sqft: 0,
    beds: 0,
    bath: 0,
    laundry: '(a) in-unit',
    pets: '(a) both',
    housing_type: '(a) single',
    parking: '(a) unknown',
    hood_district: 1,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleInputChange = (field: keyof PredictionData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    if (error) setError(null);
  };

  const validateForm = (): boolean => {
    if (formData.sqft < 100) {
      setError("Area must be at least 100 sqft");
      return false;
    }
    if (formData.beds < 0) {
      setError("Bedrooms cannot be negative");
      return false;
    }
    if (formData.bath < 0) {
      setError("Bathrooms must be at least 0.5");
      return false;
    }
    return true;
  };

  const handlePredict = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setPrediction(data.predicted_rent || data.prediction);

      toast({
        title: "Prediction Complete!",
        description: "Your rental price prediction is ready.",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get prediction. Please try again.';
      setError(errorMessage);

      toast({
        title: "Prediction Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-16 lg:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Home className="h-12 w-12 mr-4" />
              <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                San Francisco Rental Price Predictor
              </h1>
            </div>
            <p className="text-xl lg:text-2xl text-blue-100 mb-8">
              Get accurate rental price predictions powered by machine learning
            </p>
            <div className="flex items-center justify-center text-blue-200">
              <MapPin className="h-5 w-5 mr-2" />
              <span className="text-lg">San Francisco Bay Area</span>
            </div>
          </div>
        </div>
        
        {/* Decorative SVG waves */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 fill-blue-50">
            <path d="M1200 120L0 16.48V120z" />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Property Details
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Enter your property information to get a rental price prediction
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Property Basics */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="area" className="text-sm font-medium text-gray-700">
                      Area (sq ft) *
                    </Label>
                    <Input
                      id="area"
                      type="number"
                      placeholder="e.g., 800"
                      value={formData.sqft || ''}
                      onChange={(e) => handleInputChange('sqft', parseInt(e.target.value) || 0)}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms" className="text-sm font-medium text-gray-700">
                      Bedrooms *
                    </Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      placeholder="e.g., 2"
                      value={formData.beds || ''}
                      onChange={(e) => handleInputChange('beds', parseInt(e.target.value) || 0)}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bathrooms" className="text-sm font-medium text-gray-700">
                      Bathrooms *
                    </Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      step="0.1"
                      placeholder="e.g., 1"
                      value={formData.bath || ''}
                      onChange={(e) => handleInputChange('bath', parseFloat(e.target.value) || 0)}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="district" className="text-sm font-medium text-gray-700">
                      District (1-10) *
                    </Label>
                    <Select value={formData.hood_district.toString()} onValueChange={(value) => handleInputChange('hood_district', parseInt(value))}>
                      <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Select district" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                        {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            District {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Amenities */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Laundry Type *</Label>
                    <Select value={formData.laundry} onValueChange={(value) => handleInputChange('laundry', value)}>
                      <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Select laundry type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                        <SelectItem value="(a) in-unit">In-Unit</SelectItem>
                        <SelectItem value="(b) on-site">On-Site</SelectItem>
                        <SelectItem value="(c) no laundry">No Laundry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Pet Policy *</Label>
                    <Select value={formData.pets} onValueChange={(value) => handleInputChange('pets', value)}>
                      <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Select pet policy" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                        <SelectItem value="(a) both">Dogs & Cats</SelectItem>
                        <SelectItem value="(b) dogs">Dogs Only</SelectItem>
                        <SelectItem value="(c) cats">Cats Only</SelectItem>
                        <SelectItem value="(d) no pets">No Pets</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Housing Type *</Label>
                    <Select value={formData.housing_type} onValueChange={(value) => handleInputChange('housing_type', value)}>
                      <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Select housing type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                        <SelectItem value="(a) single">Single Family</SelectItem>
                        <SelectItem value="(b) double">Duplex</SelectItem>
                        <SelectItem value="(c) multi">Multi-Family</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Parking *</Label>
                    <Select value={formData.parking} onValueChange={(value) => handleInputChange('parking', value)}>
                      <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Select parking" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                        <SelectItem value="(b) protected">Protected/Garage</SelectItem>
                        <SelectItem value="(c) off-street">Off-Street</SelectItem>
                        <SelectItem value="(d) no parking">No Parking</SelectItem>
                        <SelectItem value="(a) unknown">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                    <AlertCircle className="h-5 w-5" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <Button
                  onClick={handlePredict}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 transition-all duration-200 transform hover:scale-105"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Predicting...
                    </>
                  ) : (
                    <>
                      <DollarSign className="mr-2 h-5 w-5" />
                      Predict Rent
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Results Section */}
            <div className="space-y-6">
              {/* Prediction Result */}
              {prediction !== null && (
                <Card className="shadow-xl border-0 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <CardHeader className="text-center pb-4">
                    <div className="flex items-center justify-center mb-4">
                      <CheckCircle className="h-12 w-12 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-green-800">
                      Prediction Complete!
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm">
                      <p className="text-gray-700 mb-2">Predicted Monthly Rent</p>
                      <p className="text-4xl lg:text-5xl font-bold text-green-700 mb-4">
                        ${Math.round(prediction).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Based on your property details and SF market data
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Info Cards */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    How it Works
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-gray-700">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 font-semibold text-xs">1</span>
                    </div>
                    <p>Enter your property details including size, amenities, and location</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-purple-600 font-semibold text-xs">2</span>
                    </div>
                    <p>Our ML model analyzes thousands of SF rental listings</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-600 font-semibold text-xs">3</span>
                    </div>
                    <p>Get an accurate rental price prediction instantly</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Market Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-700 space-y-3">
                  <p>
                    <strong>San Francisco</strong> rental market is influenced by location, 
                    property type, and amenities. Our model considers these factors to 
                    provide accurate predictions.
                  </p>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-blue-800 font-medium">💡 Tip:</p>
                    <p className="text-blue-700 mt-1">
                      Properties with in-unit laundry and parking typically command 
                      higher rents in the SF market.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

