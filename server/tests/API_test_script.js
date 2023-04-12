import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 1, // Number of virtual users
  duration: '10s', // Test duration
};

export default function () {
  // // Get request
  // const getReviewsResponse = http.get('http://localhost:3000/reviews?product_id=5200000');

  // // // Put request for marking review as helpful
  // const markHelpfulResponse = http.put('http://localhost:3000/reviews/5300000/helpful');

  // //Put request for reporting a review
  // const reportReviewResponse = http.put('http://localhost:3000/reviews/5300111/report');

  // // // Get request for review metadata
  // const getReviewMetadataResponse = http.get('http://localhost:3000/reviews/meta?product_id=5200000');

  // post request , add a review
  const url = 'http://localhost:3000/reviews';
  const payload = JSON.stringify({
    "product_id": 40347,
      "rating": 4,
      "summary": "Great product!",
      "body": "I really enjoyed using this product.",
      "recommend": true,
      "name": "John Doe",
      "email": "johndoe@example.com",
      "photos": [
        "https://example.com/photo1.jpg",
        "https://example.com/photo2.jpg"
      ],
      "characteristics": {
        "135250": 4
      }
      });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  http.post(url, payload, params);

  sleep(1);

}
