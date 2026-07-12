"use client";

import { useState } from "react";

export function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  return {
    value,
    on: () => setValue(true),
    off: () => setValue(false),
    toggle: () => setValue((current) => !current),
    setValue,
  };
}
