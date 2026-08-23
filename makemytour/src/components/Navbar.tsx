import React, { useState } from "react";
import SignupDialog from "./SignupDialog";
import { LogOut, Plane, User, Menu, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { clearUser } from "@/store";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const logout = () => {
    dispatch(clearUser());
    setMobileOpen(false);
  };

  const go = (path: string) => {
    router.push(path);
    setMobileOpen(false);
  };

  const linkButtons = (
    <>
      <Button
        variant="ghost"
        className="text-black hover:text-blue-600 justify-start"
        onClick={() => go("/flight-status")}
      >
        Flight Status
      </Button>
      <Button
        variant="ghost"
        className="text-black hover:text-blue-600 justify-start"
        onClick={() => go("/pricing")}
      >
        Pricing
      </Button>
      {user?.role === "ADMIN" && (
        <Button variant="default" onClick={() => go("/admin")}>
          ADMIN
        </Button>
      )}
      {user?.role === "ADMIN" && (
        <Button variant="outline" onClick={() => go("/moderation")}>
          Moderate
        </Button>
      )}
    </>
  );

  const avatarMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{user?.firstName?.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user?.firstName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/profile")}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => logout()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const authButtons = (
    <>
      <SignupDialog
        defaultLogin={true}
        trigger={
          <Button
            variant="outline"
            className="bg-white text-blue-600 hover:bg-gray-100 w-full sm:w-auto"
          >
            Login
          </Button>
        }
      />
      <SignupDialog
        trigger={
          <Button
            variant="outline"
            className="bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto"
          >
            Sign Up
          </Button>
        }
      />
    </>
  );

  return (
    <header className="bg-white/80 backdrop-blur-md py-4 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <button
          className="flex items-center space-x-2"
          onClick={() => go("/")}
        >
          <Plane className="w-8 h-8 text-red-500" />
          <span className="text-2xl font-bold text-black">MakeMyTour</span>
        </button>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-4">
          {linkButtons}
          {user ? avatarMenu : authButtons}
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-2">
          {user && avatarMenu}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="text-black p-2 rounded-lg hover:bg-gray-100"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown panel */}
      {mobileOpen && (
        <div className="md:hidden bg-white shadow-lg mt-2 mx-4 rounded-xl p-3 flex flex-col gap-2">
          {linkButtons}
          {!user && authButtons}
        </div>
      )}
    </header>
  );
};

export default Navbar;
