import React, {
  createContext,
  useMemo,
  useContext,
  useEffect,
  useRef,
} from "react";

export const ScrollContext = createContext();

export const ScrollProvider = ({ scroll, children }) => {
  const listeners = useRef(new Map());

  useEffect(() => {
    listeners.current.forEach(listener => listener(scroll));
  }, [scroll]);

  const addListener = (name, listener) => listeners.current.set(name, listener);
  const removeListener = name => listeners.current.delete(name);

  return useMemo(
    () => (
      <ScrollContext.Provider value={{ addListener, removeListener }}>
        {children}
      </ScrollContext.Provider>
    ),
    [children]
  );
};

export const useScrollListener = (name, listener) => {
  const context = useContext(ScrollContext);
  useEffect(() => {
    context.addListener(name, listener);
    return () => {
      context.removeListener(name);
    };
  });
};
