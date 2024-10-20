"use client";

import * as queryString from "query-string";
import PageTitleTemplate from "../components/PageTitleTemplate";
import { ScrollArea } from "../components/scroll-area";
import Image from "next/image";
import { Textarea } from "../components/textarea";
import githubLogo from "../images/github.svg";
import FormDrop from "../components/FormDrop";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export const Box = () => {
  const [loading, setLoading] = useState(true);
  const [resumeLink, setResumeLink] = useState(null);
  const [linkedinLink, setLinkedinLink] = useState(null);
  const [contactEmail, setContactEmail] = useState(null);
  const [githubLink, setGithubLink] = useState(null);
  const [instagramLink, setInstagramLink] = useState(null);
  const [personalLink, setPersonalLink] = useState(null);
  const [bio, setBio] = useState(null);
  const [pfpLink, setPfpLink] = useState(null);
  const [first_name, setFirstName] = useState(null);
  const [last_name, setLastName] = useState(null);
  const [github, setGitub] = useState(null);

  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      const token = sessionStorage.getItem("access_token");

      const res = await fetch("https://api.devdogs.uga.edu/users/user_page", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      let data = await res.json();
      data = await data.data;

      if (await data.accessToken) {
        sessionStorage.setItem("access_token", data.accessToken);
      }

      console.log(await data);
      setResumeLink((await data.user_page?.resume_link) || null);
      setLinkedinLink((await data.user_page?.linkedin_link) || null);
      setContactEmail((await data.user_page?.contact_email) || null);
      setGithubLink((await data.user_page?.github_link) || null);
      setInstagramLink((await data.user_page?.instagram_link) || null);
      setPersonalLink((await data.user_page?.personal_link) || null);
      setBio((await data.user_page?.bio) || null);
      setPfpLink((await data.user_page?.pfp_link) || null);
      setFirstName((await data.user_page?.userInfo.first_name) || null);
      setLastName((await data.user_page?.userInfo.last_name) || null);
      setGitub((await data.user_page?.userInfo.users?.githubLogin) || null);
      setLoading(false);
    }
    fetchUser();
  }, []);

  if (loading) return <div>Loading...</div>;

  const handlePfPChange = async (url) => {
    const profilePic = await url;
    setPfpLink(profilePic);
    try {
      const token = sessionStorage.getItem("access_token");
      console.log(pfpLink);

      const res = await fetch("https://api.devdogs.uga.edu/users/user_page", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          resume_link: resumeLink,
          linkedin_link: linkedinLink,
          contact_email: contactEmail,
          github_link: githubLink,
          instagram_link: instagramLink,
          personal_link: personalLink,
          bio: bio,
          pfp_link: profilePic,
          first_name: first_name,
          last_name: last_name,
        }),
      });

      let data = await res.json();
      console.log(await data);
      if (await data.data.accessToken) {
        sessionStorage.setItem("access_token", data.data.accessToken);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const logout = async () => {
    try {
      await fetch("https://api.devdogs.uga.edu/auth/logout", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Logged out");
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
    sessionStorage.clear("email");
  };

  const updateUserInfo = async () => {
    try {
      const token = sessionStorage.getItem("access_token");

      const res = await fetch("https://api.devdogs.uga.edu/users/user_page", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          resume_link: resumeLink,
          linkedin_link: linkedinLink,
          contact_email: contactEmail,
          github_link: githubLink,
          instagram_link: instagramLink,
          personal_link: personalLink,
          bio: bio,
          pfp_link: pfpLink,
          first_name: first_name,
          last_name: last_name,
        }),
      });

      let data = await res.json();
      console.log(await data.status);
      if (await data.data) {
        toast({
          title: "Changes Saved",
          description:
            "Changes have been saved successfully. Check your page to see them.",
        });
      }
      if (await data.data.accessToken) {
        sessionStorage.setItem("access_token", data.data.accessToken);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const params = queryString.default.stringify({
    client_id: "Ov23li4ImDoJt0HXf1wb",
    redirect_uri: "https://api.devdogs.uga.edu/auth/callback",
    scope: ["read:user", "user:email"].join(" "), // space seperated string
    allow_signup: true,
  });

  const githubLoginUrl = `https://github.com/login/oauth/authorize?${params}`;

  return (
    <div className="text-center w-full section page-main-side-padding flex flex-col items-center">
      <PageTitleTemplate
        blackText={"User "}
        redText={"Settings"}
        reverse={true}
      />
      <div className="bg-[#F5F5F5] w-8/12 rounded-[25px] flex flex-col lg:flex-row p-4">
        <div className="w-full lg:w-4/12 text-DevDogBlue">
          <h2 className="font-bold text-xl text-left">Categories</h2>
          <h3 className="text-lg text-left font-bold">
            <a href="/dashboard">Personalization</a>
          </h3>
          <h3 className="text-lg text-left -mt-4 hover:underline">
            <a href="/dashboard/security">Login & Security</a>
          </h3>
          <h3
            className="text-lg text-left -mt-4 font-[600] text-BulldogRed"
            onClick={logout}
          >
            Logout
          </h3>
        </div>
        <div className="w-full lg:w-8/12">
          <ScrollArea className="h-full lg:max-h-[500px] text-DevDogBlue">
            <h2 className="font-bold text-xl">Personal Information</h2>
            <div className="flex items-center flex-col lg:flex-row">
              <div className="h-32 w-32 rounded-full m-3">
                <Image
                  src={
                    pfpLink ||
                    "https://github.com/" + github + ".png" ||
                    "https://placehold.co/128x128"
                  }
                  width={128}
                  height={128}
                  style={{
                    height: "inherit",
                  }}
                  className="rounded-full"
                />
                <FormDrop onUrlChange={handlePfPChange} />
              </div>
              <div className="flex flex-col w-2/3 mr-6 mt-4">
                <h3 className="text-left font-semibold">First Name</h3>
                <input
                  type="text"
                  className="w-full p-2 rounded-2xl"
                  placeholder="FirstName"
                  onChange={(e) => setFirstName(e.target.value)}
                  value={first_name}
                />
                <h3 className="text-left font-semibold">Last Name</h3>
                <input
                  type="text"
                  className="w-full p-2 rounded-2xl"
                  placeholder="LastName"
                  onChange={(e) => setLastName(e.target.value)}
                  value={last_name}
                />
              </div>
            </div>
            <div className="mt-4 flex flex-col items-center">
              <div className="flex justify-center m-4 bg-DevDogBlue rounded-full py-2 text-white h-14 w-3/4 lg:w-11/12 align-middle items-center">
                {github ? (
                  <a
                    href={githubLoginUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-center text-[18px] font-[600]"
                  >
                    {"Not " + github + "? " + "Link your Github"}
                  </a>
                ) : (
                  <a
                    className="flex flex-row justify-center align-middle items-center"
                    href={githubLoginUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Image
                      src={githubLogo}
                      style={{ width: "auto", height: "auto", fill: "white" }}
                    />
                    <h3 className="text-center font-semibold">
                      Link your Github
                    </h3>
                  </a>
                )}
              </div>
              <h2 className="font-semibold text-lg text-left">Biography</h2>
              <Textarea
                placeholder="ExistingBio"
                className="my-3 ml-1 p-2 w-11/12"
                onChange={(e) => setBio(e.target.value)}
                value={bio}
              />
              <div className="flex justify-center gap-4 flex-col lg:flex-row">
                {/* <div>
                  <button className="bg-[#8A7D7D] w-fit text-white px-4 p-2 rounded-full">
                    Discard Changes
                  </button>
                </div> */}
                <div>
                  <button
                    className="bg-[#E37C7C] text-white px-2 p-2 rounded-full"
                    onClick={updateUserInfo}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-start flex-col">
              <h2 className="font-semibold text-lg text-center">
                Links & Socials
              </h2>
              <h3 className="text-center lg:mx-14">
                Only links you provide will appear on your public profile.
              </h3>
              <h3 className="text-left font-semibold">Resume Download Link</h3>
              <input
                type="text"
                className="p-2 w-11/12 ml-4 rounded-full"
                placeholder="https://your.resume"
                onChange={(e) => setResumeLink(e.target.value)}
                value={resumeLink}
              />

              <h3 className="text-left font-semibold">Linkedln Link</h3>
              <input
                type="text"
                className="p-2 w-11/12 ml-4 rounded-full"
                placeholder="https://linkedin.com/in/"
                onChange={(e) => setLinkedinLink(e.target.value)}
                value={linkedinLink}
              />

              <h3 className="text-left font-semibold">
                Preferred Contact Email
              </h3>
              <input
                type="text"
                className="p-2 w-11/12 ml-4 rounded-full"
                placeholder="hello@email.com"
                onChange={(e) => setContactEmail(e.target.value)}
                value={contactEmail}
              />

              <h3 className="text-left font-semibold">Github Link</h3>
              <input
                type="text"
                className="p-2 w-11/12 ml-4 rounded-full"
                placeholder="https://github.com/"
                onChange={(e) => setGithubLink(e.target.value)}
                value={githubLink}
              />

              <h3 className="text-left font-semibold">Instagram Link</h3>
              <input
                type="text"
                className="p-2 w-11/12 ml-4 rounded-full"
                placeholder="https://instagram.com/"
                onChange={(e) => setInstagramLink(e.target.value)}
                value={instagramLink}
              />

              <h3 className="text-left font-semibold">Personal Website Link</h3>
              <input
                type="text"
                className="p-2 w-11/12 ml-4 rounded-full"
                placeholder="https://your.website"
                onChange={(e) => setPersonalLink(e.target.value)}
                value={personalLink}
              />
            </div>
            <div className="flex justify-center gap-4 flex-col lg:flex-row mt-4">
              <div>
                <button className="bg-DevDogBlue w-fit text-white px-4 p-2 rounded-full">
                  Discard Changes
                </button>
              </div>
              <div>
                <button
                  className="bg-BulldogRed text-white px-2 p-2 rounded-full"
                  onClick={updateUserInfo}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default Box;