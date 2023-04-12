import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 1 }, // 1 request per second
    { duration: '1m', target: 10 }, // 10 requests per second
    { duration: '2m', target: 100 }, // 100 requests per second
    { duration: '2m', target: 1000 }, // 1000 requests per second
    { duration: '30s', target: 0 }, // Ramp down to 0 requests per second
  ],
};

export default function () {
  const getReviewsResponse = http.get('http://localhost:3000/reviews?product_id=5200000');
  check(getReviewsResponse, { 'status is 200': (r) => r.status === 200 });

  const markHelpfulResponse = http.put('http://localhost:3000/reviews/5300000/helpful');
  check(markHelpfulResponse, { 'status is 200': (r) => r.status === 200 });

  const reportReviewResponse = http.put('http://localhost:3000/reviews/5300111/report');
  check(reportReviewResponse, { 'status is 200': (r) => r.status === 200 });

  const getReviewMetadataResponse = http.get('http://localhost:3000/reviews/meta?product_id=5200000');
  check(getReviewMetadataResponse, { 'status is 200': (r) => r.status === 200 });

  sleep(1)
}
