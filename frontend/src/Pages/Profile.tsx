import React, { useContext, useState } from "react";
import styled from "styled-components";
import UserContext from "../UserContext";
import type { UserContextType } from "../types";
import { createClient } from "@supabase/supabase-js";
import { Link, useNavigate } from "react-router";

const Wrapper = styled.div`
  height: 100vh;
`;

const Layout = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  margin-bottom: 10px;
`;

const EditForm = styled.form`
  border: 1px solid black;
  width: 500px;
  padding: 40px 20px;

  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Label = styled.label`
  display: flex;
  gap: 5px;
  flex-direction: column;
  font-size: 20px;
`;

const Input = styled.input`
  font-family: inherit;
  font-size: 15px;
  outline: none;
  border: 1px solid black;
  padding: 5px 10px;
`;

const ActionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Button = styled.button`
  font-family: inherit;
  font-size: 15px;
  font-weight: bold;
  outline: none;
  border: 3px solid black;
  padding: 5px 10px;
  background-color: #000;
  color: #fff;
  cursor: pointer;

  &:hover {
    background-color: #fff;
    color: #000;
  }
`;

const BackLink = styled(Link)`
  font-family: inherit;
  font-size: 15px;
  font-weight: bold;
  border: 3px solid black;
  padding: 5px 10px;
  background-color: #fff;
  color: #000;
  cursor: pointer;

  text-decoration: none;
  text-align: center;

  &:hover {
    background-color: #000;
    color: #fff;
  }
`;

const ImageUploader = styled.div`
  border: 1px solid #000;
  padding: 5px 10px;
  font-size: 15px;

  display: flex;
  align-items: center;
  gap: 10px;
`;

const ImageUploaderLabel = styled.label`
  border: 1px solid #000;
  display: inline-block;
  font-weight: bold;
  padding: 5px 10px;
  background-color: #000;
  color: #fff;
  cursor: pointer;

  &:hover {
    background-color: #fff;
    color: #000;
  }
`;

const ImageUploaderInput = styled.input`
  display: none;
`;

const Pfp = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_SECRET_KEY,
);

const Profile = () => {
  const { user, setLocalStorage } = useContext(UserContext) as UserContextType;

  const [username, setUsername] = useState<string | undefined>(user?.username);
  const [image, setImage] = useState<File | null>(null);

  const navigate = useNavigate();

  if (!user) {
    return (
      <Wrapper>
        <Layout>
          <Title>Loading...</Title>
        </Layout>
      </Wrapper>
    );
  }

  const onFileUpload = (
    e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
  ) => {
    if (e.target.files !== null) {
      const file = e.target.files[0];
      setImage(file);
    }
  };

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if ((!image && !username) || username === user.username) {
      return;
    }

    const usernameToPass = username !== undefined ? username : user.username;
    let imageToPass = user.pfpUrl;

    if (image) {
      const imgType = image.type.split("image/")[1];

      const { data, error } = await supabase.storage
        .from("pfp")
        .upload(`${usernameToPass}/pfp.${imgType}`, image, {
          upsert: true,
        });

      if (!error) {
        // 3_122_064_000 === 99 years
        const info = await supabase.storage
          .from("pfp")
          .createSignedUrl(data.path, 3_122_064_000);

        if (info.error) {
          // Set Error Message
        }

        imageToPass = info.data?.signedUrl;
      } else {
        // Set Error Message
      }
    }

    await fetch("http://localhost:3000/users/", {
      method: "PUT",
      body: JSON.stringify({
        username: usernameToPass,
        pfpUrl: imageToPass,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: user?.token || "",
      },
    });

    setLocalStorage({
      ...user,
      pfpUrl: imageToPass,
      username: usernameToPass,
    });

    setUsername("");
    setImage(null);

    navigate("/", {
      flushSync: true,
    });
  };

  return (
    <Wrapper>
      <Layout>
        <Title>Edit Profile</Title>
        <EditForm onSubmit={onSubmit}>
          <Label>
            Profile Picture
            <ImageUploader>
              <Pfp
                src={image !== null ? URL.createObjectURL(image) : user?.pfpUrl}
                alt=""
              />
              <ImageUploaderLabel>
                Change Profile Picture
                <ImageUploaderInput
                  type="file"
                  accept="image/jpeg, image/png, image/jpg"
                  onChange={onFileUpload}
                />
              </ImageUploaderLabel>
            </ImageUploader>
          </Label>

          <Label>
            Username
            <Input
              type="text"
              placeholder="Username"
              value={username !== undefined ? username : user.username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </Label>
          <ActionsWrapper>
            <Button>Update</Button>
            <BackLink to={"/"}>Back To Chats</BackLink>
          </ActionsWrapper>
        </EditForm>
      </Layout>
    </Wrapper>
  );
};

export default Profile;
