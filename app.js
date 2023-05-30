//const { LocalStorage } = require("node-localstorage");
const localStorage = require("node-sessionstorage");
//var localStorage = new LocalStorage("./scratch");
const express = require("express"); //importing express
var csrf = require("tiny-csrf");
const app = express(); // creating new application
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const path = require("path");
const { Model, Op } = require("sequelize");
const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");
const session = require("express-session");
const LocalStrategy = require("passport-local");
const flash = require("connect-flash");
const bcrypt = require("bcrypt");
const saltRounds = 10;
app.set("views", path.join(__dirname, "views"));
app.use(flash());
const {
  User,
  Create_sports,
  Create_session,
  Players_names,
} = require("./models");
const { compile } = require("ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "images")));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("shh! some secrete string"));
app.use(csrf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"]));
app.set("view engine", "ejs");
app.use(
  session({
    secret: "my-super-secret-key-21728172615261562",
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(function (request, response, next) {
  response.locals.messages = request.flash();
  next();
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (username, password, done) => {
      User.findOne({ where: { email: username } })
        .then(async function (user) {
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Invalid password" });
          }
        })
        .catch(() => {
          return done(null, false, {
            message: "Account doesn't exist for this mail",
          });
        });
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("Serializing user in session", user.id);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((error) => {
      done(error, null);
    });
});

app.get("/", async (request, response) => {
  if (localStorage.getItem("userId")) {
    localStorage.removeItem("userId");
  }
  if (localStorage.getItem("admin_name")) {
    localStorage.removeItem("admin_name");
    response.render("webfirst_page", {
      title: "Sports manage!",
    });
  } else {
    response.render("webfirst_page", {
      title: "Sports manage!",
    });
  }
});
app.get("/admin_login", async (request, response) => {
  response.render("admin_login_page", {
    title: "welcom admin",
    csrfToken: request.csrfToken(),
  });
});
app.get("/all_session/:id/:sports_name", async (request, response) => {
  //if((localStorage.getItem("admin_name"))||(localStorage.getItem("userId")))
  const splits_colan = request.params.sports_name.slice(1);
  const splits_colan_id = request.params.id.slice(1);
  localStorage.setItem("current_sports_name", splits_colan),
    localStorage.setItem("current_sports_id", splits_colan_id);
  const all_sessions = await Create_session.get_today_late_session(
    splits_colan
  );
  const post_session = await Create_session.get_post_session(splits_colan);
  const url = `/all_session/:${request.params.id.slice(
    1
  )}/:${request.params.sports_name.slice(1)}/report`;
  if (request.accepts("html")) {
    response.render("all_sports_session", {
      title: localStorage.getItem("current_sports_name"),
      check_admin_are_not: localStorage.getItem("admin_name")
        ? localStorage.getItem("admin_name")
        : 0,
      all_sessions,
      post_session,
      url,
      csrfToken: request.csrfToken(),
    });
  } else {
    response.json({ all_sessions });
  }
});
app.get("/all_session/:id/:sports_name/report", async (request, response) => {
  const splits_colan = request.params.sports_name.slice(1);
  const splits_colan_id = request.params.id.slice(1);
  localStorage.setItem("current_sports_name", splits_colan),
    localStorage.setItem("current_sports_id", splits_colan_id);
  const today = await Create_session.get_today(splits_colan);
  const late = await Create_session.get_dulate(splits_colan);
  const post = await Create_session.get_post_session(splits_colan);
  if (request.accepts("html")) {
    response.render("reports", {
      title: localStorage.getItem("current_sports_name"),
      today,
      late,
      post,
      csrfToken: request.csrfToken(),
    });
  } else {
    response.json({ all_sessions });
  }
});
app.get("/session_des/:id", async (request, response) => {
  const session_id = request.params.id.slice(1);
  const sports_name = localStorage.getItem("current_sports_name");
  const one_session = await Create_session.get_one_session(
    sports_name,
    session_id
  );
  const get_players = await Players_names.get_player_name_for_session(
    sports_name,
    session_id
  );
  if (request.accepts("html")) {
    response.render("show_all_session_details", {
      title: localStorage.getItem("current_sports_name"),
      one_session,
      single_userid: localStorage.getItem("userId")
        ? localStorage.getItem("userId")
        : 0,
      admin: localStorage.getItem("admin_name")
        ? localStorage.getItem("admin_name")
        : 0,
      sports_id: localStorage.getItem("current_sports_id"),
      sports_name: localStorage.getItem("current_sports_name"),
      session_id: request.params.id.slice(1),
      get_players,
      csrfToken: request.csrfToken(),
    });
  } else {
    response.json({ one_session, single_userid, admin });
  }
});
app.get("/all_session", async (request, response) => {
  response.render("all_sports_session", {
    title: localStorage.getItem("current_sports_name"),
    csrfToken: request.csrfToken(),
  });
});
app.get("/add_sports", async (request, response) => {
  response.render("add_new_Sports", {
    Title: "create sports",
    update_sports_name: false,
    update_sports_id: null,
    csrfToken: request.csrfToken(),
  });
});
app.put("/add_sports/:id", async (req, response) => {
  console.log(response);
  response.render("add_new_Sports", {
    update_sports_name: true,
    update_sports_id: req.params.id,
    csrfToken: "sdfghjlkujryjmjn,kmjff",
  });
});
app.get("/all_sports", async (request, response) => {
  const all_sports = await Create_sports.getSports();
  const check_admin = localStorage.getItem("admin_name")
    ? localStorage.getItem("admin_name")
    : 0;
  if (request.accepts("html")) {
    response.render("admin_create_sports", {
      title: localStorage.getItem("admin_name")
        ? localStorage.getItem("admin_name")
        : request.user.firstName + request.user.lastName,
      all_sports,
      check_admin_are_not: localStorage.getItem("admin_name")
        ? localStorage.getItem("admin_name")
        : 0,
      check_admin,
      csrfToken: request.csrfToken(),
    });
  } else {
    response.join({ all_sports, check_admin });
  }
});
app.post("/admin_add_sports", async (request, response) => {
  if (request.body.sports_name == 0) {
    request.flash("error", "Enter a sports name!");
    return response.redirect("/add_sports");
  }
  try {
    const new_sports = await Create_sports.create({
      sports_name: request.body.sports_name.toUpperCase(),
      Edit_delete_display: false,
    });
    response.redirect("/all_sports");
  } catch (error) {
    console.log(error);
  }
});
app.post("/update_sports", async (request, response) => {
  if (request.body.sports_name == 0) {
    request.flash("error", "Enter a sports name!");
    return response.redirect(
      `/update_sports/:${localStorage.getItem(
        "current_sports_id"
      )}/:${"current_sports_name"}`
    );
  }
  try {
    await Create_session.update_sports_name(
      request.body.oldname,
      request.body.sports_name.toUpperCase()
    );
    await Players_names.update_sports_name_players_count(
      request.body.oldname,
      request.body.sports_name.toUpperCase()
    );
    await Create_sports.edit_sports(
      request.body.id.slice(1),
      request.body.sports_name.toUpperCase()
    );
    response.redirect("/all_sports");
  } catch (error) {
    console.log(error);
  }
});
app.post("/admins", async (request, response) => {
  if (request.body.name.length == 0) {
    request.flash("error", "Email can not be empty!");
    return response.redirect("/admin_login");
  }
  if (request.body.password != "chinnu@16") {
    request.flash("error", "Only use admin password!");
    return response.redirect("/admin_login");
  } else {
    localStorage.setItem("admin_name", request.body.name);
    //localStorage.setItem("admin_email",request.body.email);
    response.redirect("/all_sports");
  }
});
app.get("/input_session", async (request, response) => {
  response.render("Create_session", {
    title: localStorage.getItem("current_sports_name"),
    sports_id: localStorage.getItem("current_sports_id"),
    csrfToken: request.csrfToken(),
  });
});
app.post("/create_session", async (request, response) => {
  if (request.body.match_desc.length === 0) {
    request.flash("error", "Enter match desc");
    return response.redirect("/input_session");
  } else if (request.body.match_date.length === 0) {
    request.flash("error", "select date");
    return response.redirect("/input_session");
  } else if (request.body.no_player.length === 0) {
    request.flash("error", "enter players");
    return response.redirect("/input_session");
  } else if (request.body.match_time.length === 0) {
    request.flash("error", "enter time");
    return response.redirect("/input_session");
  }
  try {
    const session_data = await Create_session.create({
      session_des: request.body.match_desc,
      session_date: request.body.match_date,
      uploader_id: localStorage.getItem("admin_name")
        ? "admin"
        : request.user.id,
      sports_title: localStorage.getItem("current_sports_name"),
      total_players: request.body.no_player,
      time: request.body.match_time,
      add_player: 0,
    });
    response.redirect(
      `/all_session/:${localStorage.getItem(
        "current_sports_id"
      )}/:${localStorage.getItem("current_sports_name")}`
    );
  } catch (err) {
    console.log(err);
  }
});
app.post("/update_sessionvalues", async (request, response) => {
  if (request.body.match_desc.length === 0) {
    request.flash("error", "Enter match desc");
    return response.redirect(
      `/update_session/:${request.body.id}/:${request.body.olddes}/:${request.body.olddate}/:${request.body.oldtime}/:${request.body.oldplayers}/:${request.body.existing_player_count}`
    );
  } else if (request.body.match_date.length === 0) {
    request.flash("error", "select date");
    return response.redirect(
      `/update_session/:${request.body.id}/:${request.body.olddes}/:${request.body.olddate}/:${request.body.oldtime}/:${request.body.oldplayers}/:${request.body.existing_player_count}`
    );
  } else if (
    request.body.no_player === 0 ||
    request.body.no_player.length === 0
  ) {
    request.flash(
      "error",
      `sorry you player ${request.body.existing_player_count} but now you try add ${request.body.no_player}`
    );
    return response.redirect(
      `/update_session/:${request.body.id}/:${request.body.olddes}/:${request.body.olddate}/:${request.body.oldtime}/:${request.body.oldplayers}/:${request.body.existing_player_count}`
    );
  } else if (request.body.match_time.length === 0) {
    request.flash("error", "enter time");
    return response.redirect(
      `/update_session/:${request.body.id}/:${request.body.olddes}/:${request.body.olddate}/:${request.body.oldtime}/:${request.body.oldplayers}/:${request.body.existing_player_count}`
    );
  }
  try {
    await Create_session.update_sessionwith_id(
      request.body.id,
      request.body.match_desc,
      request.body.match_date,
      request.body.match_time,
      request.body.no_player
    );
    await Players_names.update_player_count(
      request.body.id,
      request.body.no_player
    );
    response.redirect(
      `/all_session/:${localStorage.getItem(
        "current_sports_id"
      )}/:${localStorage.getItem("current_sports_name")}`
    );
  } catch (err) {
    console.log(err);
  }
});
app.post("/add_players", async (request, response) => {
  //console.log("userid"+request.user.id);
  try {
    const all_players_name = request.body.player_name.toUpperCase();
    const split_name = all_players_name.split(",");
    for (var i = 0; i < split_name.length; i++) {
      const players_data = await Players_names.create({
        players_name: split_name[i],
        session_id: request.body.session_id,
        sports_name: request.body.sports_name,
        total_player: request.body.total_player,
        uploader_id: request.body.uploader_id,
      });
      await Create_session.update_player_count(
        request.body.session_id,
        request.body.sports_name,
        request.body.total_count_player
      );
    }

    //window.location.replace(`/session_des/:${request.body.session_id}`);
    //response.replace(`/session_des/:${request.body.session_id}`)
    response.redirect(`/session_des/:${request.body.session_id}`);
  } catch (err) {
    console.log(err);
  }
});
app.post("/join_players", async (request, response) => {
  try {
    const players = await Players_names.create({
      players_name:
        request.user.firstName.toUpperCase() +
        request.user.lastName.toUpperCase(),
      session_id: request.body.session_id,
      sports_name: request.body.sports_name,
      total_player: request.body.total_player,
      uploader_id: request.body.uploader_id,
      my_name: request.user.id,
    });
    await Create_session.update_player_count(
      request.body.session_id,
      request.body.sports_name,
      request.body.total_count_player
    );
    response.redirect(`/session_des/:${request.body.session_id}`);
  } catch (err) {
    console.log(err);
  }
});

app.get("/signup", (request, response) => {
  response.render("signup", {
    title: "Signup",
    csrfToken: request.csrfToken(),
  });
});
app.post("/users", async (request, response) => {
  const alerady_use_mail = await User.findOne({
    where: {
      email: {
        [Op.eq]: request.body.email,
      },
    },
  });

  if (request.body.email.length == 0) {
    request.flash("error", "Email can not be empty!");
    return response.redirect("/signup");
  }

  if (request.body.firstName.length == 0) {
    request.flash("error", "First name can not be empty!");
    return response.redirect("/signup");
  }
  if (request.body.lastName.length == 0) {
    request.flash("error", "Last name can not be empty!");
    return response.redirect("/signup");
  }
  if (request.body.password.length < 8) {
    request.flash("error", "Password length should be atleast 8");
    return response.redirect("/signup");
  }
  if (alerady_use_mail) {
    request.flash("error", "This email is already exists!");
    return response.redirect("/signup");
  } else {
    const hashedPwd = await bcrypt.hash(request.body.password, saltRounds);
    console.log(hashedPwd);

    try {
      const user = await User.create({
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        email: request.body.email,
        password: hashedPwd,
      });
      request.login(user, (err) => {
        if (err) {
          console.log(err);
        }
        response.redirect("/login");
      });
    } catch (error) {
      console.log(error);
    }
  }
});

app.get("/login", (request, response) => {
  if (localStorage.getItem("userId")) {
    localStorage.removeItem("userId");
  }
  if (localStorage.getItem("admin_name")) {
    localStorage.removeItem("admin_name");
  }
  response.render("login", { title: "Login", csrfToken: request.csrfToken() });
});

app.post(
  "/session",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),

  function (request, response) {
    localStorage.setItem("userId", request.user.id);
    console.log(request.user);
    response.redirect("/all_sports");
  }
);
app.get("/signout", (request, response, next) => {
  request.logout((err) => {
    if (err) {
      return next(err);
    }
    response.redirect("/");
  });
});
app.delete("/all_sports/:id/del/:sp_name", async (request, response) => {
  try {
    await Create_sports.remove(request.params.id);
    // const a=await Create_session.findids(request.params.sp_name)
    // console.log("all sesion"+ a.id[1])
    await Create_session.remove_all_session(request.params.sp_name);

    return response.json(true);
  } catch (err) {
    return response.status(422).json(err);
  }
});
app.delete(
  "/session_des/:id/:del",

  async (request, response) => {
    try {
      await Create_session.remove_session(request.params.del.slice(1));
      await Players_names.remove_session_player(request.params.del.slice(1));
      return response.json(true);
    } catch (err) {
      return response.status(422).json(err);
    }
  }
);
app.delete(
  "/session_des/:id/del/:delid/:player_count",

  async (request, response) => {
    try {
      await Players_names.remove_player(request.params.delid.slice(1));
      await Create_session.update_player_count(
        request.params.id.slice(1),
        localStorage.getItem("current_sports_name"),
        request.params.player_count.slice(1)
      );
      console.log("count" + request.params.player_count);
      return response.json(true);
    } catch (err) {
      return response.status(422).json(err);
    }
  }
);
app.get("/update_sports/:id/:name", async (request, response) => {
  if (request.accepts("html")) {
    response.render("update_sports_name", {
      title: localStorage.getItem("current_sports_name"),
      sports_name: request.params.name.slice(1),
      id: request.params.id,
      csrfToken: request.csrfToken(),
    });
  } else {
    response.join("/");
  }
});
app.get(
  "/update_session/:id/:sdes/:sdate/:time/:totalplayer/:existing_player",
  async (request, response) => {
    response.render("update_session", {
      title: localStorage.getItem("current_sports_name"),
      id: request.params.id.slice(1),
      session_des: request.params.sdes.slice(1),
      session_date: request.params.sdate.slice(1),
      session_time: request.params.time.slice(1),
      session_players: request.params.totalplayer.slice(1),
      existing_player: request.params.existing_player.slice(1),
      csrfToken: request.csrfToken(),
    });
  }
);
app.get("/resetpassword", async (request, response) => {
  response.render("user_resetPassword", {
    title: "Reset password",
    check_admin_are_not: localStorage.getItem("admin_name")
      ? localStorage.getItem("admin_name")
      : 0,
    csrfToken: request.csrfToken(),
  });
});
app.post("/reset", connectEnsureLogin.ensureLoggedIn(), async (req, res) => {
  if (req.body.newPassword.length < 8) {
    req.flash("error", "Password length should be minimum 8");
    return res.redirect("/resetpassword");
  }
  const hashedNewPwd = await bcrypt.hash(req.body.newPassword, saltRounds);
  console.log("password", hashedNewPwd);
  if (await bcrypt.compare(req.body.oldPassword, req.user.password)) {
    try {
      User.findOne({ where: { email: req.user.email } }).then((user) => {
        user.resetPassword(hashedNewPwd);
      });
      req.flash("success", "Password changed successfully");
      return res.redirect("/resetpassword");
    } catch (error) {
      console.log(error);
      return res.status(422).json(error);
    }
  } else {
    req.flash("error", "Old password does not match");
    return res.redirect("/resetpassword");
  }
});

module.exports = app;
