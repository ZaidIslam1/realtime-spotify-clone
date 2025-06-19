import { Song } from "../models/song.model.js";

export const getAllSongs = async (req, res, next) => {
    try {
        const sorted_songs = await Song.find().sort({createdAt: -1}) || null; // -1 = Descending => newest -> oldest, 1 = Ascending => oldest -> newest
        res.status(200).json(sorted_songs);
    } catch (error) {
        console.log("Error in getAllSongs", error);
        next(error);
    }
};

export const getFeaturedSongs = async (req, res, next) => {
    try {
        const featuredSongs = await Song.aggregate([
            {
                $sample: { size: 6},
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    artist: 1,
                    imageUrl: 1,
                    audioUrl: 1,
                }
            }
        ]);
        res.status(200).json(featuredSongs);
    } catch (error) {
        console.log("Error in getFeaturedSongs", error);
        next(error);
    }
};

export const getMadeForYouSongs = async (req, res, next) => {
    try {
        const madeForYouSongs = await Song.aggregate([
            {
                $sample: { size: 4},
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    artist: 1,
                    imageUrl: 1,
                    audioUrl: 1,
                }
            }
        ]);
        res.status(200).json(madeForYouSongs);
    } catch (error) {
        console.log("Error in getMadeForYouSongs", error);
        next(error);
    }
};

export const getTrendingSongs = async (req, res, next) => {
    try {
        const trendingSongs = await Song.aggregate([
            {
                $sample: { size: 4},
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    artist: 1,
                    imageUrl: 1,
                    audioUrl: 1,
                }
            }
        ]);
        res.status(200).json(trendingSongs);
    } catch (error) {
        console.log("Error in getTrendingSongs", error);
        next(error);
    }
};