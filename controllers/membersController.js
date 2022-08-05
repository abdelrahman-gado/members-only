exports.sign_up_get = (req, res, next) => {
  res.render("sign-up");
};

exports.sign_up_post = (req, res, next) => {
  res.send("Not Implemented YET");
};

exports.log_in_get = (req, res, next) => {
  res.render("log-in");
};

exports.log_in_post = (req, res, next) => {
  res.send("Not Implemented YET");
};

exports.log_out_get = (req, res, next) => {
  res.send("Not Implemented YET");
};

exports.clubhouse_get = (req, res, next) => {
  res.render("clubhouse-form")
};

exports.clubhouse_post = (req, res, next) => {
  res.send("Not Implemented YET");
};

exports.admin_get = (req, res, next) => {
  res.render("admin-form");
};

exports.admin_post = (req, res, next) => {
  res.send("Not Implemented YET");
};

exports.add_message_get = (req, res, next) => {
  res.render("add-message");
};

exports.add_message_post = (req, res, next) => {
  res.send("Not Implemneted YET");
};

exports.about_get = (req, res, next) => {
  res.render("about.ejs");
};

exports.delete_message_get = (req, res, next) => {
  res.send("Not Implemented YET");
};
