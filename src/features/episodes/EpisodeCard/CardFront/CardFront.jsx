import {CardContent, CardMedia, Typography} from "@mui/material";
import {formatDate} from "../../../../utils/date.utils.js";
import {memo} from "react";

const CardFront = ({ name, imageUrl, ep, season, airDate }) => {
  return(
    <>
      <CardMedia
        loading="lazy"
        component="img"
        height="192"
        image={imageUrl}
      />
      <CardContent>
        <Typography
          variant="h6"
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          component="div"
        >
          {name}
        </Typography>
        <Typography
          fontSize={'12px'}
          variant="overline"
          color="text.secondary"
          component="div"
        >
          {`Season: ${season} / Episode: ${ep}`}
        </Typography>
        <Typography fontSize={'12px'} variant="overline" color="text.secondary">
          {`First aired: ${formatDate(airDate)}`}
        </Typography>
      </CardContent>
    </>
  )
}

export default memo(CardFront);
