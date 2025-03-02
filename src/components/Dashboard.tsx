import React from 'react';
import { useEffect, useState } from 'react';
import { Signal } from '../types/SignalTypes';
import { Button } from '@mui/material';

export default function Dashboard () {
    const [allSignals, setAllSignals] = useState<Signal[]>();
    useEffect(() => {
        let f = require('../signals/signal-data/signal-descriptions/all_signals.json');
        if(f)
            setAllSignals(f);
        console.log('done');
    }, []);
    return (
        (allSignals?.map((signal: Signal) => <Button>{signal.signal_index}</Button>)) 
    );
};  