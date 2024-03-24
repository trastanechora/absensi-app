"use client";

import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';

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
			{currentTime.getHours()}:{currentTime.getMinutes()}:{currentTime.getSeconds()}
		</Typography>
	)
}

export default Clock;