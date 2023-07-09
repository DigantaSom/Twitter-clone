const checkIfFollowedByLoggedInUser = (loggedInUserId, followers) => {
  if (!loggedInUserId) {
    return false;
  } else {
    if (followers.some(f => f.userId.toString() === loggedInUserId)) {
      return true;
    } else {
      return false;
    }
  }
};

module.exports = checkIfFollowedByLoggedInUser;
