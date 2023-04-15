import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeClassifier
import pickle

# Load the dataset
df = pd.read_csv('C:\\Users\\otoja\\COMP377_GroupProject\\IBM.csv')

# Preprocess the dataset
df = df[['Date', 'Close']]
df['Date'] = pd.to_datetime(df['Date'])
df.set_index('Date', inplace=True)

# Define the categories based on quartiles
categories = pd.qcut(df['Close'], q=4, labels=False)

# Split the dataset into training and testing sets
X = df.index.astype('int64').values.reshape(-1, 1)
y = categories  # Use the categorical array instead of the continuous one
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train a linear regression model
reg_model = LinearRegression()
reg_model.fit(X_train, y_train)

# Train a decision tree classification model
clf_model = DecisionTreeClassifier()
clf_model.fit(X_train, categories[y_train])  # Use the categorical array instead of the continuous one

# Save the trained models
with open('C:\\Users\\otoja\\COMP377_GroupProject\\Back-End\\models\\reg_model.pkl', 'wb') as f:
    pickle.dump(reg_model, f)

with open('C:\\Users\\otoja\\COMP377_GroupProject\\Back-End\\models\\clf_model.pkl', 'wb') as f:
    pickle.dump(clf_model, f)


from flask import Flask, jsonify, request
import pickle
import numpy as np

app = Flask(__name__)

# Load the trained models
with open('C:\\Users\\otoja\\COMP377_GroupProject\\Back-End\\models\\reg_model.pkl', 'rb') as f:
    reg_model = pickle.load(f)

with open('C:\\Users\\otoja\\COMP377_GroupProject\\Back-End\\models\\clf_model.pkl', 'rb') as f:
    clf_model = pickle.load(f)

# Define an endpoint for performing regression predictions
@app.route('/predict', methods=['POST'])
def predict():
    # Get the input data from the request
    data = request.json['data']

    # Convert the input data to a numpy array of timestamps
    x = pd.to_datetime(data).astype('int64').values.reshape(-1, 1)

    # Use the regression model to make predictions
    y_pred = reg_model.predict(x)

    # Convert the predictions to a list and return them
    return jsonify({'predictions': y_pred.tolist()})

# Define an endpoint for performing classification predictions
@app.route('/classify', methods=['POST'])
def classify():
    # Get the input data from the request
    data = request.json['data']

    # Convert the input data to a numpy array
    x = np.array(data).astype('float64')
    x = x[:, np.newaxis]  # add a new axis to x

    # Use the classification model to make predictions
    y_pred = clf_model.predict(x)

    # Convert the predictions to a list and return them
    return jsonify({'classifications': y_pred.tolist()})

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    return response

if __name__ == '__main__':
    app.run(debug=True)
    print('server is running')


#import requests

# Define the input data
#data = {'data': [1640956800000000000, 1641043200000000000, 1641129600000000000]}

# Send a POST request to the Flask app
#response = requests.post('http://localhost:5000/predict', json=data)

# Get the predictions from the response
#predictions = response.json()['predictions']
#print(predictions)
