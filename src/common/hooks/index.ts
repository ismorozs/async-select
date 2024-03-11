import { useState } from "react";

export const useBoolean = (initialValue: boolean) => {
  const [value, setValue] = useState(initialValue);

  const setTrue = () => setValue(true);
  const setFalse = () => setValue(false);
  const toggle = () => setValue(value ? false : true);

  return {
    value, setTrue, setFalse, toggle,
  }
}
