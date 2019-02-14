const cron = require("node-cron");
const User = require("../models/user");

module.exports = () => {
  const calculateRating = cron.schedule("0 3 * * *", () => {
    return User.find({ type: "agronomist" })
      .then(users => {
        return Promise.map(users, user => {

          return Rating.getRating(user.id)
            .then(rating => {
              user.rating = rating;
              return user.save();
            });
        });
      })
      .catch(err => console.error(err))
  }, { scheduled: true, timezone: "America/New_York" });
};
