import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import https from "https";
import { firstValueFrom } from "rxjs";

export default async function handler(req, res) {
  // const base_url = 'https://7.213.201.251:32009';
  // const base_url2 = 'http://7.213.201.251:32091';

  const base_url = "http://196.188.120.4:32029";
  const base_url2 = "http://196.188.120.4:32029";

  async function setUpManagementConsole() {
    const accessToken = await AdministratorAccessToken();
    if (accessToken) {
      //console.log("==================accessToken=============");
      //console.log(accessToken);
      //console.log("==================accessToken=============");
      const tenantID = await RegisterAppletDevelopers(accessToken);
      //console.log({ tenantID });
      if (tenantID) {
        //console.log("==================tenantID=============");
        //console.log(tenantID);
        //console.log("==================tenantID=============");
        const { content } = await JoinSite(accessToken, tenantID);

        res.status(200).json({
          siteId: content,
          tenantId: tenantID,
        });

        // const accessToken2 = await this.AdministratorAccessTokenWIthUsername();
        // //console.log({ accessToken2 });
        // const accessToken2 = await this.AdministratorAccessTokenWIthUsername();
        // //console.log({ accessToken2 });
        // if (accessToken2) {
        //   //console.log(accessToken2);
        // }
      } else {
        res.status(400).json({
          message: "No tenantID Found!",
        });
      }
    } else {
      res.status(400).json({
        message: "No Access Token Found!",
      });
    }
  }

  await setUpManagementConsole();
}
