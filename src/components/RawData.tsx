import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, SxProps, Theme, Typography } from '@mui/material';

interface DescriptionData {
  keywords?: string[];
  descriptions?: string[];
}

interface RawDataProps {
  sensoryData?: DescriptionData;
  emotionalData?: DescriptionData;
  associativeData?: DescriptionData;
  styles?: SxProps<Theme> | undefined
}

export const RawData: React.FC<RawDataProps> = ({
  sensoryData,
  emotionalData,
  associativeData,
  styles
}) => {
  return (
    <Box sx={styles}>
      <Accordion>
        <AccordionSummary>
          <Typography variant="h6">Sensory descriptions</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1">Keywords</Typography>
          <Typography variant="body2">
            {sensoryData?.keywords?.map((keyword: string) => keyword + ' ')}
          </Typography>
          <Typography variant="body1">Descriptions</Typography>
          {sensoryData?.descriptions?.map((description: string) => (
            <Typography key={description} variant="body2">
              {description}
            </Typography>
          ))}
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary>
          <Typography variant="h6">Emotional descriptions</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1">Keywords</Typography>
          <Typography variant="body2">
            {emotionalData?.keywords?.map((keyword: string) => keyword + ' ')}
          </Typography>
          <Typography variant="body1">Descriptions</Typography>
          {emotionalData?.descriptions?.map((description: string) => (
            <Typography key={description} variant="body2">
              {description}
            </Typography>
          ))}
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary>
          <Typography variant="h6">Associative descriptions</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1">Keywords</Typography>
          <Typography variant="body2">
            {associativeData?.keywords?.map((keyword: string) => keyword + ' ')}
          </Typography>
          <Typography variant="body1">Descriptions</Typography>
          {associativeData?.descriptions?.map((description: string) => (
            <Typography key={description} variant="body2">
              {description}
            </Typography>
          ))}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default RawData;