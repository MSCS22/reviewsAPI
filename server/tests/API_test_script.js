import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 2, // Number of virtual users
  duration: '5s', // Test duration
};

export default function () {
  // Get request
  const getReviewsResponse = http.get('http://localhost:3000/reviews?product_id=305');

  // Put request for marking review as helpful
  const markHelpfulResponse = http.put('http://localhost:3000/reviews/85/helpful');

  // Put request for reporting a review
  const reportReviewResponse = http.put('http://localhost:3000/reviews/85/report');

  // Get request for review metadata
  const getReviewMetadataResponse = http.get('http://localhost:3000/reviews/meta?product_id=789');

  sleep(1);
}
