# predict.py
import pandas as pd
import numpy as np
import joblib
from config.mappings import laundry_map,pet_map,house_map,district_map

MODEL_VERSION = '1.0.0'

with open("model/model.pkl", "rb") as f:
    model = joblib.load(f)

def predict_rent(data):
    input_dict = {
        'sqft': data.sqft,
        'beds': data.beds,
        'bath': data.bath,
        'laundry': laundry_map[data.laundry],
        'pets': pet_map[data.pets],
        'housing_type': house_map[data.housing_type],
        'parking': data.parking,
        'hood_district': district_map[data.hood_district]
    }

    df = pd.DataFrame([input_dict])
    input_encoded = pd.get_dummies(df)

    X_train_cols = model.model.exog_names
    for col in X_train_cols:
        if col not in input_encoded.columns and col != 'const':
            input_encoded[col] = 0
    input_encoded['const'] = 1.0
    input_encoded = input_encoded[X_train_cols].astype(float)

    pred_log_price = model.predict(input_encoded)[0]
    pred_price = round(np.exp(pred_log_price), 2)

    return {"predicted_rent": pred_price}
