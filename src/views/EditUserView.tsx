import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { request } from "../server/server";
import {
  FormControl,
  FormLabel,
  TextField,
  Switch,
  Box,
  Button,
} from "@mui/material";
import { User, Space } from "../interfaces"

type FormData = {
  address: string,
  username: string,
  spacename: string,
  spaceactive: boolean
}

export default function EditUser() {
  const [user, setUser] = useState<User>();
  const [space, setSpace] = useState<Space>();

  let { address } = useParams();
  const { register, handleSubmit, reset } = useForm<FormData>();
  const onSubmit = (data: FormData) => {
    const newUser: User = {
      name: data.username,
      id: user!.id,
      address: data.address,
      space: {
        id: space!.id,
        userId: user!.id,
        name: data.spacename,
        active: data.spaceactive
      }
    }
    request.updateUser(newUser)
  };


  useEffect(() => {
    const getData = async () => {
      try {
        const res = await request.getUser(address ?? "");
        setSpace(res && res.space);
        setUser(res);

        reset({
          address: res?.address ?? "",
          username: res?.address ?? "",
          spacename: res?.space?.name ?? "",
          spaceactive: res?.space?.active ?? false
        })
      } catch (e) {
        throw e;
      }
    };

    getData();
  }, [address, reset]);



  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ display: "flex", flexDirection: "column" }}>

        <FormControl>
          <FormLabel>Wallet Address</FormLabel>
          <TextField
            {...register("address", { required: "Required" })}
            disabled
          />
        </FormControl>

        <FormControl>
          <FormLabel>Username</FormLabel>
          <TextField
            {...register("username", { required: "Required" })}

          />
        </FormControl>

        <FormControl>
          <FormLabel>Space Name</FormLabel>
          <TextField
            {...register("spacename", { required: "Required" })}

          />
        </FormControl>

        <FormControl>
          <FormLabel>Space Active</FormLabel>
          <Switch  {...register("spaceactive")} />
        </FormControl>

      </Box>
      <Button color="primary" variant="contained" type="submit">
        Save
      </Button>
    </form>
  );
}
