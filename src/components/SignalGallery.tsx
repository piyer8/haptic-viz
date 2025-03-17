import React, { useEffect, useState } from 'react'
import { Signal } from '../types/SignalTypes';
import { Box, Button, Card, CardActions, CardContent, Modal, Typography } from '@mui/material';
import { SignalPanel } from './SignalPanel';

const SignalCard = (props: {signal: Signal, onClick: (signal_id: string) => void}) => {
    return (
        <Card sx={{m: 2}} key={props.signal.signal_id} style={{width: 300, height: 'auto', maxHeight: '135px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}} >
                <CardContent style={{display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4px'}}>
                    <Typography fontWeight={'bold'} gutterBottom sx={{ color: 'text.secondary', fontSize: 14,  }}>
                        F{props.signal.signal_id}
                    </Typography>
                    <img src = {'/wave-plots/F'+props.signal.signal_id + '_loop.png'} width={'100%'} alt = "wave plot" />
                </CardContent>
                <CardActions style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 0}}>
                    <Button size="small" onClick={() => {props.onClick(props.signal.signal_id)}}>See more</Button>
                </CardActions>
            </Card>
    )
}

export const SignalGallery = (props: {signals: Signal[]}) => {
    const [signals, setsignals] = useState<Signal[]>([]);
    const [currentSignal, setcurrentSignal] = useState<number>();
    const [open, setopen] = useState<boolean>(false);
    useEffect(() => {
        setsignals(props.signals);
    }, [props]);

    const onSignalClick = (signal_id: string) => {setopen(true);setcurrentSignal(Number.parseInt(signal_id))}

    return(
        <Box width={"100%"} bgcolor={"grey.100"} display="flex" height={"auto"} overflow={"auto"} flexDirection={"row"} flexWrap={"wrap"}>
            {signals.map((signal) => 
            <SignalCard key={signal.signal_id} signal={signal} onClick={onSignalClick} />
            )}
            {currentSignal && <Modal open={open} onClose={() => setopen(false)}>
                <SignalPanel signalId={currentSignal}/>
            </Modal>}
        </Box>
    )
}