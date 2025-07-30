import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import Course from "./Course";
import {
  useLoadUserQuery,
  useUpdateUserMutation,
} from "@/features/api/authApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");

  const { data, isLoading, refetch } = useLoadUserQuery();
  const [
    updateUser,
    {
      data: updateUserData,
      isLoading: updateUserIsLoading,
      isError,
      error,
      isSuccess,
    },
  ] = useUpdateUserMutation();

  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePhoto(file);
  };

  const updateUserHandler = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("profilePhoto", profilePhoto);
    await updateUser(formData);
  };

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success(data.message || "Profile updated.");
    }
    if (isError) {
      toast.error(error.message || "Failed to update profile");
    }
  }, [error, updateUserData, isSuccess, isError]);

  if (isLoading) return <h1 className="text-center mt-10">Profile Loading...</h1>;
  if (!data || !data.user) return <h1 className="text-center mt-10 text-red-500">Failed to load profile data</h1>;

  const user = data.user;
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-4 my-10">
      {/* Header */}
      <h1 className="font-extrabold text-3xl text-purple-800 dark:text-purple-300 mb-8 text-center md:text-left">
        👤 My Profile
      </h1>

      {/* Profile Info Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 bg-white dark:bg-[#1c0f2f] shadow-md rounded-2xl p-6">
        <div className="flex flex-col items-center">
          <Avatar className="h-28 w-28 md:h-36 md:w-36 mb-4 border-4 border-purple-600 dark:border-purple-500">
            <AvatarImage
              src={user?.photoUrl || "https://github.com/shadcn.png"}
              alt="@shadcn"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>

        <div className="w-full space-y-4">
          <p className="text-lg">
            <span className="font-semibold text-gray-900 dark:text-gray-100">Name:</span>
            <span className="ml-2 text-gray-700 dark:text-gray-300">{user?.name || "Not provided"}</span>
          </p>
          <p className="text-lg">
            <span className="font-semibold text-gray-900 dark:text-gray-100">Email:</span>
            <span className="ml-2 text-gray-700 dark:text-gray-300">{user?.email || "Not provided"}</span>
          </p>
          <p className="text-lg">
            <span className="font-semibold text-gray-900 dark:text-gray-100">Role:</span>
            <span className="ml-2 text-gray-700 dark:text-gray-300">{user?.role?.toUpperCase() || "Not provided"}</span>
          </p>

          {/* Edit Button */}
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-purple-700 hover:bg-purple-800">
                ✏️ Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Your Profile</DialogTitle>
                <DialogDescription>
                  Update your name or upload a new profile picture.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Name</Label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter new name"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Photo</Label>
                  <Input
                    onChange={onChangeHandler}
                    type="file"
                    accept="image/*"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  disabled={updateUserIsLoading}
                  onClick={updateUserHandler}
                  className="bg-purple-700 hover:bg-purple-800"
                >
                  {updateUserIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Enrolled Courses */}
      <div className="mt-12">
        <h2 className="font-bold text-xl text-purple-800 dark:text-purple-300 mb-4">
          🎓 Courses You're Enrolled In
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {!user?.enrolledCourses || user.enrolledCourses.length === 0 ? (
            <div className="text-gray-600 dark:text-gray-400 text-center col-span-full">
              You haven’t enrolled in any courses yet.
            </div>
          ) : (
            user.enrolledCourses.map((course) => (
              <Course course={course} key={course._id} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
