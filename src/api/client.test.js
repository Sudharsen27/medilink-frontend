import { unwrap } from "./client";

describe("api unwrap helper", () => {
  test("unwraps success payloads with data key", () => {
    expect(unwrap({ data: { success: true, data: [1, 2, 3] } })).toEqual([
      1, 2, 3,
    ]);
  });

  test("returns raw payload when no data envelope", () => {
    expect(unwrap({ data: { items: [1] } })).toEqual({ items: [1] });
  });
});
