import { useEffect, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails, { AccordionDetailsClasses } from '@mui/material/AccordionDetails';
import Typography from '@mui/material/styles/createTypography';

export const WordPlot = (props: {word: string}) => {
    const [word, setWord] = useState<string>();
    const [plot, setPlot] = useState<string>();

    useEffect(() => {
        setWord(props.word)
    }, []);

    useEffect(() => {
        let f = require('../signals/signal-data/emotions/word-plots/' + props.word + '_plot.png');
        if(f)
            setPlot(f);
    }, [word]);

    return (
        <Accordion>
        <AccordionSummary>
            <p>{word}</p>
        </AccordionSummary>
        <AccordionDetails>
        {plot ? (
          <img src={plot} alt="word plot" />
        ) : (
          <p>Plot not found</p>
        )}
        </AccordionDetails>
        </Accordion>
      );
}

