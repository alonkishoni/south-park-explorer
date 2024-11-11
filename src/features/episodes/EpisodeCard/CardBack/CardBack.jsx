import {Alert, Avatar, Button, CardActions, CardContent, CardHeader} from "@mui/material";
import {formatDate} from "../../../../utils/date.utils.js";
import {memo} from "react";

const CardBack = ({ imageUrl, airDate, description, externalLink }) => {
  return (
    <>
      <CardContent>
        <CardHeader
          avatar={
            <Avatar
              sx={{ width: 72, height: 72 }}
              alt="avatar"
              src={imageUrl}
            />
          }
          title={name}
          subheader={formatDate(airDate)}
          titleTypographyProps={{ variant: 'p1' }}
          subheaderTypographyProps={{ variant: 'overline' }}
        />
        <Alert style={{ height: '120px' }} icon={false} severity="info">
          {description}
        </Alert>
      </CardContent>
      <CardActions dir={'rtl'}>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            window.open(externalLink, '_blank');
          }}
          size="small"
        >
          More
        </Button>
      </CardActions>
    </>
  )
}

export default memo(CardBack);
