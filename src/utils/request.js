import axios from "axios";
export const baseURL = "/api";

export const createHash = async (data) => {
  const encoder = new TextEncoder();
  const buffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle?.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};

export async function request(config) {
  const data = `${config.params.user}${Math.round(
    new Date().getTime() / 1000 / 60 / 60
  )}`;

  const hash = await createHash(data);

  const instance = axios.create({
    baseURL: baseURL,
    method: "get" || config.method,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      additional: hash,
    },
    timeout: 7000,
  });

  instance.interceptors.request.use(
    (config) => {
      return config;
    },
    (err) => {
      console.error(err);
    }
  );

  instance.interceptors.response.use(
    (res) => {
      if (res.data.code == 0) {
        return Promise.resolve(res.data);
      } else {
        return Promise.resolve(res.data);
      }
      console.log(res);
    },
    (err) => {
      console.error(err);
    }
  );
  return instance(config);
}

export const request2 = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
  },
});

request2.interceptors.request.use(async (config) => {
  const data = `${config.params.user}${Math.round(
    new Date().getTime() / 1000 / 60 / 60
  )}`;

  const hash = await createHash(data);
  return { ...config, headers: { ...config.headers, additional: hash } };
});

request2.interceptors.response.use((res) => {
  return res.data;
});
