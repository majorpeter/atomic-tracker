import { Table, Typography } from "@mui/joy";
import { Trans } from "react-i18next";
import { useApiQuery_config_sessions } from "../../util/api-client";

const Security: React.FC = () => {
  const { data: sessionData } = useApiQuery_config_sessions();
  return (
    <>
      <Typography level="h3">
        <Trans i18nKey="loggedInSessions">Logged-in sessions</Trans>
      </Typography>
      <Trans i18nKey="currentUserLoggedInOn">
        The current user is logged in on the following devices.
      </Trans>
      <Table>
        <thead>
          <tr>
            <th>
              <Trans i18nKey="loginMethod">Login Method</Trans>
            </th>
            <th>
              <Trans i18nKey="userAgen">User Agent</Trans>
            </th>
            <th>
              <Trans i18nKey="expiresAt">Expires at</Trans>
            </th>
            <th>
              <Trans i18nKey="remainingTime">Remaining time (h)</Trans>
            </th>
          </tr>
        </thead>
        <tbody>
          {sessionData &&
            sessionData.sessions.map((item, index) => (
              <tr key={index}>
                <td>{item.loginMethod || "N/A"}</td>
                <td>{item.userAgent}</td>
                <td>{item.expiresIsoDate}</td>
                <td>
                  {Math.round(
                    (new Date(item.expiresIsoDate).getTime() -
                      new Date().getTime()) /
                      3600e3
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </>
  );
};

export default Security;
