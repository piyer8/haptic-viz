import { Box, Drawer, Modal, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { SignalCard } from './SignalGallery';
import { SignalPanel } from './SignalPanel';

export const SignalDrawer = (props: {signals: string[], keyword: string, open: boolean, onClose: () => void}) => {
    const [openModal, setopenModal] = useState<string | undefined>(undefined);
    const [open, setopen] = useState<boolean>(props.open);
    const [signals, setsignals] = useState<string[]>([]);
    useEffect(() => {
        setopen(props.open)
        setsignals(props.signals);
    }, [props]);
    return (
        <Drawer
        anchor={'right'}
        open={open}
        onClose={() => props.onClose()}
        >
            <Box display = "flex" flexDirection={"column"}>
                <Typography variant='body1' sx={{m: 2}}>Signals described using "{props.keyword}"</Typography>
                {signals.map((signal) => 
                <SignalCard key={signal} signal_id={signal} onClick={() => {setopenModal(signal)}} /> )}
            </Box>
            <Modal open={openModal !== undefined} onClose={() => {setopenModal(undefined)}}>
                <SignalPanel signalId={Number.parseInt(openModal!)} />
            </Modal>
        </Drawer>
    )
}