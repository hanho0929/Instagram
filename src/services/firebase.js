import { firebase, FieldValue } from "../lib/firebase";

export async function doesUsernameExist(usename) {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("username", "==", usename)
    .get();
  console.log(result);

  return result.docs.map((user) => {
    //console.log(user.data() !== undefined);
    return user.data() !== undefined;
  }).length;
}

// get user from the firestore where userId === userId (passed from the auth)
export async function getUserByUserId(userId) {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("userId", "==", userId)
    .get();
  const user = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));

  return user;
}

// check all conditions before limit results ( 10 )
export async function getSuggestedProfiles(userId, following) {
  const result = await firebase.firestore().collection("users").limit(10).get();
  //const [{ following }];
  // console.log(result.docs
  //     .map((user) => ({ ...user.data(), docId: user.id}))
  //     .filter((profile) => profile.userId !== userId && !following.includes(profile.userId)));
  return result.docs
    .map((user) => ({ ...user.data(), docId: user.id }))
    .filter(
      (profile) =>
        profile.userId !== userId && !following.includes(profile.userId)
    );
}

// updateLoggedInUserFollowing, updateFollowedUserFollowers

export async function updateLoggedInUserFollowing(
  loggedInUserDocId, // currently logged in user document id(Karl)
  profieId, // the user that karl requests to follow
  isFollowingProfile // true/false ( am I currently following this person )
) {
  return firebase
    .firestore()
    .collection("users")
    .doc(loggedInUserDocId)
    .update({
      following: isFollowingProfile
        ? FieldValue.arrayRemove(profieId)
        : FieldValue.arrayUnion(profieId),
    });
}

export async function updateFollowedUserFollowers(
  profileDocId, //
  loggedInUserId, //
  isFollowingProfile // true/false ( am I currently following this person )
) {
  return firebase
    .firestore()
    .collection("users")
    .doc(profileDocId)
    .update({
      followers: isFollowingProfile
        ? FieldValue.arrayRemove(loggedInUserId)
        : FieldValue.arrayUnion(loggedInUserId),
    });
}

export async function getPhotos(userId, following) {
  // [5,4,2] => following
  const result = await firebase
    .firestore()
    .collection("photos")
    .where("userId", "in", following) // mine following someone's photos
    .get();

  const userFollowedPhotos = result.docs.map((photo) => ({
    ...photo.data(),
    docId: photo.id,
  }));

  const photosWithUserDetails = await Promise.all(
    userFollowedPhotos.map(async (photo) => {
      let userLikedPhoto = false;
      if (photo.likes.includes(userId)) {
        userLikedPhoto = true;
      }
      // photo.userId = 2
      const user = await getUserByUserId(photo.userId);
      // raphael
      const { username } = user[0];
      return { username, ...photo, userLikedPhoto };
    })
  );

  return photosWithUserDetails;
}

export async function getUserByUsername(usename) {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("username", "==", usename)
    .get();
  // console.log(result);

  const user = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));

  return user;
}

export async function getUserPhotosByUsername(username) {
  const [user] = await getUserByUsername(username);
  const result = await firebase
    .firestore()
    .collection("photos")
    .where("userId", "==", user.userId)
    .get();
  const photos = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));

  return photos;
}

export async function isUserFollowingProfile(
  loggedInUserUsername,
  profileUserId
) {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("username", "==", loggedInUserUsername)
    .where("following", "array-contains", profileUserId)
    .get();
  const [response = {}] = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));

  // console.log("response", response);
  return response.userId;
}

export async function toggleFollow(
  isFollowingProfile,
  activeUserDocId,
  profileDocId,
  profileUserId,
  followingUserId
) {
  // 1st param: Karl's doc id
  // 2nd param: raphel's user id
  // 3rd param: is the user following this profile? e.g. does karl follow raphel?
  await updateLoggedInUserFollowing(activeUserDocId, profileUserId,isFollowingProfile);

  // 1st param: Karl's user id
  // 2nd param: raphel's doc id
  // 3rd param: is the user following this profile? e.g. does karl follow raphel?
  await updateFollowedUserFollowers(profileDocId, followingUserId, isFollowingProfile);
}


export async function getPhotoByDocId(docId) {
  const result = await firebase
  .firestore()
  .collection('photos')
  .where('docId', '==', docId)
  .get()

  const photo = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id
  }));

  return photo;
}

