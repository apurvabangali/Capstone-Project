const blogData = require("../model/blog.model");
const userData = require("../model/user.model");
const db = require("../model");
const fs = require("fs");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const date = require('date-and-time')
const status = require("http-status");
const APIResponse = require("../helpers/APIResponse");
const url = "http://127.0.0.1:8000";

// Blog Insert //
exports.blogInsert = async (req, res) => {
    try {
        if(req.body.category === ""){
            return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json(new APIResponse("File Is Undefined", true, 404));
        }else{
            if (req.file == undefined)  {
                return res
                    .status(status.INTERNAL_SERVER_ERROR)
                    .json(new APIResponse("File Is Undefined", true, 404));
            } else {
                sourceId = req.params.id;
                const bData = await blogData.findOne({ source_id: sourceId });
    
                if (bData === null) {
                    const title = req.body.title;
                    const image = `${url}/image/${req.file.filename}`;
                    const path = req.file.path;
                    const discription = req.body.discription;
                    const category = req.body.category;
                    const now = new Date();
                    const createDate = date.format(now, 'YYYY/MM/DD HH:mm:ss');
    
                    const data = new blogData({
                        source_id: sourceId,
                        blog: [{
                            title,
                            image,
                            path,
                            discription,
                            category,
                            createDate,
                        },],
                    });
                    await data.save();
                    return res
                        .status(status.OK)
                        .json(new APIResponse("Blog Data Insert", false, 200, data));
                } else {
                    const com = sourceId.toString() === bData.source_id.toString();
    
                    const title = req.body.title;
                    const image = `${url}/image/${req.file.filename}`;
                    const path = req.file.path;
                    const discription = req.body.discription;
                    const category = req.body.category;
                    const now = new Date();
                    const createDate = date.format(now, 'YYYY/MM/DD HH:mm:ss');
    
                    if (com === false) {
                        const data = new blogData({
                            source_id: sourceId,
                            blog: [{
                                title,
                                image,
                                path,
                                discription,
                                category,
                                createDate,
                            },],
                        });
                        await data.save();
                        return res
                            .status(status.OK)
                            .json(new APIResponse("Blog Data Insert", false, 200, data));
                    } else {
                        const title = req.body.title;
                        const image = `${url}/image/${req.file.filename}`;
                        const path = req.file.path;
                        const discription = req.body.discription;
                        const category = req.body.category;
                        const now = new Date();
                        const createDate = date.format(now, 'YYYY/MM/DD HH:mm:ss');
    
                        const data = await blogData.findByIdAndUpdate({
                            _id: bData._id.toString(),
                        }, {
                            $push: {
                                blog: {
                                    title,
                                    image,
                                    path,
                                    discription,
                                    category,
                                    createDate,
                                },
                            },
                        }, { new: true });
                        return res
                            .status(status.OK)
                            .json(new APIResponse("Blog Data Insert", false, 200, data));
                    }
                }
            }
        }
        
    } catch (error) {
        return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json(new APIResponse("Blog Not Inserted", true, 400, error.message));
    }
};

// View All Blog //
exports.ViewAll = async (req, res) => {
    try {
        const datas = await blogData.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "source_id",
                    foreignField: "_id",
                    as: "userdata",
                },
            },
            { $unwind: "$blog" },
            { $unwind: "$userdata" },
            {
                $lookup: {
                    from: "comments",
                    localField: "blog._id",
                    foreignField: "blog_id",
                    as: "comment",
                },
            },
            {
                $group: {
                    _id: { blog: "$blog", user: "$userdata.name", comment: { $cond: { if: { $isArray: "$comment" }, then: { $size: "$comment" }, else: "NA" } } },
                },
            },
        ]);

        const data = [];
        datas.map((ele) => {
            data.push(ele._id);
        });

        function custom_sort(a, b) {
            return (
                new Date(b.blog.createDate).getTime() -
                new Date(a.blog.createDate).getTime()
            );
        }
        const new_data = data.sort(custom_sort);

        return res
            .status(status.OK)
            .json(new APIResponse("Blog Display", false, 200, data));
    } catch (error) {
        return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json(new APIResponse("Blog Not Display", true, 400, error.message));
    }
};

// View All Painding Blog // 
exports.viewPending = async (req, res) => {
    try {
        const datas = await blogData.aggregate([{
            $lookup: {
                from: "users",
                localField: "source_id",
                foreignField: "_id",
                as: "userdata",
            },
        },
        { $unwind: "$blog" },
        { $unwind: "$userdata" },
        {
            $match: {
                'blog.status': 'pending'
            }
        },
        {
            $lookup: {
                from: "comments",
                localField: "blog._id",
                foreignField: "blog_id",
                as: "comment",
            },
        },
        {
            $group: {
                _id: { blog: "$blog", user: "$userdata.name", comment: { $cond: { if: { $isArray: "$comment" }, then: { $size: "$comment" }, else: "NA" } } },
            },
        },
        ]);

        const data = [];
        datas.map((ele) => {
            data.push(ele._id);
        });

        function custom_sort(a, b) {
            return (
                new Date(b.blog.createDate).getTime() -
                new Date(a.blog.createDate).getTime()
            );
        }
        const new_data = data.sort(custom_sort);

        return res
            .status(status.OK)
            .json(new APIResponse("Blog Display", false, 200, data));
    } catch (error) {
        return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json(new APIResponse("Blog Not Display", true, 400, error.message));
    }
}

// View All Verify Blog // 
exports.viewVerify = async (req, res) => {
    try {
        const datas = await blogData.aggregate([{
            $lookup: {
                from: "users",
                localField: "source_id",
                foreignField: "_id",
                as: "userdata",
            },
        },
        { $unwind: "$blog" },
        { $unwind: "$userdata" },
        {
            $match: {
                'blog.status': 'verified'
            }
        },
        {
            $lookup: {
                from: "comments",
                localField: "blog._id",
                foreignField: "blog_id",
                as: "comment",
            },
        },
        {
            $group: {
                _id: { blog: "$blog", user: "$userdata.name", comment: { $cond: { if: { $isArray: "$comment" }, then: { $size: "$comment" }, else: "NA" } } },
            },
        },
        ]);

        const data = [];
        datas.map((ele) => {
            data.push(ele._id);
        });

        function custom_sort(a, b) {
            return (
                new Date(b.blog.createDate).getTime() -
                new Date(a.blog.createDate).getTime()
            );
        }
        const new_data = data.sort(custom_sort);

        return res
            .status(status.OK)
            .json(new APIResponse("Blog Display", false, 200, data));
    } catch (error) {
        return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json(new APIResponse("Blog Not Display", true, 400, error.message));
    }
}

// View All Unverify Blog // 
exports.viewUnverify = async (req, res) => {
    try {
        const datas = await blogData.aggregate([{
            $lookup: {
                from: "users",
                localField: "source_id",
                foreignField: "_id",
                as: "userdata",
            },
        },
        { $unwind: "$blog" },
        { $unwind: "$userdata" },
        {
            $match: {
                'blog.status': 'unverified'
            }
        },
        {
            $lookup: {
                from: "comments",
                localField: "blog._id",
                foreignField: "blog_id",
                as: "comment",
            },
        },
        {
            $group: {
                _id: { blog: "$blog", user: "$userdata.name", comment: { $cond: { if: { $isArray: "$comment" }, then: { $size: "$comment" }, else: "NA" } } },
            },
        },
        ]);

        const data = [];

        datas.map((ele) => {
            data.push(ele._id);
        });

        function custom_sort(a, b) {
            return (
                new Date(b.blog.createDate).getTime() -
                new Date(a.blog.createDate).getTime()
            );
        }
        const new_data = data.sort(custom_sort);

        return res
            .status(status.OK)
            .json(new APIResponse("Blog Display", false, 200, data));
    } catch (error) {
        return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json(new APIResponse("Blog Not Display", true, 400, error.message));
    }
}

// View Particular User All Blog //
exports.viewUserBlog = async (req, res) => {
    try {
        source_id = req.params.id;

        const datas = await blogData.aggregate([{
            $lookup: {
                from: "users",
                localField: "source_id",
                foreignField: "_id",
                as: "userdata",
            },
        },
        { $unwind: "$blog" },
        { $unwind: "$userdata" },
        {
            $match: {
                source_id: ObjectId(req.params.id),
            },
        },
        {
            $lookup: {
                from: "comments",
                localField: "blog._id",
                foreignField: "blog_id",
                as: "comment",
            },
        },
        {
            $group: {
                _id: { blog: "$blog", user: "$userdata.name", comment: { $cond: { if: { $isArray: "$comment" }, then: { $size: "$comment" }, else: "NA" } } },
            },
        },
        ]);
        const data = [];
        datas.map((ele) => {
            data.push(ele._id);
        });

        function custom_sort(a, b) {
            return (
                new Date(b.blog.createDate).getTime() -
                new Date(a.blog.createDate).getTime()
            );
        }
        const new_data = data.sort(custom_sort);

        return res
            .status(status.OK)
            .json(new APIResponse("Blog Display", false, 200, data));
    } catch (error) {
        return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json(new APIResponse("Blog Not Display", true, 400, error.message));
    }
};

// View Particular Blog //
exports.viewBlog = async (req, res) => {
    try {
        const datas = await blogData.aggregate([{
            $lookup: {
                from: "users",
                localField: "source_id",
                foreignField: "_id",
                as: "userdata",
            },
        },
        { $unwind: "$userdata" },
        { $unwind: "$blog" },
        {
            $match: {
                "blog._id": ObjectId(req.params.id),
            },
        },
        {
            $lookup: {
                from: "comments",
                localField: "blog._id",
                foreignField: "blog_id",
                as: "comment",
            },
        },
        {
            $group: {
                _id: { blog: "$blog", user: "$userdata.name", comment: { $cond: { if: { $isArray: "$comment" }, then: { $size: "$comment" }, else: "NA" } } },
            },
        },
        ]);

        const data = [];
        datas.map((ele) => {
            data.push(ele._id);
        });

        return res
            .status(status.OK)
            .json(new APIResponse("Blog Display", false, 200, data));
    } catch (error) {
        return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json(new APIResponse("Blog Not Display", true, 400, error.message));
    }
};

// View News Category Blogs //
exports.viewNews = async (req, res) => {
    try {
        const datas = await blogData.aggregate([{
            $lookup: {
                from: "users",
                localField: "source_id",
                foreignField: "_id",
                as: "userdata",
            },
        },
        { $unwind: "$blog" },
        { $unwind: "$userdata" },
        {
            $match: {
                'blog.category': 'news',
                'blog.status': 'verified',
            }
        },
        {
            $lookup: {
                from: "comments",
                localField: "blog._id",
                foreignField: "blog_id",
                as: "comment",
            },
        },
        {
            $group: {
                _id: { blog: "$blog", user: "$userdata.name", comment: { $cond: { if: { $isArray: "$comment" }, then: { $size: "$comment" }, else: "NA" } } },
            },
        },
        ]);

        const data = [];

        datas.map((ele) => {
            data.push(ele._id);
        });

        function custom_sort(a, b) {
            return (
                new Date(b.blog.createDate).getTime() -
                new Date(a.blog.createDate).getTime()
            );
        }
        const new_data = data.sort(custom_sort);

        return res
            .status(status.OK)
            .json(new APIResponse("Blog Display", false, 200, data));
    } catch (error) {
        return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json(new APIResponse("Blog Not Display", true, 400, error.message));
    }
}

// View Sport Category Blogs //
exports.viewSport = async (req, res) => {
    try {
        const datas = await blogData.aggregate([{
            $lookup: {
                from: "users",
                localField: "source_id",
                foreignField: "_id",
                as: "userdata",
            },
        },
        { $unwind: "$blog" },
        { $unwind: "$userdata" },
        {
            $match: {
                'blog.category': 'sport',
                'blog.status': 'verified',
            }
        },
        {
            $lookup: {
                from: "comments",
                localField: "blog._id",
                foreignField: "blog_id",
                as: "comment",
            },
        },
        {
            $group: {
                _id: { blog: "$blog", user: "$userdata.name", comment: { $cond: { if: { $isArray: "$comment" }, then: { $size: "$comment" }, else: "NA" } } },
            },
        },
        ]);

        const data = [];

        datas.map((ele) => {
            data.push(ele._id);
        });

        function custom_sort(a, b) {
            return (
                new Date(b.blog.createDate).getTime() -
                new Date(a.blog.createDate).getTime()
            );
        }
        const new_data = data.sort(custom_sort);

        return res
            .status(status.OK)
            .json(new APIResponse("Blog Display", false, 200, data));
    } catch (error) {
        return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json(new APIResponse("Blog Not Display", true, 400, error.message));
    }
}

// View Codding Category Blogs //
exports.viewCoding = async (req, res) => {
    try {
        const datas = await blogData.aggregate([{
            $lookup: {
                from: "users",
                localField: "source_id",
                foreignField: "_id",
                as: "userdata",
            },
        },
        { $unwind: "$blog" },
        { $unwind: "$userdata" },
        {
            $match: {
                'blog.category': 'coding',
                'blog.status': 'verified',
            }
        },
        {
            $lookup: {
                from: "comments",
                localField: "blog._id",
                foreignField: "blog_id",
                as: "comment",
            },
        },
        {
            $group: {
                _id: { blog: "$blog", user: "$userdata.name", comment: { $cond: { if: { $isArray: "$comment" }, then: { $size: "$comment" }, else: "NA" } } },
            },
        },
        ]);

        const data = [];

        datas.map((ele) => {
            data.push(ele._id);
        });

        function custom_sort(a, b) {
            return (
                new Date(b.blog.createDate).getTime() -
                new Date(a.blog.createDate).getTime()
            );
        }
        const new_data = data.sort(custom_sort);

        return res
            .status(status.OK)
            .json(new APIResponse("Blog Display", false, 200, data));
    } catch (error) {
        return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json(new APIResponse("Blog Not Display", true, 400, error.message));
    }
}

// View Other Category Blogs //
exports.viewOther = async (req, res) => {
    try {
        const datas = await blogData.aggregate([{
            $lookup: {
                from: "users",
                localField: "source_id",
                foreignField: "_id",
                as: "userdata",
            },
        },
        { $unwind: "$blog" },
        { $unwind: "$userdata" },
        {
            $match: {
                'blog.category': 'other',
                'blog.status': 'verified',
            },

        },
        {
            $lookup: {
                from: "comments",
                localField: "blog._id",
                foreignField: "blog_id",
                as: "comment",
            },
        },
        {
            $group: {
                _id: { blog: "$blog", user: "$userdata.name", comment: { $cond: { if: { $isArray: "$comment" }, then: { $size: "$comment" }, else: "NA" } } },
            },
        },
        ]);

        const data = [];

        datas.map((ele) => {
            data.push(ele._id);
        });

        function custom_sort(a, b) {
            return (
                new Date(b.blog.createDate).getTime() -
                new Date(a.blog.createDate).getTime()
            );
        }
        const new_data = data.sort(custom_sort);

        return res
            .status(status.OK)
            .json(new APIResponse("Blog Display", false, 200, data));
    } catch (error) {
        return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json(new APIResponse("Blog Not Display", true, 400, error.message));
    }
}


// Search Blog For News //
exports.searchNews = async (req, res) => {
    try {
        keyword = req.body.keyword;

        if (keyword == "") {
            return res
                .status(status.INTERNAL_SERVER_ERROR)
                .json(new APIResponse("Please Write Something", true, 400));
        } else {
            const datas = await blogData.aggregate([{
                $lookup: {
                    from: "users",
                    localField: "source_id",
                    foreignField: "_id",
                    as: "userdata",
                },
            },
            { $unwind: "$blog" },
            { $unwind: "$userdata" },
            {
                $match: {
                    'blog.status': 'verified',
                    'blog.category':'news',
                    $or: [{
                        "blog.title": { $regex: `${keyword}` },
                    },
                    {
                        "blog.discription": { $regex: `${keyword}` },
                    },
                    {
                        "blog.category": { $regex: `${keyword}` },
                    },
                    {
                        "userdata.name": { $regex: `${keyword}` },
                    },
                    ],
                },
            },
            {
                $lookup: {
                    from: "comments",
                    localField: "blog._id",
                    foreignField: "blog_id",
                    as: "comment",
                },
            },
            {
                $group: {
                    _id: { blog: "$blog", user: "$userdata.name", comment: { $cond: { if: { $isArray: "$comment" }, then: { $size: "$comment" }, else: "NA" } } },
                },
            },
            ]);

            const data = [];

            datas.map((ele) => {
                data.push(ele._id);
            });

            return res
                .status(status.OK)
                .json(new APIResponse("Blog Search Successfully", false, 200, data));
        }
    } catch (error) {
        return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json(new APIResponse("Something Went Wrong", true, 400, error.message));
    }
};

// Search Blog For Sport //
exports.searchSport = async (req, res) => {
    try {
        keyword = req.body.keyword;

        if (keyword == "") {
            return res
                .status(status.INTERNAL_SERVER_ERROR)
                .json(new APIResponse("Please Write Something", true, 400));
        } else {
            const datas = await blogData.aggregate([{
                $lookup: {
                    from: "users",
                    localField: "source_id",
                    foreignField: "_id",
                    as: "userdata",
                },
            },
            { $unwind: "$blog" },
            { $unwind: "$userdata" },
            {
                $match: {
                    'blog.status': 'verified',
                    'blog.category':'sport',
                    $or: [{
                        "blog.title": { $regex: `${keyword}` },
                    },
                    {
                        "blog.discription": { $regex: `${keyword}` },
                    },
                    {
                        "blog.category": { $regex: `${keyword}` },
                    },
                    {
                        "userdata.name": { $regex: `${keyword}` },
                    },
                    ],
                },
            },
            {
                $lookup: {
                    from: "comments",
                    localField: "blog._id",
                    foreignField: "blog_id",
                    as: "comment",
                },
            },
            {
                $group: {
                    _id: { blog: "$blog", user: "$userdata.name", comment: { $cond: { if: { $isArray: "$comment" }, then: { $size: "$comment" }, else: "NA" } } },
                },
            },
            ]);

            const data = [];

            datas.map((ele) => {
                data.push(ele._id);
            });

            return res
                .status(status.OK)
                .json(new APIResponse("Blog Search Successfully", false, 200, data));
        }
    } catch (error) {
        return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json(new APIResponse("Something Went Wrong", true, 400, error.message));
    }
};

// Search Blog For Coding//
exports.searchCodding = async (req, res) => {
    try {
        keyword = req.body.keyword;

        if (keyword == "") {
            return res
                .status(status.INTERNAL_SERVER_ERROR)
                .json(new APIResponse("Please Write Something", true, 400));
        } else {
            const datas = await blogData.aggregate([{
                $lookup: {
                    from: "users",
                    localField: "source_id",
                    foreignField: "_id",
                    as: "userdata",
                },
            },
            { $unwind: "$blog" },
            { $unwind: "$userdata" },
            {
                $match: {
                    'blog.status': 'verified',
                    'blog.category':'coding',
                    $or: [{
                        "blog.title": { $regex: `${keyword}` },
                    },
                    {
                        "blog.discription": { $regex: `${keyword}` },
                    },
                    {
                        "blog.category": { $regex: `${keyword}` },
                    },
                    {
                        "userdata.name": { $regex: `${keyword}` },
                    },
                    ],
                },
            },
            {
                $lookup: {
                    from: "comments",
                    localField: "blog._id",
                    foreignField: "blog_id",
                    as: "comment",
                },
            },
            {
                $group: {
                    _id: { blog: "$blog", user: "$userdata.name", comment: { $cond: { if: { $isArray: "$comment" }, then: { $size: "$comment" }, else: "NA" } } },
                },
            },
            ]);

            const data = [];

            datas.map((ele) => {
                data.push(ele._id);
            });

            return res
                .status(status.OK)
                .json(new APIResponse("Blog Search Successfully", false, 200, data));
        }
    } catch (error) {
        return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json(new APIResponse("Something Went Wrong", true, 400, error.message));
    }
};

// Search Blog For Other//
exports.searchOther = async (req, res) => {
    try {
        keyword = req.body.keyword;

        if (keyword == "") {
            return res
                .status(status.INTERNAL_SERVER_ERROR)
                .json(new APIResponse("Please Write Something", true, 400));
        } else {
            const datas = await blogData.aggregate([{
                $lookup: {
                    from: "users",
                    localField: "source_id",
                    foreignField: "_id",
                    as: "userdata",
                },
            },
            { $unwind: "$blog" },
            { $unwind: "$userdata" },
            {
                $match: {
                    'blog.status': 'verified',
                    'blog.category':'other',
                    $or: [{
                        "blog.title": { $regex: `${keyword}` },
                    },
                    {
                        "blog.discription": { $regex: `${keyword}` },
                    },
                    {
                        "blog.category": { $regex: `${keyword}` },
                    },
                    {
                        "userdata.name": { $regex: `${keyword}` },
                    },
                    ],
                },
            },
            {
                $lookup: {
                    from: "comments",
                    localField: "blog._id",
                    foreignField: "blog_id",
                    as: "comment",
                },
            },
            {
                $group: {
                    _id: { blog: "$blog", user: "$userdata.name", comment: { $cond: { if: { $isArray: "$comment" }, then: { $size: "$comment" }, else: "NA" } } },
                },
            },
            ]);

            const data = [];

            datas.map((ele) => {
                data.push(ele._id);
            });

            return res
                .status(status.OK)
                .json(new APIResponse("Blog Search Successfully", false, 200, data));
        }
    } catch (error) {
        return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json(new APIResponse("Something Went Wrong", true, 400, error.message));
    }
};



// Top 5 Short News Blog For Slide Bar //
exports.sortNews = async (req, res) => {
    try {
        const datas = await blogData.aggregate([{
            $lookup: {
                from: "users",
                localField: "source_id",
                foreignField: "_id",
                as: "userdata",
            },
        },
        { $unwind: "$blog" },
        { $unwind: "$userdata" },
        {
            $match: {
                'blog.status': 'verified',
                'blog.category':'news',
            }
        },
        {
            $lookup: {
                from: "comments",
                localField: "blog._id",
                foreignField: "blog_id",
                as: "comment",
            },
        },
        {
            $group: {
                _id: { blog: "$blog", user: "$userdata.name", comment: { $cond: { if: { $isArray: "$comment" }, then: { $size: "$comment" }, else: "NA" } } },
            },
        },
        ]);

        const detail = [];

        datas.map((ele) => {
            detail.push(ele._id);
        });

        function custom_sort(a, b) {
            return (
                new Date(b.blog.createDate).getTime() -
                new Date(a.blog.createDate).getTime()
            );
        }
        const new_data = detail.sort(custom_sort);
        const data = detail.slice(0, 5);

        return res
            .status(status.OK)
            .json(new APIResponse("TOP 5 Blog Display", false, 200, data));
    } catch (error) {
        return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json(
                new APIResponse("TOP 5 Blog Not Display", true, 400, error.message)
            );
    }
};

// Top 5 Short Sport Blog For Slide Bar //
exports.sortSport = async (req, res) => {
    try {
        const datas = await blogData.aggregate([{
            $lookup: {
                from: "users",
                localField: "source_id",
                foreignField: "_id",
                as: "userdata",
            },
        },
        { $unwind: "$blog" },
        { $unwind: "$userdata" },
        {
            $match: {
                'blog.status': 'verified',
                'blog.category':'sport',
            }
        },
        {
            $lookup: {
                from: "comments",
                localField: "blog._id",
                foreignField: "blog_id",
                as: "comment",
            },
        },
        {
            $group: {
                _id: { blog: "$blog", user: "$userdata.name", comment: { $cond: { if: { $isArray: "$comment" }, then: { $size: "$comment" }, else: "NA" } } },
            },
        },
        ]);

        const detail = [];

        datas.map((ele) => {
            detail.push(ele._id);
        });

        function custom_sort(a, b) {
            return (
                new Date(b.blog.createDate).getTime() -
                new Date(a.blog.createDate).getTime()
            );
        }
        const new_data = detail.sort(custom_sort);
        const data = detail.slice(0, 5);

        return res
            .status(status.OK)
            .json(new APIResponse("TOP 5 Blog Display", false, 200, data));
    } catch (error) {
        return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json(
                new APIResponse("TOP 5 Blog Not Display", true, 400, error.message)
            );
    }
};

// Top 5 Short coding Blog For Slide Bar //
exports.sortCoding = async (req, res) => {
    try {
        const datas = await blogData.aggregate([{
            $lookup: {
                from: "users",
                localField: "source_id",
                foreignField: "_id",
                as: "userdata",
            },
        },
        { $unwind: "$blog" },
        { $unwind: "$userdata" },
        {
            $match: {
                'blog.status': 'verified',
                'blog.category':'coding',
            }
        },
        {
            $lookup: {
                from: "comments",
                localField: "blog._id",
                foreignField: "blog_id",
                as: "comment",
            },
        },
        {
            $group: {
                _id: { blog: "$blog", user: "$userdata.name", comment: { $cond: { if: { $isArray: "$comment" }, then: { $size: "$comment" }, else: "NA" } } },
            },
        },
        ]);

        const detail = [];

        datas.map((ele) => {
            detail.push(ele._id);
        });

        function custom_sort(a, b) {
            return (
                new Date(b.blog.createDate).getTime() -
                new Date(a.blog.createDate).getTime()
            );
        }
        const new_data = detail.sort(custom_sort);
        const data = detail.slice(0, 5);

        return res
            .status(status.OK)
            .json(new APIResponse("TOP 5 Blog Display", false, 200, data));
    } catch (error) {
        return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json(
                new APIResponse("TOP 5 Blog Not Display", true, 400, error.message)
            );
    }
};

// Top 5 Short Other Blog For Slide Bar //
exports.sortOther = async (req, res) => {
    try {
        const datas = await blogData.aggregate([{
            $lookup: {
                from: "users",
                localField: "source_id",
                foreignField: "_id",
                as: "userdata",
            },
        },
        { $unwind: "$blog" },
        { $unwind: "$userdata" },
        {
            $match: {
                'blog.status': 'verified',
                'blog.category':'other',
            }
        },
        {
            $lookup: {
                from: "comments",
                localField: "blog._id",
                foreignField: "blog_id",
                as: "comment",
            },
        },
        {
            $group: {
                _id: { blog: "$blog", user: "$userdata.name", comment: { $cond: { if: { $isArray: "$comment" }, then: { $size: "$comment" }, else: "NA" } } },
            },
        },
        ]);

        const detail = [];

        datas.map((ele) => {
            detail.push(ele._id);
        });

        function custom_sort(a, b) {
            return (
                new Date(b.blog.createDate).getTime() -
                new Date(a.blog.createDate).getTime()
            );
        }
        const new_data = detail.sort(custom_sort);
        const data = detail.slice(0, 5);

        return res
            .status(status.OK)
            .json(new APIResponse("TOP 5 Blog Display", false, 200, data));
    } catch (error) {
        return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json(
                new APIResponse("TOP 5 Blog Not Display", true, 400, error.message)
            );
    }
};

// Blog Delete //
exports.blogDelete = async (req, res) => {
    try {
        let blog_id = req.params.id;
        let query1 = { "blog._id": blog_id },
            update1 = { $pull: { blog: { _id: blog_id } } },
            options1 = { new: true },
            imgDelete = { _id: 0, blog: { $elemMatch: { _id: blog_id } } };

        const deleteImage = await blogData.find(query1, imgDelete);

        const datas = [];
        deleteImage.map((ele) => {
            ele.blog.map((inele) => {
                datas.push(inele);
            });
        });

        const imagePath = datas[0].path;
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error("Image Path Error In Delete ==>", err);
                return;
            }
        });

        const data = await blogData.updateOne(query1, update1, options1);
        return res
            .status(status.OK)
            .json(new APIResponse("Blog Delete", false, 200, data));
    } catch (error) {
        return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json(new APIResponse("Blog Not Delete", true, 400, error.message));
    }
};

// Blog Update //
// exports.blogUpdate = async(req, res) => {
//     try {
//         let blog_id = req.params.id;

//         const title = req.body.title;
//         const image = `${url}/image/${req.file.filename}`;
//         const path = req.file.path;
//         const discription = req.body.discription;

//         let query1 = { "blog._id": blog_id },
//             update1 = {
//                 $set: {
//                     "blog.$.title": title,
//                     "blog.$.image": image,
//                     "blog.$.path": path,
//                     "blog.$.discription": discription,
//                 },
//             },
//             options1 = { new: true };
//         imgDelete = { _id: 0, blog: { $elemMatch: { _id: blog_id } } };

//         const deleteImage = await blogData.find(query1, imgDelete);

//         const datas = [];
//         deleteImage.map((ele) => {
//             ele.blog.map((inele) => {
//                 datas.push(inele);
//             });
//         });

//         const imagePath = datas[0].path;
//         fs.unlink(imagePath, (err) => {
//             if (err) {
//                 console.error("Image Path Error In Delete ==>", err);
//                 return;
//             }
//         });

//         const data = await blogData.updateOne(query1, update1, options1);
//         return res
//             .status(status.OK)
//             .json(new APIResponse("Blog Delete", false, 200, data));
//     } catch (error) {
//         console.log(error);
//         return res
//             .status(status.INTERNAL_SERVER_ERROR)
//             .json(new APIResponse("Blog Not Delete", true, 400, error.message));
//     }
// };

// Blog Update //
exports.blogUpdate = async (req, res) => {
    try {
        let blog_id = req.params.id;
        const title = req.body.title;
        const discription = req.body.discription;
        const category = req.body.category;
        let query1 = { "blog._id": blog_id },
            update1 = {
                $set: {
                    "blog.$.title": title,
                    "blog.$.discription": discription,
                    "blog.$.category": category,
                    "blog.$.status": 'pending'
                },
            },
            options1 = { new: true };
        const deleteImage = await blogData.find(query1);

        const datas = [];
        deleteImage.map((ele) => {
            ele.blog.map((inele) => {
                datas.push(inele);
            });
        });

        const data = await blogData.updateOne(query1, update1, options1);
        return res
            .status(status.OK)
            .json(new APIResponse("Blog Updated", false, 200, data));
    } catch (error) {
        console.log(error);
        return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json(new APIResponse("Blog Not Updated", true, 400, error.message));
    }
};

// Like Blog //
exports.likeBlog = async (req, res) => {
    try {
        const action = req.body.action;
        const blog_id = req.params.id;

        if (action === 1) {
            if (blog_id) {
                let query1 = { "blog._id": blog_id },
                    update1 = { $inc: { "blog.$.like": +1 } },
                    options1 = { new: true };
                const update = await blogData.updateOne(query1, update1, options1);

                const datas = await blogData.find({ "blog._id": blog_id }, { _id: 0, blog: { $elemMatch: { _id: blog_id } } });

                const data = [];
                datas.map((ele) => {
                    ele.blog.map((inele) => {
                        data.push(inele);
                    });
                });

                return res
                    .status(status.OK)
                    .json(new APIResponse("Like Increase", false, 200, data));
            }
        } else if (action === 0) {
            if (blog_id) {
                let query1 = { "blog._id": blog_id },
                    update1 = { $inc: { "blog.$.like": -1 } },
                    options1 = { new: true };
                const update = await blogData.updateOne(query1, update1, options1);

                const datas = await blogData.find({ "blog._id": blog_id }, { _id: 0, blog: { $elemMatch: { _id: blog_id } } });

                const data = [];
                datas.map((ele) => {
                    ele.blog.map((inele) => {
                        data.push(inele);
                    });
                });

                return res
                    .status(status.OK)
                    .json(new APIResponse("Like Dicrease", false, 200, data));
            }
        } else {
            return res
                .status(status.INTERNAL_SERVER_ERROR)
                .json(new APIResponse("Give Proper Value", true, 404));
        }
    } catch (error) {
        return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json(new APIResponse("Something Went Wrong", true, 400, error.message));
    }
};

// Top 5 Blog //
exports.topBlog = async (req, res) => {
    try {
        const datas = await blogData.aggregate([{
            $lookup: {
                from: "users",
                localField: "source_id",
                foreignField: "_id",
                as: "userdata",
            },
        },
        { $unwind: "$blog" },
        { $unwind: "$userdata" },
        {
            $match: {
                'blog.status': 'verified'
            }
        },
        {
            $lookup: {
                from: "comments",
                localField: "blog._id",
                foreignField: "blog_id",
                as: "comment",
            },
        },
        {
            $group: {
                _id: { blog: "$blog", user: "$userdata.name", comment: { $cond: { if: { $isArray: "$comment" }, then: { $size: "$comment" }, else: "NA" } } },
            },
        },
        ]);

        const detail = [];

        datas.map((ele) => {
            detail.push(ele._id);
        });

        function custom_sort(a, b) {
            return (
                new Date(b.blog.createDate).getTime() -
                new Date(a.blog.createDate).getTime()
            );
        }
        const new_data = detail.sort(custom_sort);
        const data = detail.slice(0, 5);

        return res
            .status(status.OK)
            .json(new APIResponse("TOP 5 Blog Display", false, 200, data));
    } catch (error) {
        return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json(
                new APIResponse("TOP 5 Blog Not Display", true, 400, error.message)
            );
    }
};

// Search API For Top 5 Blog //
exports.topSearch = async (req, res) => {
    try {
        const datas = await blogData.aggregate([{
            $lookup: {
                from: "users",
                localField: "source_id",
                foreignField: "_id",
                as: "userdata",
            },
        },
        { $unwind: "$blog" },
        { $unwind: "$userdata" },
        {
            $match: {
                'blog.status': 'verified',
            }
        },
        {
            $lookup: {
                from: "comments",
                localField: "blog._id",
                foreignField: "blog_id",
                as: "comment",
            },
        },
        {
            $group: {
                _id: { blog: "$blog", user: "$userdata.name", comment: { $cond: { if: { $isArray: "$comment" }, then: { $size: "$comment" }, else: "NA" } } },
            },
        },
        ]);

        const detail = [];

        datas.map((ele) => {
            detail.push(ele._id);
        });

        function custom_sort(a, b) {
            return (
                new Date(b.blog.createDate).getTime() -
                new Date(a.blog.createDate).getTime()
            );
        }
        const new_data = detail.sort(custom_sort);
        const serVal = detail.slice(0, 5);

        const keyword = req.body.keyword

        function isCherries(ele) {
            return ele.blog.title === keyword || ele.blog.discription === keyword || ele.user === keyword;
        }

        const data = serVal.find(isCherries);

        // console.log("------->", serVal.find(isCherries));

        return res
            .status(status.OK)
            .json(new APIResponse("TOP 5 Blog Display", false, 200, data));
    } catch (error) {
        return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json(
                new APIResponse("TOP 5 Blog Not Display", true, 400, error.message)
            );
    }
};


// Top 5 Short Blog For Slide Bar //
exports.topShortBlog = async (req, res) => {
    try {
        const datas = await blogData.aggregate([{
            $lookup: {
                from: "users",
                localField: "source_id",
                foreignField: "_id",
                as: "userdata",
            },
        },
        { $unwind: "$blog" },
        { $unwind: "$userdata" },
        {
            $match: {
                'blog.status': 'verified'
            }
        },
        {
            $lookup: {
                from: "comments",
                localField: "blog._id",
                foreignField: "blog_id",
                as: "comment",
            },
        },
        {
            $group: {
                _id: { blog: "$blog", user: "$userdata.name", comment: { $cond: { if: { $isArray: "$comment" }, then: { $size: "$comment" }, else: "NA" } } },
            },
        },
        ]);

        const detail = [];

        datas.map((ele) => {
            detail.push(ele._id);
        });

        function custom_sort(a, b) {
            return (
                new Date(b.blog.createDate).getTime() -
                new Date(a.blog.createDate).getTime()
            );
        }
        const new_data = detail.sort(custom_sort);
        const data = detail.slice(0, 5);

        return res
            .status(status.OK)
            .json(new APIResponse("TOP 5 Blog Display", false, 200, data));
    } catch (error) {
        return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json(
                new APIResponse("TOP 5 Blog Not Display", true, 400, error.message)
            );
    }
};

// Search Blog //
exports.searchBlog = async (req, res) => {
    try {
        keyword = req.body.keyword;

        if (keyword == "") {
            return res
                .status(status.INTERNAL_SERVER_ERROR)
                .json(new APIResponse("Please Write Something", true, 400));
        } else {
            const datas = await blogData.aggregate([{
                $lookup: {
                    from: "users",
                    localField: "source_id",
                    foreignField: "_id",
                    as: "userdata",
                },
            },
            { $unwind: "$blog" },
            { $unwind: "$userdata" },
            {
                $match: {
                    'blog.status': 'verified',
                    $or: [{
                        "blog.title": { $regex: `${keyword}` },
                    },
                    {
                        "blog.discription": { $regex: `${keyword}` },
                    },
                    {
                        "blog.category": { $regex: `${keyword}` },
                    },
                    {
                        "userdata.name": { $regex: `${keyword}` },
                    },
                    ],
                },
            },
            {
                $lookup: {
                    from: "comments",
                    localField: "blog._id",
                    foreignField: "blog_id",
                    as: "comment",
                },
            },
            {
                $group: {
                    _id: { blog: "$blog", user: "$userdata.name", comment: { $cond: { if: { $isArray: "$comment" }, then: { $size: "$comment" }, else: "NA" } } },
                },
            },
            ]);

            const data = [];

            datas.map((ele) => {
                data.push(ele._id);
            });

            return res
                .status(status.OK)
                .json(new APIResponse("Blog Search Successfully", false, 200, data));
        }
    } catch (error) {
        return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json(new APIResponse("Something Went Wrong", true, 400, error.message));
    }
};


// Profile Blog Short For Slide Bar //
exports.profileShort = async (req, res) => {
    try {
        source_id = req.params.id;

        const datas = await blogData.aggregate([{
            $lookup: {
                from: "users",
                localField: "source_id",
                foreignField: "_id",
                as: "userdata",
            },
        },
        { $unwind: "$blog" },
        { $unwind: "$userdata" },
        {
            $match: {
                source_id: ObjectId(req.params.id),
                // 'blog.status': 'verified',
            },
        },
        {
            $lookup: {
                from: "comments",
                localField: "blog._id",
                foreignField: "blog_id",
                as: "comment",
            },
        },
        {
            $group: {
                _id: { blog: "$blog", user: "$userdata.name", source_id: source_id, comment: { $cond: { if: { $isArray: "$comment" }, then: { $size: "$comment" }, else: "NA" } } },
            },
        },
        ]);
        const detail = [];

        datas.map((ele) => {
            detail.push(ele._id);
        });

        function custom_sort(a, b) {
            return (
                new Date(b.blog.createDate).getTime() -
                new Date(a.blog.createDate).getTime()
            );
        }
        const new_data = detail.sort(custom_sort);
        const data = detail.slice(0, 5);

        return res
            .status(status.OK)
            .json(new APIResponse("Blog Display", false, 200, data));
    } catch (error) {
        return res
            .status(status.INTERNAL_SERVER_ERROR)
            .json(new APIResponse("Blog Not Display", true, 400, error.message));
    }
};

// Blog Status //0  
exports.blogStatus = async (req, res) => {
    try {
        let blog_id = req.params.id;
        const status = req.body.status;
        console.log(status);

        let query1 = { "blog._id": blog_id },
            update1 = {
                $set: {
                    "blog.$.status": status,
                },
            },
            options1 = { new: true };

        const data = await blogData.updateOne(query1, update1, options1);
        return res.json(new APIResponse("Blog Updated", false, 200, data));
    } catch (error) {
        console.log(error);
        return res.json(new APIResponse("Blog Not Updated", true, 400, error.message));
    }
};