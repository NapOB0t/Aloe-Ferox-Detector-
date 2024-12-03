from flask import Flask, request, redirect, render_template, jsonify
import base64
import numpy as np
from PIL import Image
from keras.models import load_model
from keras.applications.resnet50 import preprocess_input as resnet50_preprocess
import os
from io import BytesIO

# Load the new model
print("Loading new model...")
model = load_model('resnet50_best_model.keras')
print("New model loaded.")

class_names = ["Flowers", "Buds", "Fruit", "No Evidence"]

def load_and_preprocess_image(img):
    # Resize and preprocess image to match the model's input requirements
    img = img.resize((224, 224))
    img_array = np.array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = resnet50_preprocess(img_array)
    return img_array

def interpret_predictions(predictions, class_names, threshold=0.5):
    # Adjusted threshold for binarizing predictions
    binary_predictions = (predictions > threshold).astype(int)
    results = [class_names[i] for i, label in enumerate(binary_predictions[0]) if label == 1]
    return results

# Initialize Flask app
app = Flask(__name__, template_folder='public')

@app.route('/')
def index():
    return render_template('Main.html')

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return redirect(request.url)

    file = request.files['image']
    if file.filename == '':
        return redirect(request.url)

    # Load the image
    img = Image.open(file)
    img_array = load_and_preprocess_image(img)

    # Make predictions
    predictions = model.predict(img_array)
    results = interpret_predictions(predictions, class_names)

    # Convert image to base64 for display
    buffered = BytesIO()
    img.save(buffered, format="JPEG")
    img_data = base64.b64encode(buffered.getvalue()).decode()

    return render_template('result.html', img_data=img_data, labels=results)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
