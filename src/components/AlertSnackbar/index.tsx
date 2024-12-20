import { Alert, Snackbar } from "@mui/material";

interface IPropsSnackbarMUI {
  onUpdateStateToastTestConnection: (
    status: boolean,
    type: string,
    message: string
  ) => void;
  openSnackbar: boolean;
  status: "error" | "success";
  message: string;
}

export function SnackbarMUI(props: IPropsSnackbarMUI) {
  const { openSnackbar, status, message, onUpdateStateToastTestConnection } =
    props;

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    onUpdateStateToastTestConnection(false, "", "");
  };

  return (
    <div>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={status}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
