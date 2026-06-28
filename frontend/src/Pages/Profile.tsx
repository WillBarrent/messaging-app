import { useContext } from "react";
import styled from "styled-components";
import UserContext from "../UserContext";
import type { UserContextType } from "../types";

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
  border-radius: 50%;
`;

const Profile = () => {
  const { user } = useContext(UserContext) as UserContextType;

  if (!user) {
    return (
      <Wrapper>
        <Layout>
          <Title>Loading...</Title>
        </Layout>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Layout>
        <Title>Edit Profile</Title>
        <EditForm>
          <Label>
            Profile Picture
            <ImageUploader>
              <Pfp src={user?.pfpUrl} alt="" />
              <ImageUploaderLabel>
                Change Profile Picture
                <ImageUploaderInput type="file" />
              </ImageUploaderLabel>
            </ImageUploader>
          </Label>

          <Label>
            Username
            <Input type="text" placeholder="Username" value={user.username} />
          </Label>
          <Button>Update</Button>
        </EditForm>
      </Layout>
    </Wrapper>
  );
};

export default Profile;
