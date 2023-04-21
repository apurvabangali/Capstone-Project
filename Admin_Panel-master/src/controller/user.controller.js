const userData = require("../module/user.modul");
const blogData = require("../module/blog.modul");
const validator = require("validator");
const contactData = require("../module/contact.model");
const fs = require("fs");
const { count } = require("console");
const url = "http://localhost:8080";

//------------------------------------------- Admin Authentication-------------------------------------------//

//Admin Login//
exports.adminLogin = async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    const data = await userData.findOne({ username });

    if (!data.tokens[0]) {
      const token = await data.generate();
    }

    if (username == data.username && password == data.password) {
      res.cookie("jwt", data.tokens[0].token);

      req.session.message = {
        type: "success",
        intro: "Successfully LogIn! ",
        message: "Welcome To dashboard.",
        
      };
      res.status(201).redirect("/dashboard");
    } else {
      req.session.message = {
        type: "danger",
        intro: "Passwords do not match! ",
        message: "Enter Valid Username Or Password.",
        
      };
      res.status(400).redirect("/");
    }
  } catch (error) {
    req.session.message = {
      type: "danger",
      intro: "Usernaame do not match! ",
      message: "Enter Valid Username.",
      status: 400,
    };
    res.status(400).redirect("/");
  }
};

// Admin Logout//
exports.adminLogout = async (req, res) => {
  try {
    req.adminUser.tokens = req.adminUser.tokens.filter((currele) => {
      return currele.token != req.token;
    });
    res.clearCookie("jwt");
    await req.adminUser.save();
    req.session.message = {
      type: "success",
      intro: "Successfully Logout! ",
      message: "Welcome To Login.",
      
    };
    res.status(201).redirect("/");
  } catch (error) {
    req.session.message = {
      type: "danger",
      intro: "Something Went Wrong! ",
      message: "Can not Logout.",
    };
    res.status(400).redirect("/Error");
  }
};

exports.viewprofile = async (req, res) => {
  try {
    _id = req.params.id;
    const admindata = await userData.findById({ _id });
    res.status(200).render("adminprofile", { records: admindata });
  } catch (error) {
    req.session.message = {
      type: "danger",
      intro: "Something Went Wrong! ",
      message: "Can not View Profile.",
    };
    res.status(400).redirect("/Error");
  }
};

exports.UpdateAdmin = async (req, res) => {
  try {
    _id = req.params.id;
    const update = await userData.find({
      _id: { $not: { $eq: _id } },
      email: req.body.email,
    });

    if (update.length > 0) {
      req.session.message = {
        type: "danger",
        intro: "Email Error!",
        message: "Email Already Exist.",
      };
      return res.status(400).redirect(`/editUserProfile/${_id}`);
    } else {
      const data = await userData.findByIdAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true }
      );

      res.redirect("/dashboard");
    }
  } catch (error) {
    req.session.message = {
      type: "danger",
      intro: "Something Went Wrong!",
      message: "Data Not Updated.",
    };
    res.status(400).redirect(`/editUserProfile/${_id}`);
  }
};

exports.AdminUpdateImage = async (req, res) => {
  try {
    _id = req.params.id;
    if (req.file == undefined) {
      req.session.message = {
        type: "danger",
        intro: "Image Undefined!",
        message: "Click On Image To Select New Image",
      };
      res.status(404).redirect(`/viewprofile/${_id}`);
    } else {
      let deleteImage = await userData.findById(_id);
      const ImagePath = deleteImage.path;

      if (!ImagePath) {
        const data = await userData.findByIdAndUpdate(
          _id,
          {
            $set: {
              image: `${url}/image/${req.file.filename}`,
              path: req.file.path,
            },
          },
          { new: true }
        );
        req.session.message = {
          type: "success",
          intro: "Image Updated Successfully.",
          message: "",
        };
        res.redirect(`/viewprofile/${_id}`);
      } else {
        fs.unlink(ImagePath, (err) => {
          if (err) {
            return;
          }
        });
        const data = await userData.findByIdAndUpdate(
          _id,
          {
            $set: {
              image: `${url}/image/${req.file.filename}`,
              path: req.file.path,
            },
          },
          { new: true }
        );
        req.session.message = {
          type: "success",
          intro: "Image Updated Successfully.",
          message: "",
        };
        res.redirect(`/viewprofile/${_id}`);
      }
    }
  } catch (err) {
    req.session.message = {
      type: "danger",
      intro: "Something Went Wrong!",
      message: "Can not Update Image",
    };
    res.status(404).redirect(`/viewprofile/${_id}`);
  }
};

exports.AdminDeleteImage = async (req, res) => {
  try {
    _id = req.params.id;
    const deleteImage = await userData.findById({ _id });
    const ImagePath = deleteImage.path;

    fs.unlink(ImagePath, (err) => {
      if (err) {
        return;
      }
    });

    const data = await userData.findByIdAndUpdate(
      _id,
      { $unset: { image: "", path: "" } },
      { new: true }
    );
    req.session.message = {
      type: "success",
      intro: "Image Deleted Successfully.",
      message: "",
    };
    return res.status(400).redirect(`/viewprofile/${_id}`);
  } catch (error) {
    req.session.message = {
      type: "danger",
      intro: "Something Went Wrong!",
      message: "Can Not Delete Profile Image.",
    };
    res.status(400).redirect(`/viewprofile/${_id}`);
  }
};


//------------------------------------------- Admin Manage User Authentication-------------------------------------------//

// Admin can insert all user data//
exports.insertUser = async (req, res) => {
  try {
    const user = new userData(req.body);

    const userList = userData.find();
    email = req.body.email;
    if (email) {
      userData.findOne({ email: email }).then((useremail) => {
        if (useremail) {
          req.session.message = {
            type: "danger",
            intro: "Email Error!",
            message: "Email Already Exist.",
          };
          return res.status(400).redirect("/register");
        } else {
          user.save();
          res.status(201).redirect("/viewUser");
        }
      });
    } else {
      req.session.message = {
        type: "danger",
        intro: "Email Error!",
        message: "Pleas Enter Email.",
      };
      res.status(400).redirect("/register");
    }
  } catch (error) {
    req.session.message = {
      type: "danger",
      intro: "Something Went Wrong!",
      message: "Can Not Insert User Record",
    };
    return res.status(400).redirect("/register");
  }
};

// Admin View All User//
exports.viewUser = async (req, res) => {
  try {
    admin = req.adminUser;
    const admindata = await userData.findById({ _id: admin._id });

    const viewData = await userData
      .find({ username: { $not: { $eq: "admin" } } })
      .sort({ updatedAt: -1 });
    res.render("UserTable", { records: viewData, admin: admindata });
  } catch (error) {
    console.log(error);
    req.session.message = {
      type: "danger",
      intro: "Something Went Wrong!",
      message: "Can Not View User Data.",
    };
    res.status(400).redirect("/Error");
  }
};

// Edit Profile //
exports.editUserProfile = async (req, res) => {
  try {
    var id = req.params.id;
    var edit = await userData.findById(id);

    res.render("editprofile", { records: edit });
  } catch (error) {
    req.session.message = {
      type: "danger",
      intro: "Something Went Wrong!",
      message: "Can Not Edit Profile.",
    };
    res.status(400).redirect("/Error");
  }
};

// Admin can update all user data//
exports.updateUser = async (req, res) => {
  try {
    _id = req.params.id;
    const update = await userData.find({
      _id: { $not: { $eq: _id } },
      email: req.body.email,
    });

    if (update.length > 0) {
      req.session.message = {
        type: "danger",
        intro: "Email Error!",
        message: "Email Already Exist.",
      };
      return res.status(400).redirect(`/editUserProfile/${_id}`);
    } else {
      const data = await userData.findByIdAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true }
      );

      res.redirect("/viewUser");
    }
  } catch (error) {
    req.session.message = {
      type: "danger",
      intro: "Something Went Wrong!",
      message: "Data Not Updated.",
    };
    res.status(400).redirect(`/editUserProfile/${_id}`);
  }
};

// Admin can delete all user data//
exports.deleteUser = async (req, res) => {
  try {
    const _id = req.params.id;
    const deleteData = await userData.findByIdAndDelete(_id);
    res.redirect("/viewUser");
  } catch (error) {
    req.session.message = {
      type: "danger",
      intro: "Something Went Wrong!",
      message: "Data Not Deleted.",
    };
    res.status(400).redirect("/viewUser");
  }
};

// Admin Upadte Image//
exports.updateImage = async (req, res) => {
  try {
    _id = req.params.id;
    if (req.file == undefined) {
      req.session.message = {
        type: "danger",
        intro: "Image Undefined!",
        message: "Click On Image To Select New Image",
      };
      res.status(404).redirect(`/editUserProfile/${_id}`);
    } else {
      let deleteImage = await userData.findById(_id);
      const ImagePath = deleteImage.path;

      if (!ImagePath) {
        const data = await userData.findByIdAndUpdate(
          _id,
          {
            $set: {
              image: `${url}/image/${req.file.filename}`,
              path: req.file.path,
            },
          },
          { new: true }
        );
        req.session.message = {
          type: "success",
          intro: "Image Updated Successfully.",
          message: "",
        };
        res.redirect(`/editUserProfile/${_id}`);
      } else {
        fs.unlink(ImagePath, (err) => {
          if (err) {
            return;
          }
        });
        const data = await userData.findByIdAndUpdate(
          _id,
          {
            $set: {
              image: `${url}/image/${req.file.filename}`,
              path: req.file.path,
            },
          },
          { new: true }
        );
        req.session.message = {
          type: "success",
          intro: "Image Updated Successfully.",
          message: "",
        };
        res.redirect(`/editUserProfile/${_id}`);
      }
    }
  } catch (err) {
    req.session.message = {
      type: "danger",
      intro: "Something Went Wrong!",
      message: "Can not Update Image",
    };
    res.status(404).redirect(`/editUserProfile/${_id}`);
  }
};

//Admin Delete Image//
exports.deleteImage = async (req, res) => {
  try {
    _id = req.params.id;
    const deleteImage = await userData.findById({ _id });
    const ImagePath = deleteImage.path;

    fs.unlink(ImagePath, (err) => {
      if (err) {
        return;
      }
    });

    const data = await userData.findByIdAndUpdate(
      _id,
      { $unset: { image: "", path: "" } },
      { new: true }
    );
    req.session.message = {
      type: "success",
      intro: "Image Deleted Successfully.",
      message: "",
    };
    return res.status(400).redirect(`/editUserProfile/${_id}`);
  } catch (error) {
    req.session.message = {
      type: "danger",
      intro: "Something Went Wrong!",
      message: "Can Not Delete Profile Image.",
    };
    res.status(400).redirect(`/editUserProfile/${_id}`);
  }
};


//------------------------------------------- Dashboard-------------------------------------------//

exports.dashdBoard = async (req, res) => {
  try {
    //Total User Count//
    const usercount = await userData
      .find({ username: { $not: { $eq: "admin" } } })
      .count();
    const contectCount = await contactData.find().count();

    admin = req.adminUser;
    const admindata = await userData.findById({ _id: admin._id });

    //All Over Total Blogs In System//
    const ablog = await blogData.aggregate([
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
        $group: {
          _id: { blog: "$blog", user: "$userdata.name" },
        },
      },
    ]);

    const allblog = [];
    let allbgcnt = 0;
    ablog.map((ele) => {
      allblog.push(ele._id);
      allbgcnt++;
    });
    let allblogscount = allbgcnt;

    //Total Verified Blogs Count//
    const totalblog = await blogData.aggregate([
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
        $group: {
          _id: { blog: "$blog", user: "$userdata.name" },
        },
      },
    ]);

    const data = [];
    let totalcount = 0;
    totalblog.map((ele) => {
      data.push(ele._id);
      totalcount++;
    });

    totalverifyblog = totalcount;

    // Total Pending Blog Count//
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
    let count = 0;
    pendingBlogs.map((ele) => {
      TpendingBlogs.push(ele._id);
      count++;
    });
    totalpendingblog = count;

    // Total Unverified Blogs Count//
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
    let counts = 0;
    datas.map((ele) => {
      TUnverified.push(ele._id);
      counts++;
    });
    totalUnverified = counts;

    //Top 10 Latest User //

    const topuser = await userData
      .find({ username: { $not: { $eq: "admin" } } })
      .sort({ updatedAt: -1 })
      .limit(10);

    //Top 10 highest Blog Uploaded User//
    const huserblog = await blogData.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "source_id",
          foreignField: "_id",
          as: "userdata",
        },
      },

      { $unwind: "$userdata" },
      {
        $match: {
          "userdata.name": { $not: { $eq: "admin" } },
        },
      },
      {
        $group: {
          _id: {
            blog: {
              $cond: {
                // if: { $and: [ { $isArray: "$blog" }, { "blog.status": "verified",} ] },
                if: { $isArray: "$blog" },
                then: { $size: "$blog" },
                else: "NA",
              },
            },
            name: "$userdata.name",
            email: "$userdata.email",
            image: "$userdata.image",
            phone: "$userdata.phone",
            username: "$userdata.username",
          },
        },
      },
    ]);
    const detail = [];
    huserblog.map((ele) => {
      detail.push(ele._id);
    });

    function custom_sort(a, b) {
      return b.blog - a.blog;
    }
    const new_data = detail.sort(custom_sort);
    const totaluserblogs = detail.slice(0, 10);

    const user = {
      allblogscount,
      totalverifyblog,
      totalpendingblog,
      usercount,
      totalUnverified,
    };

    res.status(200).render("index", {
      records: user,
      admin: admindata,
      topuser: topuser,
      user: totaluserblogs,
    });
  } catch (error) {
    req.session.message = {
      type: "danger",
      intro: "Something Went Wrong!",
      message: "Can not View Dashboard",
    };
    return res.status(400).redirect("/Error");
  }
};

exports.chartdashdBoard = async (req, res) => {
  try {
    //Total Verified Blogs Count//
    const totalblog = await blogData.aggregate([
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
        $group: {
          _id: { blog: "$blog", user: "$userdata.name" },
        },
      },
    ]);

    const data = [];
    let totalcount = 0;
    totalblog.map((ele) => {
      data.push(ele._id);
      totalcount++;
    });

    totalverifyblog = totalcount;

    // Total Pending Blog Count//
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
    let count = 0;
    pendingBlogs.map((ele) => {
      TpendingBlogs.push(ele._id);
      count++;
    });
    totalpendingblog = count;

    // Total Unverified Blogs Count//
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
    let counts = 0;
    datas.map((ele) => {
      TUnverified.push(ele._id);
      counts++;
    });
    totalUnverified = counts;

    // Highest Blog Uploaded User//
    const huserblog = await blogData.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "source_id",
          foreignField: "_id",
          as: "userdata",
        },
      },
      { $unwind: "$userdata" },
      {
        $match: {
          "userdata.name": { $not: { $eq: "admin" } },
        },
      },
      {
        $group: {
          _id: {
            blog: {
              $cond: {
                if: { $isArray: "$blog" },
                then: { $size: "$blog" },
                else: { name: "$userdata.name" },
              },
            },
            name: "$userdata.name",
            email: "$userdata.email",
            image: "$userdata.image",
            phone: "$userdata.phone",
            username: "$userdata.username",
          },
        },
      },
    ]);
    const detail = [];
    huserblog.map((ele) => {
      detail.push(ele._id);
    });

    function custom_sort(a, b) {
      return b.blog - a.blog;
    }
    const new_data = detail.sort(custom_sort);
    const totaluserblogs = detail.slice(0, 10);

    res.status(200).json({
      verified: totalverifyblog,
      unverified: totalUnverified,
      pending: totalpendingblog,
      hbloguser: totaluserblogs,
    });
  } catch (error) {
    console.log(error);
    req.session.message = {
      type: "danger",
      intro: "Something Went Wrong!",
      message: "Can not View Chart Dashboard",
    };
    return res.status(400).redirect("/Error");
  }
};