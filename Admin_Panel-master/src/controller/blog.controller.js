const blogData = require("../module/blog.modul");
const userData = require("../module/user.modul");
const commentData = require("../module/comment.model");
const mongoose = require("mongoose");
const date = require("date-and-time");
const fs = require("fs");
const ObjectId = mongoose.Types.ObjectId;
const status = require("http-status");
const url = "http://localhost:8080";

// Blog Insert //
exports.blogInsert = async (req, res) => {
  try {
    if (req.file == undefined) {
      req.session.message = {
        type: "danger",
        intro: "Image Undefined!",
        message: "Click On Image To Select New Image",
      };
      return res.status(404).redirect("/CreateBlog");
    } else {
      admin = req.adminUser;
      const admindata = await userData.findById({ _id: admin._id });

      sourceId = admindata._id;

      const bData = await blogData.findOne({ source_id: sourceId });
      if (bData === null) {
        const title = req.body.title;
        const image = `${url}/image/${req.file.filename}`;
        const path = req.file.path;
        const discription = req.body.discription;
        const category = req.body.category;
        const now = new Date();
        const createDate = date.format(now, "YYYY/MM/DD HH:mm:ss");

        const data = new blogData({
          source_id: sourceId,
          blog: [
            {
              title,
              image,
              path,
              discription,
              category,
              createDate,
            },
          ],
        });
        await data.save();
        return res.status(200).redirect("/viewVerifyBlog");
      } else {
        const com = sourceId.toString() === bData.source_id.toString();

        const title = req.body.title;
        const image = `${url}/image/${req.file.filename}`;
        const path = req.file.path;
        const discription = req.body.discription;
        const category = req.body.category;
        const now = new Date();
        const createDate = date.format(now, "YYYY/MM/DD HH:mm:ss");

        if (com === false) {
          const data = new blogData({
            source_id: sourceId,
            blog: [
              {
                title,
                image,
                path,
                discription,
                category,
                createDate,
              },
            ],
          });
          await data.save();

          return res.status(200).redirect("/viewVerifyBlog");
        } else {
          const title = req.body.title;
          const image = `${url}/image/${req.file.filename}`;
          const path = req.file.path;
          const discription = req.body.discription;
          const category = req.body.category;
          const now = new Date();
          const createDate = date.format(now, "YYYY/MM/DD HH:mm:ss");

          const data = await blogData.findByIdAndUpdate(
            {
              _id: bData._id.toString(),
            },
            {
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
            },
            { new: true }
          );
          return res.status(200).redirect("/viewVerifyBlog");
        }
      }
    }
  } catch (error) {
    req.session.message = {
      type: "danger",
      intro: "Something Went Wrong!",
      message: "Can Not Insert Blog",
    };
    return res.status(400).redirect("/CreateBlog");
  }
};

// View All Verify Blogs //
exports.ViewAllVerifyBlog = async (req, res) => {
  try {
    admin = req.adminUser;
    const admindata = await userData.findById({ _id: admin._id });

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
        $match: {
          "blog.status": "verified",
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
          _id: {
            blog: "$blog",
            user: "$userdata.name",
            comment: {
              $cond: {
                if: { $isArray: "$comment" },
                then: { $size: "$comment" },
                else: "NA",
              },
            },
          },
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
    // res.status(200).json({data:data})

    return res
      .status(200)
      .render("All_blogs", { records: new_data, admin: admindata });
  } catch (error) {
    req.session.message = {
      type: "danger",
      intro: "Something Went Wrong!",
      message: "Can Not View Verify Blogs",
    };
    return res.status(400).redirect("/Error");
  }
};

// View Pending Unverified And Verified  Blog//
exports.viewUnverify = async (req, res) => {
  try {
    admin = req.adminUser;
    const admindata = await userData.findById({ _id: admin._id });

    //Pending Blogs//
    const pendingBlogs = await blogData.aggregate([
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
        $match: {
          "blog.status": "pending",
        },
      },
      {
        $group: {
          _id: { blog: "$blog", user: "$userdata.name" },
        },
      },
    ]);

    const TpendingBlogs = [];
    pendingBlogs.map((ele) => {
      TpendingBlogs.push(ele._id);
    });
    function custom_sort(a, b) {
      return (
        new Date(b.blog.createDate).getTime() -
        new Date(a.blog.createDate).getTime()
      );
    }
    const new_pending = TpendingBlogs.sort(custom_sort);

    //Unverified //
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
        $match: {
          "blog.status": "unverified",
        },
      },
      {
        $group: {
          _id: { blog: "$blog", user: "$userdata.name" },
        },
      },
    ]);

    const TUnverified = [];
    datas.map((ele) => {
      TUnverified.push(ele._id);
    });

    function custom_sort(a, b) {
      return (
        new Date(b.blog.createDate).getTime() -
        new Date(a.blog.createDate).getTime()
      );
    }
    const new_data = TUnverified.sort(custom_sort);

    //All Verified Blogs//
    const verified = await blogData.aggregate([
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
        $match: {
          "blog.status": "verified",
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
          _id: {
            blog: "$blog",
            user: "$userdata.name",
            comment: {
              $cond: {
                if: { $isArray: "$comment" },
                then: { $size: "$comment" },
                else: "NA",
              },
            },
          },
        },
      },
    ]);

    const data = [];
    verified.map((ele) => {
      data.push(ele._id);
    });

    function custom_sort(a, b) {
      return (
        new Date(b.blog.createDate).getTime() -
        new Date(a.blog.createDate).getTime()
      );
    }
    const verifiedBlog = data.sort(custom_sort);

    return res.status(200).render("ApproveBlog", {
      records: new_pending,
      data: new_data,
      verifiedBlog: verifiedBlog,
      admin: admindata,
    });
  } catch (error) {
    req.session.message = {
      type: "danger",
      intro: "Something Went Wrong!",
      message: "Can Not View Approved Blogs Field",
    };
    return res.status(400).redirect("/Error");
  }
};

// View personal user all Blog //
exports.blogViewAll = async (req, res) => {
  try {
    admin = req.adminUser;
    const admindata = await userData.findById({ _id: admin._id });

    source_id = req.params.id;
    uname = await userData.findById({ _id: source_id });

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
          _id: {
            blog: "$blog",
            user: "$userdata.name",
            comment: {
              $cond: {
                if: { $isArray: "$comment" },
                then: { $size: "$comment" },
                else: "NA",
              },
            },
          },
        },
      },
    ]);
    const data = [];
    datas.map((ele) => {
      data.push(ele._id);
    });

    const blogusername = uname.name;
    function custom_sort(a, b) {
      return (
        new Date(b.blog.createDate).getTime() -
        new Date(a.blog.createDate).getTime()
      );
    }
    const new_data = data.sort(custom_sort);

    if (data[0] == null) {
        req.session.message = {
            type: "danger",
            intro: "Sorry ",
            message: `${blogusername} Don't Have Any Blogs! `,
          };
      return res.status(400).redirect("/Error")
    } else {
      return res.status(200).render("UserAllBlogs", {
        records: new_data,
        admin: admindata,
        username: blogusername,
        source_id: source_id,
      });
    }
  } catch (error) {
    console.log(error);
    req.session.message = {
      type: "danger",
      intro: "Something Went Wrong!",
      message: "Can Not View This Users Blogs ",
    };
    return res.status(400).redirect("/Error");
  }
};

// view perticular user Blog //
exports.blogView = async (req, res) => {
  try {
    admin = req.adminUser;
    const admindata = await userData.findById({ _id: admin._id });

    const datas = await blogData.aggregate([
      {
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
          _id: {
            blog: "$blog",
            user: "$userdata.name",
            comment: {
              $cond: {
                if: { $isArray: "$comment" },
                then: { $size: "$comment" },
                else: "NA",
              },
            },
          },
        },
      },
    ]);

    const data = [];
    datas.map((ele) => {
      data.push(ele._id);
    });

    blog_id = req.params.id;
    const cdata = await commentData
      .find({ blog_id: blog_id })
      .sort({ date: -1 })
      .limit(10);

    return res.render("Blog", {
      records: data,
      admin: admindata,
      cdata: cdata,
    });
  } catch (error) {
    req.session.message = {
      type: "danger",
      intro: "Something Went Wrong!",
      message: "Can Not View This User Blogs ",
    };
    return res.status(400).redirect("/Error");
  }
};

exports.ViewupdateBlog = async (req, res) => {
  try {
    admin = req.adminUser;
    const admindata = await userData.findById({ _id: admin._id });

    const datas = await blogData.aggregate([
      {
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
        $group: {
          _id: { blog: "$blog", user: "$userdata.name" },
        },
      },
    ]);
    const data = [];
    datas.map((ele) => {
      data.push(ele._id);
    });
    blog_id = req.params.id;
    const cdata = await commentData
      .find({ blog_id: blog_id })
      .sort({ date: -1 })
      .limit(10);

    // return res.render('Blog', { records: data, admin: admindata ,cdata:cdata });
    return res.render("EditBlog", {
      records: data,
      admin: admindata,
      cdata: cdata,
    });
  } catch (error) {
    req.session.message = {
      type: "danger",
      intro: "Something Went Wrong!",
      message: "Can Not View Or Edit The Blog  ",
    };
    return res.status(400).redirect("/Error");
  }
};

// Blog Update //
exports.blogUpdate = async (req, res) => {
  try {
    let blog_id = req.params.id;

    if (req.file == undefined) {
      req.session.message = {
        type: "danger",
        intro: "Image Undefined!",
        message: "Please Select Image ",
      };
      return res.status(400).redirect(`/editBlog/${blog_id}`);
    } else {
      
      const title = req.body.title;
  
      const image = `${url}/image/${req.file.filename}`;
      const path = req.file.path;
      const discription = req.body.discription;
      const now = new Date();
      const createDate = date.format(now, "YYYY/MM/DD HH:mm:ss");
  
      let query1 = { "blog._id": blog_id },
        update1 = {
          $set: {
            "blog.$.title": title,
            "blog.$.image": image,
            "blog.$.path": path,
            "blog.$.discription": discription,
            "blog.$.status": "pending",
            "blog.$.createDate": createDate,
          },
        },
        options1 = { new: true };
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
          return;
        }
      });
  
      const data = await blogData.updateOne(query1, update1, options1);
      return res.status(200).redirect("/viewVerifyBlog");
    }
   
  } catch (error) {
    let blog_id = req.params.id;

    req.session.message = {
      type: "danger",
      intro: "Something Went Wrong!",
      message: "Can Not Update This Blogs ",
    };
    return res.status(400).redirect(`/editBlog/${blog_id}`);
  }
};

// Blog Status //
exports.blogStatus = async (req, res) => {
  try {
    let blog_id = req.params.id;
    const status = req.body.status;

    let query1 = { "blog._id": blog_id },
      update1 = {
        $set: {
          "blog.$.status": status,
        },
      },
      options1 = { new: true };

    const data = await blogData.updateOne(query1, update1, options1);
    return res.status(200).redirect("/unverify");
  } catch (error) {
    req.session.message = {
      type: "danger",
      intro: "Something Went Wrong!",
      message: "Can Not Verify Or Unverify Blog ",
    };
    return res.status(400).redirect("/unverify");
  }
};

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
        return;
      }
    });

    const data = await blogData.updateOne(query1, update1, options1);
    return res.status(200).redirect("/viewVerifyBlog");
  } catch (error) {
    req.session.message = {
      type: "danger",
      intro: "Something Went Wrong!",
      message: "Blog Not Deleted ",
    };
    return res.status(400).redirect("/Error");
  }
};

// Top 10 Blog //
exports.topBlog = async (req, res) => {
  try {
    admin = req.adminUser;
    const admindata = await userData.findById({ _id: admin._id });

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
        $match: {
          "blog.status": "verified",
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
          _id: {
            blog: "$blog",
            user: "$userdata.name",
            comment: {
              $cond: {
                if: { $isArray: "$comment" },
                then: { $size: "$comment" },
                else: "NA",
              },
            },
          },
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
    const new_data = detail.sort(custom_sort).slice(0, 10);
    // const data = detail.slice(0, 2);
    return res
      .status(200)
      .render("All_blogs", { records: new_data, admin: admindata });
  } catch (error) {
    req.session.message = {
      type: "danger",
      intro: "Something Went Wrong!",
      message: "Top Blog Not Display  ",
    };
    return res.status(400).redirect("/Error");
  }
};

// Search verify Blog //
exports.searchBlog = async (req, res) => {
  try {
    admin = req.adminUser;
    const admindata = await userData.findById({ _id: admin._id });

    keyword = req.body.keyword;

    if (keyword == "") {
      req.session.message = {
        type: "danger",
        intro: "Empty Field!",
        message: "please Enter Any Keyword ",
      };
      return res.status(400).redirect("/viewVerifyBlog");
    } else {
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
          $match: {
            "blog.status": "verified",
            $or: [
              {
                "blog.title": { $regex: `${keyword}`, $options: "i" },
              },
              {
                "blog.discription": { $regex: `${keyword}`, $options: "i" },
              },
              {
                "userdata.name": { $regex: `${keyword}`, $options: "i" },
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
            _id: {
              blog: "$blog",
              user: "$userdata.name",
              comment: {
                $cond: {
                  if: { $isArray: "$comment" },
                  then: { $size: "$comment" },
                  else: "NA",
                },
              },
            },
          },
        },
      ]);

      const data = [];

      datas.map((ele) => {
        data.push(ele._id);
      });

      return res
        .status(200)
        .render("All_blogs", { records: data, admin: admindata });
    }
  } catch (error) {
    req.session.message = {
      type: "danger",
      intro: "Something Went Wrong!",
      message: "Could Not Serch The Blog ",
    };
    return res.status(400).redirect("/viewVerifyBlog");
  }
};

//  Search User All Blog //
exports.searchUserAllBlog = async (req, res) => {
  try {
    keyword = req.body.keyword;
    source_id = req.body.source_id;
    if (keyword == "") {
      req.session.message = {
        type: "danger",
        intro: "Empty Field!",
        message: "please Enter Any Keyword ",
      };
      return res.status(400).redirect(`/viewAll/${source_id}`);
    } else {
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
          $match: {
            source_id: ObjectId(req.params.id),

            $or: [
              {
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
            _id: {
              blog: "$blog",
              user: "$userdata.name",
              comment: {
                $cond: {
                  if: { $isArray: "$comment" },
                  then: { $size: "$comment" },
                  else: "NA",
                },
              },
            },
          },
        },
      ]);

      const data = [];

      datas.map((ele) => {
        data.push(ele._id);
      });

      return res.status(200).redirect(`/viewAll/${source_id}`);
    }
  } catch (error) {
    source_id = req.body.source_id;
    req.session.message = {
      type: "danger",
      intro: "Something Went Wrong!",
      message: "Could Not Serch The Blog ",
    };
    return res.status(400).redirect(`/viewAll/${source_id}`);
  }
};

// ------------------------------------- View Blog Category Wise -------------------------------------//

// View News Category Blogs //
exports.viewNews = async (req, res) => {
  try {
    admin = req.adminUser;
    const admindata = await userData.findById({ _id: admin._id });

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
        $match: {
          "blog.category": "news",
          "blog.status": "verified",
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
          _id: {
            blog: "$blog",
            user: "$userdata.name",
            comment: {
              $cond: {
                if: { $isArray: "$comment" },
                then: { $size: "$comment" },
                else: "NA",
              },
            },
          },
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
      .status(200)
      .render("Blogs_News", { records: new_data, admin: admindata });
  } catch (error) {
    req.session.message = {
      type: "danger",
      intro: "Something Went Wrong!",
      message: "Could Not View News Blogs ",
    };
    return res.status(400).redirect("/Error");
  }
};

// View Sport Category Blogs //
exports.viewSport = async (req, res) => {
  try {
    admin = req.adminUser;
    const admindata = await userData.findById({ _id: admin._id });

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
        $match: {
          "blog.category": "sport",
          "blog.status": "verified",
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
          _id: {
            blog: "$blog",
            user: "$userdata.name",
            comment: {
              $cond: {
                if: { $isArray: "$comment" },
                then: { $size: "$comment" },
                else: "NA",
              },
            },
          },
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
      .status(200)
      .render("Blogs_Sport", { records: new_data, admin: admindata });
  } catch (error) {
    req.session.message = {
      type: "danger",
      intro: "Something Went Wrong!",
      message: "Could Not View Sports Blogs ",
    };
    return res.status(400).redirect("/Error");
  }
};

// View Coding Category Blogs //
exports.viewCoding = async (req, res) => {
  try {
    admin = req.adminUser;
    const admindata = await userData.findById({ _id: admin._id });

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
        $match: {
          "blog.category": "coding",
          "blog.status": "verified",
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
          _id: {
            blog: "$blog",
            user: "$userdata.name",
            comment: {
              $cond: {
                if: { $isArray: "$comment" },
                then: { $size: "$comment" },
                else: "NA",
              },
            },
          },
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
      .status(200)
      .render("Blogs_Coding", { records: new_data, admin: admindata });
  } catch (error) {
    req.session.message = {
      type: "danger",
      intro: "Something Went Wrong!",
      message: "Could Not View Coding Blogs ",
    };
    return res.status(400).redirect("/Error");
  }
};

// View Other Category Blogs //
exports.viewOther = async (req, res) => {
  try {
    admin = req.adminUser;
    const admindata = await userData.findById({ _id: admin._id });

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
        $match: {
          "blog.category": "other",
          "blog.status": "verified",
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
          _id: {
            blog: "$blog",
            user: "$userdata.name",
            comment: {
              $cond: {
                if: { $isArray: "$comment" },
                then: { $size: "$comment" },
                else: "NA",
              },
            },
          },
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
      .status(200)
      .render("Blogs_Other", { records: new_data, admin: admindata });
  } catch (error) {
    req.session.message = {
      type: "danger",
      intro: "Something Went Wrong!",
      message: "Could Not View Other Category Blogs ",
    };
    return res.status(400).redirect("/Error");
  }
};

// ------------------------------------- Search Blog Category Wise -------------------------------------//

// Search Blog For News //
exports.searchNews = async (req, res) => {
  try {
    admin = req.adminUser;
    const admindata = await userData.findById({ _id: admin._id });

    keyword = req.body.keyword;

    if (keyword == "") {
      req.session.message = {
        type: "danger",
        intro: "Empty Field!",
        message: "please Enter Any Keyword ",
      };
      return res.status(400).redirect("/news");
    } else {
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
          $match: {
            "blog.status": "verified",
            "blog.category": "news",
            $or: [
              {
                "blog.title": { $regex: `${keyword}`, $options: "i" },
              },
              {
                "blog.discription": { $regex: `${keyword}`, $options: "i" },
              },
              {
                "blog.category": { $regex: `${keyword}`, $options: "i" },
              },
              {
                "userdata.name": { $regex: `${keyword}`, $options: "i" },
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
            _id: {
              blog: "$blog",
              user: "$userdata.name",
              comment: {
                $cond: {
                  if: { $isArray: "$comment" },
                  then: { $size: "$comment" },
                  else: "NA",
                },
              },
            },
          },
        },
      ]);

      const data = [];

      datas.map((ele) => {
        data.push(ele._id);
      });

      return res
        .status(200)
        .render("Blogs_News", { records: data, admin: admindata });
    }
  } catch (error) {
    req.session.message = {
      type: "danger",
      intro: "Something Went Wrong!",
      message: "Could Not Serch The Blog ",
    };
    return res.status(400).redirect("/news");
  }
};

// Search Blog For Sport //
exports.searchSport = async (req, res) => {
  try {
    admin = req.adminUser;
    const admindata = await userData.findById({ _id: admin._id });

    keyword = req.body.keyword;

    if (keyword == "") {
      req.session.message = {
        type: "danger",
        intro: "Empty Field!",
        message: "please Enter Any Keyword ",
      };
      return res.status(400).redirect("/sport");
    } else {
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
          $match: {
            "blog.status": "verified",
            "blog.category": "sport",
            $or: [
              {
                "blog.title": { $regex: `${keyword}`, $options: "i" },
              },
              {
                "blog.discription": { $regex: `${keyword}`, $options: "i" },
              },
              {
                "blog.category": { $regex: `${keyword}`, $options: "i" },
              },
              {
                "userdata.name": { $regex: `${keyword}`, $options: "i" },
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
            _id: {
              blog: "$blog",
              user: "$userdata.name",
              comment: {
                $cond: {
                  if: { $isArray: "$comment" },
                  then: { $size: "$comment" },
                  else: "NA",
                },
              },
            },
          },
        },
      ]);

      const data = [];

      datas.map((ele) => {
        data.push(ele._id);
      });

      return res
        .status(200)
        .render("Blogs_Sport", { records: data, admin: admindata });
    }
  } catch (error) {
    req.session.message = {
      type: "danger",
      intro: "Something Went Wrong!",
      message: "Could Not Serch The Blog ",
    };
    return res.status(400).redirect("/sport");
  }
};

// Search Blog For Coding //
exports.searchCoding = async (req, res) => {
  try {
    admin = req.adminUser;
    const admindata = await userData.findById({ _id: admin._id });

    keyword = req.body.keyword;

    if (keyword == "") {
      req.session.message = {
        type: "danger",
        intro: "Empty Field!",
        message: "please Enter Any Keyword ",
      };
      return res.status(400).redirect("/coding");
    } else {
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
          $match: {
            "blog.status": "verified",
            "blog.category": "coding",
            $or: [
              {
                "blog.title": { $regex: `${keyword}`, $options: "i" },
              },
              {
                "blog.discription": { $regex: `${keyword}`, $options: "i" },
              },
              {
                "blog.category": { $regex: `${keyword}`, $options: "i" },
              },
              {
                "userdata.name": { $regex: `${keyword}`, $options: "i" },
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
            _id: {
              blog: "$blog",
              user: "$userdata.name",
              comment: {
                $cond: {
                  if: { $isArray: "$comment" },
                  then: { $size: "$comment" },
                  else: "NA",
                },
              },
            },
          },
        },
      ]);

      const data = [];

      datas.map((ele) => {
        data.push(ele._id);
      });

      return res
        .status(200)
        .render("Blogs_Coding", { records: data, admin: admindata });
    }
  } catch (error) {
    req.session.message = {
      type: "danger",
      intro: "Something Went Wrong!",
      message: "Could Not Serch The Blog ",
    };
    return res.status(400).redirect("/coding");
  }
};

// Search Blog For Other //
exports.searchOther = async (req, res) => {
  try {
    keyword = req.body.keyword;
    admin = req.adminUser;
    const admindata = await userData.findById({ _id: admin._id });

    if (keyword == "") {
      req.session.message = {
        type: "danger",
        intro: "Empty Field!",
        message: "please Enter Any Keyword ",
      };
      return res.status(400).redirect("/other");
    } else {
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
          $match: {
            "blog.status": "verified",
            "blog.category": "other",
            $or: [
              {
                "blog.title": { $regex: `${keyword}`, $options: "i" },
              },
              {
                "blog.discription": { $regex: `${keyword}`, $options: "i" },
              },
              {
                "blog.category": { $regex: `${keyword}`, $options: "i" },
              },
              {
                "userdata.name": { $regex: `${keyword}`, $options: "i" },
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
            _id: {
              blog: "$blog",
              user: "$userdata.name",
              comment: {
                $cond: {
                  if: { $isArray: "$comment" },
                  then: { $size: "$comment" },
                  else: "NA",
                },
              },
            },
          },
        },
      ]);

      const data = [];

      datas.map((ele) => {
        data.push(ele._id);
      });

      return res
        .status(200)
        .render("Blogs_Other", { records: data, admin: admindata });
    }
  } catch (error) {
    req.session.message = {
      type: "danger",
      intro: "Something Went Wrong!",
      message: "Could Not Serch The Blog ",
    };
    return res.status(400).redirect("/other");
  }
};
