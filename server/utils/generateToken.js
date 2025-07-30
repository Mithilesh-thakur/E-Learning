// import jwt from "jsonwebtoken";

// export const generateToken = (res, user, message) => {
//   const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
//     expiresIn: "1d",
//   });

//   return res
//     .status(200)
//     .cookie("token", token, {
//       httpOnly: true,
//       sameSite: "strict",
//       maxAge: 24 * 60 * 60 * 1000, // 1 day
//     }).json({
//         success:true,
//         message,
//         user
//     });
// };

import jwt from "jsonwebtoken";

export const generateToken = (res, user, message) => {
  const token = jwt.sign(
    {
      userId: user._id,
      role: user.role || "student", // ✅ Include role in token payload
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "1d",
    }
  );

  return res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    })
    .json({
      success: true,
      message,
      user,
      token, // Always send token in response body
    });
};
