import { EmotionalKeyword, SignalEmotions} from "../types/SignalTypes";
import {useEffect, useState} from "react";
import { WordPlot } from "./WordPlot";
import { useParams, useSearchParams } from "react-router-dom";
export default function EmotionalData() {
    const [signalIndex, setSignalIndex] = useState<string>();
    const [signalEmotions, setSignalEmotions] = useState<SignalEmotions>();
    const [signalPlot, setSignalPlot] = useState<string>();
    const [uniqueWords, setUniqueWords] = useState<string[]>();
    const [wavePlot, setWavePlot] = useState<string>();
    const { signalID } = useParams();
    const loadData = (): void => {
        let si = signalID;
        if(si){
            setSignalIndex(si)
            let f = require('../signals/signal-data/emotions/emotional-data/' + si + '.json');
            if(f)
                setSignalEmotions(f[0]);
            setSignalPlot('/emotion-plots/'+si +'.png');
            setWavePlot('/wave-plots/' + si + '_loop.png');
        }
    }

    useEffect(() => {
        loadData()
    },[])

    useEffect(() => {
        setUniqueWords([...new Set(signalEmotions?.emotional_keywords?.map((emotion: EmotionalKeyword) => emotion.word))])
    }, [signalEmotions]);
    return(
        <div>
            <h1>{signalIndex}</h1>
            <img src = {wavePlot} alt="wave plot"/>
            <img src = {signalPlot} alt="signal plot"/>
            <p>Words used</p>
            {uniqueWords?.map((emotion: string) => {
                return <WordPlot word={emotion} />
            })}
        </div>
    )
}