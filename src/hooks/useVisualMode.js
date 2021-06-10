import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = function(newMode,replace=false) {
    if(replace){
      setHistory((prev)=>{
        setMode(newMode);
        return [...prev.slice(0,prev.length-1), newMode];
      })

    }else{
      setHistory((prev) => {
        setMode(newMode);
        return [...prev, newMode];
      })
    }    
  }

  const back = function() {
    if (history.length >= 2) {
      const copy = [...history];
      copy.pop();
      setHistory(copy);
      setMode(copy[copy.length - 1]);

      // setHistory(history.slice(0, history.length-1));
      // // console.log(history.slice(0,history.length-1));
      // console.log(history);
      // setMode(history[history.length-1])
    }
  }
  return { mode, transition, back }
}
