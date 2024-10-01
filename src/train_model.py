import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.ensemble import RandomForestRegressor
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_squared_error
import joblib
import numpy as np

# Load the new dataset
df = pd.read_csv('src/df.csv')  # Ensure the path is correct
print("Columns in the dataset:", df.columns)

# Select relevant columns
df = df[['Name', 'Admission Rate', 'SATVR75', 'SATMT75', 'ACTEN75', 'ACTMT75']]

# Handle NaNs by filling with the mean
df.replace('NA', np.nan, inplace=True)
numeric_cols = ['SATVR75', 'SATMT75', 'ACTEN75', 'ACTMT75']
df[numeric_cols] = df[numeric_cols].astype(float)
df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].mean())

# Define features (X) and target (y)
df['Name'] = df['Name'].str.strip().str.lower()
X = df[['Name', 'SATVR75', 'SATMT75', 'ACTEN75', 'ACTMT75']]
y = df['Admission Rate'].astype(float)

# One-Hot Encode 'Name' column
preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), ['SATVR75', 'SATMT75', 'ACTEN75', 'ACTMT75']),
        ('cat', OneHotEncoder(handle_unknown='ignore'), ['Name'])
    ])

# Create a pipeline that first preprocesses the data and then trains the model
model_pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('model', RandomForestRegressor(random_state=42, max_depth=20, n_estimators=200, min_samples_split=2))
])

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Convert X_train and X_test to DataFrames with proper column names
X_train = pd.DataFrame(X_train, columns=['Name', 'SATVR75', 'SATMT75', 'ACTEN75', 'ACTMT75'])
X_test = pd.DataFrame(X_test, columns=['Name', 'SATVR75', 'SATMT75', 'ACTEN75', 'ACTMT75'])

# Train the model
model_pipeline.fit(X_train, y_train)

# Save the pipeline to a .pkl file
joblib.dump(model_pipeline, 'admission_model.pkl')
print("Model saved successfully!")

# Evaluate model's performance
y_pred_train = model_pipeline.predict(X_train)
y_pred_test = model_pipeline.predict(X_test)

print("Train RMSE:", mean_squared_error(y_train, y_pred_train, squared=False))
print("Test RMSE:", mean_squared_error(y_test, y_pred_test, squared=False))

# Check feature importance (after preprocessing)
model = model_pipeline.named_steps['model']
if hasattr(model, 'feature_importances_'):
    print("Feature importances:")
    for feature, importance in zip(model_pipeline.named_steps['preprocessor'].transformers_[0][2] + model_pipeline.named_steps['preprocessor'].transformers_[1][1].get_feature_names_out(), model.feature_importances_):
        print(f"{feature}: {importance:.4f}")
