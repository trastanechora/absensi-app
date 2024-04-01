"use client";

import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import { convertDateToTime } from '@/app/lib/time';

const Clock = () => {
	const [currentTime, setCurrentTimee] = useState(new Date());

	useEffect(() => {
    const interval = setInterval(() => setCurrentTimee(new Date()), 1000);

    return () => {
      clearInterval(interval);
    };
	}, []);
	
	return (
		<Typography variant="h3" gutterBottom>
			{convertDateToTime(currentTime)}
		</Typography>
	)
}

export default Clock;