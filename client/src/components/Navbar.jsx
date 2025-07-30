import { Menu, School } from "lucide-react";
import React, { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import DarkMode from "@/DarkMode";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    await logoutUser();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "User log out.");
      navigate("/login");
    }
  }, [isSuccess]);

  return (
    <motion.div
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="h-16 px-5 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 backdrop-blur-md border-b border-white/10 fixed top-0 left-0 right-0 z-50 shadow-lg text-white"
    >
      {/* Desktop */}
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full">
        <div className="flex items-center gap-2">
          <School size={"30"} className="text-white" />
          <Link to="/">
            <h1 className="font-bold font-serif text-xl text-white">E-Learning</h1>
          </Link>
        </div>
        <div className="flex items-center gap-4">

        </div>

        {/* User icons and dark mode icon */}
        <div className="flex items-center gap-8">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer ring-2 ring-purple-600 transition-transform hover:scale-105">
                  <AvatarImage
                    src={user?.photoUrl || "https://github.com/shadcn.png"}
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white/5 backdrop-blur-lg border border-white/10 text-white shadow-xl">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Link to="/my-learning">My Learning</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/profile">Edit Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logoutHandler}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                {user?.role === "instructor" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link to="/admin/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                  </>
                )}
                {user?.role === "superAdmin" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link to={`/superadmin-dashboard/${user._id}`}>SuperAdmin Dashboard</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => navigate("/login")}>
                Signup
              </Button>
            </div>
          )}
          {/* <DarkMode /> */}
        </div>
      </div>

      {/* Mobile */}
      <div className="flex md:hidden items-center justify-between px-4 h-full">
        <h1 className="font-extrabold text-xl text-white font-serif">E-Learning</h1>
        <MobileNavbar user={user} logoutHandler={logoutHandler} />
      </div>
    </motion.div>
  );
};

export default Navbar;

const MobileNavbar = ({ user, logoutHandler }) => {
  const navigate = useNavigate();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white border-none shadow-2xl">
        <SheetHeader className="flex flex-row items-center justify-between mt-2">
          <SheetTitle className="text-xl font-bold text-white font-serif">
            <Link to="/">E-Learning</Link>
          </SheetTitle>
          {/* <DarkMode /> */}
        </SheetHeader>
        <div className="mt-6 space-y-4 text-lg">
          {user && (
            <>
              <Link to="/my-learning" className="block hover:underline">My Learning</Link>
              <Link to="/profile" className="block hover:underline">Edit Profile</Link>

              <button onClick={logoutHandler} className="block hover:underline">Log Out</button>
            </>
          )}
          {!user && (
            <>
              <Button variant="ghost" className="w-full" onClick={() => navigate("/login")}>Login</Button>
              <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => navigate("/login")}>Signup</Button>

            </>
          )}
        </div>
        {user?.role === "superAdmin" && (
          <SheetFooter className="mt-8">
            <SheetClose asChild>
              <Button onClick={() => navigate(`/superadmin-dashboard/${user._id}`)}>
                SuperAdmin Dashboard
              </Button>
            </SheetClose>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};
