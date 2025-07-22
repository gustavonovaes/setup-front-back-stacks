import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
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
