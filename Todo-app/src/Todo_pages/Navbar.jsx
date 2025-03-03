
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Logoutpage from "./Logout";
import { FaUserCircle } from "react-icons/fa"; // Profile Icon
import { Link } from "react-router-dom";

const Navbar = () => {
  const [profile, setProfile] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);
 
  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token"); // Fetch from both
    if (token) {
      axios
        .get("http://127.0.0.1:8000/profile/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        })
        .then((response) => {
          setProfile(response.data);
        })
        .catch((error) => {
          console.error("Error fetching profile:", error);
        });
    }
  }, []);
  
  
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFileChange = (event) => {
    setProfilePhoto(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!profilePhoto) {
        alert("Please select a photo");
        return;
    }

    const formData = new FormData();
    formData.append("profile_photo", profilePhoto);

    axios
        .put("http://127.0.0.1:8000/profile/", formData, {
            headers: {
                Authorization: `Token ${localStorage.getItem("token")}`,
                "Content-Type": "multipart/form-data",
            },
        })
        .then((response) => {
            setProfile(response.data);
            alert("Profile photo updated successfully!");
            setProfilePhoto(null);
        })
        .catch((error) => {
            console.error("Error updating profile photo:", error);
        });
};


  const handleIconClick = () => {
    fileInputRef.current.click(); 
  };

  return (
    <nav className="bg-[#7B2CBF] text-white flex justify-between items-center shadow-md text-2xl font-bold px-[40px] h-[70px]">
      {/* Logo */}
      <div className="flex items-center ">
      <h1 className="text-5xl font-bold !text-[#cac7d3] bg-transparent uppercase">
  Plan<span className="!text-[#b2aebe]">It</span>
</h1>
</div>
<div className="flex space-x-8 mr-[600px] pr-[500px]">
        <Link to="/todos" className=" text-white  hover:text-blue-200  no-underline transition">Home</Link>
        <Link to="/about" className="  text-white hover:text-blue-200  no-underline transition">About</Link>
        <Link to="/contact" className=" text-white hover:text-blue-200  no-underline transition">Contact</Link>
      </div>

     

      <div className="relative flex items-center justify-end gap-2">
 
  <div className="relative mr-[20px]" ref={dropdownRef} >
    <button
      onClick={() => setDropdownOpen(!dropdownOpen)}
      className="flex items-center focus:outline-none"
    >
      {profile?.profile_photo ? (
        <img
          src={`http://127.0.0.1:8000${profile.profile_photo}`}
          alt="Profile"
          className="w-13 h-13 rounded-full border-2 border-white"
        />
      ) : (
        <FaUserCircle
          className="text-4xl text-white cursor-pointer"
          onClick={handleIconClick}
        />
      )}
    </button>

 
    <input
      type="file"
      ref={fileInputRef}
      className="hidden"
      onChange={handleFileChange}
    />

    {dropdownOpen && (
      <div className="absolute right-0 mt-2 w-[400px] bg-[#E3E9FA] text-black shadow-lg rounded-xl p-5 z-50 border border-gray-200">
       
        <div className="flex items-center space-x-4 border-b pb-4 mb-4">
          {profile?.profile_photo ? (
            <img
              src={`http://127.0.0.1:8000${profile.profile_photo}`}
              alt="Profile"
              className="w-16 h-16 rounded-full border-2 border-[#7B2CBF] shadow-sm"
            />
          ) : (
            <FaUserCircle
              className="text-6xl text-gray-500 cursor-pointer"
              onClick={handleIconClick}
            />
          )}
          <div>
            <h2 className="font-bold text-xl text-[#7B2CBF]">{profile?.user}</h2>
            <p className="text-gray-500 text-sm">{profile?.email}</p>
          </div>
        </div>

      
        <div className="mt-3 space-y-2">
          <button
            onClick={handleIconClick}
            className="bg-gradient-to-r from-[#7B2CBF] to-[#A288E3] text-white font-medium px-5 py-2 rounded-lg w-full shadow-md hover:opacity-90 transition"
          >
            📷 Choose Photo
          </button>
           
          <button
            onClick={handleUpload}
            className="bg-gradient-to-r from-[#A288E3] to-[#D3B8FF] text-white font-medium px-5 py-2 rounded-lg w-full shadow-md hover:opacity-90 transition"
          >
            Upload
          </button>
        </div>
      </div>
    )}
  </div>

 
  <Logoutpage />
</div>

     

    </nav>
  );
};

export default Navbar;

