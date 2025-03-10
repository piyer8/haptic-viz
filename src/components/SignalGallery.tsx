import React, { useEffect, useState } from 'react'
import { Signal } from '../types/SignalTypes';
import { Box, Button, Card, CardActions, CardContent, Modal, Typography } from '@mui/material';
import { SignalPanel } from './SignalPanel';

export const SignalGallery = (props: {signals: Signal[]}) => {
    const [signals, setsignals] = useState<Signal[]>([]);
    const [currentSignal, setcurrentSignal] = useState<number>();
    const [open, setopen] = useState<boolean>(false);
    useEffect(() => {
        setsignals(props.signals);
    }, [props]);
    return(
        <Box width={"100%"} display="flex" height={"100%"} overflow={"auto"} flexDirection={"row"} flexWrap={"wrap"}>
            {signals.map((signal) => 
            <Card sx={{m: 2}} key={signal.signal_id} style={{width: 300, display: 'flex', flexDirection: 'column', justifyContent: 'space-around'}} >
                <CardContent style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <Typography fontWeight={'bold'} gutterBottom sx={{ color: 'text.secondary', fontSize: 14,  }}>
                        F{signal.signal_id}
                    </Typography>
                    <img src = {'/wave-plots/F'+signal.signal_id + '_loop.png'} width={'100%'} alt = "wave plot" />
                </CardContent>
                <CardActions style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <Button size="small" onClick={() => {setopen(true);setcurrentSignal(Number.parseInt(signal.signal_id))}}>See more</Button>
                </CardActions>
            </Card>
            )}
            {currentSignal && <Modal open={open} onClose={() => setopen(false)}>
                <SignalPanel signalId={currentSignal}/>
            </Modal>}
        </Box>
    )
}