from flask import Flask, request, jsonify
import pickle
import pandas as pd
from flasgger import Swagger

# Initialize Flask app
app = Flask(__name__)
swagger = Swagger(app)

# Load the model
with open("log_reg.pkl", "rb") as model_file:
    model = pickle.load(model_file)

@app.route('/predict', methods=["GET"])
def predict_class():
    """
    Predict if Customer would buy the product or not.
    ---
    parameters:
      - name: age
        in: query
        type: integer
        required: true
        description: Age of the customer
      - name: new_user
        in: query
        type: integer
        required: true
        description: Whether the user is new (1) or not (0)
      - name: total_pages_visited
        in: query
        type: integer
        required: true
        description: Number of pages visited by the user
    responses:
      200:
        description: Prediction result
        schema:
          type: object
          properties:
            prediction:
              type: integer
      400:
        description: Invalid input parameters
    """
    try:
        # Get parameters
        age = int(request.args.get("age"))
        new_user = int(request.args.get("new_user"))
        total_pages_visited = int(request.args.get("total_pages_visited"))

        # Make prediction
        prediction = model.predict([[age, new_user, total_pages_visited]])

        return jsonify({
            "prediction": int(prediction[0]),
            "message": f"Model prediction is {prediction[0]}"
        })
    except Exception as e:
        return jsonify({"error": "Invalid input or server error"}), 400

@app.route('/predict_file', methods=["POST"])
def prediction_test_file():
    """
    Prediction on multiple input test file.
    ---
    parameters:
      - name: file
        in: formData
        type: file
        required: true
        description: CSV file containing test data
    responses:
      200:
        description: Batch predictions
        schema:
          type: object
          properties:
            predictions:
              type: array
              items:
                type: integer
      400:
        description: Invalid file or server error
    """
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400

        # Read CSV and predict
        df_test = pd.read_csv(file)
        predictions = model.predict(df_test)

        return jsonify({"predictions": predictions.tolist()})
    except Exception as e:
        return jsonify({"error": "Invalid file or server error"}), 400

if __name__ == '__main__':
    app.run(debug=True)

