import { localeDateOption } from '@/entity/constant/general';
import Typography from '@mui/material/Typography';

export const formatDate = (stringDate: string) => {
  const date = new Date(stringDate)
  if (isNaN(Date.parse(stringDate))) {
    return '-'
  } else {
    return date.toLocaleDateString('id-ID', localeDateOption)
  }
}

export const formatUnorderedListItem = (jsonString: string) => {
  if (!jsonString) return '-'
  const parsedArray = JSON.parse(jsonString);
  return (<ul>
    {parsedArray.map((item: string, index: number) => {
      return (<li key={`${index}-${item}`}><Typography>{item}</Typography></li>)
    })}
  </ul>)
}