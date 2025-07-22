import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  scenarios: {
    contacts: {
      executor: 'ramping-arrival-rate',
      preAllocatedVUs: 10,
      timeUnit: '1s',
      startRate: 50,
      stages: [
        { target: 200, duration: '10s' }, // linearly go from 50 iters/s to 200 iters/s for 30s
        { target: 500, duration: '0' }, // instantly jump to 500 iters/s
        { target: 500, duration: '2m' }, // continue with 500 iters/s for 10 minutes
      ],
    },
  },
};

export default function () {
  const sku = `SKU${String(Math.ceil(Math.random() * 100000)).padStart(6, '0')}`;
  let res = http.get(`http://localhost:3000/products/${sku}`, {
    headers: {
      'secret-key': '42',
    }
  });
  check(res, { "status is 200": (res) => res.status === 200 });
  sleep(1);
}
