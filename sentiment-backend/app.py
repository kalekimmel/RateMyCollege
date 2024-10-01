from flask import Flask, request, jsonify
from transformers import pipeline
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"]) 

sentiment_analyzer = pipeline('sentiment-analysis')

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    reviews = data.get('reviews', '')
    
    reviews_list = reviews.split('\n')
    
    results = sentiment_analyzer(reviews_list)
    
    positive_reviews = [res for res in results if res['label'] == 'POSITIVE']
    negative_reviews = [res for res in results if res['label'] == 'NEGATIVE']
    
    total_reviews = len(results)
    positive_count = len(positive_reviews)
    negative_count = len(negative_reviews)
    
    summary = {
        'positive': positive_count,
        'negative': negative_count,
        'total': total_reviews,
        'positive_percentage': (positive_count / total_reviews) * 100 if total_reviews > 0 else 0,
        'negative_percentage': (negative_count / total_reviews) * 100 if total_reviews > 0 else 0,
        'summary': f'The overall sentiment is {"positive" if positive_count > negative_count else "negative" if negative_count > positive_count else "neutral"}.'
    }
    
    return jsonify(summary)

if __name__ == '__main__':
    app.run(debug=True, port=5001)  