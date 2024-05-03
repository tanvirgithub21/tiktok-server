// import Video from "../models/Video.js";

import fetch from "node-fetch";
import Video from "../models/Video.js";
import FaebookUpload from "../models/FaebookUpload.js";
import { cloudinaryVideoDelete } from "../lib/cloudinaryVideoDelete.js";

export const facebookUploadAndDatabaseUpdated = async (req, res, next) => {
  try {
    const getUplodedVideoLink = await Video.findOne(
      {},
      {},
      { sort: { created_at: -1 } }
    );
    if (!getUplodedVideoLink?._id) {
      console.log("video link not found");
      return res.status(500).json({
        success: false,
        message: "Video Not Found",
      });

    }


    const reelsUplodeUrl1 = `https://graph.facebook.com/v19.0/${process.env.page_id}/video_reels`;
    const postDataStep1 = {
      upload_phase: "start",
      access_token: `${process.env.page_access_tocken}`,
    };
    const externalResponse = await fetch(reelsUplodeUrl1, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postDataStep1),
    });

    const getVideoId = await externalResponse.json();

    console.log(getVideoId);

    // Session has expired chack
    if (getVideoId?.error?.message.includes("Session has expired")) {
      console.log("Session has expired");
    }

    if (!getVideoId?.video_id) {
      console.log("Video_id not found");
      return res.status(500).json({
        success: false,
        message: "Video_id not found",
      });
      
    }

    console.log("send first request");

    const externalResponse2 = await fetch(getVideoId.upload_url, {
      method: "POST",
      headers: {
        Authorization: `OAuth ${process.env.page_access_tocken}`,
        file_url: `${getUplodedVideoLink.videoUrl}`,
      },
      body: JSON.stringify(postDataStep1),
    });

    const result = await externalResponse2.json();
    if (!result.success) {
      console.log("Video Uplode faild!");
      return res.status(500).json({
        success: false,
        message: "Video Uplode faild!",
      });
      
    }

    console.log("send 2nd request");

    // hashtag
    const hashtag =
      "This reel is filled with adorable moments featuring a charming little girl. Prepare to be amazed by her funny antics, infectious laughter, and bright smile. Perfect for anyone who needs a dose of joy!Here are some tags to find this video: #cute #kidsofinstagram #adorable #funnykids #childhoodunplugged #laughter #happy #familyfun #toddlersofinstagr #kidsofinstagram #reelsfb2024 #viralreels23 #cute #cutenessoverload #adorable #feelingcute #goodvibe #prettygirl #beautiful #allsmiles #positivevibes #sunshine #FecebookReelsContest #Newyork #facebook #fbreelsfypシ゚vir #trendingreels #reels #fbreels #explorepage #tren #viralreels #usareels #fypviral #reelsfacebook #viral #Usa #fory #UnitedStatesAirForce";

    // publist
    const publistUrl = `https://graph.facebook.com/v19.0/${
      process.env.page_id
    }/video_reels?access_token=${process.env.page_access_tocken}&video_id=${
      getVideoId.video_id
    }&upload_phase=finish&video_state=PUBLISHED&description=${
      getUplodedVideoLink?.description
        ? getUplodedVideoLink?.description
        : hashtag
    }`;

    const finalResultRes = await fetch(publistUrl, {
      method: "POST",
    });
    const finalResult = await finalResultRes.json();

    if (!finalResult.success) {
      console.log("Video publist field");
      return res.status(500).json({
        success: false,
        message: "Video publist field",
      });
      
    }

    console.log("Publistd video in fb");

    const uploadResult = await FaebookUpload.create({
      videoUrl: getUplodedVideoLink.videoUrl,
    });

    if (!uploadResult?._id) {
      console.log("Video publist but database not saved uploaded data");
      return res.status(500).json({
        success: false,
        message: "Video publist but database not saved uploaded data",
      });
      
    }

    console.log("save publistd data");

    const deleteUploadVideoLink = await Video.findByIdAndDelete(
      getUplodedVideoLink?._id
    );

    console.log(deleteUploadVideoLink);

    if (!deleteUploadVideoLink?._id) {
      console.log(
        "Video publist and database saved uploaded data but not delete upload video link "
      );
      return res.status(500).json({
        success: false,
        deleteUploadVideoLink,
        message:
          "Video publist and database saved uploaded data but not delete upload video link ",
      });
      
    }

    console.log("delete data");
    const videoDeleteResult = await cloudinaryVideoDelete(
      getUplodedVideoLink.public_id
    );
    if (videoDeleteResult?.result != "ok") {
      console.log(
        "Video publist and database saved uploaded data but not delete upload video link abd deketed "
      );
      return res.status(500).json({
        success: false,

        message:
          "Video publist and database saved uploaded data but not delete upload video link  abd deketed",
      });
      
    }

    return res.status(200).json({
      success: true,
      message: `video uplode successfull vedio id is ***********`,
    });
  } catch (error) {
    console.log(error);

    console.log("expawar ");

    res.status(500);
    next(error);
  }
};
