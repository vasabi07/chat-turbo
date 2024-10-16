import Redis from "ioredis";

export const pub = new Redis({});
pub.on("connect", () => {
  console.log("Publisher connected to Redis");
});
export const sub = new Redis({});
sub.on("connect", () => {
  console.log("Subscriber connected to Redis");
});
