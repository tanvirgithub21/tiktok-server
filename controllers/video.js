import Video from "../models/Video.js";

export const createVideo = async (req, res, next) => {
  const { videoUrl, thumbnail_url, public_id, filenam, description } = req.body || {};

  if (!videoUrl) {
    res.status(400);
    return next(new Error("videoUrl fields are required"));
  }

  try {
    const video = await Video.create({
      videoUrl,
      videoUrl,
      thumbnail_url,
      public_id,
      filenam,
      description
    });

    console.log(video);

    res.status(201).json({
      success: true,
      video,
    });
  } catch (error) {
    console.log(error);
    res.status(500);
    next(error);
  }
};

export const findAllVideo = async (req, res, next) => {
  try {
    const data = await Video.find();
    console.log({ data });
    res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500);
    next(error);
  }
};
