import * as React from "react";

export function useElapsedTime() {
  const [startedAt, setStartedAt] = React.useState(() => Date.now());
  const [elapsedSeconds, setElapsedSeconds] = React.useState(0);

  React.useEffect(() => {
    const intervalId = window.setInterval(() => {
      setElapsedSeconds(
        Math.max(0, Math.floor((Date.now() - startedAt) / 1_000)),
      );
    }, 1_000);

    return () => window.clearInterval(intervalId);
  }, [startedAt]);

  function resetElapsedTime() {
    setStartedAt(Date.now());
    setElapsedSeconds(0);
  }

  return { elapsedSeconds, resetElapsedTime };
}
